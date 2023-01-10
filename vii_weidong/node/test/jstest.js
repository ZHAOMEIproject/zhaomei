const { ethers } = require("ethers");
let bip39 = require('bip39');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
main()

async function main() {
    let baseinfo = '13662867868'+'715677771567777156777';
    let hash= md5.update(baseinfo).digest('hex');
    console.log(hash);
    // let mnemonic = bip39.entropyToMnemonic('13662867868'+'715677771567777156777')
    // let path="0";
    // var basepath = "m/44'/60'/0'/0/"+path;
    // let account = ethers.Wallet.fromMnemonic(mnemonic, basepath);
    // console.log(account.address,await account._mnemonic().phrase);
}