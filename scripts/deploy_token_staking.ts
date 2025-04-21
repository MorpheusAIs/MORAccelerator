import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MORToken
  const MORToken = await ethers.getContractFactory("MORToken");
  const morToken = await upgrades.deployProxy(MORToken, [], { initializer: 'initialize' });
  await morToken.deployed();

  console.log("MORToken deployed to:", morToken.address);

  // Set the deployer as a minter
  await morToken.updateMinter(deployer.address, true);
  console.log("Deployer set as minter");

  // Mint some initial tokens to the deployer
  const initialMint = ethers.utils.parseEther("1000000"); // 1 million MOR
  await morToken.mint(deployer.address, initialMint);
  console.log("Minted initial supply to deployer");

  // Deploy TokenStaking
  const TokenStaking = await ethers.getContractFactory("TokenStaking");
  const tokenStaking = await upgrades.deployProxy(TokenStaking, [morToken.address], { initializer: 'initialize' });
  await tokenStaking.deployed();

  console.log("TokenStaking deployed to:", tokenStaking.address);

  // Approve TokenStaking contract to spend MOR tokens
  await morToken.approve(tokenStaking.address, ethers.constants.MaxUint256);
  console.log("Approved TokenStaking contract to spend MOR tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });