// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "./modular/withdraw.sol";
contract mainwithdraw is withdraw{
    constructor(
        uint256 _mini_amount,address _token,address _add_withdraw,string memory name, string memory version,
        address admin,address manage,address monitor
    )
        withdraw(
            _mini_amount,_token,_add_withdraw,name,version
        )
        ZMMainControl(

        )
    {
        
    }
}