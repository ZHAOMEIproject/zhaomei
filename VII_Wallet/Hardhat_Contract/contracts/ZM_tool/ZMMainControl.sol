// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract ZMMainControl is AccessControl {
    bytes32 public constant MANAGE_ROLE = keccak256("MANAGE_ROLE");
    bytes32 public constant MONITOR_ROLE = keccak256("MONITOR_ROLE");

    bool public MONITOR_switch=true;

    constructor(address admin,address manage,address monitor){
    // constructor(){
        // address admin=msg.sender;
        // address manage=msg.sender;
        // address monitor=msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGE_ROLE, manage);
        _grantRole(MONITOR_ROLE, monitor);
    }

    modifier monitor_lock(){
        require(MONITOR_switch,"MONITOR_lock");
        _;
    }
    function c_monitor_lock(bool _switch)public onlyRole(MONITOR_ROLE){
        MONITOR_switch=_switch;
    }

}