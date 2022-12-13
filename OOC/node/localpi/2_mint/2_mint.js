const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const {getsign}=require("../../api/sign/getsign");
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
let provider=new ethers.providers.JsonRpcProvider(secret.url);

let typemint=1;
let time=3600;
let secret_key="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

main();
async function main(){
    await creat_q_account()
    // console.log("creat end");
    // // 币安提现eth
    // await bnb_transfer_2()
    // console.log("transfer end");
    // // 执行mint
    // await WLmint()
    // console.log("WLmint end");
    // // 转移给匿名博士
    // await transfer()
    // console.log("transfer end");

}

async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    let accounts_k=new Object();
    
    // 机构地址
    for (let k = 0; k < 650; k++) {
        var path = "m/44'/60'/1'/2/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        // console.log(account._signingKey().privateKey);
        // return
        let address650=[
            account.address,
            2,
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
    await jsonFile.writeFileSync("./key_sign/WL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/WL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
}

// async function bnb_out(client,address,coin,amount){
//     await client.withdraw(
//         coin,address,amount
//     );
// }
async function bnb_transfer_50(){
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./key_sign/WL.json");
    let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
    let gasprice = await provider.getGasPrice();
    let amount = (Number(e_value)+Math.floor(gasprice.toString()*10*21000*1.1)).toString();
    console.log(amount);
    return
    for (let i in signinfo) {
        await locaton_transfer(i,amount);
        // await bnb_out(client,i,"ETH","0")
    }
}
async function locaton_transfer(address,value){
    let wallet = new ethers.Wallet(secret_key, provider);
    let tx = {
        to: address,
        value: value,
    }
    await wallet.sendTransaction(tx)
}
async function WLmint(typemint,mintnumber){
    if (typemint != 1 || mintnumber%50!=0) {
        console.log("error typemint or error mintnumber");
        return;
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
    let signinfo = await jsonFile.readFileSync("./key_sign/WL.json");
    let keyinfo = await jsonFile.readFileSync("./key_sign/WL_k.json");
    let length = Object.keys(keyinfo).length;
    let mint_endinfo = new Object();
    for (let i in signinfo) {
        mintnumber-=50;
        if (mintnumber<0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        // console.log(input);
        // console.log("123",tx.toString(10),tx2);
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        let gasprice = await provider.getGasPrice();
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            ...input,
            { value: e_value }
        );
        tx = contractWithSigner[baseinfo.fun](
            ...input,
            { value: e_value }
        )

        delete signinfo[i];
        await jsonFile.writeFileSync("./key_sign/WL.json",signinfo,{ spaces: 2, EOL: '\r\n' });
        await wait(time/length);
        let endinfo = await tx.wait();
        mint_endinfo[wallet.address]=endinfo.events[0].args[2].toNumber();
    }
    await jsonFile.writeFileSync("./mint_endinfo.json",mint_endinfo,{ spaces: 2, EOL: '\r\n' });
}
async function transfer(wallet){
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let mint_endinfo = await jsonFile.readFileSync("./mint_endinfo.json");
    let keyinfo = await jsonFile.readFileSync("./key_sign/WL_k.json");

    for (let i in mint_endinfo) {
    // for (let k = 0; k < 1; k++) {
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);
        let estimateGas = await contractWithSigner.estimateGas.accountTransfer(
            baseinfo.niming,mint_endinfo[wallet.address]
        );
        tx = await contractWithSigner.accountTransfer(
            baseinfo.niming,mint_endinfo[wallet.address]
        );

        delete mint_endinfo[i];
        await jsonFile.writeFileSync("./key_sign/mint_endinfo.json",mint_endinfo,{ spaces: 2, EOL: '\r\n' });
    }
}

async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}