const { ecsign } = require('ethereumjs-util');
const ethers = require("ethers");
const {getPermitDigest} = require('./VII_WITHDRAW_sign')
// const secret = global.secret;
const secret = require('../../../../../privateinfo/.secret.json');
const {getcontractinfo}=require('../../nodetool/id-readcontracts');

exports.getsign = async function getsign(id,contractname,params,privateKey){

    const contractinfo = await getcontractinfo();
    let name="VII_WITHDRAW";
    // console.log(contractinfo,id,contractname);
    let address=contractinfo[id][contractname].address;
    let chainId=id
    if (!privateKey) {
        var path = "m/44'/60'/0'/0/0";
        const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
        // console.log(account.address);
        privateKey = account._signingKey().privateKey;
    }
    
    
    const ownerPrivateKey = Buffer.from(privateKey.slice(2), 'hex')
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