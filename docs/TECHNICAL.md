# Morpheus Builder Technical Documentation

## Overview

The Morpheus Builder Integration is a decentralized platform that enables interaction with Morpheus Builder pools across multiple networks (Arbitrum One and Base). This document provides technical details for developers working with the platform.

## Smart Contract Architecture

### Core Contracts & Addresses

#### Arbitrum One
- Builder: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
- Treasury: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
- Fee Config: `0xc03d87085E254695754a74D2CF76579e167Eb895`

#### Base
- Builder: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
- Treasury: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
- Fee Config: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`

### Network Parameters
- Edit Pool Deadline: 86400 seconds (24 hours)
- Withdraw Lock Period: 604800 seconds (7 days)
- Fee Percentage: 1%
- Minimum Stake: 100 MOR

## Technical Stack

### Frontend
- Framework: Next.js 14
- Language: TypeScript
- Styling: TailwindCSS
- Web3 Integration: ethers.js v5, wagmi
- State Management: React hooks and context

### Smart Contract Integration
- Web3 Library: ethers.js v5
- Network Support: Arbitrum One & Base
- Cross-chain: LayerZero integration (planned)

## Core Components

### 1. Builder Pool Management
```typescript
interface BuilderPool {
    name: string;
    owner: string;
    totalStaked: BigNumber;
    rewardSplit: BigNumber;
    lockPeriod: BigNumber;
    lastRewardClaim: BigNumber;
    isActive: boolean;
}
```

### 2. Staking Interface
```typescript
interface StakingInfo {
    amount: BigNumber;
    lockEndTime: BigNumber;
    pendingRewards: BigNumber;
}
```

### 3. Rewards System
```typescript
interface RewardInfo {
    poolId: string;
    pendingRewards: BigNumber;
    lastClaimTime: number;
    rewardSplit: number;
}
```

## Contract Interactions

### Builder Pool Creation
```typescript
const params: BuilderPoolCreationParams = {
    name: string;
    initialStake: BigNumber;
    lockPeriod: number;
    rewardSplit: number;
};
await builderContract.createBuilderPool(params);
```

### Staking Operations
```typescript
// Stake tokens
await builderContract.stake(poolId, amount);

// Unstake tokens
await builderContract.unstake(poolId, amount);

// Claim rewards
await builderContract.claimRewards(poolId);
```

## Network Management

### Supported Networks
```typescript
export const SUPPORTED_CHAINS = {
    ARBITRUM: 42161,
    BASE: 8453
} as const;
```

### Network Switching
```typescript
async function switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) throw new Error('No ethereum wallet found');
    const network = NETWORK_CONFIGS[chainId];
    if (!network) throw new Error('Unsupported network');
    // Implementation details...
}
```

## Error Handling

### Contract Errors
```typescript
export enum ContractErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TRANSACTION_ERROR = 'TRANSACTION_ERROR',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
    CONTRACT_ERROR = 'CONTRACT_ERROR'
}
```

## Development Guidelines

### 1. Contract Interaction
- Always use the official contract addresses
- Implement proper error handling
- Validate inputs before sending transactions
- Monitor gas costs

### 2. Network Handling
- Support both Arbitrum and Base networks
- Implement proper network detection
- Handle network switching gracefully
- Add network-specific error handling

### 3. Security Considerations
- Validate all user inputs
- Implement proper access control
- Handle contract errors appropriately
- Monitor for suspicious activities

## Testing

### Required Test Coverage
1. Contract Interactions
   - Pool creation
   - Staking operations
   - Reward calculations
   - Fee handling

2. Network Management
   - Network detection
   - Chain switching
   - Cross-chain operations

3. Component Testing
   - Form validation
   - Error handling
   - State management
   - UI responsiveness

## Deployment

### Environment Setup
1. Configure network RPC endpoints
2. Set up contract addresses
3. Configure environment variables
4. Set up monitoring and logging

### Production Checklist
- [ ] Contract addresses verified
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Gas optimization completed
- [ ] Security audit passed
- [ ] Documentation updated

## Future Enhancements

1. Cross-chain Functionality
   - LayerZero integration
   - Cross-chain message handling
   - Network fee management

2. Analytics Dashboard
   - Pool performance metrics
   - Reward distribution analytics
   - Network statistics

3. Enhanced Security
   - Multi-sig support
   - Emergency pause functionality
   - Enhanced monitoring 