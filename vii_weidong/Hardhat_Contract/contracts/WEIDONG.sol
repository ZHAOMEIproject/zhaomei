// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WEIDONG is ERC1155, Ownable {
    constructor() ERC1155("http://192.168.0.173:7700/#/view/m8wN1j2k") {}
    string constant public  name="WEIDONG";
    string constant public  symbol="WD";

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    struct _mint_info{
        address to;
        uint256 id;
    }
    function single_mint(_mint_info calldata mint_info) public onlyOwner {
        _mint(mint_info.to, mint_info.id,1,"");
    }
    function mint_list(_mint_info[] calldata mint_info) public onlyOwner {
        uint256 to_l = mint_info.length;
        for(uint256 i =0;i<to_l;i++){
            _mint(mint_info[i].to,mint_info[i].id,1,"");
        }
    }
}
