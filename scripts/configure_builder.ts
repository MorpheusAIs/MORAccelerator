import { ethers } from "hardhat";
import { Contract } from "ethers";

const BUILDER_ABI = [
  "function createBuilderPool(string memory name, uint256 initialStake, uint256 lockPeriod, uint256 rewardSplit) external returns (bytes32)",
  "function stake(bytes32 builderId, uint256 amount) external",
  "function unstake(bytes32 builderId, uint256 amount) external",
  "function claimRewards(bytes32 builderId) external",
  "function getPoolId(string memory name) external view returns (bytes32)"
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
  const config = NETWORK_CONFIGS[network];

  if (!config) {
    throw new Error(`Network ${network} not supported`);
  }

  console.log(`Configuring Builder on ${network}...`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Configuring with account:", deployer.address);

  // Connect to Builder contract
  const builder = new ethers.Contract(config.builders, BUILDER_ABI, deployer);

  // Builder configuration parameters
  const builderConfig = {
    name: "Mor Builders",
    initialStake: ethers.utils.parseEther("100"), // 100 MOR minimum stake
    lockPeriod: 31536000, // 1 year in seconds
    rewardSplit: 50 // 50% to stakers
  };

  try {
    // Create Builder pool
    console.log("Creating Builder pool...");
    const tx = await builder.createBuilderPool(
      builderConfig.name,
      builderConfig.initialStake,
      builderConfig.lockPeriod,
      builderConfig.rewardSplit
    );
    await tx.wait();
    console.log("Builder pool created");

    // Get pool ID
    const poolId = await builder.getPoolId(builderConfig.name);
    console.log("Pool ID:", poolId);

    // Stake initial amount
    console.log("Staking initial amount...");
    const stakeTx = await builder.stake(poolId, builderConfig.initialStake);
    await stakeTx.wait();
    console.log("Initial stake complete");

    console.log("Configuration complete!");
    console.log({
      network,
      builderAddress: config.builders,
      poolId,
      initialStake: ethers.utils.formatEther(builderConfig.initialStake)
    });
  } catch (error) {
    console.error("Error during configuration:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });