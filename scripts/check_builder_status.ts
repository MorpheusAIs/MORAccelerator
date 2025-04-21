import { ethers } from "hardhat";
import { Contract } from "ethers";

const BUILDER_ABI = [
  "function getPoolId(string memory name) external view returns (bytes32)",
  "function getTotalStaked(bytes32 builderId) external view returns (uint256)",
  "function getRewards(bytes32 builderId) external view returns (uint256)",
  "function getPoolInfo(bytes32 builderId) external view returns (tuple(string name, uint256 totalStaked, uint256 rewardSplit, uint256 lockPeriod, uint256 lastRewardClaim, bool isActive))"
];

interface NetworkConfig {
  builders: string;
  treasury: string;
  feeConfig: string;
}

const NETWORK_CONFIGS: { [key: string]: NetworkConfig } = {
  arbitrum: {
    builders: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
    feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
  },
  base: {
    builders: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
    feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE'
  }
};

async function main() {
  const network = process.env.NETWORK || "arbitrum";
  const builderName = process.env.BUILDER_NAME || "Mor Builders";
  const config = NETWORK_CONFIGS[network];

  if (!config) {
    throw new Error(`Network ${network} not supported`);
  }

  console.log(`Checking Builder status on ${network}...`);

  // Connect to Builder contract
  const [signer] = await ethers.getSigners();
  const builder = new ethers.Contract(config.builders, BUILDER_ABI, signer);

  try {
    // Get pool ID
    const poolId = await builder.getPoolId(builderName);
    console.log("Pool ID:", poolId);

    // Get pool info
    const poolInfo = await builder.getPoolInfo(poolId);
    console.log("\nPool Information:");
    console.log("Name:", poolInfo.name);
    console.log("Total Staked:", ethers.utils.formatEther(poolInfo.totalStaked), "MOR");
    console.log("Reward Split:", poolInfo.rewardSplit.toString(), "%");
    console.log("Lock Period:", poolInfo.lockPeriod.toString(), "seconds");
    console.log("Last Reward Claim:", new Date(poolInfo.lastRewardClaim.toNumber() * 1000).toISOString());
    console.log("Active:", poolInfo.isActive);

    // Get current rewards
    const rewards = await builder.getRewards(poolId);
    console.log("\nCurrent Rewards:", ethers.utils.formatEther(rewards), "MOR");

    // Calculate APY based on rewards and total staked
    const annualizedRewards = rewards.mul(365);
    const apy = annualizedRewards.mul(100).div(poolInfo.totalStaked);
    console.log("Current APY:", apy.toString(), "%");

  } catch (error) {
    console.error("Error checking builder status:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });