# Morpheus Builder Platform: Next Steps Action Plan

## Overview

After reviewing the codebase and the official Morpheus smart contract addresses, we have a clearer picture of the next steps needed to complete the Morpheus Builder Platform integration. This document outlines the prioritized actions required to achieve a production-ready deployment.

## Key Discoveries

1. **MOR Token Contracts**: The official MOR token contracts are already deployed on:
   - Ethereum: `0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0`
   - Arbitrum: `0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86`
   - Base: `0x7431ada8a591c955a994a21710752ef9b882b8e3`

2. **LayerZero Integration**: The Morpheus ecosystem already includes:
   - L1Sender on Ethereum: `0x2Efd4430489e1a05A89c2f51811aC661B7E5FF84`
   - L2MessageReceiver on Arbitrum: `0xd4a8ECcBe696295e68572A98b1aA70Aa9277d427`
   - L2TokenReceiverV2 on Arbitrum: `0x47176b2af9885dc6c4575d4efd63895f7aaa4790`

3. **Builder Pool Contracts**: Already deployed on:
   - Arbitrum: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
   - Base: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`

## Priority Action Items

### 1. MOR Token Integration (1-2 weeks)

- **Connect to Official MOR Token**
  - [x] Update `.env` with official MOR token addresses
  - [x] Create MOR token interface (implemented as `MOR_TOKEN_ABI.ts`)
  - [x] Implement token approval and allowance functionality
  - [x] Create or update `useMORToken.ts` hook

- **Implementation Tasks**
  ```typescript
  // Example token interface implementation
  import { useContractRead, useContractWrite } from 'wagmi';
  import { MOR_TOKEN_ABI } from '../contracts/abis';
  
  export function useMORToken(chainId: number) {
    const tokenAddress = getTokenAddressByChainId(chainId);
    
    // Token balance
    const { data: balance } = useContractRead({
      address: tokenAddress,
      abi: MOR_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address]
    });
    
    // Approve tokens for staking
    const { write: approve } = useContractWrite({
      address: tokenAddress,
      abi: MOR_TOKEN_ABI,
      functionName: 'approve'
    });
    
    return { balance, approve };
  }
  ```

### 2. LayerZero Cross-Chain Integration (2-3 weeks)

- **Complete LayerZero Service**
  - [ ] Update `LayerZeroService.ts` to use official L1Sender and L2MessageReceiver
  - [ ] Implement cross-chain message handling
  - [ ] Create helper functions for fee estimation
  - [ ] Add support for message verification

- **Implementation Tasks**
  ```typescript
  // Example LayerZero integration
  import { LayerZeroService } from '../services/LayerZeroService';
  
  async function sendCrossChainMessage(
    fromChainId: number,
    toChainId: number,
    message: string
  ) {
    // Get contract based on chain
    const contract = fromChainId === 1 ? l1SenderContract : builderContract;
    
    // Prepare payload
    const payload = encodeCrossChainPayload(message);
    
    // Estimate fees
    const fees = await LayerZeroService.estimateFees(
      contract,
      toChainId,
      payload
    );
    
    // Send message
    return LayerZeroService.sendCrossChainMessage(
      contract,
      toChainId,
      payload,
      fees
    );
  }
  ```

### 3. Feature Market Contract Deployment (1-2 weeks)

- **Deploy Feature Market Contract**
  - [ ] Update `deploy_feature_sponsorship.ts` to use official MOR token
  - [ ] Deploy on Arbitrum and Base
  - [ ] Configure contract parameters
  - [ ] Verify contracts on block explorers

- **Implementation Tasks**
  ```bash
  # Deploy Feature Market on Arbitrum
  NETWORK=arbitrum MOR_TOKEN_ADDRESS=0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86 \
    npx hardhat run scripts/deploy_feature_sponsorship.ts --network arbitrum
  
  # Deploy Feature Market on Base
  NETWORK=base MOR_TOKEN_ADDRESS=0x7431ada8a591c955a994a21710752ef9b882b8e3 \
    npx hardhat run scripts/deploy_feature_sponsorship.ts --network base
  ```

### 4. UI and Contract Integration (1-2 weeks)

- **Connect UI to MOR Token**
  - [ ] Update staking interface to use MOR token
  - [ ] Implement token balance display
  - [ ] Add token approval workflow
  - [ ] Test staking functionality with real tokens

- **Implement Cross-Chain UI**
  - [ ] Create cross-chain transfer UI
  - [ ] Add network switching support
  - [ ] Implement fee estimation display
  - [ ] Add transaction status tracking

- **Complete Feature Market UI Integration**
  - [ ] Connect proposal creation to deployed contract
  - [ ] Implement proposal listing from contract
  - [ ] Add bidding functionality
  - [ ] Create milestone tracking UI

### 5. Comprehensive Testing (2 weeks)

- **Unit Testing**
  - [ ] Test MOR token integration
  - [ ] Test builder pool operations
  - [ ] Test feature market functionality
  - [ ] Test cross-chain operations

- **End-to-End Testing**
  - [ ] Test complete user flows
  - [ ] Test cross-network operations
  - [ ] Test error scenarios and recovery
  - [ ] Performance testing

- **Security Testing**
  - [ ] Review token approval and transfer logic
  - [ ] Test for common vulnerabilities
  - [ ] Check for reentrancy protection
  - [ ] Verify access control

### 6. IPFS Integration (1 week)

- **Set Up IPFS Integration**
  - [ ] Register for IPFS service (Pinata, Web3.Storage, or Infura)
  - [ ] Implement metadata storage
  - [ ] Add proposal content storage
  - [ ] Create retrieval functionality

- **Implementation Tasks**
  ```typescript
  // Example IPFS integration
  async function storeMetadataOnIPFS(metadata: any) {
    const data = JSON.stringify(metadata);
    const added = await ipfsClient.add(data);
    return added.path; // IPFS hash/CID
  }
  
  async function retrieveMetadataFromIPFS(cid: string) {
    const url = `${process.env.IPFS_GATEWAY}${cid}`;
    const response = await fetch(url);
    return response.json();
  }
  ```

## Implementation Roadmap

```
Week 1-2: MOR Token Integration + Feature Market Deployment
Week 3-4: LayerZero Cross-Chain Integration + UI Integration
Week 5: IPFS Integration
Week 6-7: Comprehensive Testing
Week 8: Deployment Preparation & Production Release
```

## Technical Integration Notes

### 1. MOR Token Integration

The MOR token is already deployed on Ethereum, Arbitrum, and Base. The token has OFT (Omnichain Fungible Token) capabilities via LayerZero, which enables cross-chain transfers. This is a crucial component to leverage for the cross-chain functionality of our platform.

```solidity
// IMOR.sol
interface IMOR {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    // OFT functions for cross-chain
    function sendFrom(
        address _from,
        uint16 _dstChainId,
        bytes calldata _toAddress,
        uint256 _amount,
        address _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;
}
```

### 2. LayerZero Integration

The LayerZero integration provides the ability to send messages and tokens across chains. The Morpheus ecosystem already has the necessary infrastructure in place with the L1Sender, L2MessageReceiver, and L2TokenReceiverV2 contracts.

```typescript
// Cross-chain message structure
interface CrossChainMessage {
    srcChainId: number;
    dstChainId: number;
    message: string;
    nonce: number;
    payload: string;
}

// Example LayerZero endpoints
const LZ_ENDPOINTS = {
    1: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',  // Ethereum
    42161: '0x3c2269811836af69497E5F486A85D7316753cf62', // Arbitrum
    8453: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7'  // Base
};
```

### 3. Builder Pool Integration

The Builder Pool contracts are already deployed and functional on both Arbitrum and Base. The integration needs to ensure that:

1. Users can approve MOR tokens for staking
2. Builder pools can be created with proper parameters
3. Staking and unstaking work correctly
4. Rewards are properly distributed and claimed

## Conclusion

The integration of the Morpheus Builder Platform with the official Morpheus smart contracts is a significant step toward a fully functional cross-chain DApp. By following this action plan, we can leverage the existing infrastructure while adding the necessary features to create a comprehensive builder pool management and feature market platform.

The estimated timeline for completion is 7-8 weeks, with the possibility of an earlier release if testing progresses smoothly. The priority should be on establishing a secure connection to the MOR token contracts and implementing the cross-chain functionality, as these form the foundation for the rest of the platform's features.
