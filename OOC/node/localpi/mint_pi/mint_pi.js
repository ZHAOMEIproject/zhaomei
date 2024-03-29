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

async function b_main(){
    // // 创建账号和签名
    // await creat_q_account()
    // console.log("creat end");
    // // 币安提现eth
    // await bnb_transfer()
    // console.log("creat end");
    // // 执行mint
    // await mint()
    // console.log("mint end");
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
    for (let k = 0; k < 50; k++) {
        var path = "m/44'/60'/1'/1/"+k;// 第99号钱包
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
    await jsonFile.writeFileSync("./key_sign/OG.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/OG_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
    accounts=new Object();
    accounts_k=new Object();
    for (let k = 0; k < 650; k++) {
        var path = "m/44'/60'/1'/2/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
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

async function locaton_transfer(){
    var path = "m/44'/60'/0'/0/0";// 第0号钱包
    const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    // npx hardhat node
    let wallet = new ethers.Wallet(secret_key, provider);
    // console.log(wallet.address);
    // return
    // let wallet = await account.connect(provider);
    let signinfo = await jsonFile.readFileSync("./accounts.json");

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
    // for (let i in signinfo) {
    //     tx={
    //         // to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    //         to:i,
    //         value:ethers.utils.parseEther("0.001"),
    //         nonce:nonce++,
    //     }
    //     // await wallet.sendTransaction(tx)
    //     wallet.sendTransaction(tx)
    //     console.log(nonce);
    //     // await wait(100);
    // }

}
// bnb_out(client,)
// async function bnb_out(client,address,coin,amount){
//     await client.withdraw(
//         coin,address,amount
//     );
// }
async function bnb_transfer(){
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./accounts.json");
    for (let i in signinfo) {
        await bnb_out(client,i,"ETH","0")
    }
}
async function check(){
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFileSync("./accounts.json");
    for (let k = 0; k < 1; k++) {
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let wallet = new ethers.Wallet(account._signingKey(), provider);
    
        let contractWithSigner = contract.connect(wallet);
        // console.log(signinfo[wallet.address][1]);
        try {
            // tx = await contractWithSigner.estimateGas[baseinfo.fun](
            tx = await contractWithSigner.block_timestamp(
                
            );
        } catch (error) {
            console.log(error);
        }

        console.log(tx);
    }
}

async function mint(){
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFileSync("./accounts.json");
    let mint_endinfo = new Object();
    // for (let k = 0; k < 721; k++) {
    for (let k = 0; k < 1; k++) {
        k=12
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let wallet = new ethers.Wallet(account._signingKey(), provider);
    
        let contractWithSigner = contract.connect(wallet);
        // console.log(signinfo[wallet.address][1]);
        try {
            let input = [signinfo[wallet.address],signinfo[wallet.address][2]];
            // console.log(input);
            let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
                ...input,
                {value:ethers.utils.parseEther((baseinfo.value*signinfo[wallet.address][2]).toString())}
            );
            // console.log(baseinfo.value*signinfo[wallet.address][2]);
            tx = await contractWithSigner[baseinfo.fun](
                ...input,
                {value:ethers.utils.parseEther((baseinfo.value*signinfo[wallet.address][2]).toString())}
            );
        } catch (error) {
            console.log(error);
        }
        let endinfo = await tx.wait();
        // console.log(tx);

        // console.log(endinfo.events[0].args[2].toNumber());
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
    
    for (let k = 0; k < 721; k++) {
    // for (let k = 0; k < 1; k++) {
        k=11
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let wallet = new ethers.Wallet(account._signingKey(), provider);
        let contractWithSigner = contract.connect(wallet);
        // console.log(wallet.address,mint_endinfo);
        try {
            tx = await contractWithSigner.accountTransfer(
                baseinfo.niming,mint_endinfo[wallet.address]
            );
        } catch (error) {
            console.log(error);
        }
        console.log(tx);
    }
}
async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}