export const NETWORK_CONFIG = {
    arbitrum: {
        id: 42161,
        name: 'Arbitrum One',
        rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
        explorer: 'https://arbiscan.io',
        contracts: {
            builders: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
            treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
            feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
        }
    },
    base: {
        id: 8453,
        name: 'Base',
        rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
        explorer: 'https://basescan.org',
        contracts: {
            builders: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
            treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
            feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE'
        }
    }
} as const;

export type NetworkId = keyof typeof NETWORK_CONFIG;
export type NetworkInfo = typeof NETWORK_CONFIG[NetworkId];

export const SUPPORTED_CHAIN_IDS = Object.values(NETWORK_CONFIG).map(network => network.id);

export function getNetworkById(chainId: number) {
    return Object.values(NETWORK_CONFIG).find(network => network.id === chainId);
}

export function getContractAddress(networkId: number, contract: keyof NetworkInfo['contracts']) {
    const network = getNetworkById(networkId);
    if (!network) throw new Error(`Network with id ${networkId} not found`);
    return network.contracts[contract];
} 