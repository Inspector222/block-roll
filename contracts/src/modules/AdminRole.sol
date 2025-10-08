// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IAdminRole.sol";
import "../interfaces/IFileRegistry.sol";

/**
 * @title AdminRole
 * @notice Manages admin roles and permissions
 */
contract AdminRole is IAdminRole {
    address public owner;
    mapping(address => Role) private roles;
    address[] private admins;

    IFileRegistry public fileRegistry;

    modifier onlyOwner() {
        require(msg.sender == owner, "AdminRole: Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(
            roles[msg.sender] == Role.Admin || roles[msg.sender] == Role.Owner,
            "AdminRole: Only admin"
        );
        _;
    }

    constructor(address _fileRegistry) {
        require(_fileRegistry != address(0), "AdminRole: Invalid registry");
        owner = msg.sender;
        roles[msg.sender] = Role.Owner;
        fileRegistry = IFileRegistry(_fileRegistry);
    }

    /**
     * @notice Add a new admin
     * @param admin The address to grant admin role
     */
    function addAdmin(address admin) external override onlyOwner {
        require(admin != address(0), "AdminRole: Invalid address");
        require(roles[admin] != Role.Admin, "AdminRole: Already admin");

        roles[admin] = Role.Admin;
        admins.push(admin);

        emit AdminAdded(admin, msg.sender);
    }

    /**
     * @notice Remove an admin
     * @param admin The address to remove admin role from
     */
    function removeAdmin(address admin) external override onlyOwner {
        require(roles[admin] == Role.Admin, "AdminRole: Not an admin");

        roles[admin] = Role.User;

        emit AdminRemoved(admin, msg.sender);
    }

    /**
     * @notice Suspend a file (admin only)
     * @param fileId The file ID to suspend
     */
    function suspendFile(bytes32 fileId) external override onlyAdmin {
        fileRegistry.updateFileStatus(fileId, IFileRegistry.FileStatus.Revoked);

        emit FileSuspended(fileId, msg.sender);
    }

    /**
     * @notice Check if an address is an admin
     * @param account The address to check
     * @return bool True if admin
     */
    function isAdmin(address account) external view override returns (bool) {
        return roles[account] == Role.Admin || roles[account] == Role.Owner;
    }

    /**
     * @notice Check if an address is the owner
     * @param account The address to check
     * @return bool True if owner
     */
    function isOwner(address account) external view override returns (bool) {
        return roles[account] == Role.Owner;
    }

    /**
     * @notice Get the role of an address
     * @param account The address to check
     * @return Role enum value
     */
    function getRole(address account) external view override returns (Role) {
        return roles[account];
    }

    /**
     * @notice Get all admins
     * @return Array of admin addresses
     */
    function getAllAdmins() external view returns (address[] memory) {
        return admins;
    }

    /**
     * @notice Transfer ownership
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "AdminRole: Invalid address");

        roles[owner] = Role.User;
        roles[newOwner] = Role.Owner;
        owner = newOwner;
    }
}

