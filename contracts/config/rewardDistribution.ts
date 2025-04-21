/**
 * Reward Distribution Configuration
 * 
 * This file defines the reward distribution percentages for the Morpheus Open Source Accelerator.
 * These values are used throughout the application to ensure consistent reward distribution.
 */

export const REWARD_DISTRIBUTION = {
  // 50% of rewards go to stakers
  STAKERS: 50,
  
  // 20% of rewards go to the Maintainer Wallet
  // Note: 50% of Maintainer rewards must be staked, 50% remains liquid
  MAINTAINER: 20,
  
  // 5% of rewards go to Mentor Wallets
  // Note: 100% liquid for direct distribution
  MENTORS: 5,
  
  // 25% of rewards go to Operations Multisig
  // Note: Manages budget for expenses such as compute, software development, and travel
  OPERATIONS: 25
};

// Minimum staking threshold in MOR tokens
// Rewards depend on meeting this minimum threshold
export const MINIMUM_STAKING_THRESHOLD = '100'; // 100 MOR tokens

// Maintainer wallet staking requirement
// 50% must be staked, 50% remains liquid
export const MAINTAINER_STAKING_REQUIREMENT = 50; // 50%

// Liquidity rules
export const LIQUIDITY_RULES = {
  MAINTAINER: {
    STAKED: 50,  // 50% must be staked
    LIQUID: 50   // 50% remains liquid
  },
  MENTORS: {
    STAKED: 0,   // 0% staked
    LIQUID: 100  // 100% liquid for direct distribution
  },
  OPERATIONS: {
    STAKED: 0,   // 0% staked
    LIQUID: 100  // 100% liquid for operations expenses
  }
};

// Power factor configuration
export const POWER_FACTOR_CONFIG = {
  // Base multiplier (1.0) represented as 10000 for precision
  BASE_MULTIPLIER: 10000,
  
  // Maximum power factor multiplier (3.0) represented as 30000
  MAX_POWER_FACTOR: 30000,
  
  // Time thresholds for power factor calculation (in seconds)
  TIME_THRESHOLDS: {
    ONE_MONTH: 30 * 24 * 60 * 60,
    THREE_MONTHS: 90 * 24 * 60 * 60,
    SIX_MONTHS: 180 * 24 * 60 * 60,
    ONE_YEAR: 365 * 24 * 60 * 60
  },
  
  // Power factor tiers for display
  TIERS: [
    { duration: '0-1 month', factor: '1.0x', description: 'Base staking power' },
    { duration: '1-3 months', factor: '1.0x-1.5x', description: 'Early loyalty boost' },
    { duration: '3-6 months', factor: '1.5x-2.0x', description: 'Medium-term commitment' },
    { duration: '6-12 months', factor: '2.0x-2.5x', description: 'Long-term commitment' },
    { duration: '12+ months', factor: '2.5x-3.0x', description: 'Maximum loyalty boost' }
  ]
};
