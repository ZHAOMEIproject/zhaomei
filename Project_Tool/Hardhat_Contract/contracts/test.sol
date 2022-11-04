// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./ZM_tool/p_ZMMainControl.sol";




contract ZM_ERC721 is Initializable, p_ZMMainControl, ERC721Upgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;
    using StringsUpgradeable for uint256;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name,string memory symol,address _admin,address _manage,address _monitor) initializer public {
        __ERC721_init(name, symol);
        __AccessControl_init();
        __p_ZMMainControl_init(_admin,_manage,_monitor);
        // _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _revokeRole(MANAGE_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        __base_init(
            "ipfs://bafybeiasstkn5xlajj43nxzokxtv4sbjfp3j6cwvgbc6ui5immwbbfd2fq/",
            true,
            0
        );
    }
    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    string baseURL;
    bool egg_open;
    uint256 public sell_price;

    function __base_init(string memory _str,bool _egg_open,uint256 _sell_price)
        internal onlyInitializing {
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
    // function all(address add,bytes memory a,uint256 _gas)payable public onlyRole(MINTER_ROLE){
    //     (bool success,) = add.call{gas: _gas}(a);
    //     require(success,"error call");
    // }
}