pragma solidity ^0.8.9;

contract Blog {

    struct Post {
        uint id; 
        string author;
        address pubkey;
        string content;
        uint timestamp;
    }

    struct Message {
        uint id;
        address from;
        string nameOfSender;
        address to;
        string content;
        uint timestamp;
    }

    struct User {
        string name;
        Friend[] friends;
        Post[] posts;
        FriendRequest[] friendRequests;
        UserType userType;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct FriendRequest {
        address pubkey;
        string name;
    }

    Post[] private allPosts;
    mapping(address => User) users;
    mapping(bytes32 => Message[]) public chats;

    enum UserType { Moderator, Regular }
    event NewUserCreated(address newUserAddress, string newUserName);
    error NotUsersPost(address postOwner, address userDeleting);

    // *****
    // USERS
    // *****
    function doesUserExist(address pubkey) public view returns(bool) {
        return bytes(users[pubkey].name).length > 0;
    }

    function createNewUser(string calldata name, bool isMod) external {
        require(doesUserExist(msg.sender) == false, "User already exists!");
        require(bytes(name).length>0, "Username cannot be empty!"); 
        users[msg.sender].name = name;

        if (isMod)
        {
            users[msg.sender].userType = UserType.Moderator;
        }
        else
        {
            users[msg.sender].userType = UserType.Regular;
        }

        emit NewUserCreated(msg.sender, name);
    }

    function addFriend(address friend_key, string calldata name) external {
        Friend memory newFriend = Friend(friend_key, name);
        users[msg.sender].friends.push(newFriend);

        newFriend = Friend(msg.sender, users[msg.sender].name);
        users[friend_key].friends.push(newFriend);
    }

    function handleFriendRequest(address friend_request_key, bool accept) external {
        for (uint i = 0; i < users[msg.sender].friendRequests.length; i++) {
            if (users[msg.sender].friendRequests[i].pubkey == friend_request_key && accept) {
                Friend memory newFriend = Friend(friend_request_key, users[friend_request_key].name);
                users[msg.sender].friends.push(newFriend);

                newFriend = Friend(msg.sender, users[msg.sender].name);
                users[friend_request_key].friends.push(newFriend);

                users[msg.sender].friendRequests[i] = users[msg.sender].friendRequests[users[msg.sender].friendRequests.length - 1];
                users[msg.sender].friendRequests.pop();
            } else if (users[msg.sender].friendRequests[i].pubkey == friend_request_key && !accept) {
                users[msg.sender].friendRequests[i] = users[msg.sender].friendRequests[users[msg.sender].friendRequests.length - 1];
                users[msg.sender].friendRequests.pop();
            }
        }
    }

    function sendFriendRequest(address friend_key) external {
        FriendRequest memory friendRequest = FriendRequest(msg.sender, users[msg.sender].name);
        users[friend_key].friendRequests.push(friendRequest);
    }

    function getFriendRequests(address user) external view returns (FriendRequest[] memory){
        return users[user].friendRequests;
    }

    function removeFriend(address user) external {
        for (uint i = 0; i < users[msg.sender].friends.length; i++) {
            if (users[msg.sender].friends[i].pubkey == user) {
                users[msg.sender].friends[i] = users[msg.sender].friends[users[msg.sender].friends.length - 1];
                users[msg.sender].friends.pop();
            } 
        }

        for (uint i = 0; i < users[user].friends.length; i++) {
            if (users[user].friends[i].pubkey == msg.sender) {
                users[user].friends[i] = users[user].friends[users[user].friends.length - 1];
                users[user].friends.pop();
            } 
        }
    }

    function getUser(address userAddress) external view returns(User memory) {
        return users[userAddress];
    }

    // *****
    // CHATS
    // *****
    function getChatHash(address key1, address key2) private pure returns(bytes32) {
        if(key1 < key2) {
            return keccak256(abi.encodePacked(key1, key2));
        } else {
            return keccak256(abi.encodePacked(key2, key1));
        }       
    }

    function sendMessage(address to, string memory content) external {
        bytes32 chatHash = getChatHash(msg.sender, to);
        chats[chatHash].push(Message(chats[chatHash].length, msg.sender, users[msg.sender].name, to, content, block.timestamp));
    }

    function getChat(address to) external view returns (Message[] memory) {
        bytes32 chatHash = getChatHash(msg.sender, to);
        return chats[chatHash];
    }

    // *****
    // POSTS
    // *****
    function addPost(string memory vsebina) external {
        Post memory newPost = Post(allPosts.length, users[msg.sender].name, msg.sender, vsebina, block.timestamp);
        allPosts.push(newPost);
        users[msg.sender].posts.push(newPost);
    }

    function getPosts() external view returns (Post[] memory) {
        return allPosts;
    }

    modifier isModerator {
        require(users[msg.sender].userType == UserType.Moderator);
        _;
    }

    function deletePost(uint id) isModerator external {
        for (uint i = 0; i < allPosts.length; i++) {
            if (allPosts[i].id == id) {
                allPosts[i] = allPosts[allPosts.length-1];
                allPosts.pop();
            } 
        }

        for (uint i = 0; i < users[msg.sender].posts.length; i++) {
            if (users[msg.sender].posts[i].id == id) {
                users[msg.sender].posts[i] = users[msg.sender].posts[users[msg.sender].posts.length-1];
                users[msg.sender].posts.pop();
            } 
        }        
    }

    function deleteOwnPost(uint id) external {
        if (allPosts[id].pubkey != msg.sender) {
            revert NotUsersPost(allPosts[id].pubkey, msg.sender);
        } else {
            for (uint i = 0; i < allPosts.length; i++) {
                if (allPosts[i].id == id) {
                    allPosts[i] = allPosts[allPosts.length-1];
                    allPosts.pop();
                } 
            }

            for (uint i = 0; i < users[msg.sender].posts.length; i++) {
                if (users[msg.sender].posts[i].id == id) {
                    users[msg.sender].posts[i] = users[msg.sender].posts[users[msg.sender].posts.length-1];
                    users[msg.sender].posts.pop();
                } 
            }
        }
    } 
}