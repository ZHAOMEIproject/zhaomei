// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Transfer_station{
    constructor()
    {
        vii_20 = IERC20(0x9cb423b85f7A83362cA1fFB4f7Cadd89BBD432Fb);
        collection = msg.sender;
    }
    address immutable public collection;
    IERC20 immutable public vii_20;

    event Recharge(address indexed from,address indexed to,uint256 indexed index,uint256 amount);
    uint256 public index;
    function recharge(address to,uint256 amount)public{
        vii_20.transferFrom(msg.sender,collection,amount);
        emit Recharge(to,collection,amount,index++);
    }
}