# Morpheus Builder Staking Rules and Mechanics

## Overview

This document explains the mechanics and rules of the Morpheus Builder staking system based on the staking model analysis and official documentation.

## Core Staking Parameters

### Initial Parameters
1. Base Staking Amount: 10,000 MOR
2. Lock Period Options:
   - 1 Year Lock: 2.11x multiplier
   - No Lock: 1x multiplier
3. Reward Split: 50% to stakers, 50% to Builder

### Network Distribution
- Network: Arbitrum One & Base Mainnet
- Fee for Builder Projects: 1%
- Edit Pool Deadline: 86,400 seconds (24 hours)
- Withdraw Lock Period: 604,800 seconds (7 days)

## Staking Mechanics

### 1. Synthetic MOR Calculation
```
Synthetic MOR = Base Staking Amount × Power Factor Multiplier
Example: 10,000 MOR × 2.11 = 21,068.45513 Synthetic MOR (with 1-year lock)
```

### 2. Reward Calculation
Annual Percentage Yield (APY) Tiers:
- Year 1: 72-151% (based on lock period)
- Year 2: 39-82%
- Year 3: 26-55%
- Year 4: 19-41%
- Year 5: 15-31%

### 3. Daily Reward Distribution
```
Daily Reward = (Annual Reward ÷ 365) × (Individual Stake ÷ Total Pool Stake)
```

Example Calculation:
- With 1 Year Lock: ~41.35 MOR per day
- Without Lock: ~19.63 MOR per day

## Pool Weight Mechanics

### 1. Total Proportionality Weight
- Initial Pool: 1,100,000 base units
- Daily Growth Rate: ~0.3%
- Weight Calculation: `Individual Stake × Lock Multiplier / Total Pool Weight`

### 2. Pool Share Calculation
```
Pool Share % = (Individual Synthetic Stake / Total Pool Synthetic Stake) × 100
```

Example (Day 1):
- With Lock: 1.92% of pool
- Without Lock: 0.91% of pool

## Reward Distribution Rules

### 1. Monthly Distribution
- Total Monthly Rewards: 100,000 MOR
- Builder Target Share: ~10% of reward bucket
- Minimum Stake Requirement: Must meet threshold for rewards

### 2. Network Distribution
- Rewards split proportionally between Arbitrum and Base networks
- Based on totalVirtualDeposited in each network
- Distribution through respective Treasury contracts

## Staking Periods

### 1. Lock Period Rules
- Maximum Lock: 1 year
- Early Withdrawal: Not permitted during lock period
- Lock Multiplier: 2.11x for 1-year lock

### 2. Withdrawal Rules
- Minimum Wait: 7 days after stake
- Unlock Schedule: Linear unlocking after lock period
- Claim Period: Rewards claimable during lock period

## Smart Contract Integration

### 1. Builder Pool Creation
```solidity
function createBuilderPool(
    string memory name,
    uint256 initialStake,
    uint256 lockPeriod,
    uint256 rewardSplit
) external returns (bytes32)
```

### 2. Staking Function
```solidity
function stake(bytes32 builderId, uint256 amount) external
```

### 3. Reward Distribution
```solidity
function distributeRewards(
    bytes32[] calldata builderIds,
    uint256[] calldata amounts
) external
```

## Performance Metrics

### 1. Reward Efficiency
Based on 10,000 MOR stake:
- Year 1: 15,093.87 MOR (with lock)
- Year 2: 8,208.63 MOR
- Year 3: 5,509.95 MOR
- Year 4: 4,057.38 MOR
- Year 5: 3,119.23 MOR

### 2. Computing Power Equivalent
For 10,000 MOR stake:
- H100 GPU Daily Equivalent: ~5.83 (after year 1)
- Brainpower Equivalent: ~1,751.46 units

## Implementation Notes

1. **Synthetic Base Calculation**
   - Based on point-in-time measurement
   - Sets starting base at individual builder deposit
   - Updates daily based on emission schedule

2. **Growth Rate Management**
   - Daily pool growth tracked
   - Rewards adjusted based on total pool size
   - Network distribution balanced monthly

3. **Smart Contract Requirements**
   - Must implement full reward calculation logic
   - Must track lock periods accurately
   - Must handle multi-network distribution

## Treasury Management

1. **Reward Collection**
   - Multisig claims MOR tokens
   - Transfers to Builder Treasury contracts
   - Distributes across networks based on stake ratio

2. **Fee Management**
   - 1% fee on claims
   - Treasury address: 0x68700f67Eb19722f8051f072264E979ae4c03c3F

## Network-Specific Implementations

### Arbitrum One
```javascript
{
    builders: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
    feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
}
```

### Base Mainnet
```javascript
{
    builders: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
    feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE'
}
```