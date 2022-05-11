// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract owl_base is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {
    }
    function initialize() initializer public {
        __ERC721_init("Vii_Owl", "VOL");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }
    string baseURL;
    bool egg_open;
    uint256 public sell_price;
    function update()public onlyOwner{
        sell_price=10**16;
    }
    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }
    function set_baseinfo(string memory _str,bool _egg_open,uint256 _sell_price)public onlyOwner{
        baseURL=_str;
        egg_open=_egg_open;
        sell_price=_sell_price;
    }


    function test_sell_Mint(address to)payable public {
        require(msg.value>=sell_price,"eth not enough");
        payable(to).transfer(msg.value);
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
    function setTokenURI(uint256 tokenId, string calldata uri) public onlyOwner{
        _setTokenURI(tokenId, uri);
    }
    function P_setTokenURI(uint256[] calldata tokenId, string[] calldata uri) public onlyOwner{
        uint256 l=tokenId.length;
        for(uint256 i;i<l;i++){
            _setTokenURI(tokenId[i], uri[i]);
        }
    }



    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        if(!egg_open){
            return "bafybeian5c52y2qhuuaegkgu2ygrbtihpbi3zz3sjkaxrnscmpueercypm.ipfs.nftstorage.link/nftowlegg.json";
        }
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}