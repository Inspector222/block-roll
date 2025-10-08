// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BlockRoll.sol";
import "../src/interfaces/IFileRegistry.sol";

contract BlockRollTest is Test {
    BlockRoll public blockRoll;
    
    address public owner;
    address public user1;
    address public user2;
    address public developer;

    bytes32 public constant FILE_HASH = keccak256("test-file-hash");
    bytes32 public constant ENCRYPTED_KEY_REF = keccak256("encrypted-key");
    bytes32 public constant API_KEY_HASH = keccak256("test-api-key");

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

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        developer = makeAddr("developer");

        blockRoll = new BlockRoll();
    }

    function testDeployment() public view {
        assertEq(blockRoll.owner(), owner);
        assertEq(blockRoll.getVersion(), "1.0.0");

        (
            address fileRegistry,
            address accessControl,
            address apiKeyManager,
            address adminRole
        ) = blockRoll.getModules();

        assertTrue(fileRegistry != address(0));
        assertTrue(accessControl != address(0));
        assertTrue(apiKeyManager != address(0));
        assertTrue(adminRole != address(0));
    }

    function testUploadFile() public {
        vm.startPrank(user1);

        uint256 expiryDate = block.timestamp + 30 days;

        vm.expectEmit(true, true, true, true);
        emit FileUploaded(bytes32(0), user1, user2, FILE_HASH); // fileId will be generated

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            expiryDate,
            ENCRYPTED_KEY_REF
        );

        assertTrue(fileId != bytes32(0));

        IFileRegistry.FileMetadata memory file = blockRoll.getFileInfo(fileId);
        assertEq(file.owner, user1);
        assertEq(file.receiver, user2);
        assertEq(file.fileHash, FILE_HASH);
        assertEq(file.expiryDate, expiryDate);
        assertEq(uint(file.status), uint(IFileRegistry.FileStatus.Active));

        vm.stopPrank();
    }

    function testVerifyFileOwnership() public {
        vm.startPrank(user1);

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        address fileOwner = blockRoll.verifyFileOwnership(fileId);
        assertEq(fileOwner, user1);

        vm.stopPrank();
    }

    function testIsAuthorized() public {
        vm.startPrank(user1);

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        assertTrue(blockRoll.isAuthorized(fileId, user2));
        assertFalse(blockRoll.isAuthorized(fileId, user1));

        vm.stopPrank();
    }

    function testRevokeAccess() public {
        vm.startPrank(user1);

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        assertTrue(blockRoll.isAuthorized(fileId, user2));

        blockRoll.revokeFileAccess(fileId);

        assertFalse(blockRoll.isAuthorized(fileId, user2));

        vm.stopPrank();
    }

    function testRegisterAPIKey() public {
        blockRoll.registerAPIKey(API_KEY_HASH, developer);

        (
            ,
            ,
            address apiKeyManager,
            
        ) = blockRoll.getModules();

        address apiKeyOwner = APIKeyManager(apiKeyManager).getAPIKeyOwner(API_KEY_HASH);
        assertEq(apiKeyOwner, developer);

        assertTrue(APIKeyManager(apiKeyManager).validateAPIKey(API_KEY_HASH));
    }

    function testUploadFileWithAPIKey() public {
        // First register API key
        blockRoll.registerAPIKey(API_KEY_HASH, developer);

        vm.startPrank(developer);

        bytes32 fileId = blockRoll.uploadFileWithAPIKey(
            API_KEY_HASH,
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        assertTrue(fileId != bytes32(0));

        IFileRegistry.FileMetadata memory file = blockRoll.getFileInfo(fileId);
        assertEq(file.owner, developer);
        assertEq(file.receiver, user2);

        vm.stopPrank();
    }

    function test_RevertWhen_UploadWithInvalidAPIKey() public {
        bytes32 invalidAPIKey = keccak256("invalid-key");

        vm.startPrank(user1);

        // This should revert
        vm.expectRevert();
        blockRoll.uploadFileWithAPIKey(
            invalidAPIKey,
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        vm.stopPrank();
    }

    function testAddEmergencyContact() public {
        vm.startPrank(user1);

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        address emergencyContact = makeAddr("emergency");
        blockRoll.addEmergencyContact(fileId, emergencyContact);

        (
            ,
            address accessControl,
            ,
            
        ) = blockRoll.getModules();

        assertTrue(
            AccessControlModule(accessControl).hasEmergencyAccess(fileId, emergencyContact)
        );

        vm.stopPrank();
    }

    function testShareFile() public {
        vm.startPrank(user1);

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        address newReceiver = makeAddr("newReceiver");

        vm.expectEmit(true, true, true, false);
        emit FileShared(fileId, user1, newReceiver);

        blockRoll.shareFile(fileId, newReceiver);

        vm.stopPrank();
    }

    function test_RevertWhen_NonOwnerRevokesAccess() public {
        vm.prank(user1);
        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            0,
            ENCRYPTED_KEY_REF
        );

        // User2 tries to revoke (should revert)
        vm.prank(user2);
        vm.expectRevert();
        blockRoll.revokeFileAccess(fileId);
    }

    function testGetFileInfo() public {
        vm.startPrank(user1);

        uint256 expiryDate = block.timestamp + 7 days;

        bytes32 fileId = blockRoll.uploadFile(
            FILE_HASH,
            user2,
            expiryDate,
            ENCRYPTED_KEY_REF
        );

        IFileRegistry.FileMetadata memory file = blockRoll.getFileInfo(fileId);

        assertEq(file.fileId, fileId);
        assertEq(file.fileHash, FILE_HASH);
        assertEq(file.owner, user1);
        assertEq(file.receiver, user2);
        assertEq(file.expiryDate, expiryDate);
        assertEq(file.encryptedKeyRef, ENCRYPTED_KEY_REF);

        vm.stopPrank();
    }
}

