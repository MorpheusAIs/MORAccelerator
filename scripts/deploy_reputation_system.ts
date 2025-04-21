import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
  const reputationSystem = await upgrades.deployProxy(ReputationSystem, [], { initializer: 'initialize' });
  await reputationSystem.deployed();

  console.log("ReputationSystem deployed to:", reputationSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });