// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IAPIKeyManager.sol";

/**
 * @title APIKeyManager
 * @notice Manages API keys for SDK/CDN integrations
 */
contract APIKeyManager is IAPIKeyManager {
    struct APIKeyData {
        address developer;
        uint256 registeredAt;
        bool isActive;
        uint256 usageCount;
    }

    mapping(bytes32 => APIKeyData) private apiKeys;
    mapping(address => bytes32[]) private developerKeys;

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "APIKeyManager: Only admin");
        _;
    }

    modifier onlyDeveloperOrAdmin(bytes32 apiKeyHash) {
        require(
            msg.sender == apiKeys[apiKeyHash].developer || msg.sender == admin,
            "APIKeyManager: Unauthorized"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Register a new API key
     * @param apiKeyHash The hash of the API key
     * @param developer The developer wallet address
     */
    function registerAPIKey(bytes32 apiKeyHash, address developer)
        external
        override
    {
        require(apiKeyHash != bytes32(0), "APIKeyManager: Invalid key hash");
        require(developer != address(0), "APIKeyManager: Invalid developer");
        require(
            apiKeys[apiKeyHash].developer == address(0),
            "APIKeyManager: Key already registered"
        );

        apiKeys[apiKeyHash] = APIKeyData({
            developer: developer,
            registeredAt: block.timestamp,
            isActive: true,
            usageCount: 0
        });

        developerKeys[developer].push(apiKeyHash);

        emit APIKeyRegistered(apiKeyHash, developer, block.timestamp);
    }

    /**
     * @notice Deactivate an API key
     * @param apiKeyHash The hash of the API key
     */
    function deactivateAPIKey(bytes32 apiKeyHash)
        external
        override
        onlyDeveloperOrAdmin(apiKeyHash)
    {
        require(apiKeys[apiKeyHash].isActive, "APIKeyManager: Key already inactive");

        apiKeys[apiKeyHash].isActive = false;

        emit APIKeyDeactivated(apiKeyHash, apiKeys[apiKeyHash].developer);
    }

    /**
     * @notice Validate if an API key is active
     * @param apiKeyHash The hash of the API key
     * @return bool True if valid and active
     */
    function validateAPIKey(bytes32 apiKeyHash)
        external
        view
        override
        returns (bool)
    {
        return apiKeys[apiKeyHash].isActive;
    }

    /**
     * @notice Get the owner of an API key
     * @param apiKeyHash The hash of the API key
     * @return address The developer wallet address
     */
    function getAPIKeyOwner(bytes32 apiKeyHash)
        external
        view
        override
        returns (address)
    {
        return apiKeys[apiKeyHash].developer;
    }

    /**
     * @notice Log API key usage
     * @param apiKeyHash The hash of the API key
     * @param action The action performed (upload, share, etc.)
     */
    function logAPIKeyUsage(bytes32 apiKeyHash, string calldata action)
        external
        override
    {
        require(apiKeys[apiKeyHash].isActive, "APIKeyManager: Key not active");

        apiKeys[apiKeyHash].usageCount++;

        emit APIKeyUsed(apiKeyHash, apiKeys[apiKeyHash].developer, action);
    }

    /**
     * @notice Get API key data
     * @param apiKeyHash The hash of the API key
     * @return APIKeyData struct
     */
    function getAPIKeyData(bytes32 apiKeyHash)
        external
        view
        returns (APIKeyData memory)
    {
        return apiKeys[apiKeyHash];
    }

    /**
     * @notice Get all API keys for a developer
     * @param developer The developer address
     * @return Array of API key hashes
     */
    function getDeveloperKeys(address developer)
        external
        view
        returns (bytes32[] memory)
    {
        return developerKeys[developer];
    }

    /**
     * @notice Transfer admin role
     * @param newAdmin The new admin address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "APIKeyManager: Invalid admin");
        admin = newAdmin;
    }
}

