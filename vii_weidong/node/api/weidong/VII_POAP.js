// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const {sendEmailandto} = require("../../nodetool/email");
const {creatwallet} = require("./creatwallet");

exports.postmint = router.post("/postmint", async (req, res) => {
    var params = req.body;

    let check =["account","tokenid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            data:{
                error:"error params"
            }
        });
        return;
    }
    params.account = toChecksumAddress(params.account);
    let check2 =["key"];
    if(!check2.every(key=>key in params)){
        res.send({
            success:false,
            data:{
                error:"no key"
            }
        });
        return;
    }
    let key_set="dawasdak3jerbjfseijlfjoj3jli32j390(i";
    if (params["key"]!=key_set) {
        res.send({
            success:false,
            data:{
                error:"error key"
            }
        });
        return;
    }


    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }
    let checkorderid ="select * from mint_list where (account,tokenid) in ((?),(?))"
    let orderidsql = await conn.select(checkorderid,[sqlparams,[0,0]])
    // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
    // return
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                error: "110",
                repeat: false,
                errorinfo:"Repeated order submission"
            }
        });
        return;
    }

    let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        // sendEmailandto("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
        data:{
            success:true
        }
    });
    return;
});

var {newcontractcall}=require("../contractcall");
const {getcontractinfo}=require('../../nodetool/readcontracts');
const BigNumber = require("bignumber.js");

exports.checkaccount = router.post("/checkaccount", async (req, res) => {
    var params = req.body;

    let check =["account","tokenid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let data = await getbalanceOf(params.account,params.tokenid);
        // console.log(data);
        if (data==0) {
            res.send({
                success:true,
                data:{
                    success:false
                }
            });
        } else {
            res.send({
                success:true,
                data:{
                    success:true
                }
            });
        }
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:"blockchain call error"
            }
        });
    }
});



async function getbalanceOf(account,tokenid){
    // let contractinfo = await getcontractinfo();
    var params = new Object();
    params["contractname"]="VII_POAP";
    params["fun"]="balanceOf";
    params["params"]=[account,tokenid];
    let data = await newcontractcall(params);
    // console.log(contractinfo.mainwithdraw.address,data);
    return data.data.result;
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


exports.postmint = router.post("/phonepostmint", async (req, res) => {
    var params = req.body;
    let check =["phone","tokenid"];
    // let check =["account","tokenid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            data:{
                error:"error params"
            }
        });
        return;
    }
    let path = "0";
    let phone=params.phone;
    let account = await creatwallet(phone,path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone=params.account;
    let check2 =["key"];
    if(!check2.every(key=>key in params)){
        res.send({
            success:false,
            data:{
                error:"no key"
            }
        });
        return;
    }
    let key_set="dawasdak3jerbjfseijlfjoj3jli32j390(i";
    if (params["key"]!=key_set) {
        res.send({
            success:false,
            data:{
                error:"error key"
            }
        });
        return;
    }


    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }
    let checkorderid ="select * from mint_list where (account,tokenid) in ((?),(?))"
    let orderidsql = await conn.select(checkorderid,[sqlparams,[0,0]])
    // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
    // return
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                error: "110",
                repeat: false,
                errorinfo:"Repeated order submission"
            }
        });
        return;
    }

    let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        // sendEmailandto("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
        data:{
            success:true
        }
    });
    return;
});
exports.checkaccount = router.post("/phonecheckaccount", async (req, res) => {
    var params = req.body;

    let check =["phone","tokenid"];
    // let check =["account","tokenid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let path = "0";
    let phone=params.phone;
    let account = await creatwallet(phone,path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    try {
        let data = await getbalanceOf(params.account,params.tokenid);
        // console.log(data);
        if (data==0) {
            res.send({
                success:true,
                data:{
                    success:false
                }
            });
        } else {
            res.send({
                success:true,
                data:{
                    success:true
                }
            });
        }
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:"blockchain call error"
            }
        });
    }
});
