const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");

main();
async function main(){

}

async function bnb_out(client,address,coin,amount){
    await client.withdraw(
        coin,address,amount
    );
}

async function getaccount(){
    var path = "m/44'/60'/0'/9/9";// 第99号钱包
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
}