require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@typechain/hardhat");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";

   const config: HardhatUserConfig = {
     solidity: {
       version: "0.8.20",
       settings: {
         optimizer: {
           enabled: true,
           runs: 200
         }
       }
     },
     networks: {
       hardhat: {},
       arbitrum: {
         url: process.env.ARBITRUM_RPC_URL || "https://arbitrum-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 42161
       },
       arbitrumSepolia: {
         url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://arbitrum-sepolia.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 421614
       },
       base: {
         url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 8453
       },
       baseGoerli: {
         url: process.env.BASE_GOERLI_RPC_URL || "https://goerli.base.org",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 84531
       }
     },
     etherscan: {
       apiKey: {
         arbitrumOne: process.env.ARBITRUM_API_KEY || "",
         base: process.env.BASE_API_KEY || ""
       }
     },
     gasReporter: {
       enabled: process.env.REPORT_GAS !== undefined,
       currency: "USD"
     },
     paths: {
       sources: "./contracts",
       tests: "./test",
       cache: "./cache",
       artifacts: "./artifacts"
     },
   };

   export default config;