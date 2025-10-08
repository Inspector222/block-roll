// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAPIKeyManager
 * @notice Interface for SDK/CDN API key management
 */
interface IAPIKeyManager {
    event APIKeyRegistered(
        bytes32 indexed apiKeyHash,
        address indexed developer,
        uint256 timestamp
    );

    event APIKeyDeactivated(
        bytes32 indexed apiKeyHash,
        address indexed developer
    );

    event APIKeyUsed(
        bytes32 indexed apiKeyHash,
        address indexed developer,
        string action
    );

    function registerAPIKey(bytes32 apiKeyHash, address developer) external;

    function deactivateAPIKey(bytes32 apiKeyHash) external;

    function validateAPIKey(bytes32 apiKeyHash) external view returns (bool);

    function getAPIKeyOwner(bytes32 apiKeyHash) external view returns (address);

    function logAPIKeyUsage(bytes32 apiKeyHash, string calldata action) external;
}

