const hre = require("hardhat");
const { getcontractinfo } = require('./tool/id-readcontracts');

// 测试的help文档
// require('./help.js')

// npx hardhat run testscripts/trantest.js --network checketh
// 加载别的钱包
var path = "m/44'/60'/0'/9/9";// 第99号钱包
var secret = require("../../../../privateinfo/.secret.json");// 载入助记词
const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
var contractinfo = new Object();

async function main() {
    let [owner, addr1, addr2] = await ethers.getSigners();
    console.log(await ethers.provider.getBalance(addr2.address));
    await addr2.sendTransaction({
        to: addr2.address,
        value: 0
    })



}

async function contractcall(signingKey, chainId, contractname, fun, params) {
    let provider = new ethers.providers.JsonRpcProvider(contractinfo[chainId][contractname].network.url);
    let wallet = new ethers.Wallet(signingKey, provider);
    let contract = new ethers.Contract(
        contractinfo[chainId][contractname].address,
        contractinfo[chainId][contractname].abi,
        provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    if (params.length > 0) {
        // tx = await contractWithSigner[fun](...params);
        // console.log(...params);
        tx = await contractWithSigner[fun](...params);
    } else {
        tx = await contractWithSigner[fun]();
    }
    return tx
}
function contractadd(newontract) {
    contractinfo[newontract.network.chainId.toString()][newontract.contractName] = newontract;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });




const request = require("request");
function getbyurl(url) {
    return new Promise(function (resolve, reject) {
        request({
            timeout: 10000,    // Set timeout
            method: 'GET',     // Set method
            url: url
        }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // let json = JSON.parse(body);
                resolve(body);
            } else {
                resolve();
            }
        })
    })
}