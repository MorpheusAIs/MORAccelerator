import { NetworkConfig } from './types';
import { arbitrumConfig } from './arbitrum';
import { baseConfig } from './base';

export const SUPPORTED_NETWORKS: { [key: string]: NetworkConfig } = {
    arbitrum: arbitrumConfig,
    base: baseConfig
};

export const DEFAULT_NETWORK = 'arbitrum';

export function getNetworkConfig(networkId?: string): NetworkConfig {
    if (!networkId) {
        return SUPPORTED_NETWORKS[DEFAULT_NETWORK];
    }
    
    const config = SUPPORTED_NETWORKS[networkId];
    if (!config) {
        throw new Error(`Network ${networkId} not supported`);
    }
    
    return config;
}

export function getNetworkByChainId(chainId: number): NetworkConfig {
    const network = Object.values(SUPPORTED_NETWORKS).find(
        (config) => config.chainId === chainId
    );
    
    if (!network) {
        throw new Error(`Chain ID ${chainId} not supported`);
    }
    
    return network;
}

export * from './types';
export { arbitrumConfig } from './arbitrum';
export { baseConfig } from './base';