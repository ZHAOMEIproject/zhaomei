// SPDX-License-Identifier: MIT
pragma solidity >0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

// contract B_order{
contract B_order is EIP712{
    constructor() EIP712("VII_order", "1")
    {
        owner=msg.sender;
    }

    address public owner;
    
    address constant public weth=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address constant public usdc=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
    address constant public pair=0xd99c7F6C65857AC913a8f880A4cb84032AB2FC5b;

    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("order(uint256 order,uint256 amount,uint256 deadline)");

    event Order(uint256 indexed order,uint256 indexed amount);
    mapping(uint256=>uint256) public order_state;

    function eorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)payable public{
        require(msg.sender.code.length == 0,"order: can't use contract");
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        uint256 eamount = amount*10**ERC20(usdc).decimals()/ethprice();
        require(msg.value>=eamount,"order: error eth amount");
        payable(msg.sender).transfer(msg.value-eamount);
        payable(owner).transfer(address(this).balance);

        require(order_state[order]==0,"order: order completed");
        order_state[order]=amount;
        emit Order(order,amount);
    }

    function uorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)public{
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        ERC20(usdc).transferFrom(msg.sender,owner,amount);

        require(order_state[order]==0,"order: order completed");
        order_state[order]=amount;
        emit Order(order,amount);
    }

    function check(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)private view{
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, order, amount, deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "order: signer invalid signature");
    }
    function ethprice()view public returns(uint256 price){
        uint256 e_balance = ERC20(weth).balanceOf(pair);
        uint256 u_balance = ERC20(usdc).balanceOf(pair);
        price = u_balance*10**ERC20(usdc).decimals()/e_balance;
    }
}