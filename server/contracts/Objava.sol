pragma solidity ^0.8.9;

contract Objava {

    event DodajObjavo(address avtor, uint id);

    struct Objava {
        uint id;
        address avtor;
        string vsebina;
        uint timestamp;
    }

    Objava[] private objave;
    //mapping(uint256 => address) objavaAvtor;

    function dodajObjavo(string memory vsebina) external {
        uint id = objave.length;
        objave.push(Objava(id, msg.sender, vsebina, block.timestamp));
        emit DodajObjavo(msg.sender, id);
    }

    function vseObjave() external view returns (Objava[] memory) {
        return objave;
    }
}