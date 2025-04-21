export const NETWORK_CONFIG = {
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    contracts: {
      builder: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
      treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
      feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
    },
    explorer: 'https://arbiscan.io'
  },
  base: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    contracts: {
      builder: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
      treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
      feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE'
    },
    explorer: 'https://basescan.org'
  }
} as const;

export type NetworkName = keyof typeof NETWORK_CONFIG;
export type NetworkConfig = typeof NETWORK_CONFIG[NetworkName];

export const getNetworkConfig = (chainId: number): NetworkConfig => {
  const network = Object.values(NETWORK_CONFIG).find(
    (config) => config.chainId === chainId
  );
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return network;
}; 