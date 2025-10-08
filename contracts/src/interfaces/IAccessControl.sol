// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAccessControl
 * @notice Interface for managing file access permissions
 */
interface IAccessControl {
    event AccessGranted(
        bytes32 indexed fileId,
        address indexed owner,
        address indexed receiver
    );

    event AccessRevoked(
        bytes32 indexed fileId,
        address indexed owner,
        address indexed receiver
    );

    event EmergencyAccessTriggered(
        bytes32 indexed fileId,
        address indexed triggeredBy
    );

    function grantAccess(bytes32 fileId, address caller, address receiver) external;

    function revokeAccess(bytes32 fileId, address caller) external;

    function emergencyAccess(bytes32 fileId) external;

    function isAuthorizedReceiver(bytes32 fileId, address user) external view returns (bool);

    function hasEmergencyAccess(bytes32 fileId, address user) external view returns (bool);
}

