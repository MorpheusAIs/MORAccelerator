# Vercel Deployment Guide for MOR Accelerator

This guide will walk you through deploying the MOR Accelerator project to Vercel with properly configured environment variables.

## Prerequisites

1. A [Vercel](https://vercel.com) account linked to your GitHub account
2. The MOR Accelerator repository pushed to GitHub
3. Your environment variables ready (from your `.env` file)

## Step 1: Prepare Your Repository

Ensure your repository is up to date and all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Import Project in Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Add New" → "Project"
3. Find and select your MOR Accelerator repository
4. Configure the project settings:
   - **Project Name**: Enter a name or keep the default
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (or the appropriate subdirectory if your project isn't at the root)

## Step 3: Configure Environment Variables

This is a crucial step. You need to transfer the environment variables from your local `.env` file to Vercel's environment configuration.

> **IMPORTANT**: Never commit sensitive API keys, private keys, or secrets to your repository.

In the Vercel project setup, navigate to the "Environment Variables" section and add the following variables. We have organized them by category for easier configuration:

### Contract Addresses - Arbitrum

```
NEXT_PUBLIC_ARBITRUM_BUILDER_ADDRESS       0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f
NEXT_PUBLIC_ARBITRUM_TREASURY_ADDRESS      0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257
NEXT_PUBLIC_ARBITRUM_FEE_CONFIG_ADDRESS    0xc03d87085E254695754a74D2CF76579e167Eb895
NEXT_PUBLIC_MOR_TOKEN_ARBITRUM             0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86
NEXT_PUBLIC_L2_TOKEN_RECEIVER_V2           0x47176b2af9885dc6c4575d4efd63895f7aaa4790
NEXT_PUBLIC_L2_MESSAGE_RECEIVER            0xd4a8ECcBe696295e68572A98b1aA70Aa9277d427
NEXT_PUBLIC_MORPHEUS_MULTISIG_ARBITRUM     0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

### Contract Addresses - Base

```
NEXT_PUBLIC_BASE_BUILDER_ADDRESS           0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9
NEXT_PUBLIC_BASE_TREASURY_ADDRESS          0x9eba628581896ce086cb8f1A513ea6097A8FC561
NEXT_PUBLIC_BASE_FEE_CONFIG_ADDRESS        0x845FBB4B3e2207BF03087b8B94D2430AB11088eE
NEXT_PUBLIC_MOR_TOKEN_BASE                 0x7431ada8a591c955a994a21710752ef9b882b8e3
NEXT_PUBLIC_MORPHEUS_MULTISIG_BASE         0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

### Contract Addresses - Ethereum

```
NEXT_PUBLIC_MOR_TOKEN_ETHEREUM             0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0
NEXT_PUBLIC_DISTRIBUTION_ETHEREUM          0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790
NEXT_PUBLIC_L1_SENDER                      0x2Efd4430489e1a05A89c2f51811aC661B7E5FF84
NEXT_PUBLIC_MORPHEUS_MULTISIG_ETHEREUM     0x1FE04BC15Cf2c5A2d41a0b3a96725596676eBa1E
```

### Other Contract Addresses

```
NEXT_PUBLIC_MOR_BURN_ADDRESS               0x000000000000000000000000000000000000dead
NEXT_PUBLIC_MOR_LOCK_ADDRESS               0xb1972e86b3380fd69dcb395f98d39fbf1a5f305a
```

### Network Configuration - Main Networks (CRITICAL)

```
NEXT_PUBLIC_ARBITRUM_RPC_URL               https://arbitrum-mainnet.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_BASE_RPC_URL                   https://base-mainnet.infura.io/v3/YOUR_INFURA_KEY
```

> **⚠️ Replace `YOUR_INFURA_KEY` with your actual Infura API key**

### Platform Configuration

```
MINIMUM_STAKE_AMOUNT                       1000000000000000000000
PLATFORM_FEE_BPS                           250
```

### Environment Configuration

```
NEXT_PUBLIC_ENVIRONMENT                    production
ENABLE_TESTNET                             false
```

### Feature Flags

```
ENABLE_FEATURE_MARKET                      true
ENABLE_AGENT_MARKETPLACE                   true
ENABLE_DEVELOPER_REGISTRY                  true
```

### API Keys

> **⚠️ These are sensitive values. Enter your actual API keys here, not placeholders.**

```
INFURA_API_KEY                             your_infura_api_key
ALCHEMY_API_KEY                            your_alchemy_api_key
ETHERSCAN_API_KEY                          your_etherscan_api_key
```

## Step 4: Set Up Production Branch and Deployment Configuration

1. In your Vercel project, go to "Settings" → "Git"
2. Under "Production Branch", make sure the correct branch (typically `main` or `master`) is selected
3. Under "Ignored Build Step", you can leave it empty or customize according to your needs

## Step 5: Deploy to Production

1. Return to the "Deployments" tab
2. Click "Deploy" to start the deployment process
3. Vercel will build and deploy your project

## Step 6: Test Your Deployment

After deployment completes:

1. Click on the deployed site URL provided by Vercel
2. Verify that your application loads correctly
3. Test the main functionalities:
   - Connecting to wallet
   - Viewing MOR token balances
   - Staking interface
   - Builder pools
   - Feature market

## Troubleshooting Common Deployment Issues

### Environment Variable Issues

If your app doesn't connect to contracts or shows network errors:

1. Go to "Settings" → "Environment Variables"
2. Verify all environment variables are correctly set
3. Check for typos, especially in contract addresses and URLs
4. If any changes are made, redeploy the project

### Build Failures

If the build fails:

1. Check the build logs for error messages
2. Common issues include:
   - Missing dependencies
   - TypeScript errors
   - Import path errors
   - Environment variable reference errors

### Client/Server Hydration Errors

If you see hydration warnings in the console:

1. Verify that all components using dynamic data are wrapped with the `ClientOnly` component
2. Check for any components with client-side state that isn't properly initialized on the server

## Automatic Deployments for Future Updates

By default, Vercel will automatically deploy your app when you push changes to your production branch. You can control this behavior in "Settings" → "Git".

## Environment Variables for Different Deployments

Vercel allows you to configure different environment variables for different deployments:

1. Production: The main deployment from your production branch
2. Preview: Deployments from pull requests and other branches
3. Development: Your local development environment

You can customize the environment variables for each deployment type through the Vercel dashboard.

## Conclusion

Your MOR Accelerator application should now be successfully deployed to Vercel with all the necessary environment variables configured. If you encounter any specific issues, refer to the [Vercel documentation](https://vercel.com/docs) or reach out for specialized support.

Remember to never expose your private keys or API secrets, and always use environment variables for sensitive information.
