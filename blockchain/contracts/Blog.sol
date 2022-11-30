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
    }

    struct Friend {
        address pubkey;
        string name;
    }

    Post[] private allPosts;
    mapping(address => User) users;
    mapping(bytes32 => Message[]) public chats;


    // *****
    // USERS
    // *****
    function doesUserExist(address pubkey) public view returns(bool) {
        return bytes(users[pubkey].name).length > 0;
    }

    function createNewUser(string calldata name) external {
        require(doesUserExist(msg.sender)==false, "User already exists!");
        require(bytes(name).length>0, "Username cannot be empty!"); 
        users[msg.sender].name = name;
    }

    function addFriend(address friend_key, string calldata name) external {
        require(doesUserExist(msg.sender), "Create an account first!");
        require(doesUserExist(friend_key), "User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themselves as friends!");
        require(checkIfFriends(msg.sender, friend_key) == false, "These users are already friends!");

        Friend memory newFriend = Friend(friend_key, name);
        users[msg.sender].friends.push(newFriend);

        newFriend = Friend(msg.sender, users[msg.sender].name);
        users[friend_key].friends.push(newFriend);
    }

    function checkIfFriends(address user1, address user2) internal view returns(bool) {
        if (users[user1].friends.length > users[user2].friends.length) {  
            for (uint i = 0; i < users[user2].friends.length; i++) {
                if (users[user2].friends[i].pubkey == user1) {
                    return true;
                }
            }
        } else {
            for (uint i = 0; i < users[user1].friends.length; i++) {
                if (users[user1].friends[i].pubkey == user2) {
                    return true;
                }
            }
        }
        return false;
    }

    function getMyFriends() external view returns(Friend[] memory) {
        return users[msg.sender].friends;
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
        allPosts.push(Post(allPosts.length, users[msg.sender].name, msg.sender, vsebina, block.timestamp));
    }

    function getPosts() external view returns (Post[] memory) {
        return allPosts;
    }
}


