const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const {getsign}=require("../../api/sign/getsign");
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
let provider=new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

main();
async function main(){
    // await creat_q_account()
    // console.log("creat end");
    // await locaton_transfer()
    // console.log("eth transfer end");
    await mint()
    console.log("mint end");
}

// async function bnb_out(client,address,coin,amount){
//     await client.withdraw(
//         coin,address,amount
//     );
// }

async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    // 国库
    var path = "m/44'/60'/0'/0/0";// 第0号钱包
    const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    let address1=[
        account.address,
        "0x0000000000000000000000000000000000000000",
        500,
        0,
        1669579200,
    ]
    let signinfo1 = await getsign(
        chainId,contractname,
        address1
    )
    // console.log(...Object.values(signinfo1));
    // return
    accounts[account.address]=[
        address1,
        ...Object.values(signinfo1),
        500
    ]
    // 自留地址
    for (let k = 1; k < 651; k++) {
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            "0x0000000000000000000000000000000000000000",
            2,
            0,
            1669579200,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            address650,
            ...Object.values(signinfo650),
            500
        ]
    }
    // 机构地址
    for (let k = 651; k < 721; k++) {
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            "0x0000000000000000000000000000000000000000",
            50,
            0,
            1669579200,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            address650,
            ...Object.values(signinfo650),
            50
        ]
    }
    await jsonFile.writeFile("./accounts.json",accounts,{ spaces: 2, EOL: '\r\n' });
}

async function locaton_transfer(){
    var path = "m/44'/60'/0'/0/0";// 第0号钱包
    const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    // npx hardhat node
    let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    // let wallet = await account.connect(provider);
    let signinfo = await jsonFile.readFile("./accounts.json");
    tx={
        to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
        value:ethers.utils.parseEther("0.1"),
    }
    await wallet.sendTransaction(tx)
    
    for (let i in signinfo) {
        tx={
            // to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
            to:i,
            value:ethers.utils.parseEther("0.01"),
        }
        await wallet.sendTransaction(tx)
    }

}



async function mint(){
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].network.url
    );
    let tx;
    let signinfo = await jsonFile.readFile("./accounts.json");
    // for (let k = 0; k < 721; k++) {
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const wallet = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let contractWithSigner = contract.connect(wallet);
        try {
            tx = await contractWithSigner.estimateGas[baseinfo.fun](signinfo[wallet.address],{...baseinfo.options});
        } catch (error) {
            console.log(error);
        }
        tx.wait();

        console.log(tx);
    // }

}

async function transfer(wallet){
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].network.url
    );
    let tx;
    let signinfo = jsonFile.readFile("./accounts.json");
    for (let k = 0; k < 721; k++) {
        var path = "m/44'/60'/0'/0/"+k;// 第99号钱包
        const wallet = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let contractWithSigner = contract.connect(wallet);
        try {
            tx = await contractWithSigner.estimateGas.safeTransferFrom(wallet.address,baseinfo.niming);
        } catch (error) {
            console.log(error);
        }
        console.log(tx);
    }
}