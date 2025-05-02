// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Dupple.sol";
import "../src/libraries/Enums.sol";

contract DuppleTest is Test {
    Dupple dupple;
    address owner = address(1);
    address user1 = address(2);
    address user2 = address(3);
    address user3 = address(4);

    uint num = 0;

    function setUp() public {
        vm.prank(owner);
        dupple = new Dupple();

        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.prank(user1);
        dupple.register(
            "viktrified", // ENS Name
            "I Love Coding", // Description
            "ipfs://profile1", // Profile Pic URL
            Enums.Gender.Female, // Interested In
            Enums.Gender.Male, // Gender
            Enums.RelationshipStatus.Complicated, // Relationship Status
            5, // Height
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate, // Reason for Joining
            Enums.Drinking.Often, // Drinking Preference
            Enums.Smoking.No // Smoking Preference
        );
    }

    function test_Initialization() public view {
        assertEq(dupple.owner(), owner);
        Dupple.UserProfile memory userProfile = dupple.getUser(user1);

        assertEq(userProfile.ens, "viktrified");
        assertEq(userProfile.description, "I Love Coding");
        assertEq(userProfile.profilePictureNFT, "ipfs://profile1");
        assertEq(userProfile.height, 5);
        assertEq(
            uint(userProfile.relationshipStatus),
            uint(Enums.RelationshipStatus.Complicated)
        );
        assertEq(uint(userProfile.drinking), uint(Enums.Drinking.Often));
        assertEq(
            uint(userProfile.reason),
            uint(Enums.ReasonForJoining.HereToDate)
        );
        assertEq(uint(userProfile.smoking), uint(Enums.Smoking.No));
        assertEq(uint(userProfile.gender), uint(Enums.Gender.Male));
        assertEq(uint(userProfile.interestedIn), uint(Enums.Gender.Female));
        assertEq(userProfile.hobbies[0], "Reading");
        assertEq(userProfile.hobbies[1], "Gaming");

        assertTrue(userProfile.resgistrationTime <= block.timestamp);
        assertTrue(userProfile.registered);
    }

    function test_sendMessage() public {
        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;
        string memory messageContent = "Hello Bob!";

        vm.expectRevert("Not registered");
        dupple.sendMessage(user2, messageContent);

        vm.prank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        vm.prank(user1);
        dupple.sendMessage(user2, messageContent);

        vm.startPrank(owner);
        Dupple.Message[] memory messages = dupple.getMessages(user1, user2);
        assertEq(messages.length, 1, "Should have 1 message");
        assertEq(
            messages[0].content,
            messageContent,
            "Message content should match"
        );
        assertTrue(messages[0].timestamp > 0, "Timestamp should be set");
        vm.stopPrank();
    }

    function test_onlyRegistered() public {
        vm.prank(user2);
        vm.expectRevert("Not registered");
        dupple.sendMessage(user1, "Sup Nigga!");
    }

    function test_updateProfilePic() public {
        Dupple.UserProfile memory userPic = dupple.getUser(user1);
        assertEq(userPic.profilePictureNFT, "ipfs://profile1");

        vm.prank(user1);
        dupple.updateProfilePicture("ipfs://profile2");

        userPic = dupple.getUser(user1);
        assertEq(userPic.profilePictureNFT, "ipfs://profile2");
    }

    function test_updateDescription() public {
        Dupple.UserProfile memory userPic = dupple.getUser(user1);
        assertEq(userPic.description, "I Love Coding");

        vm.prank(user1);
        dupple.updateDescription("I Still Love Coding");

        userPic = dupple.getUser(user1);
        assertEq(userPic.description, "I Still Love Coding");
    }

    function testBlock() public {
        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.prank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        assertFalse(dupple.isBlocked(user1, user2));

        // 1. Test initial message sending works
        vm.prank(user1);
        dupple.sendMessage(user2, "Hello before blocking");

        vm.prank(user2);
        dupple.sendMessage(user1, "Hi there!");

        // 2. Test blocking in one direction
        vm.prank(user1);
        dupple.blockUser(user2);

        assertTrue(dupple.isBlocked(user1, user2));

        // user2 cannot message user1 (blocked)
        vm.prank(user2);
        vm.expectRevert("blocked");
        dupple.sendMessage(user1, "This should fail");

        // 3. Test mutual blocking
        vm.prank(user2);
        dupple.blockUser(user1);

        // Now neither can message each other
        vm.prank(user1);
        vm.expectRevert("blocked");
        dupple.sendMessage(user2, "Now I'm blocked too");

        vm.prank(user2);
        vm.expectRevert("blocked");
        dupple.sendMessage(user1, "We're both blocked");

        // test unblock
        vm.prank(user2);
        dupple.unBlockUser(user1);
        assertFalse(dupple.isBlocked(user2, user1));

        vm.prank(user1);
        dupple.unBlockUser(user2);
        assertFalse(dupple.isBlocked(user1, user1));
    }

    function test_like() public {
        vm.startPrank(user1);
        vm.expectRevert("Cannot like yourself");
        dupple.like(user1);

        dupple.like(user2);
        assertTrue(dupple.getLikeStatus(user2));
        assertEq(dupple.getUser(user1).likes[0], user2);
        vm.stopPrank();

        // User2 likes User1 - should create a match
        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.startPrank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        dupple.like(user1);

        // Verify match was created
        assertTrue(dupple.matches(user1, user2));
        assertTrue(dupple.matches(user2, user1));
        vm.stopPrank();

        vm.startPrank(owner);
        assertEq(dupple.getMatches(user1)[0], user2);
        assertEq(dupple.getMatches(user2)[0], user1);
        vm.stopPrank();

        // test already liked
        vm.startPrank(user2);
        dupple.like(user3);

        vm.expectRevert("Already liked");
        dupple.like(user3);

        // test undo
        dupple.undo(user3);
        assertFalse(dupple.getLikeStatus(user3));
        vm.stopPrank();
    }

    function test_dislike() public {
        // test dislike
        vm.startPrank(user1);
        vm.expectRevert("Cannot dislike yourself");
        dupple.dislike(user1);
        assertFalse(dupple.getLikeStatus(user2));

        //test _removeLike()
        dupple.like(user2);
        assertTrue(dupple.getLikeStatus(user2));
        assertEq(dupple.getUser(user1).likes[0], user2);

        dupple.dislike(user2);
        assertFalse(dupple.getLikeStatus(user2));
        assertEq(dupple.getUser(user1).likes.length, 0, "has been disliked");
        vm.stopPrank();
    }

    function testAcceptCreatesMatch() public {
        vm.prank(user1);
        dupple.like(user2);

        // user2 accepts user1's like
        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.startPrank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        vm.startPrank(user2);
        dupple.accept(user1);

        assertTrue(
            dupple.matches(user2, user1),
            "User2 should be matched with User1"
        );
        assertTrue(
            dupple.matches(user1, user2),
            "User1 should be matched with User2"
        );

        // Check that user1 and user2 are added to each other's match list
        vm.startPrank(owner);
        assertEq(dupple.getMatches(user1)[0], user2);
        assertEq(dupple.getMatches(user2)[0], user1);
        vm.stopPrank();

        vm.stopPrank();
    }

    function test_tip() public {
        uint256 tipAmount = 1 ether;

        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.prank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        // Give tipper some ETH
        vm.deal(user1, 5 ether);

        // Send tip
        vm.prank(user1);
        dupple.tip{value: tipAmount}(user2);

        // Check user2 received ETH
        assertEq(user2.balance, tipAmount, "user2 did not receive the tip");

        // Check tipsReceived value
        assertEq(dupple.getUser(user2).tipsReceived, tipAmount);

        // Check user1s list
        assertEq(dupple.getUser(user2).tippers[0], user1);
    }

    function testWithdrawFromContractByOwner() public {
        uint256 deposit = 1 ether;
        vm.deal(address(dupple), deposit);

        assertEq(
            address(dupple).balance,
            deposit,
            "Contract should have initial balance"
        );

        // Track balance before withdrawal
        uint256 ownerBalanceBefore = owner.balance;

        vm.prank(owner);
        dupple.withdrawFromContract();

        assertEq(address(dupple).balance, 0, "Contract balance should be zero");
        uint256 ownerBalanceAfter = owner.balance;
        assertEq(
            ownerBalanceAfter,
            ownerBalanceBefore + deposit,
            "Owner should receive contract funds"
        );
    }

    function test_getAllUsers() public {
        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.prank(owner);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        vm.prank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        vm.prank(user3);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        address[] memory all = dupple.getAllUsers();

        assertEq(all.length, 4);
    }

    function test_getTop10PercentUsers() public {
        // Fund users
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);

        uint[] memory hobbyIndices = new uint[](2);
        hobbyIndices[0] = 0;
        hobbyIndices[1] = 1;

        vm.prank(user2);
        dupple.register(
            "alice.eth",
            "Alice's profile",
            "ipfs://alice",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            5,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.Sometimes
        );

        vm.prank(user3);
        dupple.register(
            "bob.eth",
            "Bob's profile",
            "ipfs://bob",
            Enums.Gender.Male,
            Enums.Gender.Female,
            Enums.RelationshipStatus.Single,
            6,
            hobbyIndices,
            Enums.ReasonForJoining.HereToDate,
            Enums.Drinking.Socially,
            Enums.Smoking.No
        );

        vm.prank(user1);
        dupple.tip{value: 2 ether}(user2); 

        vm.prank(user1);
        dupple.tip{value: 1 ether}(user3); 

        // Get top 10% users (min fee = 0.001 ether)
        vm.prank(user1);
        address[] memory topUsers = dupple.getTop10PercentUsers{
            value: 0.001 ether
        }();

        // We have 3 users, so top 10% = 3/10 = 0 → force to 1
        assertEq(topUsers.length, 1);
        assertEq(topUsers[0], user2); // user2 has the highest score
    }
}
