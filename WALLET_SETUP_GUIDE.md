# Wallet & Private Key Setup Guide 🔐

## What is a Private Key?

A **private key** is like a master password that:
- Controls a blockchain wallet/address
- Signs transactions
- Pays for gas fees
- **Must be kept SECRET!**

## 🎯 Quick Answer

**You need the SAME private key in TWO places:**

1. **`contracts/.env`** - For deploying contracts
2. **`server/.env`** - For server to pay gas when creating blockchain transactions

---

## 📝 Step-by-Step Setup

### Step 1: Get Your Private Key

#### Option A: Using MetaMask (Easiest for Development)

1. **Install MetaMask**: https://metamask.io
2. **Create a new account** or use existing
3. **Export Private Key**:
   - Click the 3 dots menu (⋮)
   - Select "Account Details"
   - Click "Show Private Key"
   - Enter your MetaMask password
   - Copy the private key (format: `0x1234567890abcdef...`)

#### Option B: Generate with Foundry (For New Wallet)

```bash
# Generate a new wallet
cast wallet new

# Output:
# Successfully created new keypair.
# Address:     0xAbC123...
# Private key: 0x1234567890abcdef...
```

**Save both the address and private key securely!**

#### Option C: Use Existing Wallet

If you have a wallet on BlockDAG/Kaspa network, export its private key from your wallet application.

---

### Step 2: Fund Your Wallet

Your wallet needs native tokens (BDAG, KAS, etc.) to pay for:
- Contract deployment gas fees
- Transaction gas fees when server uploads files

**How to get tokens:**
1. **Testnet**: Use a faucet (ask in BlockDAG Discord/Telegram)
2. **Mainnet**: Buy tokens from an exchange

**Recommended amounts:**
- **Testnet**: 10-100 tokens (free from faucet)
- **Mainnet**: 50-200 tokens (enough for thousands of transactions)

---

### Step 3: Create Environment Files

#### A. Contracts Environment (`contracts/.env`)

Create `contracts/.env`:

```bash
# Network Configuration
BLOCKCHAIN_RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKCHAIN_CHAIN_ID=1

# Your Wallet Private Key (KEEP SECRET!)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Optional: Deployer address for verification
DEPLOYER_ADDRESS=0xYourWalletAddress...

# Optional: Block explorer API key (for contract verification)
ETHERSCAN_API_KEY=your_api_key_if_available
```

#### B. Server Environment (`server/.env`)

Add to your existing `server/.env`:

```bash
# ... your existing MongoDB, JWT, etc. configs ...

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKCHAIN_CHAIN_ID=1
BLOCKCHAIN_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
BLOCKCHAIN_NETWORK=blockdag

# These will be filled AFTER deployment
BLOCKROLL_CONTRACT_ADDRESS=
API_KEY_MANAGER_ADDRESS=
```

---

### Step 4: Verify Setup

Check that your wallet has funds:

```bash
# Using cast (Foundry tool)
cast balance 0xYourWalletAddress --rpc-url https://rpc.primordial.bdagscan.com

# Should show something like: 100000000000000000000 (100 tokens)
```

---

## 🔒 Security Best Practices

### ❌ **NEVER DO THIS:**
- ❌ Commit `.env` files to GitHub
- ❌ Share your private key with anyone
- ❌ Use production keys in development
- ❌ Store keys in plain text in code

### ✅ **ALWAYS DO THIS:**
- ✅ Add `.env` to `.gitignore`
- ✅ Use different wallets for dev/prod
- ✅ Keep backups of private keys in secure location (password manager)
- ✅ Use environment variables, never hardcode keys

### `.gitignore` Check

Make sure your `.gitignore` includes:

```bash
# Environment variables
.env
.env.local
.env.*.local

# Contracts
contracts/.env
contracts/broadcast/
contracts/cache/
contracts/out/

# Server
server/.env
server/node_modules/
```

---

## 📋 Complete Setup Checklist

- [ ] Generate or export private key from wallet
- [ ] Fund wallet with native tokens
- [ ] Create `contracts/.env` with `PRIVATE_KEY`
- [ ] Create/update `server/.env` with `BLOCKCHAIN_PRIVATE_KEY`
- [ ] Verify both files are in `.gitignore`
- [ ] Test wallet balance with `cast balance`
- [ ] Ready to deploy! 🚀

---

## 🛠️ Example: Complete Flow

```bash
# 1. Generate new wallet
cast wallet new
# Save the output!

# 2. Check balance (should be 0)
cast balance YOUR_ADDRESS --rpc-url https://rpc.primordial.bdagscan.com

# 3. Fund wallet (testnet faucet or buy tokens)
# ...wait for tokens...

# 4. Check balance again
cast balance YOUR_ADDRESS --rpc-url https://rpc.primordial.bdagscan.com
# Should show your balance now

# 5. Create contracts/.env
echo 'PRIVATE_KEY=0xyour_private_key_here' > contracts/.env
echo 'BLOCKCHAIN_RPC_URL=https://rpc.primordial.bdagscan.com' >> contracts/.env

# 6. Update server/.env
echo 'BLOCKCHAIN_PRIVATE_KEY=0xyour_private_key_here' >> server/.env

# 7. Deploy contracts
cd contracts
forge script script/DeployBlockRoll.s.sol --rpc-url $BLOCKCHAIN_RPC_URL --broadcast --private-key $PRIVATE_KEY

# 8. Copy deployed addresses to server/.env
# Edit server/.env and add:
# BLOCKROLL_CONTRACT_ADDRESS=0x...
# API_KEY_MANAGER_ADDRESS=0x...

# 9. Start server
cd ../server
npm run dev
```

---

## 🆘 Troubleshooting

### "Insufficient funds for intrinsic transaction cost"
- Your wallet doesn't have enough tokens for gas
- Fund your wallet with more tokens

### "Invalid private key"
- Ensure private key starts with `0x`
- Ensure it's 64 hexadecimal characters (after `0x`)
- Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

### "Connection refused" or "RPC error"
- Check `BLOCKCHAIN_RPC_URL` is correct
- Try alternative RPC endpoint
- Check internet connection

### "Nonce too high" or "Nonce too low"
- Reset your account in MetaMask (Settings → Advanced → Reset Account)
- Or wait a few minutes and try again

---

## 💡 Pro Tips

1. **Use Different Wallets for Different Purposes:**
   - Dev wallet (testnet)
   - Staging wallet (testnet)
   - Production wallet (mainnet)

2. **Monitor Gas Usage:**
   ```bash
   # Check recent transactions
   cast tx TRANSACTION_HASH --rpc-url YOUR_RPC
   ```

3. **Set Up Alerts:**
   - Monitor wallet balance
   - Alert when balance drops below threshold
   - Use services like Tenderly or Defender

4. **Backup Your Keys:**
   - Use a password manager (1Password, Bitwarden)
   - Store encrypted backups
   - Never store in plain text

---

## 🔑 Key Formats Reference

### Valid Private Key Formats:
```bash
# Hex format (most common)
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Without 0x prefix (some tools)
1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Invalid Formats:
```bash
# Too short
0x12345

# Contains invalid characters
0xGHIJKL...

# Missing characters
0x123456789...  (must be exactly 64 hex chars)
```

---

**You're all set! The same private key works for both deployment and server operations.** 🎉

