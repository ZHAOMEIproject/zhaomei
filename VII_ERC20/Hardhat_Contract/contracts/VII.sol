// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Vii_s is ERC20, ERC20Burnable, ERC20Permit {
    constructor() ERC20("vii", "VID") ERC20Permit("vii") {
        _mint(msg.sender, 30000000 * 10 ** decimals());
    }
}
