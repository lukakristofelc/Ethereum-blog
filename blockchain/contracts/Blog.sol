pragma solidity ^0.8.9;

contract Blog {

    struct Post {
        uint id; 
        address author;
        string content;
        uint timestamp;
    }

    struct Message {
        uint id;
        address from;
        address to;
        string content;
        uint timestamp;
    }

    address private moderator;
    Post[] private posts;
    
    mapping(uint256 => Message[]) private chat;

    function sendMessage(address from, address to, string memory content) external {
        
        uint256 chatHashFrom = uint256(keccak256(abi.encodePacked(from, to)));
        chat[chatHashFrom].push(Message(chat[chatHashFrom].length, from, to, content, block.timestamp));

        uint256 chatHashTo = uint256(keccak256(abi.encodePacked(to, from)));
        chat[chatHashTo].push(Message(chat[chatHashTo].length, from, to, content, block.timestamp));
    }

    function setModerator(address newMod) external {
        moderator = newMod;
    }

    function urediObjavo(string memory urejenaVsebina, uint id) external {
        if (msg.sender == moderator)
        {
            posts[id].content = urejenaVsebina;
        }
    }

    function izbrisiObjavo(uint id) external {
        if(msg.sender == moderator)
        {
            delete posts[id];
        }
    }

    function dodajObjavo(string memory vsebina) external {
        posts.push(Post(posts.length, msg.sender, vsebina, block.timestamp));
    }

    function getPosts() external view returns (Post[] memory) {
        return posts;
    }

    function getModerator() external view returns (address) {
        return moderator;
    }

    function getChat(address from, address to) external view returns (Message[] memory) {
        uint256 chatHash = uint256(keccak256(abi.encodePacked(from, to)));
        return chat[chatHash];
    }
}


