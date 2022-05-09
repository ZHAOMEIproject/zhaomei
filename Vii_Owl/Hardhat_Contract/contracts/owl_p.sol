// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
contract owl_p is ERC1967Proxy{
    constructor(address logic)ERC1967Proxy(logic,new bytes(0)){
    }
}