// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlockRollUtils
 * @notice Utility library for common BlockRoll operations
 */
library BlockRollUtils {
    /**
     * @notice Generate a unique file ID based on hash, owner, and timestamp
     * @param fileHash The hash of the file
     * @param owner The owner address
     * @param timestamp The registration timestamp
     * @return fileId The generated unique file ID
     */
    function generateFileId(
        bytes32 fileHash,
        address owner,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(fileHash, owner, timestamp));
    }

    /**
     * @notice Validate if an address is not zero
     * @param addr The address to validate
     */
    function requireValidAddress(address addr) internal pure {
        require(addr != address(0), "BlockRoll: Invalid address");
    }

    /**
     * @notice Validate if a bytes32 value is not empty
     * @param value The bytes32 value to validate
     */
    function requireNonEmpty(bytes32 value) internal pure {
        require(value != bytes32(0), "BlockRoll: Empty value");
    }

    /**
     * @notice Check if expiry date is in the future
     * @param expiryDate The expiry timestamp
     * @return bool True if expiry is in the future or zero (no expiry)
     */
    function isValidExpiry(uint256 expiryDate) internal view returns (bool) {
        return expiryDate == 0 || expiryDate > block.timestamp;
    }

    /**
     * @notice Check if a timestamp has expired
     * @param expiryDate The expiry timestamp
     * @return bool True if expired
     */
    function isExpired(uint256 expiryDate) internal view returns (bool) {
        return expiryDate != 0 && block.timestamp >= expiryDate;
    }
}

