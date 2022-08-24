// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "../ZM_tool/ZMMainControl.sol";

abstract contract otherinfo is ZMMainControl{
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    constructor(address withdraw){
        // address withdraw=msg.sender;
        _grantRole(WITHDRAW_ROLE, withdraw);
    }
}