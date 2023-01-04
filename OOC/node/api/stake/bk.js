// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

module.exports = router;
// const mysql = require("mysql2");
// const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");

exports.getinfo = router.get("/getinfo", async (req, res) => {

    res.send({
        success:false,
        error:"error call"
    });
    return;
})
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
const ethers = require('ethers');
const secret = global.secret;

exports.tokenidtostake = router.post("/tokenidtostake", async (req, res) => {
    var params = req.body;
    
    let check =["address","tokenids"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        await contractset();
        let results =await checkstake(params.tokenids);
        // console.log(results);
        for (let i = 0; i < results.length; i++) {
            results[i]=results[i].toString();
        }
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            if (element==0) {
                res.send({
                    success:true,
                    data:{
                        success:false,
                        error:"A tokenid is not in the stack",
                        "stakes":results
                    }
                });
                return
            }
        }
        res.send({
            success:true,
            data:{
                success:true,
                "stakes":results
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            error:"error call"
        });
    }
    return;
})

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
async function checkstake(tokenids){
    try {
        tokenids=JSON.parse(tokenids);
    } catch (error) {
    }
    // console.log(tokenids);
    let tasks=new Array();
    for (let i in tokenids) {
        tasks.push(contractWithSigner["locktime"](tokenids[i]));
    }
    let results =await Promise.all(tasks);
    return results;
}
async function checkaddress(tokenids){
    try {
        tokenids=JSON.parse(tokenids);
    } catch (error) {
    }
    // console.log(tokenids);
    let tasks=new Array();
    for (let i in tokenids) {
        tasks.push(contractWithSigner["ownerOf"](tokenids[i]));
    }
    let results =await Promise.all(tasks);
    return results;
}
async function checkstakeandaddress(tokenids,address){
    try {
        tokenids=JSON.parse(tokenids);
    } catch (error) {
    }
    let [stakeres,ownerres] =await Promise.all([checkstake(tokenids),checkaddress(tokenids)]);
    for (let i = 0; i < stakeres.length; i++) {
        const element = array[i];
        
    }
    return results;
}

exports.addtostakenft = router.post("/addtostakenft", async (req, res) => {
    var params = req.body;
    
    let check =["address","blocktime"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let results = await stakenft(params.address,params.blocktime)
        res.send({
            success:true,
            data:{
                success:true,
                "stakes":results
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            error:"error call"
        });
    }
    return;
})
async function stakenft(address,blocktime){
    let sqlstr="select * from OOC where event_name='locknft' and data0=? and data3<=?";
    // console.log(address,blocktime);
    let sqlres=await sql.sqlcall(sqlstr,[address,blocktime]);
    // console.log(sqlres);
    for (let i = 0; i < sqlres.length; i++) {
        sqlres[i]["address"]=sqlres[i].data0;
        sqlres[i]["tokenid"]=sqlres[i].data1;
        sqlres[i]["locktype"]=sqlres[i].data2;
        sqlres[i]["blocktime"]=sqlres[i].data3;
    }
    return sqlres;
}



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