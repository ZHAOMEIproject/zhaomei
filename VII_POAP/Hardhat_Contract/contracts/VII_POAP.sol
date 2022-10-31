// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VII_POAP is ERC1155, Ownable {
    constructor() ERC1155("https://test") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }
    function mint_list(address[] memory to, uint256[] memory ids)
        public
        onlyOwner
    {
        uint256 to_l = to.length;
        for(uint256 i =0;i<to_l;i++){
            if(balanceOf(to[i],ids[i])!=0){
                continue;
            }
            _mint(to[i],ids[i],1,"");
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        require(from==address(0),"VII_POAP cannot transfer");
    }
}