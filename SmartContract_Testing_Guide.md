# Morpheus Builder: Smart Contract Testing Guide

This guide provides a comprehensive approach to testing the smart contracts in the MOR Accelerator project. Testing is a critical step before mainnet deployment to ensure security, functionality, and reliability.

## Testing Environment Setup

### 1. Local Hardhat Environment

```bash
# Install development dependencies if not already installed
npm install --save-dev hardhat @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle ethereum-waffle chai

# Verify hardhat.config.ts is properly configured
```

### 2. Test Account Configuration

Add these variables to your `.env` file:

```
# Test Configuration
PRIVATE_KEY_TEST="your_test_wallet_private_key" # Never use a production wallet
TEST_ACCOUNT_ADDRESS="your_test_wallet_address"
```

### 3. Obtain Testnet Tokens

- For Arbitrum Sepolia: Use the [Arbitrum Sepolia Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
- For Base Sepolia: Use the [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- For MOR tokens: Deploy a test MOR token or request from the project team

## Testing Strategies

### 1. Unit Testing

Test individual contract functions in isolation.

```typescript
// Example test for staking functionality
describe("MorpheusBuilder Staking", function() {
  let builder: Contract;
  let treasury: Contract;
  let morToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let builderId: string;

  beforeEach(async function() {
    // Setup contracts and test accounts
    [owner, user1] = await ethers.getSigners();
    
    // Deploy test contracts or connect to existing ones
    morToken = await deployMorToken();
    treasury = await deployTreasury();
    builder = await deployBuilder(treasury.address);
    
    // Create a builder pool for testing
    const tx = await builder.connect(user1).createBuilderPool(
      "Test Pool",
      ethers.utils.parseEther("100"),
      31536000, // 1 year
      70 // 70% reward split
    );
    const receipt = await tx.wait();
    builderId = receipt.events?.find(e => e.event === "BuilderPoolCreated")?.args?.builderId;
  });

  it("Should allow staking tokens", async function() {
    // Approve tokens for staking
    await morToken.connect(user1).approve(builder.address, ethers.utils.parseEther("50"));
    
    // Stake tokens
    await builder.connect(user1).stake(builderId, ethers.utils.parseEther("50"));
    
    // Verify stake amount
    const pool = await builder.getBuilderInfo(builderId);
    expect(pool.stakedAmount).to.equal(ethers.utils.parseEther("150")); // 100 initial + 50 new
  });

  it("Should enforce lock period", async function() {
    // Approve tokens for staking
    await morToken.connect(user1).approve(builder.address, ethers.utils.parseEther("50"));
    
    // Stake tokens
    await builder.connect(user1).stake(builderId, ethers.utils.parseEther("50"));
    
    // Try to unstake immediately (should fail)
    await expect(
      builder.connect(user1).unstake(builderId, ethers.utils.parseEther("10"))
    ).to.be.revertedWith("Tokens are locked");
  });
});
```

### 2. Integration Testing

Test interactions between multiple contracts.

```typescript
describe("Builder and Treasury Integration", function() {
  let builder: Contract;
  let treasury: Contract;
  let morToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let builderId: string;

  beforeEach(async function() {
    // Setup contracts and test accounts
    [owner, user1] = await ethers.getSigners();
    
    // Deploy test contracts
    morToken = await deployMorToken();
    treasury = await deployTreasury(morToken.address);
    builder = await deployBuilder(treasury.address);
    
    // Setup treasury permissions
    await treasury.setBuilderContract(builder.address);
    
    // Create a builder pool for testing
    const tx = await builder.connect(user1).createBuilderPool(
      "Test Pool",
      ethers.utils.parseEther("100"),
      31536000,
      70
    );
    const receipt = await tx.wait();
    builderId = receipt.events?.find(e => e.event === "BuilderPoolCreated")?.args?.builderId;
    
    // Fund treasury with rewards
    await morToken.transfer(treasury.address, ethers.utils.parseEther("1000"));
  });

  it("Should distribute rewards from treasury to builders", async function() {
    // Distribute rewards
    await treasury.distributeRewards(
      [builderId],
      [ethers.utils.parseEther("100")]
    );
    
    // Check available rewards
    const rewards = await treasury.getBuilderRewards(builderId);
    expect(rewards).to.equal(ethers.utils.parseEther("100"));
    
    // Claim rewards
    const balanceBefore = await morToken.balanceOf(user1.address);
    await builder.connect(user1).claimRewards(builderId);
    const balanceAfter = await morToken.balanceOf(user1.address);
    
    // Verify claimed amount (70% of 100 = 70)
    expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther("70"));
  });
});
```

### 3. Network-Specific Testing

Test deployment and functionality on each target network.

```typescript
describe("Cross-Network Deployment", function() {
  // This would be run with different networks selected in hardhat.config.ts
  
  it("Should deploy and initialize on Arbitrum", async function() {
    // Deploy contracts to Arbitrum testnet
    const treasury = await deployTreasury();
    const builder = await deployBuilder(treasury.address);
    
    // Verify contract initialization
    expect(await builder.treasury()).to.equal(treasury.address);
  });
  
  it("Should deploy and initialize on Base", async function() {
    // Deploy contracts to Base testnet
    const treasury = await deployTreasury();
    const builder = await deployBuilder(treasury.address);
    
    // Verify contract initialization
    expect(await builder.treasury()).to.equal(treasury.address);
  });
});
```

### 4. Cross-Chain Testing

Test LayerZero integrations for cross-chain functionality.

```typescript
describe("LayerZero Cross-Chain", function() {
  let arbitrumBuilder: Contract;
  let baseBuilder: Contract;
  let user1: SignerWithAddress;
  
  // This test requires deploying to both networks and setting up LayerZero
  
  it("Should initialize cross-chain communication", async function() {
    // Test LayerZero message passing
    // (This is simplified - actual implementation would be more complex)
    const message = ethers.utils.formatBytes32String("test_message");
    await arbitrumBuilder.sendCrossChainMessage(BASE_CHAIN_ID, message);
    
    // Wait for message to be received (would need event monitoring)
    // Verify message receipt on Base contract
  });
});
```

## Testing Scripts

Use these scripts to run your tests:

### 1. Running Unit Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/BuilderIntegration.test.ts

# Run tests with coverage report
npx hardhat coverage
```

### 2. Testing on Specific Networks

```bash
# Test on Arbitrum Sepolia
npx hardhat test --network arbitrumSepolia

# Test on Base Sepolia
npx hardhat test --network baseSepolia
```

### 3. Gas Usage Analysis

```bash
# Run gas reporter
REPORT_GAS=true npx hardhat test
```

## Example Testing Workflow

1. **Write Tests**: Create comprehensive tests for all contract functions
2. **Local Testing**: Run tests in local Hardhat environment
3. **Testnet Deployment**: Deploy contracts to testnets
4. **Network Testing**: Run integration tests on testnets
5. **Gas Optimization**: Analyze gas usage and optimize
6. **Cross-Chain Testing**: Test LayerZero integration
7. **Security Review**: Review for vulnerabilities
8. **Production Ready**: When all tests pass, prepare for mainnet

## Testing the Builder Staking Model

### Key Test Cases

1. **Pool Creation**
   - Create pools with different parameters
   - Verify minimum stake requirements
   - Test invalid inputs (e.g., zero stake, invalid lock periods)

2. **Staking Functions**
   - Stake tokens
   - Verify token transfers
   - Check staking limits and minimums
   - Test staking with different lock periods

3. **Unstaking Functions**
   - Test unstaking after lock period expires
   - Verify unstaking restrictions during lock period
   - Test partial unstaking
   - Verify token returns

4. **Reward Distribution**
   - Test reward calculations
   - Verify reward splits (70%, 80%, 90%)
   - Test reward claiming
   - Verify treasury interactions

5. **Fee Configuration**
   - Test fee calculations
   - Verify fee deductions
   - Test fee distribution

6. **Cross-Chain Functions** (if implemented)
   - Test cross-chain stake migration
   - Test cross-chain reward distribution
   - Verify gas fee handling

## Security Testing

Incorporate these security-focused tests:

1. **Access Control**
   - Test function access restrictions
   - Verify owner-only functions
   - Test pool creator permissions

2. **Economic Security**
   - Test for economic exploits
   - Verify reward distribution fairness
   - Test slashing conditions (if any)

3. **Reentrancy Protection**
   - Test for reentrancy vulnerabilities
   - Verify state changes before external calls

4. **Input Validation**
   - Test boundary values
   - Test with malicious inputs
   - Verify proper error handling

## Debugging Tips

1. **Console Logging**: Use `console.log()` in tests and Hardhat's console.log in contracts
2. **Event Monitoring**: Track events emitted by contracts
3. **State Inspection**: Check contract state before and after operations
4. **Transaction Traces**: Use `hardhat_traceTransaction` for detailed debugging
5. **Local Forking**: Fork mainnet or testnet for realistic testing

## Continuous Integration

Consider setting up CI/CD for automated testing:

```yaml
# Example GitHub Actions workflow
name: Smart Contract Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16.x'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npx hardhat test
      - name: Run coverage
        run: npx hardhat coverage
```

## Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Waffle Testing](https://ethereum-waffle.readthedocs.io/)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [OpenZeppelin Test Helpers](https://docs.openzeppelin.com/test-helpers)
- [LayerZero Documentation](https://layerzero.gitbook.io/docs/)

## Conclusion

Thorough testing is essential before deploying smart contracts to mainnet. This guide provides a framework for testing the Morpheus Builder contracts, but should be adapted to the specific requirements and functionality of your implementation. Always prioritize security and correctness in your testing approach.
