pragma solidity ^0.8.9;

contract Blog {

    struct Objava {
        address avtor;
        string vsebina;
        uint timestamp;
    }

    Objava[] private objave;

    function dodajObjavo(string memory vsebina) external {
        objave.push(Objava(msg.sender, vsebina, block.timestamp));
    }

    function vseObjave() external view returns (Objava[] memory) {
        return objave;
    }
}


