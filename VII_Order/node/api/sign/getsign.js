const { ecsign } = require('ethereumjs-util');
const ethers = require("ethers");
const {getPermitDigest} = require('./VII_order_sign')
const secret = require('../../../../../privateinfo/.secret.json');
const {getcontractinfo}=require('../../nodetool/readcontracts');

exports.getsign = async function getsign(order,amount,deadline){

    const contractinfo = await getcontractinfo();
    let name="VII_order";
    let address=contractinfo.address;
    let chainId=contractinfo.network.chainId;

    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let add = account._signingKey().privateKey;
    const ownerPrivateKey = Buffer.from(add.slice(2), 'hex')
    // 获取加密信息
    const digest = getPermitDigest(
        name, address, chainId,
        order,amount,deadline
    )
    // get vrs
    let { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), ownerPrivateKey)
    
    return {v,r,s};
}