import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

interface NetworkConfig {
  builders: string;
  treasury: string;
  feeConfig: string;
  depositToken: string;
  editPoolDeadline: number;
  withdrawLockPeriod: number;
}

const NETWORK_CONFIGS: { [key: string]: NetworkConfig } = {
  arbitrum: {
    builders: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
    feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895',
    depositToken: 'MOR',
    editPoolDeadline: 86400,
    withdrawLockPeriod: 604800
  },
  base: {
    builders: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
    feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE',
    depositToken: 'MOR',
    editPoolDeadline: 86400,
    withdrawLockPeriod: 604800
  }
};

async function main() {
  console.log("Starting Morpheus Builder deployment...");

  const network = process.env.NETWORK || "arbitrum";
  const config = NETWORK_CONFIGS[network];

  if (!config) {
    throw new Error(`Network ${network} not supported`);
  }

  // Get deployer account
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get contract factories
  const BuilderFactory = await ethers.getContractFactory("MorpheusBuilder");
  const TreasuryFactory = await ethers.getContractFactory("MorpheusTreasury");

  // Deploy Builder contract
  console.log("Deploying Builder contract...");
  const builder = await BuilderFactory.deploy(
    config.depositToken,
    config.editPoolDeadline,
    config.withdrawLockPeriod,
    config.feeConfig
  );
  await builder.deployed();
  console.log("Builder deployed to:", builder.address);

  // Deploy Treasury contract
  console.log("Deploying Treasury contract...");
  const treasury = await TreasuryFactory.deploy(
    config.depositToken,
    builder.address
  );
  await treasury.deployed();
  console.log("Treasury deployed to:", treasury.address);

  // Set up initial configuration
  console.log("Setting up initial configuration...");
  
  // Set Treasury in Builder contract
  const setTreasuryTx = await builder.setTreasury(treasury.address);
  await setTreasuryTx.wait();
  console.log("Treasury set in Builder contract");

  // Set fee configuration
  const setFeeTx = await builder.setFeeConfig(config.feeConfig);
  await setFeeTx.wait();
  console.log("Fee configuration set");

  // Verify contracts
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contracts on Etherscan...");
    await hre.run("verify:verify", {
      address: builder.address,
      constructorArguments: [
        config.depositToken,
        config.editPoolDeadline,
        config.withdrawLockPeriod,
        config.feeConfig
      ],
    });

    await hre.run("verify:verify", {
      address: treasury.address,
      constructorArguments: [
        config.depositToken,
        builder.address
      ],
    });
  }

  console.log("Deployment complete!");
  console.log({
    network,
    builder: builder.address,
    treasury: treasury.address,
    feeConfig: config.feeConfig
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });