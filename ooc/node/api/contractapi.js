// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const {getcontractinfo}=require('../nodetool/id-readcontracts');
const ethers = require('ethers');
const secret = require('../../../../privateinfo/.secret.json');

exports.contractinfo = router.get("/", async (req, res) => {
    const contractinfo = await getcontractinfo();
    res.send({
        success:true,
        data:{
            contractinfo:contractinfo
        },
    });
    return;
});

exports.contractapi = router.get("/read", async (req, res) => {
    var params = url.parse(req.url, true).query;
    
    let check =["id","contractname","fun","params"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    params.params= JSON.parse(params.params);
    let result = await readcontracts(params)
    
    
    res.send({
        ...result
    });
    return;
});

exports.readcontracts = readcontracts;

async function readcontracts(params){
    let id = params.id;
    let contractname = params.contractname;

    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(contractinfo[id][contractname].network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo[id][contractname].address, 
        contractinfo[id][contractname].abi, 
        provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;

    try {
        if(params.params.length>0){
            tx = await contractWithSigner[params.fun](...params.params);
        }else{
            tx = await contractWithSigner[params.fun]();
        }
    } catch (error) {
        console.log(error);
        return {
            success:false,
            account:account.address,
            data:{
                result:tx
            },
        }
        // res.send({
        //     success:false,
        //     account:account.address,
        //     data:{
        //         result:tx
        //     },
        // });
    }
    
    return {
        success:true,
        account:account.address,
        data:{
            result:tx
        },
    }
}
// module.exports = {
//     readcontracts
// }