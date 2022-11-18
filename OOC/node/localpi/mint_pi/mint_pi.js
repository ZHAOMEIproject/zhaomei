const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
main();
async function main(){
    let account = await getaccount();
    console.log(account);
}

async function bnb_out(client,address,coin,amount){
    await client.withdraw(
        coin,address,amount
    );
}

async function getaccount(){
    var path = "m/44'/60'/0'/9/9";// 第99号钱包
    const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    return account;
}