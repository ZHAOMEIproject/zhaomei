// SPDX-License-Identifier: MIT
pragma solidity >0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

// contract B_order{
contract E_order is EIP712{
    constructor() EIP712("VII_order", "1")
    {
        owner=msg.sender;
    }

    address public owner;

    address constant public weth=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address constant public usdc=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address constant public pair=0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc;

    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("order(uint256 order,uint256 amount,uint256 deadline)");

    event Order(uint256 indexed order,uint256 indexed amount);
    mapping(uint256=>uint256) public order_state;

    function eorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)payable public{
        require(msg.sender.code.length == 0,"order: can't use contract");
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        require(msg.value>=(amount/ethprice()),"order: error eth amount");
        payable(msg.sender).transfer(msg.value-(amount*10**18/ethprice()));
        payable(owner).transfer(address(this).balance);
        order_state[order]=amount;
        emit Order(order,amount);
    }

    function uorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)public{
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        IERC20(usdc).transferFrom(msg.sender,owner,amount);
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
        uint256 e_balance = IERC20(weth).balanceOf(pair);
        uint256 u_balance = IERC20(usdc).balanceOf(pair);
        price = u_balance*10**18/e_balance;
    }
}