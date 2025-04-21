export const NETWORK_CONFIG = {
  // Mainnet RPC endpoints (add multiple for redundancy)
  RPC_URLS: [
    'https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY',
    'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
  ],
  
  // Contract addresses
  CONTRACTS: {
    STAKING: '0x...',  // Replace with actual Morpheus staking contract address
    TOKEN: '0x...',    // Replace with actual Morpheus token contract address
    VALIDATOR_REGISTRY: '0x...' // Replace with actual validator registry contract address
  },

  // Block time settings
  BLOCKS_PER_DAY: 7200, // Approximate number of blocks per day (adjust based on actual network)
  HISTORICAL_DAYS: 30,  // Number of days to track historical data
};

// WebSocket endpoints for real-time updates
export const WS_ENDPOINTS = {
  MAINNET: 'wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY'
};

// Subgraph endpoints for historical data
export const SUBGRAPH_ENDPOINTS = {
  MORPHEUS: 'https://api.thegraph.com/subgraphs/name/morpheus/network-stats'
};