// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract VII_POAP is ERC1155, Ownable {
    constructor() ERC1155("http://3pe6232331.zicp.vip/api/owl-behavior/behavior/space/activity/token/") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // function mint(address account, uint256 id, uint256 amount, bytes memory data)
    //     public
    //     onlyOwner
    // {
    //     _mint(account, id, amount, data);
    // }
    struct _mint_info{
        address to;
        uint256 id;
    }
    function single_mint(_mint_info calldata mint_info)
        public
        onlyOwner
    {
        _mint(mint_info.to, mint_info.id, 1, "0x");
    }
    function mint_list(_mint_info[] calldata mint_info)
        public
        onlyOwner
    {
        uint256 to_l = mint_info.length;
        for(uint256 i =0;i<to_l;i++){
            if(balanceOf(mint_info[i].to,mint_info[i].id)!=0){
                continue;
            }
            _mint(mint_info[i].to,mint_info[i].id,1,"");
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) view internal override {
        operator;
        from;
        amounts;
        data;
        require(from==address(0),"VII_POAP cannot transfer");
        for (uint256 i = 0; i < ids.length; i++) {
            require(balanceOf(to,ids[i])==0,"The user already owns");
        }
    }
    using Strings for uint256;
    function uri(uint256 tokenId) public view override returns (string memory tokenurl) {
        string memory baseURI = super.uri(tokenId);
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }
}