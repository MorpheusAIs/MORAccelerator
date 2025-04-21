# Morpheus Builder Technical Implementation Guide

## Overview

This guide provides technical details for implementing and maintaining the Morpheus Builder integration. The integration allows builders to create pools, manage stakes, and handle rewards on both Arbitrum One and Base networks.

## Architecture

### Core Components

1. **Contract Services**
   - `ContractService`: Main service for interacting with Morpheus smart contracts
   - Location: `services/ContractService.ts`
   - Dependencies: ethers.js, Web3Provider

2. **React Components**
   - `BuilderRegistration`: Pool creation and management
   - `StakingInterface`: Staking and unstaking functionality
   - Location: `components/Builder/`

3. **Custom Hooks**
   - `useContractService`: Contract interaction management
   - Location: `hooks/useContractService.ts`

## Smart Contract Integration

### Contract Addresses

```typescript
// Arbitrum One
const ARBITRUM_CONTRACTS = {
    builders: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257',
    feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895'
};

// Base
const BASE_CONTRACTS = {
    builders: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
    feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE'
};
```

### Contract Interfaces

1. **IMorpheusBuilder**
   - Core functionality for builder pool management
   - Key methods:
     ```solidity
     function createBuilderPool(
         string memory name,
         uint256 initialStake,
         uint256 lockPeriod,
         uint256 rewardSplit
     ) external returns (bytes32);

     function stake(bytes32 builderId, uint256 amount) external;
     function unstake(bytes32 builderId, uint256 amount) external;
     function claimRewards(bytes32 builderId) external;
     ```

2. **IMorpheusTreasury**
   - Handles reward distribution and fee management
   - Key methods:
     ```solidity
     function distributeRewards(
         bytes32[] calldata builderIds,
         uint256[] calldata amounts
     ) external;

     function getBuilderRewards(bytes32 builderId) external view returns (uint256);
     ```

## Implementation Details

### Setting Up Contract Service

```typescript
import { Web3Provider } from '@ethersproject/providers';
import { ContractService } from '../services/ContractService';

// Initialize service
const provider = new Web3Provider(window.ethereum);
const service = new ContractService(provider);
```

### Creating a Builder Pool

```typescript
const createPool = async () => {
    const name = "My Builder Pool";
    const initialStake = ethers.utils.parseEther("100"); // 100 MOR
    const lockPeriod = 31536000; // 1 year in seconds
    const rewardSplit = 70; // 70%

    const tx = await service.createBuilderPool(
        chainId,
        name,
        initialStake,
        lockPeriod,
        rewardSplit
    );
    await tx.wait();
};
```

### Managing Stakes

```typescript
// Staking
const stake = async (builderId: string, amount: string) => {
    const amountWei = ethers.utils.parseEther(amount);
    const tx = await service.stake(chainId, builderId, amountWei);
    await tx.wait();
};

// Unstaking
const unstake = async (builderId: string, amount: string) => {
    const amountWei = ethers.utils.parseEther(amount);
    const tx = await service.unstake(chainId, builderId, amountWei);
    await tx.wait();
};
```

### Handling Rewards

```typescript
// Claiming rewards
const claimRewards = async (builderId: string) => {
    const tx = await service.claimRewards(chainId, builderId);
    await tx.wait();
};

// Fetching reward information
const getRewards = async (builderId: string) => {
    const rewards = await service.getBuilderRewards(chainId, builderId);
    return ethers.utils.formatEther(rewards);
};
```

## Error Handling

The integration includes comprehensive error handling:

```typescript
try {
    // Contract interaction
    const tx = await service.someMethod();
    await tx.wait();
} catch (error: any) {
    if (error.code === 'ACTION_REJECTED') {
        // User rejected transaction
        handleUserRejection();
    } else if (error.code === -32603) {
        // Internal JSON-RPC error
        handleRPCError();
    } else {
        // General error handling
        handleGeneralError(error);
    }
}
```

## Network Management

### Supported Networks

1. **Arbitrum One**
   - Chain ID: 42161
   - RPC URL: https://arb1.arbitrum.io/rpc

2. **Base**
   - Chain ID: 8453
   - RPC URL: https://mainnet.base.org

### Network Switching

```typescript
const switchNetwork = async (chainId: number) => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
    } catch (error) {
        // Handle network switch error
    }
};
```

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test BuilderRegistration.test.tsx
```

### Test Environment Setup

```typescript
import { MockProvider } from 'ethereum-waffle';
import { Contract } from 'ethers';

const provider = new MockProvider();
const [wallet] = provider.getWallets();
const contract = new Contract(address, abi, wallet);
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Environment configuration:
   ```bash
   cp .env.example .env
   # Update environment variables
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Security Considerations

1. **Transaction Security**
   - Always use `tx.wait()` to ensure transaction confirmation
   - Implement proper error handling for failed transactions

2. **Input Validation**
   - Validate all user inputs before sending transactions
   - Implement proper type checking and sanitization

3. **Network Security**
   - Always verify the correct network before transactions
   - Implement network switching safeguards

## Maintenance

1. **Contract Updates**
   - Monitor for contract upgrades
   - Update ABIs when contracts change

2. **Dependencies**
   - Regular updates of dependencies
   - Security audit of dependencies

3. **Performance Monitoring**
   - Monitor transaction success rates
   - Track gas usage and optimization opportunities 