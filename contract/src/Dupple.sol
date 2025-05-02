// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./libraries/Events.sol";
import "./libraries/Enums.sol";

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Dupple is Ownable {
    string[] public allowedHobbies;
    address[] public allUsers;

    mapping(address => UserProfile) public users;
    mapping(address => mapping(address => Message[])) public messages;
    mapping(address => mapping(address => bool)) public liked;
    mapping(address => mapping(address => bool)) public blocked;
    mapping(address => mapping(address => bool)) public matches;
    mapping(address => address[]) public userMatches;

    constructor() Ownable(msg.sender) {
        allowedHobbies = [
            "Reading",
            "Gaming",
            "Cooking",
            "Sports",
            "Music",
            "Travel",
            "Relaxing",
            "Football",
            "barbecues",
            "cuddles",
            "meeting people",
            "Tennis",
            "writing",
            "Horror",
            "Coffee",
            "Baking",
            "Hiking",
            "Gardening",
            "Foodie",
            "skiing",
            "Museums and galleries",
            "Wine",
            "Art",
            "Coding",
            "Festivals"
        ];
    }

    struct UserProfile {
        address user;
        string ens;
        string description;
        string profilePictureNFT;
        string[] hobbies;
        address[] likes;
        Enums.RelationshipStatus relationshipStatus;
        uint8 height; // 1 to 5
        Enums.ReasonForJoining reason;
        Enums.Drinking drinking;
        Enums.Smoking smoking;
        Enums.Gender gender;
        Enums.Gender interestedIn;
        uint tipsReceived;
        address[] tippers;
        bool registered;
        uint resgistrationTime;
    }

    struct Message {
        string content;
        uint timestamp;
    }

    struct ScoredUser {
        address user;
        uint score;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "Not registered");
        _;
    }

    function register(
        string memory _ens,
        string memory _description,
        string memory _profilePic,
        Enums.Gender _interestedIn,
        Enums.Gender _gender,
        Enums.RelationshipStatus _rs,
        uint8 _height,
        uint[] memory hobbyIndices,
        Enums.ReasonForJoining _reason,
        Enums.Drinking _drinking,
        Enums.Smoking _smoking
    ) external {
        require(!users[msg.sender].registered, "Already registered");
        require(hobbyIndices.length > 0, "Pick at least one hobby");

        string[] memory selectedHobbies = new string[](hobbyIndices.length);
        for (uint i = 0; i < hobbyIndices.length; i++) {
            uint index = hobbyIndices[i];
            require(index < allowedHobbies.length, "Invalid hobby index");
            selectedHobbies[i] = allowedHobbies[index];
        }

        UserProfile storage profile = users[msg.sender];
        profile.user = msg.sender;
        profile.ens = _ens;
        profile.description = _description;
        profile.profilePictureNFT = _profilePic;
        profile.hobbies = selectedHobbies;
        profile.relationshipStatus = _rs;
        profile.height = _height;
        profile.reason = _reason;
        profile.drinking = _drinking;
        profile.smoking = _smoking;
        profile.gender = _gender;
        profile.interestedIn = _interestedIn;
        profile.registered = true;
        profile.resgistrationTime = block.timestamp;

        allUsers.push(msg.sender);

        emit Events.UserRegistered(msg.sender);
    }

    function getTop10PercentUsers()
        public
        payable
        onlyRegistered
        returns (address[] memory)
    {
        require(msg.value >= 0.001 ether, "Insufficient fee");

        uint numOfusers = allUsers.length;
        require(numOfusers > 0, "No users registered");

        uint theTenPercent = numOfusers / 10;
        if (theTenPercent == 0) {
            theTenPercent = 1;
        }

        ScoredUser[] memory scoredUsers = new ScoredUser[](numOfusers);

        for (uint i = 0; i < numOfusers; i++) {
            address userAddr = allUsers[i];
            UserProfile storage user = users[userAddr];
            uint tips = user.tipsReceived;
            uint tippersCount = user.tippers.length;
            uint score = (tips + tippersCount) / 2;
            scoredUsers[i] = ScoredUser(userAddr, score);
        }

        for (uint i = 0; i < numOfusers; i++) {
            for (uint j = i + 1; j < numOfusers; j++) {
                if (scoredUsers[j].score > scoredUsers[i].score) {
                    ScoredUser memory temp = scoredUsers[i];
                    scoredUsers[i] = scoredUsers[j];
                    scoredUsers[j] = temp;
                }
            }
        }

        address[] memory topUsers = new address[](theTenPercent);
        for (uint i = 0; i < theTenPercent; i++) {
            topUsers[i] = scoredUsers[i].user;
        }

        emit Events.PaidToReturnTop10Percent(msg.sender);

        return topUsers;
    }

    function getUser(address user) external view returns (UserProfile memory) {
        return users[user];
    }

    function updateProfilePicture(string memory uri) external onlyRegistered {
        users[msg.sender].profilePictureNFT = uri;
    }

    function updateDescription(string memory _desc) external onlyRegistered {
        users[msg.sender].description = _desc;
    }

    function sendMessage(
        address to,
        string memory content
    ) external onlyRegistered {
        require(users[to].registered, "Can't send to non-user");
        require(!blocked[to][msg.sender], "blocked");
        require(to != msg.sender, "Can't message yourself");

        messages[msg.sender][to].push(
            Message({content: content, timestamp: block.timestamp})
        );

        emit Events.MessageSent(msg.sender, to, content);
    }

    function getMessages(
        address sender,
        address receiver
    ) external view onlyOwner returns (Message[] memory) {
        return messages[sender][receiver];
    }

    function like(address user) external onlyRegistered {
        require(user != msg.sender, "Cannot like yourself");

        if (liked[user][msg.sender]) {
            _createMatch(user);
        } else {
            require(!liked[msg.sender][user], "Already liked");
            liked[msg.sender][user] = true;
            users[msg.sender].likes.push(user);
        }

        emit Events.Liked(msg.sender, user);
    }

    function accept(address user) external onlyRegistered {
        require(liked[user][msg.sender], "Not yet liked");
        _createMatch(user);
    }

    function _createMatch(address user) internal {
        require(!matches[msg.sender][user], "Already matched");

        matches[msg.sender][user] = true;
        matches[user][msg.sender] = true;
        userMatches[msg.sender].push(user);
        userMatches[user].push(msg.sender);

        emit Events.Matched(msg.sender, user);
    }

    function dislike(address user) external onlyRegistered {
        require(user != msg.sender, "Cannot dislike yourself");
        require(liked[msg.sender][user], "Already dislike");

        liked[msg.sender][user] = false;
        _removeLike(msg.sender, user);

        emit Events.Disliked(msg.sender, user);
    }

    function _removeLike(address from, address to) private {
        uint length = users[from].likes.length;
        for (uint i = 0; i < length; i++) {
            if (users[from].likes[i] == to) {
                if (i != length - 1) {
                    users[from].likes[i] = users[from].likes[length - 1];
                }
                users[from].likes.pop();
                break;
            }
        }
    }

    function getLikeStatus(address user) external view returns (bool) {
        return liked[msg.sender][user];
    }

    function undo(address user) external onlyRegistered {
        require(user != msg.sender, "Cannot undo for yourself");

        bool hadLike = liked[msg.sender][user];

        delete liked[msg.sender][user];

        if (hadLike) {
            _removeLike(msg.sender, user);
        }
    }

    function getMatches(
        address user
    ) external view onlyOwner returns (address[] memory) {
        return userMatches[user];
    }

    function blockUser(address user) external onlyRegistered {
        blocked[msg.sender][user] = true;

        emit Events.Blocked(msg.sender, user);
    }

    function unBlockUser(address user) external onlyRegistered {
        blocked[msg.sender][user] = false;

        emit Events.UnBlocked(msg.sender, user);
    }

    function isBlocked(
        address blocker,
        address blockedUser
    ) external view returns (bool) {
        return blocked[blocker][blockedUser];
    }

    function tip(address user) external payable onlyRegistered {
        require(users[user].registered, "Recipient not found");
        require(user != msg.sender, "Cannot tip yourself");
        require(msg.value > 0, "Tip must be greater than 0");

        users[user].tipsReceived += msg.value;
        users[user].tippers.push(msg.sender);

        (bool success, ) = user.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit Events.Tipped(msg.sender, user, msg.value);
    }

    function getTippers() external view returns (address[] memory) {
        return users[msg.sender].tippers;
    }

    function getTipReceived() external view returns (uint) {
        return users[msg.sender].tipsReceived;
    }

    function getENS(address user) external view returns (string memory) {
        return users[user].ens;
    }

    function getAllUsers() external view returns (address[] memory) {
        return allUsers;
    }

    function withdrawFromContract() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");

        emit Events.WithdrawToOwner(balance);
    }
}
