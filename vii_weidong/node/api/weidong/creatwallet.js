const { ethers } = require("ethers");
const bip39 = require('bip39');
async function creatwallet(userid,path) {
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    let baseinfo = userid+'715677771567777156777';
    let hash= md5.update(baseinfo).digest('hex');
    let mnemonic = bip39.entropyToMnemonic(hash);
    var basepath = "m/44'/60'/0'/0/"+path;
    let account = await ethers.Wallet.fromMnemonic(mnemonic, basepath);
    return account
}


module.exports ={
    creatwallet
}