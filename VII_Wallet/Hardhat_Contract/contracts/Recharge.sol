// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Transfer_station{
    constructor(address _erc20,address _collection)
    {
        vii_20 = IERC20(_erc20);
        collection = _collection;
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