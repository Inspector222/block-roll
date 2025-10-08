// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAdminRole
 * @notice Interface for role-based admin management
 */
interface IAdminRole {
    enum Role {
        User,
        Admin,
        Owner
    }

    event AdminAdded(address indexed admin, address indexed addedBy);

    event AdminRemoved(address indexed admin, address indexed removedBy);

    event FileSuspended(bytes32 indexed fileId, address indexed suspendedBy);

    function addAdmin(address admin) external;

    function removeAdmin(address admin) external;

    function suspendFile(bytes32 fileId) external;

    function isAdmin(address account) external view returns (bool);

    function isOwner(address account) external view returns (bool);

    function getRole(address account) external view returns (Role);
}

