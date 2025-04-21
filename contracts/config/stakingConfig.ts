/**
 * Staking Configuration
 * 
 * This file defines the staking configuration for the Morpheus Open Source Accelerator.
 * These values are used throughout the application to ensure consistent staking behavior.
 */

// Network configuration for staking
export const STAKING_NETWORKS = {
  // Arbitrum Mainnet
  ARBITRUM: {
    chainId: 42161,
    builderContract: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    treasuryContract: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
    feeConfigContract: '0xc03d87085E254695754a74D2CF76579e167Eb895',
    morToken: '0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86'
  },
  // Base Mainnet
  BASE: {
    chainId: 8453,
    builderContract: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    treasuryContract: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
    feeConfigContract: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE',
    morToken: '0x7431ada8a591c955a994a21710752ef9b882b8e3'
  }
};

// Default staking periods in seconds
export const STAKING_PERIODS = {
  ONE_MONTH: 30 * 24 * 60 * 60,
  THREE_MONTHS: 90 * 24 * 60 * 60,
  SIX_MONTHS: 180 * 24 * 60 * 60,
  ONE_YEAR: 365 * 24 * 60 * 60
};

// Staking options for UI
export const STAKING_OPTIONS = [
  { 
    label: '1 Month', 
    value: STAKING_PERIODS.ONE_MONTH,
    powerFactor: '1.0x',
    description: 'Base staking power'
  },
  { 
    label: '3 Months', 
    value: STAKING_PERIODS.THREE_MONTHS,
    powerFactor: '1.5x',
    description: 'Early loyalty boost'
  },
  { 
    label: '6 Months', 
    value: STAKING_PERIODS.SIX_MONTHS,
    powerFactor: '2.0x',
    description: 'Medium-term commitment'
  },
  { 
    label: '1 Year', 
    value: STAKING_PERIODS.ONE_YEAR,
    powerFactor: '2.5x',
    description: 'Long-term commitment'
  }
];

// Wallet types for reward distribution
export const WALLET_TYPES = {
  STAKER: 'STAKER',
  MAINTAINER: 'MAINTAINER',
  MENTOR: 'MENTOR',
  OPERATIONS: 'OPERATIONS'
};
