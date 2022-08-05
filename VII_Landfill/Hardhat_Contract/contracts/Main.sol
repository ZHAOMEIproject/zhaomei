// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "./modular/Nftstorage.sol";
import "./ZM_tool/ZMMainControl.sol";
import "./modular/ERC20_RubbishCoin.sol";
import "./modular/Random.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract main is ZMMainControl{
    Nftstorage immutable public nftstorage;
    RubbishCoin immutable public rubbishcoin;
    Random immutable public random;
    constructor(){
        nftstorage = new Nftstorage();
        rubbishcoin = new RubbishCoin();
        random = new Random();
        setinfo(
            75*10**16,
            50*10**16,
            2*10**18,
            259200);
    }
    bytes4 constant ERC721type = type(IERC721).interfaceId;
    bytes4 constant ERC1155type = type(IERC1155).interfaceId;

    uint256 public baseget;
    uint256 public baserandom;
    uint256 public baseauction;
    uint256 public auctiontime;
    function setinfo(uint256 _baseget,uint256 _baserandom,uint256 _baseauction,uint256 _auctiontime)public onlyRole(MANAGE_ROLE){
        baseget=_baseget;
        baserandom = _baserandom;
        baseauction = _baseauction;
        auctiontime=_auctiontime;
    }
    struct auction{
        bool finish;
        address nft;
        uint256 tokenid;
        uint256 time;
        uint256 amount;
        address auctioner;
    }

    auction[] auctions;
    mapping(uint256=>uint256) m_auctions;
    uint256 m_auction_l;
    mapping(uint256=>uint256) t_m_auctions;

    function thrownft(address nft,uint256 tokenid)public contract_invocation_lock{
        if(ERC165(nft).supportsInterface(ERC721type)){
            IERC721(nft).transferFrom(msg.sender,address(nftstorage),tokenid);
        }else if(ERC165(nft).supportsInterface(ERC1155type)){
            IERC1155(nft).safeTransferFrom(msg.sender,address(nftstorage),tokenid,0,"");
        }else{
            require(false,"This is not an NFT that can be verified through the interface");
        }
        auctionadd(nft,tokenid);
        rubbishcoin.Ownermint(msg.sender,uint256(random.getrandom())%baserandom+baseget);
    }
    function auctionadd(address nft,uint256 tokenid)private{
        uint256 NO = auctions.length;
        auction memory nowauction = auction(false,nft,tokenid,block.timestamp,baseauction,address(0));
        auctions.push(nowauction);
        m_auctions[m_auction_l]=NO;
        t_m_auctions[NO]=m_auction_l;
        m_auction_l++;


    }
    function auctiondel(uint256 order)private{
        uint256 NO = m_auction_l-1;
        auctions[m_auctions[order]].finish=true;
        if(order!=NO){
            m_auctions[order]=m_auctions[NO];
            t_m_auctions[m_auctions[order]]=order;
        }
        delete m_auctions[NO];
        m_auction_l--;
    }

    function nftauction(uint256 trueorder,uint256 tokenamount)public contract_invocation_lock{
        auction storage nowauction = auctions[trueorder];
        if((nowauction.time+auctiontime)<block.timestamp){
            require(nowauction.auctioner!=address(0),"Unmanned auction");
            nftstorage.withdrawnft(nowauction.nft,nowauction.tokenid,nowauction.auctioner);
        }else{
            require(nowauction.amount<tokenamount,"Under bid");
            rubbishcoin.Ownermint(nowauction.auctioner,nowauction.amount);
            rubbishcoin.Ownerburn(msg.sender,tokenamount);
            nowauction.auctioner=msg.sender;
            nowauction.amount=tokenamount;
        }
        auctiondel(t_m_auctions[trueorder]);
    }
    

    modifier contract_invocation_lock(){
        require(msg.sender.code.length==0);
        _;
    }
}
