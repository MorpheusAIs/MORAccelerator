import { NetworkConfig } from './types';

export const arbitrumConfig: NetworkConfig = {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arbitrum-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0',
    explorer: 'https://arbiscan.io',
    contracts: {
        builder: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
        treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
        feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
    },
    params: {
        editPoolDeadline: 86400, // 24 hours
        withdrawLockPeriod: 604800, // 7 days
        feePercentage: 100, // 1%
        minimumStake: '100000000000000000000' // 100 MOR
    },
    tokens: {
        MOR: {
            address: '0x0000000000000000000000000000000000000000', // Replace with actual MOR token address
            decimals: 18,
            symbol: 'MOR'
        }
    }
};