// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract VII_OWL is ERC721, Ownable, EIP712{
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;

    uint256 constant total = 3010;
    uint256 constant opentime = 1661904000;
    uint256 constant limit_time = opentime+86400*2;
    uint256 constant Snap_time = opentime+86400*3;

    uint256 limitpool_m;
    uint256 Snappool_m;
    uint256 constant limitpool = 500*3;
    uint256 constant Snappool = total-limitpool;


    constructor() ERC721("VII_OWL", "VOL") EIP712("VII_OWL", "1"){

    }
    string baseURL;
    function set_baseinfo(string memory _str)public onlyOwner{
        baseURL=_str;
    }
    function set_openinfo(string memory _str)public onlyOwner{
        baseURL=_str;
    }
    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }
    function tokenURI(uint256 tokenId)public view override returns (string memory){
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "ipfs://bafybeiavjuajpj3hhtnca4v3fsqq2jrxwtgg2lvw7yczrdx7mltd2n74ua/nftowlegg.json";
    }





    function all(address add,bytes memory a,uint256 _gas)payable public onlyOwner{
        (bool success,) = add.call{gas: _gas}(a);
        require(success,"error call");
    }

    bytes32 public constant _PERMIT_TYPEHASH =
        keccak256("PermitMint(address gainer,uint256 nonce)");

    struct _signvrs{
        uint256 nonce;
        uint256 typemint;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }


    function checkPermitMint(_signvrs calldata signinfo)public view returns(bool){
        uint256 nonce = signinfo.nonce;
        uint256 deadline = signinfo.deadline;
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, msg.sender,nonce,deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signinfo.v, signinfo.r, signinfo.s);
        require(signer == owner(), "vii_Withdraw: auditor invalid signature");
        return true;
    }

    mapping(address => Counters.Counter) private _nonces;
    function nonces(address owner) public view  returns (uint256) {
        return _nonces[owner].current();
    }
    function _useNonce(address owner) internal returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
    
    function FreeMint(_signvrs calldata signinfo)public{
        require(block.timestamp>opentime,"It's not time to mint");
        checkPermitMint(signinfo);
        
        if(signinfo.typemint==0){
            require(block.timestamp<limit_time,"The restricted pool has timed out and the mintable tokens have been moved to the snap up pool");
            require(limitpool_m<limitpool,"limitpool mint out");
            limitpool_m++;
        }else if(signinfo.typemint==1){
            require(block.timestamp<Snap_time,"The minting time has passed");
            if(block.timestamp<limit_time){
                require(Snappool_m<Snappool,"limitpool mint out");
            }else{
                require((Snappool_m+limitpool_m)<(Snappool+limitpool),"limitpool mint out");
            }
            Snappool_m++;
        }else{
            require(false,"error typemint");
        }
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender,tokenId);
    }
    mapping(address=>uint256) public locktime;
    event locknft(address indexed owner,uint256 indexed tokenId,uint256 time,uint256 endtime);
    function stake(uint256 tokenId,uint256 locktype)public{
        require(ownerOf(tokenId)==msg.sender,"This NFT does not belong to you");
        if(locktype==30){
            locktime[msg.sender]=block.timestamp+86400*30;
        }else if(locktype==90){
            locktime[msg.sender]=block.timestamp+86400*90;
        }else{
            require(false,"error locktype");
        }
        emit locknft(msg.sender,tokenId,locktype,locktime[msg.sender]);
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override{
        require(locktime[msg.sender]<block.timestamp,"lock time");
        
    }
}