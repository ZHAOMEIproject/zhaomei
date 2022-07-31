const {getcontractinfo}=require('../nodetool/readcontracts');
const ethers = require('ethers');
const secret = require('../../../../privateinfo/.secret.json');
web3test();
// exports.web3test = 
async function web3test(){

    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.mainwithdraw.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.mainwithdraw.address, 
        contractinfo.mainwithdraw.abi, 
        provider
    );

    let contractWithSigner = contract.connect(wallet);
    let tx = await contractWithSigner["MANAGE_ROLE"]();
    // console.log(tx.hash);
    // await tx.wait();
    console.log(tx);
}