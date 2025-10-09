# Blockchain Integration Setup Guide

## Overview
BlockRoll is integrated with blockchain (BlockDAG/Kaspa) for decentralized file metadata storage and access control.

## Environment Variables

Add these to your `.env` file:

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKCHAIN_CHAIN_ID=1
BLOCKROLL_CONTRACT_ADDRESS=<your_deployed_blockroll_address>
API_KEY_MANAGER_ADDRESS=<your_api_key_manager_address>
BLOCKCHAIN_PRIVATE_KEY=<server_wallet_private_key>
BLOCKCHAIN_NETWORK=blockdag
```

## Contract Deployment

1. **Deploy Contracts:**
   ```bash
   cd contracts
   forge script script/DeployBlockRoll.s.sol --rpc-url $BLOCKCHAIN_RPC_URL --broadcast
   ```

2. **Get Contract Addresses:**
   After deployment, copy the BlockRoll and APIKeyManager addresses to your `.env` file.

3. **Fund Server Wallet:**
   The server needs gas to execute blockchain transactions. Fund the wallet address corresponding to `BLOCKCHAIN_PRIVATE_KEY`.

## How It Works

### File Upload Flow
1. User uploads file to server
2. Server encrypts and stores file in IPFS/storage
3. Server calls `BlockRoll.uploadFile()` with metadata
4. Blockchain returns `fileId` which is stored in MongoDB
5. User can verify ownership on-chain

### API Key Upload Flow
1. Developer creates API key on server
2. Server registers API key hash on blockchain
3. When developer uploads with API key:
   - Server verifies API key locally
   - Creates wallet from developer's private key
   - Calls `uploadFileWithAPIKey()` from developer's wallet
   - File is owned by developer on-chain

### Access Control
- All access control is managed on-chain
- Server reads blockchain state to verify permissions
- File sharing/revocation updates blockchain state

## Blockchain Service API

```typescript
import { BlockchainService } from './services';

// Upload file to blockchain
const result = await BlockchainService.uploadFile({
  fileHash: '0x...',
  receiver: '0xUserAddress',
  expiryDate: timestamp,
  encryptedKeyRef: '0x...'
});

// Register API key
await BlockchainService.registerAPIKey({
  apiKeyHash: '0x...',
  developerAddress: '0xDeveloperAddress'
});

// Share file
await BlockchainService.shareFile(
  fileId,
  newReceiverAddress,
  userWallet
);

// Revoke access
await BlockchainService.revokeFileAccess(
  fileId,
  userWallet
);
```

## Security Considerations

1. **Server Private Key:** Keep `BLOCKCHAIN_PRIVATE_KEY` secure. It's used for gas payments.
2. **API Key Hashing:** API keys are hashed before storing on-chain.
3. **User Wallets:** Users should connect their own wallets for maximum security.
4. **Gas Management:** Monitor gas usage and keep server wallet funded.

## Testing

Run blockchain integration tests:
```bash
cd contracts
forge test
```

All 12 tests should pass ✅

## Troubleshooting

### "Invalid API key" Error
- Ensure API key is registered on blockchain
- Verify API key hash matches

### "Not file owner" Error
- Check that the correct wallet is calling the function
- Verify file ownership on-chain

### Gas Issues
- Ensure server wallet has sufficient balance
- Check RPC endpoint is responding

### RPC Connection Issues
- Verify `BLOCKCHAIN_RPC_URL` is correct
- Check network connectivity
- Try alternative RPC endpoints

## Future Enhancements

- [ ] Batch file uploads to reduce gas costs
- [ ] Layer 2 integration for cheaper transactions
- [ ] Multi-sig support for enterprise files
- [ ] Automated gas price optimization

