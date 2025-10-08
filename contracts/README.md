# BlockRoll Smart Contracts

Professional, modular smart contracts for BlockRoll - A non-custodial data exchange and storage platform on BlockDAG Network.

## 📋 Overview

BlockRoll consists of the following modular contracts:

- **FileRegistry**: Manages file registration and metadata storage
- **AccessControlModule**: Handles file access permissions and emergency access
- **APIKeyManager**: Manages SDK/CDN API key integrations
- **AdminRole**: Role-based admin management
- **BlockRoll**: Main contract integrating all modules

## 🏗️ Architecture

```
BlockRoll (Main Contract)
├── FileRegistry (File metadata & ownership)
├── AccessControlModule (Permissions & sharing)
├── APIKeyManager (SDK/CDN integration)
└── AdminRole (Admin management)
```

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (v18+)
- A wallet with BlockDAG test/mainnet funds

### Installation

```bash
# Install dependencies
forge install

# Build contracts
forge build
```

### Environment Setup

Create a `.env` file in the contracts directory:

```bash
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKDAG_API_KEY=your_api_key_here
```

**⚠️ NEVER commit your `.env` file!**

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run tests with verbosity
forge test -vvv

# Run specific test
forge test --match-test testUploadFile
```

## 📦 Deployment

### Deploy to BlockDAG Network

```bash
# Deploy to BlockDAG
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url blockdag \
  --broadcast \
  --verify

# Or using environment variables
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### Local Testing with Anvil

```bash
# Start local node
anvil

# Deploy to local node
forge script script/DeployBlockRoll.s.sol:DeployBlockRoll \
  --rpc-url http://localhost:8545 \
  --broadcast
```

## 📝 Contract Interactions

### Upload a File

```solidity
bytes32 fileId = blockRoll.uploadFile(
    fileHash,        // bytes32: IPFS CID or SHA-256 hash
    receiver,        // address: Authorized recipient
    expiryDate,      // uint256: Expiry timestamp (0 for no expiry)
    encryptedKeyRef  // bytes32: Reference to encrypted key
);
```

### Upload with API Key (SDK/CDN)

```solidity
bytes32 fileId = blockRoll.uploadFileWithAPIKey(
    apiKeyHash,      // bytes32: Hash of API key
    fileHash,
    receiver,
    expiryDate,
    encryptedKeyRef
);
```

### Share File

```solidity
blockRoll.shareFile(fileId, newReceiver);
```

### Revoke Access

```solidity
blockRoll.revokeFileAccess(fileId);
```

### Verify Ownership

```solidity
address owner = blockRoll.verifyFileOwnership(fileId);
```

### Check Authorization

```solidity
bool isAuth = blockRoll.isAuthorized(fileId, userAddress);
```

## 🔧 Development Commands

```bash
# Format code
forge fmt

# Generate gas snapshots
forge snapshot

# Analyze contract size
forge build --sizes

# Run slither (security analysis)
slither .

# Coverage report
forge coverage
```

## 📊 Contract Addresses

After deployment, contract addresses will be displayed:

```
Main Contract: 0x...
FileRegistry: 0x...
AccessControl: 0x...
APIKeyManager: 0x...
AdminRole: 0x...
```

## 🔒 Security

- All contracts use Solidity 0.8.20+ (built-in overflow protection)
- Modular design for easier auditing
- Comprehensive test coverage
- Non-custodial architecture
- Role-based access control

## 📖 Documentation

For detailed API documentation, see:
- [Foundry Book](https://book.getfoundry.sh/)
- [BlockDAG Documentation](https://primordial.bdagscan.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass: `forge test`
4. Format code: `forge fmt`
5. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for BlockRoll on BlockDAG Network**
