// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./modular/otherinfo.sol";
import "./modular/withdraw.sol";
contract main_withdraw is withdraw{
    constructor(uint256 _mini_amount,address _token,address _add_withdraw,string memory name, string memory version)
        withdraw(
             _mini_amount, _token, _add_withdraw,  name,   version
        )
    {
        
    }

}