# BlockRoll Deployment Guide

Complete guide for deploying BlockRoll smart contracts to BlockDAG Network.

## 📋 Pre-Deployment Checklist

- [ ] Foundry installed and updated
- [ ] Wallet funded with BlockDAG tokens for gas
- [ ] Private key secured (never share or commit)
- [ ] RPC endpoint accessible
- [ ] Environment variables configured

## 🔧 Environment Configuration

### 1. Create `.env` File

Create a `.env` file in the `contracts` directory:

```bash
# Required
PRIVATE_KEY=0x... # Your wallet private key (without 0x prefix for some tools)
RPC_URL=https://rpc.primordial.bdagscan.com

# Optional
BLOCKDAG_API_KEY=your_api_key_here
CHAIN_ID=1 # Update with actual BlockDAG chain ID
GAS_PRICE=20
```

### 2. Load Environment Variables

```bash
source .env
```

## 🧪 Pre-Deployment Testing

### Run All Tests

```bash
# Basic test run
forge test

# Verbose output
forge test -vvv

# Gas reporting
forge test --gas-report

# Coverage report
forge coverage
```

### Build Contracts

```bash
forge build

# Check contract sizes
forge build --sizes
```

## 🚀 Deployment Steps

### Option 1: Using Deployment Script (Recommended)

```bash
# Deploy to BlockDAG mainnet
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url blockdag \
  --broadcast \
  --verify

# Deploy with specific gas price
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --gas-price $GAS_PRICE \
  --broadcast
```

### Option 2: Manual Deployment

```bash
# 1. Deploy using forge create
forge create src/BlockRoll.sol:BlockRoll \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# 2. Save the deployed address
export BLOCKROLL_ADDRESS=0x...
```

### Option 3: Local Testing First

```bash
# 1. Start local Anvil node
anvil

# 2. Deploy to local node (in new terminal)
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url http://localhost:8545 \
  --broadcast

# 3. Test interactions locally
cast call $BLOCKROLL_ADDRESS "getVersion()" --rpc-url http://localhost:8545
```

## 📝 Post-Deployment Verification

### 1. Verify Deployment

```bash
# Get deployed contract info
cast code $BLOCKROLL_ADDRESS --rpc-url $RPC_URL

# Check version
cast call $BLOCKROLL_ADDRESS "getVersion()" --rpc-url $RPC_URL

# Get all module addresses
cast call $BLOCKROLL_ADDRESS "getModules()" --rpc-url $RPC_URL
```

### 2. Test Basic Functionality

```bash
# Upload a test file
cast send $BLOCKROLL_ADDRESS \
  "uploadFile(bytes32,address,uint256,bytes32)" \
  <fileHash> <receiverAddress> 0 <encryptedKeyRef> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Verify ownership
cast call $BLOCKROLL_ADDRESS \
  "verifyFileOwnership(bytes32)" <fileId> \
  --rpc-url $RPC_URL
```

### 3. Verify on Block Explorer

If BlockDAG has a block explorer with verification:

```bash
forge verify-contract \
  $BLOCKROLL_ADDRESS \
  src/BlockRoll.sol:BlockRoll \
  --chain-id $CHAIN_ID \
  --etherscan-api-key $BLOCKDAG_API_KEY
```

## 🔐 Security Best Practices

### Before Deployment

1. **Audit Contracts**
   ```bash
   # Run Slither
   slither .
   
   # Run Mythril (if available)
   myth analyze src/BlockRoll.sol
   ```

2. **Test Coverage**
   ```bash
   forge coverage
   # Aim for >90% coverage
   ```

3. **Gas Optimization**
   ```bash
   forge snapshot
   # Review gas costs
   ```

### After Deployment

1. **Transfer Ownership** (if needed)
   ```bash
   cast send $BLOCKROLL_ADDRESS \
     "transferOwnership(address)" <newOwnerAddress> \
     --rpc-url $RPC_URL \
     --private-key $PRIVATE_KEY
   ```

2. **Add Admins**
   ```bash
   # Get AdminRole module address
   ADMIN_ROLE=$(cast call $BLOCKROLL_ADDRESS "getModules()" --rpc-url $RPC_URL | cut -d' ' -f4)
   
   # Add admin
   cast send $ADMIN_ROLE \
     "addAdmin(address)" <adminAddress> \
     --rpc-url $RPC_URL \
     --private-key $PRIVATE_KEY
   ```

3. **Set Up Monitoring**
   - Monitor contract events
   - Set up alerts for critical functions
   - Track gas usage

## 📊 Deployment Costs (Estimated)

| Contract | Estimated Gas | Cost (at 20 gwei) |
|----------|--------------|-------------------|
| BlockRoll Main | ~2,500,000 | ~0.05 ETH |
| FileRegistry | ~1,200,000 | ~0.024 ETH |
| AccessControl | ~800,000 | ~0.016 ETH |
| APIKeyManager | ~600,000 | ~0.012 ETH |
| AdminRole | ~500,000 | ~0.01 ETH |
| **Total** | ~5,600,000 | **~0.112 ETH** |

*Note: Actual costs may vary based on network conditions and BlockDAG gas prices.*

## 🐛 Troubleshooting

### Common Issues

**1. "Insufficient funds for gas"**
```bash
# Check balance
cast balance <your_address> --rpc-url $RPC_URL

# Get current gas price
cast gas-price --rpc-url $RPC_URL
```

**2. "Nonce too low/high"**
```bash
# Check current nonce
cast nonce <your_address> --rpc-url $RPC_URL

# Reset if needed (only on testnet)
cast send <your_address> --value 0 --nonce <correct_nonce>
```

**3. "Contract size exceeds limit"**
```bash
# Enable optimizer
forge build --optimize --optimizer-runs 200

# Or split into smaller contracts
```

**4. "RPC connection failed"**
```bash
# Test RPC endpoint
curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## 📋 Deployment Checklist

- [ ] All tests passing
- [ ] Gas optimization reviewed
- [ ] Contract audited (if mainnet)
- [ ] Environment variables set
- [ ] Sufficient gas funds available
- [ ] Backup private key secured
- [ ] Deployment script tested on testnet
- [ ] Post-deployment verification plan ready
- [ ] Monitoring tools configured
- [ ] Documentation updated with contract addresses

## 🔄 Upgrade Strategy

BlockRoll uses a modular architecture. To upgrade:

1. Deploy new module version
2. Update main contract to point to new module
3. Test thoroughly before switching
4. Maintain backwards compatibility

## 📞 Support

If you encounter issues:
- Check Foundry documentation: https://book.getfoundry.sh/
- Review BlockDAG documentation
- Open an issue on GitHub
- Contact the BlockRoll team

---

**Deployment Date:** _____________  
**Deployer Address:** _____________  
**Network:** BlockDAG  
**Chain ID:** _____________  

**Contract Addresses:**
- Main Contract: _____________
- FileRegistry: _____________
- AccessControl: _____________
- APIKeyManager: _____________
- AdminRole: _____________

---

**Happy Deploying! 🚀**

