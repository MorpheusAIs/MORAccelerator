# Vercel Environment Variables for MOR Accelerator

Below are all the environment variables formatted for easy copy-pasting into Vercel's environment variables section. The variables are grouped by category for better organization.

## How to Use This File

1. Copy each section as needed
2. Paste into Vercel's Environment Variables section during project setup
3. Review for any placeholders that need to be replaced with actual values
4. Save the environment variables

## Contract Addresses - Arbitrum

```
NEXT_PUBLIC_ARBITRUM_BUILDER_ADDRESS=0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f
NEXT_PUBLIC_ARBITRUM_TREASURY_ADDRESS=0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257
NEXT_PUBLIC_ARBITRUM_FEE_CONFIG_ADDRESS=0xc03d87085E254695754a74D2CF76579e167Eb895
NEXT_PUBLIC_MOR_TOKEN_ARBITRUM=0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86
NEXT_PUBLIC_L2_TOKEN_RECEIVER_V2=0x47176b2af9885dc6c4575d4efd63895f7aaa4790
NEXT_PUBLIC_L2_MESSAGE_RECEIVER=0xd4a8ECcBe696295e68572A98b1aA70Aa9277d427
NEXT_PUBLIC_MORPHEUS_MULTISIG_ARBITRUM=0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

## Contract Addresses - Base

```
NEXT_PUBLIC_BASE_BUILDER_ADDRESS=0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9
NEXT_PUBLIC_BASE_TREASURY_ADDRESS=0x9eba628581896ce086cb8f1A513ea6097A8FC561
NEXT_PUBLIC_BASE_FEE_CONFIG_ADDRESS=0x845FBB4B3e2207BF03087b8B94D2430AB11088eE
NEXT_PUBLIC_MOR_TOKEN_BASE=0x7431ada8a591c955a994a21710752ef9b882b8e3
NEXT_PUBLIC_MORPHEUS_MULTISIG_BASE=0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

## Contract Addresses - Ethereum

```
NEXT_PUBLIC_MOR_TOKEN_ETHEREUM=0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0
NEXT_PUBLIC_DISTRIBUTION_ETHEREUM=0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790
NEXT_PUBLIC_L1_SENDER=0x2Efd4430489e1a05A89c2f51811aC661B7E5FF84
NEXT_PUBLIC_MORPHEUS_MULTISIG_ETHEREUM=0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

## Special Addresses

```
NEXT_PUBLIC_MOR_BURN_ADDRESS=0x000000000000000000000000000000000000dead
NEXT_PUBLIC_MOR_LOCK_ADDRESS=0xb1972e86b3380fd69dcb395f98d39fbf1a5f305a
```

## Network Configuration - Critical for Production

```
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
```

## API Keys - Enter your actual keys

```
INFURA_API_KEY=ecbb7fb016fc4f859469f48787bc67c0
ALCHEMY_API_KEY=QOeBQdwKcWQuaIVh-vZzDVjJxTNVKHNz
ETHERSCAN_API_KEY=1QAR2FAFP1Y2AY8HJXN2VXJRK1X9GE29M2
```

## Environment Settings

```
NEXT_PUBLIC_ENVIRONMENT=production
ENABLE_TESTNET=false
```

## Feature Flags

```
ENABLE_FEATURE_MARKET=true
ENABLE_AGENT_MARKETPLACE=true
ENABLE_DEVELOPER_REGISTRY=true
```

## Platform Configuration

```
MINIMUM_STAKE_AMOUNT=1000000000000000000000
PLATFORM_FEE_BPS=250
```

## Additional RPC URLs (Optional)

```
ETH_MAINNET_RPC_URL=https://mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
POLYGON_MAINNET_RPC_URL=https://polygon-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
OPTIMISM_MAINNET_RPC_URL=https://optimism-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
AVALANCHE_MAINNET_RPC_URL=https://avalanche-mainnet.infura.io/v3/ecbb7fb016fc4f859469f48787bc67c0
```

## Notes for Vercel Deployment

- These environment variables are formatted for direct copy-paste into Vercel's interface
- When pasting, Vercel will automatically separate the name and value
- Review for any sensitive information before deploying
- Ensure all URLs and contract addresses are correct for your deployment environment
- Consider using different values for preview deployments vs. production
