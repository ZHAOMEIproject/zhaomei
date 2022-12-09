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
    // await locaton_transfer();
    await OGmint(0,50);
}
async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    let accounts_k=new Object();
    // 机构地址
    for (let k = 0; k < 20; k++) {
        var path = "m/44'/60'/1'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        // console.log(account._signingKey().privateKey);
        // return
        let address650=[
            account.address,
            50,
            9999999999,
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
        accounts_k[account.address]=account._signingKey().privateKey;
    }
    await jsonFile.writeFile("./OG.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFile("./OG_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
    // accounts=new Object();
    // accounts_k=new Object();
    // for (let k = 0; k < 500; k++) {
    //     var path = "m/44'/60'/2'/0/"+k;// 第99号钱包
    //     const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    //     let address650=[
    //         account.address,
    //         2,
    //         9999999999,
    //         0,
    //     ]
    //     let signinfo650 = await getsign(
    //         chainId,contractname,
    //         address650
    //     )
    //     accounts[account.address]=[
    //         ...address650,
    //         ...Object.values(signinfo650)
    //     ]
    //     accounts_k[account.address]=account._signingKey().privateKey;
    // }
    // await jsonFile.writeFile("./WL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    // await jsonFile.writeFile("./WL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
}
async function locaton_transfer(){
    var path = "m/44'/60'/0'/0/0";// 第0号钱包
    // const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    // npx hardhat node
    let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    // console.log(wallet.address);
    // return
    // let wallet = await account.connect(provider);
    let signinfo = await jsonFile.readFile("./OG.json");
    // let signinfo = await jsonFile.readFile("./WL.json");

    let nonce = await wallet.getTransactionCount();
    // console.log(nonce);
    // return;
    // tx={
    //     to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    //     value:ethers.utils.parseEther("10"),
    //     nonce:nonce++,
    // }
    // wallet.sendTransaction(tx)
    // tx={
    //     to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    //     value:ethers.utils.parseEther("10"),
    //     nonce:nonce++,
    // }
    // wallet.sendTransaction(tx)
    // for (let i = 0; i < 10; i++) {
    // }
    for (let i in signinfo) {
        tx={
            // to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
            to:i,
            value:ethers.utils.parseEther("10"),
            nonce:nonce++,
        }
        // await wallet.sendTransaction(tx)
        wallet.sendTransaction(tx)
        // console.log(nonce);
        // await wait(100);
    }
}
async function OGmint(typemint,mintnumber){
    if (typemint!=0&&mintnumber%50!=0) {
        console.log("error typemint or error mintnumber");
    }
    let value = 0.05;
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    // console.log(contractinfo);
    // return;
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFile("./OG.json");
    let keyinfo = await jsonFile.readFile("./OG_k.json");
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber-=50;
        if (mintnumber<0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        try {
            let input = [signinfo[wallet.address],signinfo[wallet.address][1]];
            // console.log(input);
            // console.log("123",tx.toString(10),tx2);
            let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
                ...input,
                {value:ethers.utils.parseEther((value*signinfo[wallet.address][1]).toString())}
            );
            tx = contractWithSigner[baseinfo.fun](
                ...input,
                {value:ethers.utils.parseEther((value*signinfo[wallet.address][1]).toString())}
            )
        } catch (error) {
            console.log(error);
        }
        delete keyinfo[i];
        await jsonFile.writeFile("./OG_k.json",keyinfo,{ spaces: 2, EOL: '\r\n' });
    }
}


async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}