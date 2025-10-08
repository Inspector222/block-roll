// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BlockRoll.sol";

/**
 * @title DeployBlockRoll
 * @notice Deployment script for BlockRoll on BlockDAG Network
 */
contract DeployBlockRoll is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy BlockRoll (automatically deploys all modules)
        BlockRoll blockRoll = new BlockRoll();

        console.log("==============================================");
        console.log("BlockRoll Deployed Successfully!");
        console.log("==============================================");
        console.log("Main Contract:", address(blockRoll));
        
        (
            address fileRegistry,
            address accessControl,
            address apiKeyManager,
            address adminRole
        ) = blockRoll.getModules();

        console.log("FileRegistry:", fileRegistry);
        console.log("AccessControl:", accessControl);
        console.log("APIKeyManager:", apiKeyManager);
        console.log("AdminRole:", adminRole);
        console.log("==============================================");
        console.log("Network: BlockDAG");
        console.log("Version:", blockRoll.getVersion());
        console.log("==============================================");

        vm.stopBroadcast();
    }
}

