// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IFileRegistry
 * @notice Interface for file registration and metadata management
 */
interface IFileRegistry {
    enum AccessMode {
        Normal,
        Emergency
    }

    enum FileStatus {
        Active,
        Revoked,
        Expired
    }

    struct FileMetadata {
        bytes32 fileId;
        bytes32 fileHash;
        address owner;
        address receiver;
        uint256 timestamp;
        uint256 expiryDate;
        bytes32 encryptedKeyRef;
        AccessMode accessMode;
        FileStatus status;
    }

    event FileRegistered(
        bytes32 indexed fileId,
        address indexed owner,
        address indexed receiver,
        uint256 timestamp
    );

    event FileStatusUpdated(
        bytes32 indexed fileId,
        FileStatus oldStatus,
        FileStatus newStatus
    );

    function registerFile(
        bytes32 fileHash,
        address owner,
        address receiver,
        uint256 expiryDate,
        bytes32 encryptedKeyRef
    ) external returns (bytes32 fileId);

    function getFileMetadata(bytes32 fileId) external view returns (FileMetadata memory);

    function updateFileStatus(bytes32 fileId, FileStatus newStatus) external;

    function isFileExpired(bytes32 fileId) external view returns (bool);
}

