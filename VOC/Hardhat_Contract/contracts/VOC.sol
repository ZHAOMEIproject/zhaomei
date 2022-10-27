// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

import "./otherset/VOC_ERC721.sol";

contract VIIDER_OWL_CLUB is ERC721, Ownable, EIP712{
    constructor() ERC721("VIIDER_OWL_CLUB", "VOC") EIP712("VIIDER_OWL_CLUB", "1"){

    }

    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;

    uint256 total_supply = 6010;

    uint256 White_mint_time = 1668520800;
    uint256 White_mint_fee = 0.06*10**18;
    uint256 White_end_time = White_mint_time+86400;

    uint256 mint_fee = 0.08*10**18;
    uint256 end_time = White_end_time+86400*3;

    uint256 White_pool_m;

    address Treasury = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    uint256 fack_time;
    mapping(address=>uint256) Ranking_list;
    function block_timestamp()public view returns(uint256 time){
        if(fack_time==0){
            return block.timestamp;
        }else{
            return fack_time;
        }
    }

    function dbug(uint256 _White_mint_time,uint256 _White_mint_fee,uint256 _White_end_time,uint256 _mint_fee,uint256 _end_time,uint256 _total_supply,uint256 _White_pool_m,uint256 _fack_time)public{
        White_mint_time=_White_mint_time;
        White_mint_fee=_White_mint_fee;
        White_end_time=_White_end_time;
        mint_fee=_mint_fee;
        end_time=_end_time;
        total_supply=_total_supply;
        White_pool_m=_White_pool_m;
        fack_time=_fack_time;
    }
    function set_openinfo(uint256 _White_mint_time,uint256 _White_mint_fee,uint256 _White_end_time,uint256 _mint_fee,uint256 _end_time,uint256 _total_supply)public onlyOwner{
        White_mint_time=_White_mint_time;
        White_mint_fee=_White_mint_fee;
        White_end_time=_White_end_time;
        mint_fee=_mint_fee;
        end_time=_end_time;
        total_supply=_total_supply;
    }
    function view_set()public view returns(uint256 _White_mint_time,uint256 _White_mint_fee,uint256 _White_end_time,uint256 _mint_fee,uint256 _end_time,uint256 _total_supply,uint256 _White_pool_m,uint256 _fack_time){
        return (White_mint_time,White_mint_fee,White_end_time,mint_fee,end_time,total_supply,White_pool_m,fack_time);
    }

    // open box
    string baseURL;
    function set_baseinfo(string memory _str)public onlyOwner{
        baseURL=_str;
    }
    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }
    function tokenURI(uint256 tokenId)public view override returns (string memory){
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "ipfs://bafybeiacwutogdxuso375yqeueux6egecrzxxjfxai2lndsd2jfk7s4jo4/owlbox.json";
    }

    // White_list
    bytes32 public constant _PERMIT_TYPEHASH =
        keccak256("PermitMint(address gainer,address community,uint256 deadline,uint256 nonce)");
    struct _signvrs{
        address gainer;
        address community;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    function signcheck(_signvrs calldata signinfo,uint256 nonce)public view returns(address signer){
        address gainer = signinfo.gainer;
        uint256 deadline = signinfo.deadline;
        address community = signinfo.community;
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, gainer,community,deadline,nonce));
        bytes32 hash = _hashTypedDataV4(structHash);
        return ECDSA.recover(hash, signinfo.v, signinfo.r, signinfo.s);
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


    function White_mint(_signvrs calldata signinfo)public payable{
        address gainer = signinfo.gainer;
        require(signinfo.deadline>block_timestamp(),"time out");
        require(owner()==signcheck(signinfo,_useNonce(gainer)),"error signature");

        require(msg.value>=White_mint_fee,"Insufficient expenses");
        require(block_timestamp()>White_mint_time,"It's not time to mint");
        require(block_timestamp()<White_end_time,"It' has timed out");
        
        Ranking_list[signinfo.community]++;


        mint(msg.sender);
    }


    function Public_mint()public payable{
        require(msg.value>=mint_fee,"Insufficient expenses");
        require(block_timestamp()>White_end_time,"It's not time to mint");
        require(block_timestamp()<end_time,"It' has timed out");


        mint(msg.sender);
    }

    function mint(address sender)private{
        White_pool_m++;
        require(White_pool_m<total_supply,"NFTpool mint out");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(sender,tokenId);
    }

    mapping(uint256=>uint256) public locktime;
    event locknft(address indexed owner,uint256 indexed tokenId,uint256 time,uint256 endtime);
    function stake(uint256 tokenId,uint256 locktype)public{
        require(locktime[tokenId]<block_timestamp(),"NFT is already in staking");
        require(ownerOf(tokenId)==msg.sender,"This NFT does not belong to you");
        if(locktype==30){
            locktime[tokenId]=block_timestamp()+86400*30;
        }else if(locktype==90){
            locktime[tokenId]=block_timestamp()+86400*90;
        }else{
            require(false,"error locktype");
        }
        emit locknft(msg.sender,tokenId,locktype,locktime[tokenId]);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        require(locktime[tokenId]<block_timestamp(),"lock time");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        address owner = super.ownerOf(tokenId);
        if (owner == address(0)) {
            return Treasury;
        }
        return owner;
    }


    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function all(address add,bytes memory a,uint256 _gas)payable public onlyOwner{
        (bool success,) = add.call{gas: _gas}(a);
        require(success,"error call");
    }
}

