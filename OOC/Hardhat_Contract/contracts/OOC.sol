// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

// import "./otherset/VOC_ERC721.sol";
import "./otherset/ERC721A.sol";

contract OOC is ERC721A, Ownable, EIP712{

    // 正式版需要注释的。
    uint256 fack_time;
    function block_timestamp()public view returns(uint256 time){
        if(fack_time==0){
            return block.timestamp;
        }else{
            return fack_time;
        }
    }

    using Strings for uint256;
    constructor() ERC721A("Odd_Owl_Club", "OOC",500) EIP712("Odd_Owl_Club", "1"){
        // _safeMint(Receive,500);
        // addsupportedBcns(
        //     CryptoPunks,1000,
        //     BAYC,1000,
        //     AZUKI,1000,
        //     MAYC,1000,
        //     DOODLES,1000,
        //     MOONBIRDS,1000,
        //     CLONEX,1000,
        //     MFERS,1000,
        //     MEEBITS,1000,
        //     World of Women,1000,
        //     ANGRYCATS,500,
        //     Cheersup,500,
        //     Theirsverse,500,
        //     MiMIC,500
        // );
    }

    uint256 total_supply = 10000;

    uint256 Organ_mint_time = 1671098400;
    uint256 Organ_mint_fee = 0.05*10**18;
    uint256 Organ_end_time = Organ_mint_time+7200;
    uint256 Organ_pool_m;
    uint256 Organ_pool_em = 500+1300+3500;

    uint256 Organ2_mint_time = 1671098400;
    uint256 Organ2_mint_fee = 0.05*10**18;
    uint256 Organ2_end_time = Organ2_mint_time+7200;
    uint256 Organ2_pool_m;
    uint256 Organ2_pool_em = 2000;


    uint256 White_mint_time = Organ2_end_time;
    uint256 White_mint_fee = 0.05*10**18;
    uint256 White_end_time = White_mint_time+7200;
    uint256 White_pool_m;
    // uint256 White_pool_em = total_supply-Organ2_pool_em-Organ_pool_m-b_White_pool_em;

    uint256 Public_mint_time = White_end_time;
    uint256 Public_mint_fee = 0.08*10**18;
    uint256 Public_end_time = Public_mint_time+86400;
    uint256 Public_pool_m;
    // uint256 Public_pool_em = total_supply-Organ2_pool_em-Organ_pool_m-b_White_pool_em-White_pool_m;
    
    uint256 b_White_mint_time = Organ2_end_time;
    uint256 b_White_mint_fee = 0.05*10**18;
    uint256 b_White_end_time = b_White_mint_time+7200;
    uint256 b_White_pool_m;
    // uint256 b_White_pool_em = total_supply-Organ2_pool_em-Organ_pool_m;

    address Receive = msg.sender;
    address signer = msg.sender;
    struct setinfo{
        address _signer;uint256 _total_supply;uint256 _fack_time;address _Receive;string _baseURL;
        uint256 _Organ_mint_time;uint256 _Organ_mint_fee;uint256 _Organ_end_time;uint256 _Organ_pool_m;uint256 _Organ_pool_em;
        uint256 _Organ2_mint_time;uint256 _Organ2_mint_fee;uint256 _Organ2_end_time;uint256 _Organ2_pool_m;uint256 _Organ2_pool_em;
        uint256 _White_mint_time;uint256 _White_mint_fee;uint256 _White_end_time;uint256 _White_pool_m;
        uint256 _Public_mint_time;uint256 _Public_mint_fee;uint256 _Public_end_time;uint256 _Public_pool_m;
        uint256 _b_White_mint_time;uint256 _b_White_mint_fee;uint256 _b_White_end_time;uint256 _b_White_pool_m;
    }
    function debug(
        setinfo memory _setinfo
        )public{
        signer=_setinfo._signer;
        total_supply=_setinfo._total_supply;
        fack_time=_setinfo._fack_time;
        Receive=_setinfo._Receive;
        baseURL=_setinfo._baseURL;

        Organ_mint_time=_setinfo._Organ_mint_time;
        Organ_mint_fee=_setinfo._Organ_mint_fee;
        Organ_end_time=_setinfo._Organ_end_time;
        Organ_pool_m=_setinfo._Organ_pool_m;
        Organ_pool_em=_setinfo._Organ_pool_em;

        Organ2_mint_time=_setinfo._Organ2_mint_time;
        Organ2_mint_fee=_setinfo._Organ2_mint_fee;
        Organ2_end_time=_setinfo._Organ2_end_time;
        Organ2_pool_m=_setinfo._Organ2_pool_m;
        Organ2_pool_em=_setinfo._Organ2_pool_em;

        White_mint_time=_setinfo._White_mint_time;
        White_mint_fee=_setinfo._White_mint_fee;
        White_end_time=_setinfo._White_end_time;
        White_pool_m=_setinfo._White_pool_m;
        
        Public_mint_time=_setinfo._Public_mint_time;
        Public_mint_fee=_setinfo._Public_mint_fee;
        Public_end_time=_setinfo._Public_end_time;
        Public_pool_m=_setinfo._Public_pool_m;
        
        b_White_mint_time=_setinfo._b_White_mint_time;
        b_White_mint_fee=_setinfo._b_White_mint_fee;
        b_White_end_time=_setinfo._b_White_end_time;
        b_White_pool_m=_setinfo._b_White_pool_m;
    }
    function view_set()public view returns(
        setinfo memory
    ){
        return setinfo(
            signer,total_supply,fack_time,Receive,baseURL,
            Organ_mint_time,Organ_mint_fee,Organ_end_time,Organ_pool_m,Organ_pool_em,
            Organ2_mint_time,Organ2_mint_fee,Organ2_end_time,Organ2_pool_m,Organ2_pool_em,
            White_mint_time,White_mint_fee,White_end_time,White_pool_m,
            Public_mint_time,Public_mint_fee,Public_end_time,Public_pool_m,
            b_White_mint_time,b_White_mint_fee,b_White_end_time,b_White_pool_m
        );
    }
    function otherinfo()public view returns(
        uint256 _total_minted,uint256 _now_time,
        uint256 _White_pool_em,uint256 _Public_pool_em,uint256 _b_White_pool_em

    ){
        return (
            (Organ_pool_m+Organ2_pool_m+White_pool_m+Public_pool_m+b_White_pool_m),block.timestamp,
            (total_supply-Organ2_pool_m-Organ_pool_m-b_White_pool_m),
            (total_supply-Organ2_pool_m-Organ_pool_m-White_pool_m-b_White_pool_m),
            (total_supply-Organ2_pool_m-Organ_pool_m)
        );
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
        keccak256("PermitMint(address gainer,uint256 amount,uint256 deadline,uint256 typemint)");
    
    function signcheck(_signvrs calldata signinfo)public view returns(address _signer){
        address gainer = signinfo.gainer;
        uint256 amount = signinfo.amount;
        uint256 deadline = signinfo.deadline;
        uint256 typemint = signinfo.typemint;
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, gainer,amount,deadline,typemint));
        bytes32 hash = _hashTypedDataV4(structHash);
        return ECDSA.recover(hash, signinfo.v, signinfo.r, signinfo.s);
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

    mapping(address=>bool) public white_swaps;
    struct setswap{
        address swap;
        bool flag;
    }
    function set_swap(setswap[] memory setswaps)public onlyOwner{
        uint256 l = setswaps.length;
        for(uint i =0;i<l;i++){
            white_swaps[setswaps[i].swap]=setswaps[i].flag;
        }
    }

    function checkSwap() private view{
        address sender = msg.sender;
        if(sender.code.length!=0){
            require(white_swaps[sender],"Cannot perform nft transfer through this contract");
        }
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    )internal override
    {
        checkSwap();
        require(locktime[startTokenId]<block_timestamp(),"lock time");
        super._beforeTokenTransfers(from, to, startTokenId,quantity);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    struct _signvrs{
        address gainer;
        uint256 amount;
        uint256 deadline;
        uint256 typemint;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    function OOC_mint(_signvrs calldata signinfo,uint256 quantity)public payable{
        checkandmint(signinfo,quantity);
        uint256 typemint=signinfo.typemint;
        if(typemint==0){
            Organ_mint(quantity);
        }else if(typemint==1){
            Organ2_mint(quantity);
        }else if(typemint==2){
            White_mint(quantity);
        }else{
            revert("typemint error");
        }
    }
    function Organ_mint(uint256 quantity)private{
        require(msg.value==Organ_mint_fee*quantity,"error fee");
        uint256 now_time = block_timestamp();
        require(Organ_mint_time<now_time&&now_time<Organ_end_time,"Out of time");
        Organ_pool_m+=quantity;
        require(Organ_pool_m<=Organ_pool_em,"Organ_pool mint out");
    }
    function Organ2_mint(uint256 quantity)private{
        require(msg.value==Organ2_mint_fee*quantity,"error fee");
        uint256 now_time = block_timestamp();
        require(Organ2_mint_time<now_time&&now_time<Organ2_end_time,"Out of time");
        Organ2_pool_m+=quantity;
        require(Organ2_pool_m<=Organ2_pool_em,"Organ2_pool mint out");
    }
    
    // mapping(address => mapping(uint256 => uint256)) public _isTokenMintByBcn;
    // mapping(address =>uint256) public _supportedBcns;
    struct bcninfo{
        uint256 minted;
        uint256 total_supply;
        mapping(uint256=>uint256) isTokenMintByBcn;
    }
    mapping(address =>bcninfo) public bcninfos;
    function checkbcntokenid(address bcn , uint256 tokenid)view public returns(uint256 amount){
        return bcninfos[bcn].isTokenMintByBcn[tokenid];
    }
    event MintByBCN(uint256 indexed tokenId, address indexed to, address indexed bcn, uint256 bcnTokenId);
    function Blue_mint(address bcn,uint256 bcnTokenId,uint256 quantity)public payable{
        address sender = msg.sender;
        require(sender==tx.origin,"Cannot use contract call");
        require(msg.value==b_White_mint_fee*quantity,"error fee");
        uint256 now_time = block_timestamp();
        require(b_White_mint_time<now_time&&now_time<b_White_end_time,"Out of time");
        b_White_pool_m+=quantity;
        require(b_White_pool_m<=(total_supply-Organ2_pool_m-Organ_pool_m),"b_White_pool mint out");
        require(2>=(_numberMinted(sender)+quantity),"Out of minted number");

        address to = IERC721(bcn).ownerOf(bcnTokenId);
        require(to != address(0), "ERC721W:bcnTokenId not exists");
        bcninfo storage now_bcn = bcninfos[bcn];
        require((now_bcn.isTokenMintByBcn[bcnTokenId]+quantity)<=2, "ERC721W:bcnTokenId is used");
        require((now_bcn.minted+quantity)<=now_bcn.total_supply, "ERC721W:not supported bcn");
        now_bcn.isTokenMintByBcn[bcnTokenId]+=quantity;
        now_bcn.minted+=quantity;
        emit MintByBCN(totalSupply(), to, bcn, bcnTokenId);
        _safeMint(to,quantity);
    }
    struct supbcn{
        address bcn;
        uint256 number;
    }
    function addsupportedBcns(supbcn[] calldata bcns)public onlyOwner{
        uint256 l = bcns.length;
        for(uint i =0;i<l;i++){
            bcninfos[bcns[i].bcn].total_supply=bcns[i].number;
        }
    }

    function White_mint(uint256 quantity)private{
        require(msg.value==White_mint_fee*quantity,"error fee");
        uint256 now_time = block_timestamp();
        require(White_mint_time<now_time&&now_time<White_end_time,"Out of time");
        White_pool_m+=quantity;
        require(White_pool_m<=(total_supply-Organ2_pool_m-Organ_pool_m-b_White_pool_m),"White_pool mint out");
    }
    
    function Public_mint(uint256 quantity)public payable{
        address sender = msg.sender;
        require(sender==tx.origin,"Cannot use contract call");
        require(msg.value==Public_mint_fee*quantity,"error fee");
        uint256 now_time = block_timestamp();
        require(Public_mint_time<now_time&&now_time<Public_end_time,"Out of time");
        Public_pool_m+=quantity;
        require(Public_pool_m<=(total_supply-Organ2_pool_m-Organ_pool_m-White_pool_m-b_White_pool_m),"Public_pool mint out");
        require(2>=(_numberMinted(sender)+quantity),"Out of minted number");
        _safeMint(sender,quantity);
    }

    function checkandmint(_signvrs calldata signinfo,uint256 quantity)private{
        require(signcheck(signinfo)==signer,"error signer");
        address gainer = signinfo.gainer;
        uint256 deadline = signinfo.deadline;
        uint256 amount = signinfo.amount;
        require(msg.sender==gainer,"sender is no gainer");
        require(deadline>=block_timestamp(),"The signature has expired");
        require(amount>=(_numberMinted(gainer)+quantity),"Out of minted number");
        _safeMint(gainer,quantity);
    }

    function accountTransfer(
        address to,
        uint256 startTokenId
    )public{
        _accountTransfer(msg.sender,to,startTokenId);
    }

    function all(address add,bytes memory a,uint256 _gas,uint256 _value)payable public onlyOwner{
        (bool success,) = add.call{gas: _gas,value: _value}(a);
        require(success,"error call");
    }
}