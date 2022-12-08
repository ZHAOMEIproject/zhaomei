const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const {getsign}=require("../../api/sign/getsign");
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
let provider=new ethers.providers.JsonRpcProvider(secret.url);

let typemint=0;
let mintnumber=0;
main();
async function main(){
    // await creat_q_account()
    // console.log("creat end");

    // await locaton_transfer()
    // console.log("eth transfer end");

    // await check()
    // console.log("mint end");
    // await mint()
    // console.log("mint end");
    // await transfer()
    // console.log("transfer end");
}
async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    // 机构地址
    for (let k = 0; k < 20; k++) {
        var path = "m/44'/60'/1'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            50,
            1669579200,
            0,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
    }
    await jsonFile.writeFile("./OG.json",accounts,{ spaces: 2, EOL: '\r\n' });
    accounts=new Object();
    for (let k = 0; k < 1000; k++) {
        var path = "m/44'/60'/2'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            2,
            1669579200,
            0,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
    }
    await jsonFile.writeFile("./WL.json",accounts,{ spaces: 2, EOL: '\r\n' });
}

async function OGmint(){

}


async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}