import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const BUILDER_ABI = [
  "function createBuilderPool(string memory name, uint256 initialStake, uint256 lockPeriod, uint256 rewardSplit) external returns (bytes32)",
  "function stake(bytes32 builderId, uint256 amount) external",
  "function unstake(bytes32 builderId, uint256 amount) external",
  "function claimRewards(bytes32 builderId) external",
  "function getPoolId(string memory name) external view returns (bytes32)",
  "function getTotalStaked(bytes32 builderId) external view returns (uint256)",
  "function getRewards(bytes32 builderId) external view returns (uint256)"
];

describe("Morpheus Builder Integration", function () {
  let builder: Contract;
  let owner: SignerWithAddress;
  let staker: SignerWithAddress;
  let poolId: string;

  const INITIAL_STAKE = ethers.utils.parseEther("100");
  const BUILDER_NAME = "Test Builder";
  const LOCK_PERIOD = 31536000; // 1 year
  const REWARD_SPLIT = 50;

  before(async function () {
    // This test assumes we're using a fork of the mainnet
    [owner, staker] = await ethers.getSigners();

    // Connect to existing Builder contract
    const builderAddress = "0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f"; // Arbitrum
    builder = new ethers.Contract(builderAddress, BUILDER_ABI, owner);
  });

  describe("Builder Pool Creation", function () {
    it("Should create a new builder pool", async function () {
      const tx = await builder.createBuilderPool(
        BUILDER_NAME,
        INITIAL_STAKE,
        LOCK_PERIOD,
        REWARD_SPLIT
      );
      await tx.wait();

      poolId = await builder.getPoolId(BUILDER_NAME);
      expect(poolId).to.not.be.empty;
    });

    it("Should accept initial stake", async function () {
      const tx = await builder.stake(poolId, INITIAL_STAKE);
      await tx.wait();

      const totalStaked = await builder.getTotalStaked(poolId);
      expect(totalStaked).to.equal(INITIAL_STAKE);
    });
  });

  describe("Staking Functionality", function () {
    const STAKE_AMOUNT = ethers.utils.parseEther("50");

    it("Should allow additional staking", async function () {
      const beforeStake = await builder.getTotalStaked(poolId);
      
      await builder.connect(staker).stake(poolId, STAKE_AMOUNT);
      
      const afterStake = await builder.getTotalStaked(poolId);
      expect(afterStake).to.equal(beforeStake.add(STAKE_AMOUNT));
    });

    it("Should track rewards", async function () {
      // Wait for some blocks to pass
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);

      const rewards = await builder.getRewards(poolId);
      expect(rewards).to.be.gt(0);
    });
  });

  describe("Reward Distribution", function () {
    it("Should allow rewards to be claimed", async function () {
      const beforeBalance = await ethers.provider.getBalance(staker.address);
      
      await builder.connect(staker).claimRewards(poolId);
      
      const afterBalance = await ethers.provider.getBalance(staker.address);
      expect(afterBalance).to.be.gt(beforeBalance);
    });
  });

  describe("Unstaking", function () {
    it("Should respect lock period", async function () {
      // Try to unstake before lock period
      await expect(
        builder.connect(staker).unstake(poolId, INITIAL_STAKE)
      ).to.be.revertedWith("Lock period not expired");

      // Fast forward past lock period
      await ethers.provider.send("evm_increaseTime", [LOCK_PERIOD + 1]);
      await ethers.provider.send("evm_mine", []);

      // Should now be able to unstake
      const tx = await builder.connect(staker).unstake(poolId, INITIAL_STAKE);
      await tx.wait();

      const afterUnstake = await builder.getTotalStaked(poolId);
      expect(afterUnstake).to.be.lt(INITIAL_STAKE);
    });
  });
});