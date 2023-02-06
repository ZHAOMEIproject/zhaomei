const { ethers } = require("ethers");
let bip39 = require('bip39');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
let poapcontractinfo = {
    address:"0xD5e264f146661797FF7F849A56eF4CD13a5432b9",
    erc:"erc1155",
    chainid:"1030",
    chainname:"Conflux eSpace",
    blockrpc:"https://evm.confluxrpc.com",
    blockexplorer:"https://evm.confluxscan.net"

}
main()

async function main() {
    console.log({poapcontractinfo:
        {
            ...poapcontractinfo,
            nftlink:(poapcontractinfo.blockexplorer+"/nft/"+poapcontractinfo.address+"/"+159753)
        }
    });
}