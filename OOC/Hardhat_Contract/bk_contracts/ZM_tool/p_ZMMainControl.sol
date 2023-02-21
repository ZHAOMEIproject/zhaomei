// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract p_ZMMainControl is Initializable, AccessControlUpgradeable,UUPSUpgradeable {
    bytes32 public constant MANAGE_ROLE = keccak256("MANAGE_ROLE");
    bytes32 public constant MONITOR_ROLE = keccak256("MONITOR_ROLE");

    bool public MONITOR_switch=true;

    function __p_ZMMainControl_init(address _admin,address _manage,address _monitor)
    internal onlyInitializing {
        __p_ZMMainControl_init_unchained();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MANAGE_ROLE, _manage);
        _grantRole(MONITOR_ROLE, _monitor);
    }

    function __p_ZMMainControl_init_unchained() internal onlyInitializing {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGE_ROLE, msg.sender);
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(DEFAULT_ADMIN_ROLE)
        override
    {}

    modifier monitor_lock(){
        require(MONITOR_switch,"MONITOR_lock");
        _;
    }
    function c_monitor_lock(bool _switch)public onlyRole(MONITOR_ROLE){
        MONITOR_switch=_switch;
    }
}