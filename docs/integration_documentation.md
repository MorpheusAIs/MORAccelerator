# Morpheus Open Source Accelerator Integration Documentation

## Overview

This document provides a comprehensive overview of the integration work completed for the Morpheus Open Source Accelerator application. The integration focuses on implementing the staking mechanism with MOR tokens, updating reward distribution percentages, and implementing the Time & Dilution-Based Power Factor Method as specified in the requirements.

## Smart Contract Integration

### 1. Power Factor Calculator

A new `PowerFactorCalculator.sol` library has been implemented to calculate power factors based on staking duration. This library provides the following functionality:

- Calculate power factor based on staking duration
- Calculate virtual staked amount based on actual amount and power factor
- Calculate rewards based on staked amount and power factor

The power factor scale is as follows:
- 0-1 month: 1.0x (base)
- 1-3 months: 1.0x to 1.5x (linear increase)
- 3-6 months: 1.5x to 2.0x (linear increase)
- 6-12 months: 2.0x to 2.5x (linear increase)
- 12+ months: 2.5x to 3.0x (diminishing returns)

### 2. Reward Distribution

The reward distribution has been updated to reflect the following percentages:
- 50% to stakers
- 20% to Maintainer Wallet
- 5% to Mentor Wallets
- 25% to Operations Multisig

Liquidity rules have been implemented as follows:
- Maintainer Wallet: 50% must be staked, 50% remains liquid
- Mentor Wallets: 100% liquid for direct distribution
- Operations Multisig: Manages budget for expenses such as compute, software development, and travel

### 3. Smart Contract Addresses

The integration uses the following smart contract addresses:

#### Arbitrum
- Builder Contract: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
- Treasury Contract: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
- Fee Config Contract: `0xc03d87085E254695754a74D2CF76579e167Eb895`
- MOR Token: `0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86`

#### Base
- Builder Contract: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
- Treasury Contract: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
- Fee Config Contract: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`
- MOR Token: `0x7431ada8a591c955a994a21710752ef9b882b8e3`

## Frontend Integration

### 1. New Hooks

The following hooks have been implemented to support the staking mechanism and reward distribution:

- `usePowerFactor.ts`: Calculates power factors based on staking duration
- `useEnhancedStakingContract.ts`: Integrates power factor with staking functionality
- `useRewardDistribution.ts`: Manages reward distribution rules and calculations

### 2. UI Components

The following UI components have been implemented to provide a comprehensive staking experience:

- `StakingForm.tsx`: Allows users to stake MOR tokens with power factor boosts
- `StakingDashboard.tsx`: Displays user's staking information and pending rewards
- `StakingPowerFactorDisplay.tsx`: Shows user's current power factor and virtual staked amount
- `PowerFactorInfo.tsx`: Explains the Time & Dilution-Based Power Factor Method
- `RewardDistributionInfo.tsx`: Displays reward distribution percentages and rules
- `RewardDistributionDashboard.tsx`: Shows detailed breakdown of reward distribution

### 3. Configuration Files

The following configuration files have been created to centralize settings:

- `rewardDistribution.ts`: Defines reward distribution percentages and liquidity rules
- `stakingConfig.ts`: Defines staking networks, periods, and options

## Cleanup

NFT-related code that was part of the original template has been identified, backed up, and removed from the main codebase. This includes:

- NFT components: NFTCard, NFTCreate, NFTDetail, NFTStep
- NFT pages: allnft.tsx, mynft.tsx, NFT/[tokenId].tsx

## Testing

A test utility (`testPowerFactor.ts`) has been implemented to validate power factor calculations and ensure they work correctly. This utility includes test cases for different staking durations and verifies that the power factor and reward calculations produce the expected results.

## Integration Summary

The integration work has successfully implemented all the required features for the Morpheus Open Source Accelerator application:

1. Staking Mechanism with MOR tokens via the Builder Smart Contract on Arbitrum and Base networks
2. Reward Distribution with the specified percentages (50% stakers, 20% Maintainer, 5% Mentors, 25% Operations)
3. Time & Dilution-Based Power Factor Method for boosting staking rewards
4. Liquidity Rules for different wallet types
5. Minimum Staking Threshold requirement

The application now provides a complete staking experience with power factor boosts and transparent reward distribution.
