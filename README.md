![Wide but short logo for Morpheus](https://github.com/MorpheusAIs/Morpheus/assets/1563345/be0c5a0f-0766-4e31-8e4a-ab18cd211961)

# Morpheus Builder Accelerator

A decentralized platform for managing Morpheus Builder pools, staking, and rewards across multiple blockchain networks, plus resources for the Morpheus builder community.

## Accelerator Overview

The Morpheus Accelerator is a grassroots project with the mission to empower the Morpheus builder community. It focuses on meeting builders where they are and enabling them to use developer tools, access compute resources, and identify ways to contribute to the ecosystem. Visit the [Morpheus Accelerator website](https://kcdenman.github.io/accmor/) to learn more about the accelerator or submit more project.

### Accelerator Initiatives

- **Hackathons**: Support for in-person and virtual hackathons with Morpheus developer tools, code, compute, and capital. [Morpheus Hackathon Guide](https://kevindenman.notion.site/Morpheus-Hackathon-Guide-12d87e2c683c80aaa890ff8e9f08f6d0)
- **Builder Tooling**: Improved discoverability and accessibility of developer tools
- **Use Case Curation**: Curating impactful use cases - [Morpheus Smart Agent Use Cases](https://docs.google.com/spreadsheets/d/18-6Hxe59Rc6vXTEkyFUgeRZsI0PjdJYk715bx6eSD14/edit?gid=0#gid=0)
- **MOR20 Fair Launch**: Resources for understanding MOR20 Fair Launch for project incubation
- **Project Incubation**: Using the techno-capital machine and network effects of the Morpheus community

## Builder Platform Features

### Builder Pool Management
- Create and manage builder pools with customizable parameters
- Stake MOR tokens with flexible lock periods (no lock or 1-year lock with 2.11x multiplier)
- Earn rewards based on configurable reward splits (70%, 80%, or 90%)
- Track pool performance and rewards in real-time

### Multi-Network Support
- Deploy and manage pools on both Arbitrum One and Base
- View unified dashboard across networks
- Cross-chain functionality via LayerZero

### Feature Sponsorship Market (Coming Soon)
- Create feature proposals with milestone-based funding
- Bid on feature development opportunities
- Track development progress with on-chain verification
- Secure payment system with escrow management

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) (v16.x or higher)
* [Yarn](https://yarnpkg.com/getting-started/install) (preferred package manager)
* [MetaMask](https://metamask.io/download/) or other Web3 wallet
* Access to Arbitrum One or Base network
* MOR tokens for staking

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/MyBlockcities/MORAccelerator
cd MORAccelerator
```

2. Install dependencies using Yarn:
```bash
yarn install
```

3. Configure environment:
```bash
cp .env.example .env
```

Update the following variables in `.env`:
```env
# Contract Addresses - Arbitrum
NEXT_PUBLIC_ARBITRUM_BUILDER_ADDRESS="0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f"
NEXT_PUBLIC_ARBITRUM_TREASURY_ADDRESS="0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257"
NEXT_PUBLIC_ARBITRUM_FEE_CONFIG_ADDRESS="0xc03d87085E254695754a74D2CF76579e167Eb895"
NEXT_PUBLIC_MOR_TOKEN_ARBITRUM="0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86"

# Contract Addresses - Base
NEXT_PUBLIC_BASE_BUILDER_ADDRESS="0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9"
NEXT_PUBLIC_BASE_TREASURY_ADDRESS="0x9eba628581896ce086cb8f1A513ea6097A8FC561"
NEXT_PUBLIC_BASE_FEE_CONFIG_ADDRESS="0x845FBB4B3e2207BF03087b8B94D2430AB11088eE"
NEXT_PUBLIC_MOR_TOKEN_BASE="0x7431ada8a591c955a994a21710752ef9b882b8e3"

# Contract Addresses - Ethereum
NEXT_PUBLIC_MOR_TOKEN_ETHEREUM="0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0"

# Network Configuration
NEXT_PUBLIC_ARBITRUM_RPC_URL="Your Arbitrum RPC URL"
NEXT_PUBLIC_BASE_RPC_URL="Your Base RPC URL"
```

4. Start development server:
```bash
yarn dev
```

Visit http://localhost:3000 to view the application.

## Recent Updates

### Enhanced Staking Mechanism
- **Power Factor System**: Implemented time-based staking rewards with a Power Factor Calculator
- **Smart Contract Integration**: Direct integration with Builder Smart Contracts on Arbitrum and Base
- **Staking Thresholds**: Added minimum staking threshold requirements for participation

### Reward Distribution System
- **Distribution Model**:
  - 50% to stakers
  - 20% to Maintainer Wallet
  - 5% to Mentor Wallets
  - 25% to Operations Multisig
- **Liquidity Rules**:
  - Maintainer Wallet: 50% must be staked, 50% remains liquid
  - Mentor Wallets: 100% liquid for direct distribution
  - Operations Multisig: Budget management for expenses

### Power Factor Calculation
- **Dynamic Scaling**: Power factor scale from 1.0x to 3.0x based on staking duration
- **Reward Boosts**: Time-based multipliers applied to user deposits
- **Formula**: MOR Rewards = MOR Staked × Power Factor

### New UI Components
- **Staking Interface**:
  - `StakingForm`: For MOR token staking operations
  - `StakingDashboard`: Centralized view of all staking information
  - `PowerFactorInfo`: Educational component explaining power factor mechanics
  - `RewardDistributionDashboard`: Visual representation of reward distribution
  - `AnimatedStakingFlow`: Interactive staking process visualization
  - `RewardVisualizationDashboard`: Real-time reward tracking and projections

### Staking Pages
- `/staking`: Core staking interface with essential functionality
- `/enhanced-staking`: Advanced staking features with detailed analytics and visualization tools

## Known Issues and Fixes

### BIP39 Wordlist ESM Import Issue

This project uses the `ox` package which imports wordlists from `@scure/bip39` without the `.js` extension, causing ESM import errors. The error typically looks like:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/path/to/node_modules/@scure/bip39/wordlists/czech' 
imported from /path/to/node_modules/ox/_esm/core/internal/mnemonic/wordlists.js
Did you mean to import "@scure/bip39/wordlists/czech.js"?
```

#### Automatic Fix
We've added a postinstall script that automatically creates the missing files when you install dependencies:

```bash
# The fix runs automatically during:
npm install
# or
yarn install
```

#### Manual Fix (if needed)
If you still encounter this issue after installation:

1. Run the provided fix script:
   ```bash
   # Using the shell script (recommended)
   ./scripts/fix-bip39-imports.sh
   
   # Or directly with Node
   node scripts/fix-bip39-wordlists.js
   ```

2. If errors persist, try these steps:
   - Clear your Node.js module cache: `rm -rf node_modules/.cache`
   - Restart your development server
   - In rare cases, you may need to reinstall dependencies: `rm -rf node_modules && yarn install`

The fix creates proxy files for each wordlist without the `.js` extension that properly export from the original files, addressing the ESM import issue while maintaining compatibility.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Run production build
- `yarn lint` - Run linting checks
- `yarn test` - Run test suite
- `yarn deploy:feature-market` - Deploy feature market contract

## Smart Contracts

### Core Contracts (Already Deployed)

#### Arbitrum One
- Builder: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
- Treasury: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
- Fee Config: `0xc03d87085E254695754a74D2CF76579e167Eb895`
- MOR Token: `0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86`

#### Base
- Builder: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
- Treasury: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
- Fee Config: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`
- MOR Token: `0x7431ada8a591c955a994a21710752ef9b882b8e3`

#### Ethereum
- MOR Token: `0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0`
- L1Sender: `0x2Efd4430489e1a05A89c2f51811aC661B7E5FF84`
- Distribution: `0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790`

### Contract Interfaces
- `IMorpheusBuilder.sol`: Interface for builder pool management and staking
- `IMorpheusTreasury.sol`: Interface for reward distribution and fee management
- `IMorpheusFeeConfig.sol`: Interface for fee configuration and management
- `IMOR.sol`: Interface for the MOR token with OFT (Omnichain Fungible Token) capabilities
- `IOFT.sol`: Interface for LayerZero Omnichain functionality

## Architecture

### Frontend Stack
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Web3 Integration**: ethers.js v6, wagmi v2, viem
- **State Management**: React hooks and context
- **UI Components**: Custom components + Chakra UI
- **Form Handling**: React Hook Form with Zod validation

### Contract Integration
- **Language**: TypeScript
- **Web3 Library**: ethers.js v6, viem
- **Network Support**: Ethereum, Arbitrum One & Base
- **Cross-Chain**: LayerZero integration for OFT

## Development Features

- 🏗️ Builder pool management system
- 💰 Flexible staking mechanisms
- 🔄 Real-time reward tracking
- 🌐 Multi-network support
- 🔒 Secure contract integration
- 📱 Responsive design
- ⚡ Network switching
- ✅ Type-safe contract interactions
- 🛡️ Comprehensive error handling

## Project Structure

```
/
├── components/        # UI components
├── contracts/         # Smart contract interfaces & ABIs
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages and API routes
├── public/            # Static assets
├── scripts/           # Deployment and utility scripts
├── services/          # Backend services
├── styles/            # Global styles
└── utils/             # Utility functions
```

## Documentation

- [Technical Implementation Guide](./docs/technical_guide.md)
- [Smart Contract Testing Guide](./SmartContract_Testing_Guide.md)
- [Deployment Checklist](./Deployment_Checklist.md)
- [Project Assessment](./MOR_Project_Updated_Assessment.md)
- [Next Steps Action Plan](./MOR_Next_Steps_Action_Plan.md)

## Core Dependencies

- [Next.js](https://nextjs.org/) - React framework
- [ethers.js](https://docs.ethers.io/v6/) - Ethereum library
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Interface for Ethereum
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Socket.io](https://socket.io/) - Real-time event-based communication
- [ox](https://www.npmjs.com/package/ox) - Wallet connection utilities (requires BIP39 wordlist fix)
- [@scure/bip39](https://www.npmjs.com/package/@scure/bip39) - Implementation of BIP39 standard

## Deployment

### Vercel Deployment

The recommended way to deploy this application is using Vercel:

1. Push your repository to GitHub
2. Import your repository in the Vercel dashboard
3. Configure environment variables
4. Deploy

### Manual Deployment

For manual deployment:

1. Build the project:
```bash
yarn build
```

2. Start the production server:
```bash
yarn start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
