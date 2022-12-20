const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const { getsign } = require("../../api/sign/getsign");
const { getcontractinfo } = require('../../nodetool/id-readcontracts');
let provider = new ethers.providers.JsonRpcProvider(secret.url);

let typemint = 1;
let time = 60 * 1000;
let value = 0.05;
let mintamount = 50;
let mint_50_fee = 22 * 21000;
let secret_key = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

main();
async function main() {
    // await creat_q_account()
    // console.log("creat end");
    // 测试使用的提现eth，用上面secret_key对应的账号进行发钱。
    // await test_transfer_50()
    // 币安提现eth
    // await bnb_transfer_50()
    // console.log("transfer end");
    // // 执行mint
    await OGmint()
    // console.log("OGmint end");
    // // 转移给匿名博士
    // await transfer()
    // console.log("transfer end");

}

async function creat_q_account() {
    let accounts = new Object();
    let chainId = secret.baseinfo.chainId;
    let contractname = secret.baseinfo.contractname;
    let accounts_k = new Object();

    // 机构地址
    for (let k = 0; k < 70; k++) {
        var path = "m/44'/60'/1'/1/" + k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        // console.log(account._signingKey().privateKey);
        // return
        let address650 = [
            account.address,
            mintamount,
            secret.baseinfo.blocktime,
            0,
        ]
        let signinfo650 = await getsign(
            chainId, contractname,
            address650
        )
        accounts[account.address] = [
            ...address650,
            ...Object.values(signinfo650)
        ]
        accounts_k[account.address] = account._signingKey().privateKey;
        console.log(k);
    }
    await jsonFile.writeFileSync("./key_sign/OG.json", accounts, { spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/OG_k.json", accounts_k, { spaces: 2, EOL: '\r\n' });
}

// async function bnb_out(client,address,coin,amount){
//     await client.withdraw(
//         coin,address,amount
//     );
// }
async function bnb_transfer_50() {
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./key_sign/OG.json");
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    let amount = (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_50_fee)).toString();
    console.log(amount);
    // return
    for (let i in signinfo) {
        await bnb_out(client, i, "ETH", amount)
        console.log(i);
    }
}
async function test_transfer_50() {
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./key_sign/OG.json");

    let wallet = new ethers.Wallet(secret_key, provider);
    let nonce = await wallet.getTransactionCount();
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    let amount = (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_50_fee)).toString();
    for (let i in signinfo) {
        let tx = {
            to: i,
            value: amount,
            nonce: nonce++
        }
        wallet.sendTransaction(tx)
        console.log(i);
    }
}

async function OGmint() {
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
    let length = Object.values(signinfo).length;
    let keyinfo = await jsonFile.readFileSync("./key_sign/OG_k.json");
    let mint_endinfo = await jsonFile.readFileSync("./mint_endinfo.json");
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    for (let i in signinfo) {
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            1,
            ...input,
            {
                value: e_value,
                gasPrice: secret.baseinfo.gasprice
            }
        );
        // console.log(estimateGas);
        tx = await contractWithSigner[baseinfo.fun](
            1,
            ...input,
            {
                value: e_value,
                gasPrice: secret.baseinfo.gasprice
            }
        )

        delete signinfo[i];
        await jsonFile.writeFileSync("./key_sign/OG.json", signinfo, { spaces: 2, EOL: '\r\n' });
        console.log(time / length);
        await wait(time / length);
        let endinfo = await tx.wait();
        mint_endinfo[wallet.address] = endinfo.events[0].args[2].toNumber();
        // break;
        await jsonFile.writeFileSync("./mint_endinfo.json", mint_endinfo, { spaces: 2, EOL: '\r\n' });
        console.log(i);
    }
}
async function transfer(wallet) {
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let mint_endinfo = await jsonFile.readFileSync("./mint_endinfo.json");
    let keyinfo = await jsonFile.readFileSync("./key_sign/OG_k.json");

    for (let i in mint_endinfo) {
        // for (let k = 0; k < 1; k++) {
        if (keyinfo[i] != null) {
            let wallet = new ethers.Wallet(keyinfo[i], provider);
            let contractWithSigner = contract.connect(wallet);
            let estimateGas = await contractWithSigner.estimateGas.accountTransfer(
                baseinfo.niming, mint_endinfo[wallet.address],
                {
                    gasPrice: secret.baseinfo.gasprice
                }
            );
            tx = await contractWithSigner.accountTransfer(
                baseinfo.niming, mint_endinfo[wallet.address],
                {
                    gasPrice: secret.baseinfo.gasprice
                }
            );
        }
        delete mint_endinfo[i];
        await jsonFile.writeFileSync("./mint_endinfo.json", mint_endinfo, { spaces: 2, EOL: '\r\n' });
        console.log(i);
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}