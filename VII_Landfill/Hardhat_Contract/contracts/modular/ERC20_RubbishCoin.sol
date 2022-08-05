// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract RubbishCoin is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor() ERC20("RubbishCoin", "RBC") ERC20Permit("RubbishCoin") {}

    function Ownermint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    function Ownerburn(address to, uint256 amount) public onlyOwner {
        _burn(to,amount);
    }
}
