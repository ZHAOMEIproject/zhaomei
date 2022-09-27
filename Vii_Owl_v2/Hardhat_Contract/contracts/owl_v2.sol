// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract VII_OWL is ERC721, Ownable, EIP712, ERC721Enumerable{
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;

    // uint256 constant total = 3010;
    // uint256 constant opentime = 1661904000;
    // uint256 constant limit_time = opentime+86400*2;
    // uint256 constant Snap_time = opentime+86400*3;
    // uint256 limitpool_m;
    // uint256 Snappool_m;
    // uint256 constant limitpool = 500*3;
    // uint256 constant Snappool = total-limitpool;

    uint256  total = 3010;
    uint256  opentime = 1661904000;
    uint256  limit_time = opentime+86400*2;
    uint256  Snap_time = opentime+86400*3;

    uint256 limitpool_m;
    uint256 Snappool_m;
    uint256 limitpool = 500*3;
    uint256 Snappool = total-limitpool;

    function dbug(uint256 _opentime,uint256 _limit_time,uint256 _Snap_time,uint256 _total,uint256 _limitpool,uint256 _Snappool)public{
        opentime=_opentime;
        limit_time=_limit_time;
        Snap_time=_Snap_time;
        total=_total;
        limitpool=_limitpool;
        Snappool=_Snappool;
    }
    function set_openinfo(uint256 _opentime,uint256 _limit_time,uint256 _Snap_time,uint256 _total,uint256 _limitpool,uint256 _Snappool)public onlyOwner{
        opentime=_opentime;
        limit_time=_limit_time;
        Snap_time=_Snap_time;
        total=_total;
        limitpool=_limitpool;
        Snappool=_Snappool;
    }
    function view_set()public view returns(uint256 _opentime,uint256 _limit_time,uint256 _Snap_time,uint256 _total,uint256 _limitpool,uint256 _Snappool){
        return (opentime,limit_time,Snap_time,total,limitpool,Snappool);
    }


    constructor() ERC721("VII_OWL", "VOL") EIP712("VII_OWL", "1"){
    }
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
    function all(address add,bytes memory a,uint256 _gas)payable public onlyOwner{
        (bool success,) = add.call{gas: _gas}(a);
        require(success,"error call");
    }
    bytes32 public constant _PERMIT_TYPEHASH =
        keccak256("PermitMint(address gainer,uint256 typemint,uint256 deadline,uint256 nonce)");

    struct _signvrs{
        address gainer;
        uint256 typemint;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    function signcheck(_signvrs calldata signinfo,uint256 nonce)public view returns(address signer){
        address gainer = signinfo.gainer;
        uint256 deadline = signinfo.deadline;
        uint256 typemint = signinfo.typemint;
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, gainer,typemint,deadline,nonce));
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
    
    function FreeMint(_signvrs calldata signinfo)public{
        require(signinfo.deadline>block.timestamp,"time out");
        require(block.timestamp>opentime,"It's not time to mint");
        address gainer = signinfo.gainer;
        require(owner()==signcheck(signinfo,_useNonce(gainer)),"error signature");
        
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
        _mint(gainer,tokenId);
    }
    function mintednumber()public view returns(uint256){
        return (limitpool_m+Snappool_m);
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
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(locktime[msg.sender]<block.timestamp,"lock time");
        super._beforeTokenTransfer(from, to, tokenId);
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