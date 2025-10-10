import { ethers } from 'ethers';
import config from '../config';
import { ValidationError } from '../utils/errors';
import { BaseService } from './BaseService';

// Import contract ABIs (we'll need to generate these)
import BlockRollABI from '../contracts/BlockRoll.json';

interface FileUploadParams {
  fileHash: string;
  receiver: string;
  expiryDate?: number;
  encryptedKeyRef: string;
}

interface APIKeyRegistrationParams {
  apiKeyHash: string;
  developerAddress: string;
}

export class BlockchainService extends BaseService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private blockRollContract: ethers.Contract;
  // private apiKeyManagerContract: ethers.Contract; // Reserved for future use

  constructor() {
    super('BlockchainService');

    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);

    // Initialize wallet (server wallet for gas payments)
    // Skip if private key is not configured (e.g., development mode)
    if (config.blockchain.privateKey && config.blockchain.privateKey.length > 0) {
      try {
        this.wallet = new ethers.Wallet(
          config.blockchain.privateKey,
          this.provider
        );
        this.logInfo('Blockchain wallet initialized');
      } catch (error) {
        this.logWarn('Invalid blockchain private key - blockchain features will be limited', { error });
        // Create a random wallet for development
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
      }
    } else {
      this.logWarn('No blockchain private key configured - using random wallet for development');
      // Create a random wallet for development (won't have funds but won't crash)
      this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    }

    // Initialize contracts (skip if addresses not configured)
    if (config.blockchain.blockRollAddress && config.blockchain.blockRollAddress.length > 0) {
      this.blockRollContract = new ethers.Contract(
        config.blockchain.blockRollAddress,
        BlockRollABI.abi,
        this.wallet
      );
      this.logInfo('BlockRoll contract initialized', {
        address: config.blockchain.blockRollAddress,
      });
    } else {
      this.logWarn('BlockRoll contract address not configured - blockchain features will be limited');
      // Create a dummy contract to prevent crashes
      this.blockRollContract = new ethers.Contract(
        ethers.ZeroAddress,
        BlockRollABI.abi,
        this.wallet
      );
    }

    // Initialize API Key Manager Contract (reserved for future use)
    // this.apiKeyManagerContract = new ethers.Contract(
    //   config.blockchain.apiKeyManagerAddress,
    //   APIKeyManagerABI.abi,
    //   this.wallet
    // );

    this.logInfo('Blockchain service initialized', {
      rpcUrl: config.blockchain.rpcUrl,
      blockRollAddress: config.blockchain.blockRollAddress || 'NOT_CONFIGURED',
      walletConfigured: !!config.blockchain.privateKey,
    });
  }

  /**
   * Upload file to blockchain
   */
  async uploadFile(
    params: FileUploadParams,
    _userWallet?: string
  ): Promise<{ fileId: string; txHash: string }> {
    return this.executeWithErrorHandling(async () => {
      // Validate addresses
      if (!ethers.isAddress(params.receiver)) {
        throw new ValidationError('Invalid receiver address');
      }

      // Convert file hash to bytes32
      const fileHashBytes32 = ethers.keccak256(
        ethers.toUtf8Bytes(params.fileHash)
      );
      const encryptedKeyRefBytes32 = ethers.keccak256(
        ethers.toUtf8Bytes(params.encryptedKeyRef)
      );

      // Prepare transaction
      const expiryTimestamp = params.expiryDate
        ? Math.floor(new Date(params.expiryDate).getTime() / 1000)
        : 0;

      this.logInfo('Uploading file to blockchain', {
        fileHash: params.fileHash,
        receiver: params.receiver,
        expiryDate: params.expiryDate,
      });

      // Call contract
      const tx = await this.blockRollContract.uploadFile(
        fileHashBytes32,
        params.receiver,
        expiryTimestamp,
        encryptedKeyRefBytes32
      );

      const receipt = await tx.wait();

      // Extract fileId from event
      const fileUploadedEvent = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          ethers.id('FileUploaded(bytes32,address,address,bytes32)')
      );

      if (!fileUploadedEvent) {
        throw new Error('FileUploaded event not found in transaction');
      }

      const fileId = fileUploadedEvent.topics[1]; // First indexed parameter

      this.logInfo('File uploaded to blockchain', {
        fileId,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return {
        fileId,
        txHash: receipt.hash,
      };
    }, 'uploadFile');
  }

  /**
   * Upload file with API key
   */
  async uploadFileWithAPIKey(
    apiKeyHash: string,
    params: FileUploadParams,
    developerWallet: ethers.Wallet
  ): Promise<{ fileId: string; txHash: string }> {
    return this.executeWithErrorHandling(async () => {
      if (!ethers.isAddress(params.receiver)) {
        throw new ValidationError('Invalid receiver address');
      }

      const fileHashBytes32 = ethers.keccak256(
        ethers.toUtf8Bytes(params.fileHash)
      );
      const encryptedKeyRefBytes32 = ethers.keccak256(
        ethers.toUtf8Bytes(params.encryptedKeyRef)
      );
      const apiKeyHashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(apiKeyHash));

      const expiryTimestamp = params.expiryDate
        ? Math.floor(new Date(params.expiryDate).getTime() / 1000)
        : 0;

      // Use developer's wallet to call the function
      const contractWithDeveloperWallet = this.blockRollContract.connect(
        developerWallet
      );

      this.logInfo('Uploading file with API key', {
        apiKeyHash: apiKeyHash.substring(0, 10) + '...',
        receiver: params.receiver,
      });

      const tx = await (contractWithDeveloperWallet as any).uploadFileWithAPIKey(
        apiKeyHashBytes32,
        fileHashBytes32,
        params.receiver,
        expiryTimestamp,
        encryptedKeyRefBytes32
      );

      const receipt = await tx.wait();

      const fileUploadedEvent = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          ethers.id('FileUploaded(bytes32,address,address,bytes32)')
      );

      if (!fileUploadedEvent) {
        throw new Error('FileUploaded event not found in transaction');
      }

      const fileId = fileUploadedEvent.topics[1];

      this.logInfo('File uploaded with API key', {
        fileId,
        txHash: receipt.hash,
      });

      return {
        fileId,
        txHash: receipt.hash,
      };
    }, 'uploadFileWithAPIKey');
  }

  /**
   * Register API key on blockchain
   */
  async registerAPIKey(
    params: APIKeyRegistrationParams
  ): Promise<{ txHash: string }> {
    return this.executeWithErrorHandling(async () => {
      if (!ethers.isAddress(params.developerAddress)) {
        throw new ValidationError('Invalid developer address');
      }

      const apiKeyHashBytes32 = ethers.keccak256(
        ethers.toUtf8Bytes(params.apiKeyHash)
      );

      this.logInfo('Registering API key on blockchain', {
        apiKeyHash: params.apiKeyHash.substring(0, 10) + '...',
        developer: params.developerAddress,
      });

      const tx = await this.blockRollContract.registerAPIKey(
        apiKeyHashBytes32,
        params.developerAddress
      );

      const receipt = await tx.wait();

      this.logInfo('API key registered on blockchain', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return {
        txHash: receipt.hash,
      };
    }, 'registerAPIKey');
  }

  /**
   * Share file on blockchain
   */
  async shareFile(
    fileId: string,
    newReceiver: string,
    userWallet: ethers.Wallet
  ): Promise<{ txHash: string }> {
    return this.executeWithErrorHandling(async () => {
      if (!ethers.isAddress(newReceiver)) {
        throw new ValidationError('Invalid receiver address');
      }

      const contractWithUserWallet = this.blockRollContract.connect(userWallet);

      this.logInfo('Sharing file on blockchain', {
        fileId,
        newReceiver,
      });

      const tx = await (contractWithUserWallet as any).shareFile(fileId, newReceiver);
      const receipt = await tx.wait();

      this.logInfo('File shared on blockchain', {
        txHash: receipt.hash,
      });

      return {
        txHash: receipt.hash,
      };
    }, 'shareFile');
  }

  /**
   * Revoke file access on blockchain
   */
  async revokeFileAccess(
    fileId: string,
    userWallet: ethers.Wallet
  ): Promise<{ txHash: string }> {
    return this.executeWithErrorHandling(async () => {
      const contractWithUserWallet = this.blockRollContract.connect(userWallet);

      this.logInfo('Revoking file access on blockchain', {
        fileId,
      });

      const tx = await (contractWithUserWallet as any).revokeFileAccess(fileId);
      const receipt = await tx.wait();

      this.logInfo('File access revoked on blockchain', {
        txHash: receipt.hash,
      });

      return {
        txHash: receipt.hash,
      };
    }, 'revokeFileAccess');
  }

  /**
   * Get file info from blockchain
   */
  async getFileInfo(fileId: string): Promise<any> {
    return this.executeWithErrorHandling(async () => {
      const fileInfo = await this.blockRollContract.getFileInfo(fileId);

      return {
        fileId: fileInfo.fileId,
        fileHash: fileInfo.fileHash,
        owner: fileInfo.owner,
        receiver: fileInfo.receiver,
        timestamp: new Date(Number(fileInfo.timestamp) * 1000),
        expiryDate: fileInfo.expiryDate
          ? new Date(Number(fileInfo.expiryDate) * 1000)
          : null,
        encryptedKeyRef: fileInfo.encryptedKeyRef,
        status: fileInfo.status,
      };
    }, 'getFileInfo');
  }

  /**
   * Verify file ownership on blockchain
   */
  async verifyFileOwnership(fileId: string): Promise<string> {
    return this.executeWithErrorHandling(async () => {
      const owner = await this.blockRollContract.verifyFileOwnership(fileId);
      return owner;
    }, 'verifyFileOwnership');
  }

  /**
   * Check if user is authorized to access file
   */
  async isAuthorized(fileId: string, userAddress: string): Promise<boolean> {
    return this.executeWithErrorHandling(async () => {
      if (!ethers.isAddress(userAddress)) {
        throw new ValidationError('Invalid user address');
      }

      const isAuthorized = await this.blockRollContract.isAuthorized(
        fileId,
        userAddress
      );
      return isAuthorized;
    }, 'isAuthorized');
  }

  /**
   * Create wallet from private key
   */
  createWallet(privateKey: string): ethers.Wallet {
    return new ethers.Wallet(privateKey, this.provider);
  }

  /**
   * Get contract addresses
   */
  getContractAddresses() {
    return {
      blockRoll: config.blockchain.blockRollAddress,
      apiKeyManager: config.blockchain.apiKeyManagerAddress,
      rpcUrl: config.blockchain.rpcUrl,
    };
  }
}

export default new BlockchainService();

