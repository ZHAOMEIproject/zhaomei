// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const {getcontractinfo}=require('../nodetool/readcontracts');
const ethers = require('ethers');
const secret = require('../../../../privateinfo/.secret.json');

exports.contractapi = router.get("/getsign", async (req, res) => {
    var params = url.parse(req.url, true).query;
    
    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.TB_order.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.TB_order.address, 
        contractinfo.TB_order.abi, 
        provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    if(params.params.length>0){
         tx = await contractWithSigner[params.fun](params.params);
    }
    tx = await contractWithSigner[params.fun]();
    
    res.send({
        success:true,
        account:account.address,
        data:{
            result:tx
        },
    });
    return;
});