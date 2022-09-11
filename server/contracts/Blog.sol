pragma solidity ^0.8.9;

contract Blog {

    //event DodajObjavo(address avtor);

    struct Objava {
        address avtor;
        string vsebina;
        uint timestamp;
    }

    Objava[] private objave;

    function dodajObjavo(string memory vsebina) external {
        objave.push(Objava(msg.sender, vsebina, block.timestamp));
        //emit DodajObjavo(msg.sender);
    }

    function vseObjave() external view returns (Objava[] memory) {
        return objave;
    }
}