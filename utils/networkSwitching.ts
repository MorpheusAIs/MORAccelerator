import { Chain } from 'wagmi';

export const SUPPORTED_CHAINS = {
    ARBITRUM: 42161,
    BASE: 8453
} as const;

export interface NetworkConfig {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

export const NETWORK_CONFIGS: { [key: number]: NetworkConfig } = {
    [SUPPORTED_CHAINS.ARBITRUM]: {
        chainId: SUPPORTED_CHAINS.ARBITRUM,
        name: 'Arbitrum One',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        blockExplorer: 'https://arbiscan.io',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        }
    },
    [SUPPORTED_CHAINS.BASE]: {
        chainId: SUPPORTED_CHAINS.BASE,
        name: 'Base',
        rpcUrl: 'https://mainnet.base.org',
        blockExplorer: 'https://basescan.org',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        }
    }
};

export async function switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
        throw new Error('No ethereum wallet found');
    }

    const network = NETWORK_CONFIGS[chainId];
    if (!network) {
        throw new Error('Unsupported network');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }]
        });
    } catch (error: any) {
        // If the chain hasn't been added to MetaMask
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: `0x${chainId.toString(16)}`,
                        chainName: network.name,
                        nativeCurrency: network.nativeCurrency,
                        rpcUrls: [network.rpcUrl],
                        blockExplorerUrls: [network.blockExplorer]
                    }
                ]
            });
        } else {
            throw error;
        }
    }
}

export function isNetworkSupported(chainId: number): boolean {
    return Object.values(SUPPORTED_CHAINS).includes(chainId);
}

export function getNetworkConfig(chainId: number): NetworkConfig {
    const config = NETWORK_CONFIGS[chainId];
    if (!config) {
        throw new Error(`Network configuration not found for chain ID ${chainId}`);
    }
    return config;
} 