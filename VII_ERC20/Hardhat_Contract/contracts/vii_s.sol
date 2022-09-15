// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract vii_s is ERC20, ERC20Burnable, ERC20Permit {
    constructor() ERC20("VIIDER", "VID") ERC20Permit("VIIDER") {
        _mint(0x4B05DBd3a8cE4238161C6a9eaFEB1B61Eba37165, 30000000 * 10 ** decimals());
    }
}
