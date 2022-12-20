const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const {getsign}=require("../../api/sign/getsign");
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
let provider=new ethers.providers.JsonRpcProvider(secret.url);

let typemint=3;
let mintnumber=2500;

let mint_OG_fee = 207983 + 3 * 21000;
let mint_WL_fee = 102118 + 3 * 21000;
let mint_PL_fee = 102118 + 3 * 21000;
// 发钱账号的密钥
let secret_key="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
main();
async function main(){
    // await creat_q_account()
    // await OGmint(typemint, mintnumber);
    // await WLmint(typemint, mintnumber);
    await PLmint(typemint, mintnumber);
}
async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    let accounts_k=new Object();
    // 机构地址
    for (let k = 0; k < 20; k++) {
        var path = "m/44'/60'/3'/1/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        // console.log(account._signingKey().privateKey);
        // return
        let address650=[
            account.address,
            50,
            9999999999,
            1,
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
        console.log(k);
    }
    await jsonFile.writeFileSync("./key_sign/OG.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/OG_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
    accounts=new Object();
    accounts_k=new Object();
    for (let k = 250; k < 750; k++) {
        var path = "m/44'/60'/3'/2/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            2,
            9999999999,
            2,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
        accounts_k[account.address] = account._signingKey().privateKey;
        console.log(k);
    }
    await jsonFile.writeFileSync("./key_sign/WL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/WL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });

    accounts=new Object();
    accounts_k=new Object();
    for (let k = 0; k < 1250; k++) {
        var path = "m/44'/60'/3'/3/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            2,
            9999999999,
            3,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
        accounts_k[account.address] = account._signingKey().privateKey;
        console.log(k);
    }
    await jsonFile.writeFileSync("./key_sign/PL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/PL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
}
async function OGmint(typemint,mintnumber){
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
    let signinfo = await jsonFile.readFileSync("./key_sign/OG.json");
    let keyinfo = await jsonFile.readFileSync("./key_sign/OG_k.json");
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

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        // console.log(input);
        // console.log("123",tx.toString(10),tx2);
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        await simpletransfer(wallet.address, (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_OG_fee)).toString());
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            1,
            ...input,
            { value: e_value }
        );
        tx = contractWithSigner[baseinfo.fun](
            1,
            ...input,
            { value: e_value }
        )

        delete keyinfo[i];
        await jsonFile.writeFileSync("./key_sign/OG_k.json",keyinfo,{ spaces: 2, EOL: '\r\n' });
        console.log(i);
    }
}

async function WLmint(typemint, mintnumber) {
    if (typemint != 2 || mintnumber % 2 != 0) {
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
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber -= 2;
        if (mintnumber < 0) {
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
        await simpletransfer(wallet.address, (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_WL_fee )).toString());
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            1,
            ...input,
            { value: e_value }
        );
        mint(contractWithSigner,input,e_value)
        delete keyinfo[i];
        await jsonFile.writeFileSync("./key_sign/WL_k.json", keyinfo, { spaces: 2, EOL: '\r\n' });
        console.log(i);
    }
}
async function mint(contractWithSigner,input,e_value){
    let tx = await contractWithSigner[secret.baseinfo.fun](
        1,
        ...input,
        {
            value: e_value,
            gasPrice: secret.baseinfo.gasprice
        }
    )
}
async function PLmint(typemint, mintnumber) {
    if (typemint != 3 || mintnumber % 2 != 0) {
        console.log("error typemint or error mintnumber");
        return;
    }
    let value = 0.06;
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    // console.log(contractinfo);
    // return;
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFileSync("./key_sign/PL.json");
    let keyinfo = await jsonFile.readFileSync("./key_sign/PL_k.json");
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber -= 2;
        if (mintnumber < 0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);
        
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        let gasprice = await provider.getGasPrice();
        await simpletransfer(wallet.address, (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_PL_fee)).toString());
        // return;
        // console.log(signinfo[wallet.address][1], e_value.toString(10));
        // return
        let estimateGas = await contractWithSigner.estimateGas["Public_mint"](
            1,
            signinfo[wallet.address][1],
            { value: e_value }
        );
        tx = contractWithSigner["Public_mint"](
            1,
            signinfo[wallet.address][1],
            { value: e_value }
        )

        delete keyinfo[i];
        await jsonFile.writeFileSync("./key_sign/PL_k.json", keyinfo, { spaces: 2, EOL: '\r\n' });
        console.log(i);
    }
}

async function simpletransfer(address,value){
    let wallet = new ethers.Wallet(secret_key, provider);
    let tx = {
        to: address,
        value: value,
    }
    await wallet.sendTransaction(tx)
}
