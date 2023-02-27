// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WEIDONG is ERC721, ERC721Enumerable, Ownable {
    constructor() ERC721("WEIDONG", "WD") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.weidong.space/api/wd-space/space/poap/manager/token/";
    }

    struct _mint_info{
        address to;
        uint256 id;
    }
    function single_mint(_mint_info calldata mint_info) public onlyOwner {
        _safeMint(mint_info.to, mint_info.id);
    }
    function mint_list(_mint_info[] calldata mint_info) public onlyOwner {
        uint256 to_l = mint_info.length;
        for(uint256 i =0;i<to_l;i++){
            _safeMint(mint_info[i].to,mint_info[i].id);
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}