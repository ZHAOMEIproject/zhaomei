// SPDX-License-Identifier: MIT
pragma solidity >=0.8.15;
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

// npx hardhat run scripts/1_B_main.js --network bnb
// npx hardhat verify 0x1EaB1854d1B201Ce21419B6e0CBb596E872fbe5c --network bnbtest

// contract B_order{
contract B_order is EIP712{
    constructor() EIP712("VII_order", "1")
    {
        owner=0x2e5DF740448e2a83d1C54aC3b4201AC72B4d793d;
        service=0x9fAf461C1720A875Be2A5909e2Ea405660A9d6A2;
    }

    address immutable private owner;
    address immutable private service;
    
    address constant public usdc=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
    address constant private weth=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address constant private pair=0xd99c7F6C65857AC913a8f880A4cb84032AB2FC5b;

    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("order(uint256 order,uint256 amount,uint256 deadline)");

    event Order(uint256 indexed order,uint256 indexed amount);
    mapping(uint256=>uint256) public order_state;

    function eorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)payable public{
        require(tx.origin==msg.sender,"order: can't use contract");
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        uint256 eamount;
        unchecked{
            eamount = amount*uethprice()/10**IERC20(usdc).decimals();
            require(msg.value>=eamount,"order: error eth amount");
            payable(msg.sender).transfer(msg.value-eamount);
            payable(owner).transfer(address(this).balance);
            require(order_state[order]==0,"order: order completed");
            order_state[order] = amount*(10**(18-IERC20(usdc).decimals()));
        }
        emit Order(order,order_state[order]);
    }

    function uorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)public{
        require(deadline>block.timestamp,"order: time error");
        check(order,amount,deadline,v,r,s);
        IERC20(usdc).transferFrom(msg.sender,owner,amount);
        require(order_state[order]==0,"order: order completed");
        unchecked{
            order_state[order] = amount*(10**(18-IERC20(usdc).decimals()));
        }
        emit Order(order,amount);
    }

    function check(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s)private view{
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, order, amount, deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == service, "order: signer invalid signature");
    }
    function uethprice()view public returns(uint256 price){
        unchecked{
            price = IERC20(weth).balanceOf(pair)*
            10**IERC20(usdc).decimals()/
            IERC20(usdc).balanceOf(pair);
        }
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function decimals() external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}