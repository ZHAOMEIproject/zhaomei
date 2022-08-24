// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "../ZM_tool/ZMMainControl.sol";

abstract contract otherinfo is ZMMainControl{
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    constructor(address _withdraw,address _admin,address _manage,address _monitor)
        ZMMainControl(
            _admin,_manage,_monitor
        )
    {
        // address _withdraw=msg.sender;
        _grantRole(WITHDRAW_ROLE, _withdraw);

    }
}