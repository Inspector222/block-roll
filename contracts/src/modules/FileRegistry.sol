// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IFileRegistry.sol";
import "../libraries/BlockRollUtils.sol";

/**
 * @title FileRegistry
 * @notice Manages file registration and metadata storage
 */
contract FileRegistry is IFileRegistry {
    using BlockRollUtils for bytes32;
    using BlockRollUtils for address;

    address public deployer;
    mapping(bytes32 => FileMetadata) private files;
    mapping(address => bytes32[]) private ownerFiles;
    mapping(address => bool) private trustedCallers;

    constructor() {
        deployer = msg.sender;
    }

    modifier onlyFileOwner(bytes32 fileId) {
        require(
            files[fileId].owner == msg.sender || trustedCallers[msg.sender],
            "FileRegistry: Not file owner"
        );
        _;
    }

    modifier fileExists(bytes32 fileId) {
        require(files[fileId].fileId != bytes32(0), "FileRegistry: File does not exist");
        _;
    }

    /**
     * @notice Register a new file on-chain
     * @param fileHash The hash of the file (IPFS CID or SHA-256)
     * @param owner The file owner address
     * @param receiver The authorized recipient wallet
     * @param expiryDate Optional expiry timestamp (0 for no expiry)
     * @param encryptedKeyRef Reference to encrypted key (stored off-chain)
     * @return fileId The generated unique file ID
     */
    function registerFile(
        bytes32 fileHash,
        address owner,
        address receiver,
        uint256 expiryDate,
        bytes32 encryptedKeyRef
    ) external override returns (bytes32 fileId) {
        BlockRollUtils.requireNonEmpty(fileHash);
        BlockRollUtils.requireValidAddress(owner);
        BlockRollUtils.requireValidAddress(receiver);
        require(
            BlockRollUtils.isValidExpiry(expiryDate),
            "FileRegistry: Invalid expiry date"
        );

        fileId = BlockRollUtils.generateFileId(fileHash, owner, block.timestamp);

        files[fileId] = FileMetadata({
            fileId: fileId,
            fileHash: fileHash,
            owner: owner,
            receiver: receiver,
            timestamp: block.timestamp,
            expiryDate: expiryDate,
            encryptedKeyRef: encryptedKeyRef,
            accessMode: AccessMode.Normal,
            status: FileStatus.Active
        });

        ownerFiles[owner].push(fileId);

        emit FileRegistered(fileId, owner, receiver, block.timestamp);
    }

    /**
     * @notice Get file metadata
     * @param fileId The file ID
     * @return FileMetadata struct
     */
    function getFileMetadata(bytes32 fileId)
        external
        view
        override
        fileExists(fileId)
        returns (FileMetadata memory)
    {
        return files[fileId];
    }

    /**
     * @notice Update file status
     * @param fileId The file ID
     * @param newStatus The new status
     */
    function updateFileStatus(bytes32 fileId, FileStatus newStatus)
        external
        override
        fileExists(fileId)
        onlyFileOwner(fileId)
    {
        FileStatus oldStatus = files[fileId].status;
        files[fileId].status = newStatus;

        emit FileStatusUpdated(fileId, oldStatus, newStatus);
    }

    /**
     * @notice Check if a file has expired
     * @param fileId The file ID
     * @return bool True if expired
     */
    function isFileExpired(bytes32 fileId)
        external
        view
        override
        fileExists(fileId)
        returns (bool)
    {
        return BlockRollUtils.isExpired(files[fileId].expiryDate);
    }

    /**
     * @notice Get all files owned by an address
     * @param owner The owner address
     * @return Array of file IDs
     */
    function getOwnerFiles(address owner) external view returns (bytes32[] memory) {
        return ownerFiles[owner];
    }

    /**
     * @notice Add a trusted caller (e.g., AccessControlModule)
     * @param caller The address to trust
     */
    function addTrustedCaller(address caller) external {
        require(msg.sender == deployer || trustedCallers[msg.sender], "FileRegistry: Not authorized");
        trustedCallers[caller] = true;
    }

    /**
     * @notice Internal function to get file metadata (for other modules)
     * @param fileId The file ID
     * @return FileMetadata struct
     */
    function _getFile(bytes32 fileId) internal view returns (FileMetadata storage) {
        return files[fileId];
    }
}

