const { ecsign } = require('ethereumjs-util');
const ethers = require("ethers");
const {getPermitDigest} = require('./OOC')
const secret = require('../../../../../privateinfo/.secret.json');
const {getcontractinfo}=require('../../nodetool/id-readcontracts');

exports.getsign = async function getsign(id,contractname,params){

    const contractinfo = await getcontractinfo();
    let name="Odd_Owl_Club";
    // console.log(contractinfo,id,contractname);
    let address=contractinfo[id][contractname].address;
    let chainId=id

    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log(account.address);
    let add = account._signingKey().privateKey;
    const ownerPrivateKey = Buffer.from(add.slice(2), 'hex')
    // 获取加密信息
    const digest = getPermitDigest(
        name, address, chainId,
        params
    )
    // get vrs
    let { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), ownerPrivateKey)
    let sign= "0x" + r.toString('hex')+s.toString('hex')+v;

    r = '0x' + sign.substring(2).substring(0, 64);
    s = '0x' + sign.substring(2).substring(64, 128);
    v =  sign.substring(2).substring(128, 130);

    return {v,r,s};
}