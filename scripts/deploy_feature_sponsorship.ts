import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Feature Sponsorship Market with the account:", deployer.address);

  // Get the MOR token address from environment or configuration
  const morTokenAddress = process.env.MOR_TOKEN_ADDRESS;
  if (!morTokenAddress) {
    throw new Error("MOR token address not provided");
  }

  const FeatureSponsorshipMarket = await ethers.getContractFactory("FeatureSponsorshipMarket");
  const featureSponsorshipMarket = await upgrades.deployProxy(
    FeatureSponsorshipMarket,
    [morTokenAddress],
    { initializer: 'initialize' }
  );
  await featureSponsorshipMarket.deployed();

  console.log("FeatureSponsorshipMarket deployed to:", featureSponsorshipMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });