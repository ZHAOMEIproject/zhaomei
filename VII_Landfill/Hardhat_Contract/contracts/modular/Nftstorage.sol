// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../ZM_tool/ZMMainControl.sol";

contract Nftstorage is ZMMainControl{
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    constructor(){
        address withdraw=msg.sender;
        _grantRole(WITHDRAW_ROLE, withdraw);
    }
    bytes4 constant ERC721type = type(IERC721).interfaceId;
    bytes4 constant ERC1155type = type(IERC1155).interfaceId;
    function withdrawnft(address nft,uint256 tokenid,address to)public onlyRole(WITHDRAW_ROLE){
        if(ERC165(nft).supportsInterface(ERC721type)){
            IERC721(nft).transferFrom(address(this),to,tokenid);
            nft721 = true;
        }else if(ERC165(nft).supportsInterface(ERC1155type)){
            IERC1155(nft).safeTransferFrom(address(this),to,tokenid,0,"");
        }else{
            require(false,"This is not an NFT that can be verified through the interface");
        }
    }
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 amount,
        bytes memory data
    )public pure returns(bytes4){
        {operator;from;id;amount;data;}
        return IERC1155Receiver.onERC1155Received.selector;
    }
}