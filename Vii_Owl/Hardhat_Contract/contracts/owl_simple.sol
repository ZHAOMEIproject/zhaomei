// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract VII_OWL is ERC721, ERC721Burnable, Ownable{
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("VII_OWL", "VOL") {
        safeMint(msg.sender);
        // set_baseinfo(
        //     "ipfs://bafybeiasstkn5xlajj43nxzokxtv4sbjfp3j6cwvgbc6ui5immwbbfd2fq/",
        //     false,
        //     0
        // );
        set_baseinfo(
            "ipfs://bafybeiasstkn5xlajj43nxzokxtv4sbjfp3j6cwvgbc6ui5immwbbfd2fq/",
            true,
            0
        );
    }
    string baseURL;
    bool egg_open;
    uint256 public sell_price;
    function set_baseinfo(string memory _str,bool _egg_open,uint256 _sell_price)public onlyOwner{
        baseURL=_str;
        egg_open=_egg_open;
        sell_price=_sell_price;
    }
    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }
    function tokenURI(uint256 tokenId)public view override returns (string memory){
         if(egg_open){
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
            string memory baseURI = _baseURI();
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "";
         }
         return "ipfs://bafybeiavjuajpj3hhtnca4v3fsqq2jrxwtgg2lvw7yczrdx7mltd2n74ua/nftowlegg.json";
    }
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    function sell_Mint()payable public {
        require(msg.value>=sell_price,"eth not enough");
        payable(owner()).transfer(msg.value);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
    function all(address add,bytes memory a,uint256 _gas)payable public onlyOwner{
        (bool success,) = add.call{gas: _gas}(a);
        require(success,"error call");
    }
}