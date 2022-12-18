const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const { getsign } = require("../../api/sign/getsign");
const { getcontractinfo } = require('../../nodetool/id-readcontracts');
let provider = new ethers.providers.JsonRpcProvider(secret.url);

let typemint = 0;
let time = 60 * 1000;
let value = 0.05;
let mintamount = 2;
let mint_2_fee = 8 * 21000;
let secret_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
let opensea = "0x1E0049783F008A0085193E00003D00cd54003c71";
main();
async function main() {
    // await creat_q_account()
    // console.log("creat end");
    // 测试使用的提现eth，用上面secret_key对应的账号进行发钱。
    // await test_transfer_2()
    // 币安提现eth
    // await bnb_transfer_2()
    // console.log("transfer end");
    // // 执行mint
    // await WLmint()
    // console.log("WLmint end");
    // 批量授权opensea
    // await p_Approval()
    // console.log("p_Approval end");

}

async function creat_q_account() {
    let accounts = new Object();
    let chainId = secret.baseinfo.chainId;
    let contractname = secret.baseinfo.contractname;
    let accounts_k = new Object();

    // 机构地址
    for (let k = 0; k < 650; k++) {
        var path = "m/44'/60'/2'/1/" + k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        // console.log(account._signingKey().privateKey);
        // return
        let address62 = [
            account.address,
            mintamount,
            secret.baseinfo.blocktime,
            typemint,
        ]
        let signinfo62 = await getsign(
            chainId, contractname,
            address62
        )
        accounts[account.address] = [
            ...address62,
            ...Object.values(signinfo62)
        ]
        accounts_k[account.address] = account._signingKey().privateKey;
        console.log(k);
    }
    await jsonFile.writeFileSync("./key_sign/WL.json", accounts, { spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFileSync("./key_sign/WL_k.json", accounts_k, { spaces: 2, EOL: '\r\n' });
}

// async function bnb_out(client,address,coin,amount){
//     await client.withdraw(
//         coin,address,amount
//     );
// }
async function bnb_transfer_2() {
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./key_sign/WL.json");
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    let amount = (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_2_fee)).toString();
    console.log(amount);
    // return
    for (let i in signinfo) {
        await bnb_out(client, i, "ETH", amount)
        console.log(i);
    }
}
async function test_transfer_2() {
    const client = new Spot(secret.apiKey, secret.apiSecret);
    let signinfo = await jsonFile.readFileSync("./key_sign/WL.json");

    let wallet = new ethers.Wallet(secret_key, provider);
    let nonce = await wallet.getTransactionCount();
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    let amount = (Number(e_value) + Math.floor(secret.baseinfo.gasprice * mint_2_fee)).toString();
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

async function WLmint() {
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
    let length = Object.values(signinfo).length;
    let keyinfo = await jsonFile.readFileSync("./key_sign/WL_k.json");
    let e_value = ethers.utils.parseEther((value * mintamount).toString());
    for (let i in signinfo) {
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        try {
            let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
                1,
                ...input,
                {
                    value: e_value,
                    gasPrice: secret.baseinfo.gasprice
                }
            );
        } catch (error) {
            console.log("error",i);
            continue;
        }
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
        await jsonFile.writeFileSync("./key_sign/WL.json", signinfo, { spaces: 2, EOL: '\r\n' });
        console.log(time / length);
        await wait(time / length);
        console.log(i);
        // break;
    }
}
async function p_Approval() {
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let keyinfo = await jsonFile.readFileSync("./key_sign/WL_k.json");

    for (let i in keyinfo) {
        // for (let k = 0; k < 1; k++) {
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);
        let flag = await contractWithSigner.isApprovedForAll(
            wallet.address,opensea,
        );
        if (flag) {
            continue;
        }
        let estimateGas = await contractWithSigner.estimateGas.setApprovalForAll(
            opensea, true,
            {
                gasPrice: secret.baseinfo.gasprice
            }
        );
        tx = await contractWithSigner.setApprovalForAll(
            opensea, true,
            {
                gasPrice: secret.baseinfo.gasprice
            }
        );

        console.log(i);
    }
}
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}