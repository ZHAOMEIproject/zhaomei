// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const {getcontractinfo}=require('../nodetool/readcontracts');
const ethers = require('ethers');
const secret = require('../../../../privateinfo/.secret.json');

exports.contractapi = router.get("/read", async (req, res) => {
    var params = url.parse(req.url, true).query;
    
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
    let tx = await contractWithSigner[params.fun]();
    // console.log(tx.hash);
    // await tx.wait();
    console.log(tx);
    
    res.send({
        success:tx,
    });
    return;
});