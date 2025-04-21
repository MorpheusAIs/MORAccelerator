export const STAKING_ABI = [
  // Only including relevant functions for our statistics
  {
    "inputs": [],
    "name": "getTotalStaked",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveValidatorsCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStakingHistory",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "internalType": "struct Staking.StakeSnapshot[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const VALIDATOR_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "getValidatorMetrics",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "totalBlocks", "type": "uint256"},
          {"internalType": "uint256", "name": "avgBlockTime", "type": "uint256"},
          {"internalType": "uint256", "name": "totalTransactions", "type": "uint256"}
        ],
        "internalType": "struct ValidatorRegistry.Metrics",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];