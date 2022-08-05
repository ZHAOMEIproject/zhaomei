// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

contract Random{
    address immutable owner ;
    constructor(){
        owner = msg.sender;
    }
    mapping(address=>uint256) nonce;
    function getrandom()public returns(bytes32){
        require(owner==msg.sender);
        return keccak256(abi.encodePacked(block.chainid,block.coinbase,block.difficulty,msg.sender,nonce[msg.sender]++,block.timestamp));
    }
}