const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");


main();
async function main(){
    let account = await getaccount();
    console.log(account.address);
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
const {getcontractinfo}=require('./tool/id-readcontracts');
async function mint(wallet){
    let baseinfo = secret.basrinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].network.url
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    if(params.length>0){
        // tx = await contractWithSigner[fun](...params);
        // console.log(...params);
        tx = await contractWithSigner[baseinfo.fun](...baseinfo.params,{...baseinfo.options});
    }
}