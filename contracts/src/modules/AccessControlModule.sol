// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IAccessControl.sol";
import "../interfaces/IFileRegistry.sol";

/**
 * @title AccessControlModule
 * @notice Manages file access permissions and emergency access
 */
contract AccessControlModule is IAccessControl {
    IFileRegistry public fileRegistry;

    mapping(bytes32 => address[]) private emergencyContacts;
    mapping(bytes32 => mapping(address => bool)) private emergencyAccessGranted;

    modifier onlyFileOwner(bytes32 fileId, address caller) {
        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        require(file.owner == caller, "AccessControl: Not file owner");
        _;
    }

    modifier fileActive(bytes32 fileId) {
        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        require(
            file.status == IFileRegistry.FileStatus.Active,
            "AccessControl: File not active"
        );
        _;
    }

    constructor(address _fileRegistry) {
        require(_fileRegistry != address(0), "AccessControl: Invalid registry");
        fileRegistry = IFileRegistry(_fileRegistry);
    }

    /**
     * @notice Grant access to a receiver
     * @param fileId The file ID
     * @param caller The address calling this function (original caller from BlockRoll)
     * @param receiver The address to grant access to
     */
    function grantAccess(bytes32 fileId, address caller, address receiver)
        external
        override
        onlyFileOwner(fileId, caller)
        fileActive(fileId)
    {
        require(receiver != address(0), "AccessControl: Invalid receiver");

        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        emit AccessGranted(fileId, file.owner, receiver);
    }

    /**
     * @notice Revoke access from current receiver
     * @param fileId The file ID
     * @param caller The address calling this function (original caller from BlockRoll)
     */
    function revokeAccess(bytes32 fileId, address caller)
        external
        override
        onlyFileOwner(fileId, caller)
    {
        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        
        // Update file status to revoked
        fileRegistry.updateFileStatus(fileId, IFileRegistry.FileStatus.Revoked);

        emit AccessRevoked(fileId, file.owner, file.receiver);
    }

    /**
     * @notice Trigger emergency access for trusted contacts
     * @param fileId The file ID
     */
    function emergencyAccess(bytes32 fileId) external override {
        require(
            emergencyAccessGranted[fileId][msg.sender],
            "AccessControl: Not authorized for emergency access"
        );

        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        require(
            file.accessMode == IFileRegistry.AccessMode.Emergency,
            "AccessControl: Emergency mode not enabled"
        );

        emit EmergencyAccessTriggered(fileId, msg.sender);
    }

    /**
     * @notice Check if user is authorized receiver
     * @param fileId The file ID
     * @param user The user address to check
     * @return bool True if authorized
     */
    function isAuthorizedReceiver(bytes32 fileId, address user)
        external
        view
        override
        returns (bool)
    {
        IFileRegistry.FileMetadata memory file = fileRegistry.getFileMetadata(fileId);
        return file.receiver == user && file.status == IFileRegistry.FileStatus.Active;
    }

    /**
     * @notice Check if user has emergency access
     * @param fileId The file ID
     * @param user The user address to check
     * @return bool True if has emergency access
     */
    function hasEmergencyAccess(bytes32 fileId, address user)
        external
        view
        override
        returns (bool)
    {
        return emergencyAccessGranted[fileId][user];
    }

    /**
     * @notice Add emergency contact for a file
     * @param fileId The file ID
     * @param caller The address calling this function (original caller from BlockRoll)
     * @param contact The emergency contact address
     */
    function addEmergencyContact(bytes32 fileId, address caller, address contact)
        external
        onlyFileOwner(fileId, caller)
    {
        require(contact != address(0), "AccessControl: Invalid contact");
        require(
            !emergencyAccessGranted[fileId][contact],
            "AccessControl: Contact already added"
        );

        emergencyContacts[fileId].push(contact);
        emergencyAccessGranted[fileId][contact] = true;
    }

    /**
     * @notice Remove emergency contact
     * @param fileId The file ID
     * @param caller The address calling this function (original caller from BlockRoll)
     * @param contact The emergency contact address to remove
     */
    function removeEmergencyContact(bytes32 fileId, address caller, address contact)
        external
        onlyFileOwner(fileId, caller)
    {
        emergencyAccessGranted[fileId][contact] = false;
    }

    /**
     * @notice Get all emergency contacts for a file
     * @param fileId The file ID
     * @return Array of emergency contact addresses
     */
    function getEmergencyContacts(bytes32 fileId)
        external
        view
        returns (address[] memory)
    {
        return emergencyContacts[fileId];
    }
}

