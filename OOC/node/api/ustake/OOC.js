// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

module.exports = router;
// const mysql = require("mysql2");
// const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");
exports.accstakeamount = router.post("/accstakeamount", async (req, res) => {
    var params = req.body;
    let check =["address"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let results = await getaccountnft(params.address)
        let time = parseInt(new Date()/1000);
        let amount=0;
        for (let i in results.nft) {
            if (results.nft[i].locktime>time) {
                amount++;
            }
        }
        res.send({
            success:true,
            data:{
                success:true,
                "stakeamount":amount
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success:true,
            data:{
                success:false,
                error:error
            }
        });
    }
    return;
})

const createKeccakHash = require('keccak')

function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

async function getstakeamount(address,blocktime){
    let sqlstr="select count(*) as amount  from OOC where event_name='locknft' and data0=? and data3>=?";
    let sqlres=await sql.sqlcall(sqlstr,[address,blocktime]);
    // console.log(address,blocktime,sqlres);
    return sqlres[0].amount;
}
exports.getstakenft = router.post("/getstakenft", async (req, res) => {
    var params = req.body;
    let check =["address"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let results = await getstakenft(toChecksumAddress(params.address),parseInt(new Date()/1000))
        res.send({
            success:true,
            data:{
                success:true,
                "stakeamount":results
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success:true,
            data:{
                success:false,
                error:error
            }
        });
    }
    return;
})

async function getstakenft(address,blocktime){
    let sqlstr="select * from OOC where event_name='locknft' and data0=? and data3>=?";
    let sqlres=await sql.sqlcall(sqlstr,[address,blocktime]);
    // console.log(address,blocktime,sqlres);
    for (let i = 0; i < sqlres.length; i++) {
        sqlres[i]["address"]=sqlres[i].data0;
        sqlres[i]["tokenid"]=sqlres[i].data1;
        sqlres[i]["locktype"]=sqlres[i].data2;
        sqlres[i]["blocktime"]=sqlres[i].data3;
    }
    return sqlres;
}

const {getcontractinfo}=require('../../nodetool/id-readcontracts');
const ethers = require('ethers');
const secret = global.secret;
contractset();
async function contractset(){
    const contractinfo = await getcontractinfo();
    let oocinfo;
    for (let i in contractinfo) {
        oocinfo = contractinfo[i]["OOC"];
        break;
    }
    var path = "m/44'/60'/9'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(oocinfo.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        oocinfo.address, 
        oocinfo.abi, 
        provider
    );
    global.contractWithSigner = contract.connect(wallet);
}
async function getaccountnft(address){
    let results =new Object();
    let nftbalance = await contractWithSigner["balanceOf"](address);
    results["balanceOf"]=nftbalance.toString();
    if (nftbalance==0) {
        return results;
    }
    let tasks=new Array();
    for (let i = 0; i < nftbalance; i++) {
        tasks.push(contractWithSigner["tokenOfOwnerByIndex"](address,i));
    }
    let tokenids =await Promise.all(tasks);
    tasks=new Array();
    for (let i = 0; i < tokenids.length; i++) {
        // console.log(tokenids[i].toString());
        tasks.push(contractWithSigner["locktime"](tokenids[i]));
    }
    let locktimes =await Promise.all(tasks);
    results["nft"]=new Array();
    for (let i = 0; i < locktimes.length; i++) {
        results["nft"][i]={
            "tokenid":tokenids[i].toString(),
            "locktime":locktimes[i].toString()
        }
    }
    return results;
}
exports.accnft = router.post("/accnft", async (req, res) => {
    var params = req.body;
    let check =["address"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let results = await getaccountnft(params.address)
        res.send({
            success:true,
            data:{
                success:true,
                stakes:results
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success:true,
            data:{
                success:false,
                error:error
            }
        });
    }
    return;
    }
)