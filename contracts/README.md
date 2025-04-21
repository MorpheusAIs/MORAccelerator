# Morpheus Smart Contracts Integration

## Directory Structure

```
contracts/
├── core/                 # Core Morpheus contracts (copied from official repo)
│   ├── MOR.sol          # MOR Token contract
│   ├── MOROFT.sol       # OFT implementation
│   └── Distribution.sol  # Distribution contract
├── interfaces/          # Our interface definitions
│   ├── IMOR.sol        # MOR Token interface
│   ├── IOFT.sol        # OFT interface
│   └── IDistribution.sol # Distribution interface
└── config/             # Contract deployment configurations
    ├── arbitrum.ts     # Arbitrum network config
    └── base.ts         # Base network config
```

## Contract Addresses

### Arbitrum One
- Builder: 0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f
- Treasury: 0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257
- Fee Config: 0xc03d87085E254695754a74D2CF76579e167Eb895

### Base
- Builder: 0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9
- Treasury: 0x9eba628581896ce086cb8f1A513ea6097A8FC561
- Fee Config: 0x845FBB4B3e2207BF03087b8B94D2430AB11088eE

## Integration Notes

1. We use the official Morpheus contracts for core functionality
2. Our interfaces are used to interact with deployed contracts
3. We don't deploy our own versions of core contracts
4. Configuration files contain network-specific settings 