# Morpheus Builder Integration Platform: Project Summary

## Project Overview

The MOR_Accelerator_New repository is a decentralized application (dApp) implementing the Morpheus Builder platform. It provides a comprehensive framework for managing builder pools, staking MOR tokens, and participating in a feature sponsorship marketplace across multiple blockchain networks (Arbitrum One and Base).

## Core Features

### 1. Builder Pool Management
- **Creating Builder Pools**: Users can create customized builder pools with configurable parameters
- **Pool Parameters**: Name, initial stake amount, lock period, and reward split
- **Management Interface**: UI for creating and managing builder pools

### 2. Staking Mechanism
- **Token Staking**: Stake MOR tokens with flexible lock periods
- **Locking Options**: 1-year lock period (2.11x multiplier) or no lock (1x multiplier)
- **Reward Distribution**: Configurable reward splits (70%, 80%, or 90%)
- **Cross-Chain Staking**: Support for multiple networks

### 3. Feature Sponsorship Market
- **Feature Proposals**: Create proposals with MOR token staking
- **Bidding System**: Allow developers to bid on feature implementation
- **Milestone Tracking**: Track development progress
- **Filtering & Search**: UI to filter and search through proposals

### 4. Multi-Network Support
- **Arbitrum One Integration**:
  - Builder Contract: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
  - Treasury Contract: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
  - Fee Config Contract: `0xc03d87085E254695754a74D2CF76579e167Eb895`

- **Base Network Integration**:
  - Builder Contract: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
  - Treasury Contract: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
  - Fee Config Contract: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`

## Technical Architecture

### Frontend Components

1. **Builder Registration Components**
   - `BuilderRegistration.tsx`: Pool creation and management
   - Form for name, initial stake, lock period, and reward split configuration
   - Transaction confirmation and error handling

2. **Staking Components**
   - `StakingInterface.tsx`: Staking and unstaking functionality
   - `RewardsTracker.tsx`: Tracking and claiming rewards

3. **Feature Market Components**
   - `ProposalList.tsx`: Listing and filtering feature proposals
   - `ProposalCard.tsx`: Displaying individual proposal details
   - `CreateProposal.tsx`: Interface for submitting new proposals

4. **Network Management**
   - `NetworkSelector.tsx`: Switch between supported networks
   - Network configuration and contract address management

### Backend Services

1. **Contract Services**
   - `ContractService.ts`: Central service for all blockchain interactions
   - Methods for interacting with Morpheus smart contracts
   - Network-specific contract instantiation

2. **Custom React Hooks**
   - `useContractService.ts`: Managing contract interactions
   - `useBuilderPool.ts`: Builder pool state management
   - `useFeatureMarket.ts`: Feature market interactions
   - `useWalletConnection.ts`: Wallet connectivity management

3. **Smart Contract Integration**
   - Contract ABI imports for builder, treasury, and fee configuration
   - Type-safe contract interactions
   - Transaction handling with confirmation feedback

## Development Features

### Error Handling
- Comprehensive error handling for blockchain transactions
- User-friendly error messages with toast notifications
- Transaction rejection handling

### Security Considerations
- Input validation for all user inputs
- Network verification before transactions
- Proper transaction confirmation monitoring

### UI/UX Elements
- Form validation for all input fields
- Loading states during transactions
- Success/error notifications
- Responsive design

## Project Structure

### Key Directories
- `/components`: UI components organized by feature
- `/hooks`: Custom React hooks
- `/services`: Service classes for backend interactions
- `/contracts`: Smart contract ABIs and interfaces
- `/config`: Network and environment configuration
- `/pages`: Next.js page components
- `/utils`: Utility functions

## Getting Started

### Prerequisites
- Node.js v16+
- MetaMask or other Web3 wallet
- MOR tokens for staking

### Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Configure environment variables
4. Start development server: `npm run dev`

## Smart Contract Interaction

### Builder Pool Creation
```typescript
const createPool = async () => {
    const tx = await contractService.createBuilderPool(
        chainId,
        name,
        initialStake,
        lockPeriod,
        rewardSplit
    );
    await tx.wait();
};
```

### Staking Operations
```typescript
// Staking
const stake = async (builderId, amount) => {
    const tx = await contractService.stake(chainId, builderId, amount);
    await tx.wait();
};

// Unstaking
const unstake = async (builderId, amount) => {
    const tx = await contractService.unstake(chainId, builderId, amount);
    await tx.wait();
};
```

### Reward Management
```typescript
// Claiming rewards
const claimRewards = async (builderId) => {
    const tx = await contractService.claimRewards(chainId, builderId);
    await tx.wait();
};

// Fetching reward information
const getRewards = async (builderId) => {
    return await contractService.getBuilderRewards(chainId, builderId);
};
```

## Project Requirements

### Functional Requirements
- Builder pool creation and management
- MOR token staking with flexible lock periods
- Reward distribution system
- Feature proposal and bidding system
- Developer reputation tracking
- Cross-chain compatibility

### Technical Requirements
- Smart contract integration with Arbitrum and Base
- Web3 wallet connectivity
- Gas optimization
- Responsive design
- State management
- Error handling
