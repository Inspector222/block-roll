// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./modules/FileRegistry.sol";
import "./modules/AccessControlModule.sol";
import "./modules/APIKeyManager.sol";
import "./modules/AdminRole.sol";
import "./interfaces/IFileRegistry.sol";

/**
 * @title BlockRoll
 * @notice Main contract integrating all BlockRoll modules
 * @dev Non-custodial secure data exchange platform on BlockDAG
 */
contract BlockRoll {
    FileRegistry public fileRegistry;
    AccessControlModule public accessControl;
    APIKeyManager public apiKeyManager;
    AdminRole public adminRole;

    address public owner;
    string public constant VERSION = "1.0.0";

    event BlockRollDeployed(
        address indexed fileRegistry,
        address indexed accessControl,
        address indexed apiKeyManager,
        address adminRole
    );

    event FileUploaded(
        bytes32 indexed fileId,
        address indexed owner,
        address indexed receiver,
        bytes32 fileHash
    );

    event FileShared(
        bytes32 indexed fileId,
        address indexed from,
        address indexed to
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "BlockRoll: Only owner");
        _;
    }

    /**
     * @notice Constructor to deploy and integrate all modules
     */
    constructor() {
        owner = msg.sender;

        // Deploy modules
        fileRegistry = new FileRegistry();
        apiKeyManager = new APIKeyManager();
        adminRole = new AdminRole(address(fileRegistry));
        accessControl = new AccessControlModule(address(fileRegistry));

        emit BlockRollDeployed(
            address(fileRegistry),
            address(accessControl),
            address(apiKeyManager),
            address(adminRole)
        );
    }

    /**
     * @notice Upload a file (register metadata on-chain)
     * @param fileHash The hash of the file (IPFS CID or SHA-256)
     * @param receiver The authorized recipient wallet
     * @param expiryDate Optional expiry timestamp (0 for no expiry)
     * @param encryptedKeyRef Reference to encrypted key
     * @return fileId The generated unique file ID
     */
    function uploadFile(
        bytes32 fileHash,
        address receiver,
        uint256 expiryDate,
        bytes32 encryptedKeyRef
    ) external returns (bytes32 fileId) {
        fileId = fileRegistry.registerFile(
            fileHash,
            receiver,
            expiryDate,
            encryptedKeyRef
        );

        emit FileUploaded(fileId, msg.sender, receiver, fileHash);
    }

    /**
     * @notice Upload file with API key (for SDK/CDN)
     * @param apiKeyHash The hash of the API key
     * @param fileHash The hash of the file
     * @param receiver The authorized recipient wallet
     * @param expiryDate Optional expiry timestamp
     * @param encryptedKeyRef Reference to encrypted key
     * @return fileId The generated unique file ID
     */
    function uploadFileWithAPIKey(
        bytes32 apiKeyHash,
        bytes32 fileHash,
        address receiver,
        uint256 expiryDate,
        bytes32 encryptedKeyRef
    ) external returns (bytes32 fileId) {
        require(
            apiKeyManager.validateAPIKey(apiKeyHash),
            "BlockRoll: Invalid API key"
        );

        fileId = fileRegistry.registerFile(
            fileHash,
            receiver,
            expiryDate,
            encryptedKeyRef
        );

        apiKeyManager.logAPIKeyUsage(apiKeyHash, "upload");

        emit FileUploaded(fileId, msg.sender, receiver, fileHash);
    }

    /**
     * @notice Share file by granting access
     * @param fileId The file ID
     * @param newReceiver The new receiver address
     */
    function shareFile(bytes32 fileId, address newReceiver) external {
        accessControl.grantAccess(fileId, newReceiver);

        emit FileShared(fileId, msg.sender, newReceiver);
    }

    /**
     * @notice Revoke file access
     * @param fileId The file ID
     */
    function revokeFileAccess(bytes32 fileId) external {
        accessControl.revokeAccess(fileId);
    }

    /**
     * @notice Verify file ownership
     * @param fileId The file ID
     * @return owner The owner's wallet address
     */
    function verifyFileOwnership(bytes32 fileId)
        external
        view
        returns (address)
    {
        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        return file.owner;
    }

    /**
     * @notice Check if user is authorized to access file
     * @param fileId The file ID
     * @param user The user address
     * @return bool True if authorized
     */
    function isAuthorized(bytes32 fileId, address user)
        external
        view
        returns (bool)
    {
        return accessControl.isAuthorizedReceiver(fileId, user);
    }

    /**
     * @notice Get file metadata
     * @param fileId The file ID
     * @return FileMetadata struct
     */
    function getFileInfo(bytes32 fileId)
        external
        view
        returns (IFileRegistry.FileMetadata memory)
    {
        return fileRegistry.getFileMetadata(fileId);
    }

    /**
     * @notice Register API key for SDK/CDN integration
     * @param apiKeyHash The hash of the API key
     * @param developer The developer wallet address
     */
    function registerAPIKey(bytes32 apiKeyHash, address developer) external {
        apiKeyManager.registerAPIKey(apiKeyHash, developer);
    }

    /**
     * @notice Add emergency contact for a file
     * @param fileId The file ID
     * @param contact The emergency contact address
     */
    function addEmergencyContact(bytes32 fileId, address contact) external {
        accessControl.addEmergencyContact(fileId, contact);
    }

    /**
     * @notice Trigger emergency access
     * @param fileId The file ID
     */
    function triggerEmergencyAccess(bytes32 fileId) external {
        accessControl.emergencyAccess(fileId);
    }

    /**
     * @notice Get contract version
     * @return string version
     */
    function getVersion() external pure returns (string memory) {
        return VERSION;
    }

    /**
     * @notice Get all module addresses
     * @return Addresses of all modules
     */
    function getModules()
        external
        view
        returns (
            address,
            address,
            address,
            address
        )
    {
        return (
            address(fileRegistry),
            address(accessControl),
            address(apiKeyManager),
            address(adminRole)
        );
    }
}

