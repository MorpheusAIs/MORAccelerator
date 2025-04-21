# Modification Checklist for Morpheus Builder Integration

## Files to Remove

### 1. Contracts
- [ ] `/contracts/MORToken.sol`
- [ ] `/contracts/TokenStaking.sol`
- [ ] `/contracts/FeatureRequests.sol`
- [ ] `/contracts/Bidding.sol`
- [ ] `/contracts/EscrowPayment.sol`

### 2. ABIs
- [ ] `/contractAbi/myNFT.js`
- [ ] `/contractAbi/MorpheusFeatureRequest.js`
- [ ] `/contractAbi/MORToken.ts`
- [ ] `/contractAbi/blogAbi.js`
- [ ] `/contractAbi/myTokenAbi.js`

## Files to Create

### 1. Contract Interfaces
```
/contracts/interfaces/
├── IMorpheusBuilder.sol
├── IMorpheusTreasury.sol
└── IMorpheusStaking.sol
```

### 2. New ABIs
```
/contractAbi/
├── MorpheusBuilder.ts
├── MorpheusTreasury.ts
└── BuilderConfig.ts
```

### 3. Configuration Files
```
/config/
├── networks/
│   ├── arbitrum.ts
│   └── base.ts
└── contracts/
    ├── builder.ts
    └── treasury.ts
```

### 4. New Components
```
/components/Builder/
├── BuilderRegistration.tsx
├── StakingInterface.tsx
├── RewardsTracker.tsx
└── NetworkSelector.tsx
```

## Files to Modify

### 1. Configuration Files
- [ ] `hardhat.config.ts`
  * Add network configurations
  * Update compiler settings
  * Add verification plugins

### 2. Scripts
- [ ] `/scripts/deploy_token_staking.ts` → Rename to `deploy_builder_integration.ts`
- [ ] `/scripts/deploy_feature_sponsorship.ts` → Remove
- [ ] Create new scripts:
  * `scripts/builder/createPool.ts`
  * `scripts/builder/configureStaking.ts`
  * `scripts/builder/verifyContracts.ts`

### 3. Components
- [ ] Update `/components/ConnectWallet` for multi-network support
- [ ] Modify `/components/Navbar` to include Builder section
- [ ] Add Builder-specific components to main navigation

## Integration Points

### 1. Smart Contract Integration
```typescript
// Add to existing contract interactions
import { BUILDER_ABI } from '../contractAbi/MorpheusBuilder';
import { NETWORK_CONFIG } from '../config/networks';

const builderContract = new ethers.Contract(
  NETWORK_CONFIG[network].builders,
  BUILDER_ABI,
  signer
);
```

### 2. Network Configuration
```typescript
// Add to network configuration
export const SUPPORTED_NETWORKS = {
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    builder: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    // ... other config
  },
  base: {
    chainId: 8453,
    name: 'Base',
    builder: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
    // ... other config
  }
};
```

## Testing Requirements

### 1. New Test Files
```
/test/
├── builder/
│   ├── BuilderPool.test.ts
│   ├── Staking.test.ts
│   └── Rewards.test.ts
└── integration/
    ├── NetworkSwitch.test.ts
    └── RewardDistribution.test.ts
```

### 2. Test Scripts
```
/scripts/test/
├── simulateStaking.ts
├── verifyRewards.ts
└── checkNetworkBalance.ts
```

## Documentation Updates

### 1. New Documentation
```
/docs/
├── builder/
│   ├── setup.md
│   ├── staking.md
│   └── rewards.md
└── networks/
    ├── arbitrum.md
    └── base.md
```

### 2. Update Existing Documentation
- [ ] Update README.md with Builder integration information
- [ ] Update deployment guides
- [ ] Add network-specific documentation

## Implementation Priority

1. **Phase 1: Clean-up (Day 1-2)**
   - Remove deprecated contracts
   - Remove unused ABIs
   - Clean up existing configuration

2. **Phase 2: Basic Integration (Week 1)**
   - Create interface files
   - Add network configurations
   - Set up basic Builder contract interaction

3. **Phase 3: Frontend Updates (Week 2)**
   - Create Builder components
   - Update navigation
   - Add network switching support

4. **Phase 4: Testing (Week 3)**
   - Implement test suite
   - Create simulation scripts
   - Verify contract interactions

5. **Phase 5: Documentation & Deployment (Week 4)**
   - Update all documentation
   - Create deployment guides
   - Final testing and verification

## Required Environment Variables

```bash
# Network RPC URLs
ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
BASE_RPC_URL=https://mainnet.base.org

# Contract Addresses
ARBITRUM_BUILDER=0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f
BASE_BUILDER=0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9

# API Keys
ARBITRUM_API_KEY=your_arbitrum_api_key
BASE_API_KEY=your_base_api_key

# Other Configuration
BUILDER_FEE_PERCENTAGE=100  # 1%
EDIT_POOL_DEADLINE=86400   # 24 hours
WITHDRAW_LOCK_PERIOD=604800  # 7 days
```

Would you like me to proceed with creating any of these specific files or provide more detailed implementation plans for any section?