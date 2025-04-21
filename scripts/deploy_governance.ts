import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MORToken = await ethers.getContractFactory("MORToken"); // Assume you have a MORToken contract
  const morToken = await MORToken.deploy();
  await morToken.deployed();

  console.log("MORToken deployed to:", morToken.address);

  const Governance = await ethers.getContractFactory("Governance");
  const governance = await upgrades.deployProxy(Governance, [morToken.address], { initializer: 'initialize' });
  await governance.deployed();

  console.log("Governance deployed to:", governance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });