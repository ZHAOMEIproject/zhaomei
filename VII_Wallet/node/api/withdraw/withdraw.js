// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const {sendEmail} = require("../../nodetool/email");

// 暂存
var n_allowance;
var lasttime;

exports.postwithdraw = router.get("/postwithdraw", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["spender","amount","orderid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    {
        let selsql = "SELECT amount FROM withdraw where flag_withdraw ='F'";
        let sqlrq = await conn.select(selsql,null);
        let amount = 0;
        for (let i in sqlrq) {
            amount+=sqlrq[i]
        }
        amount+=params.amount;
        if (n_allowance<amount) {
            let checktime=Date.now()/1000;
            if (lasttime<(checktime-15)) {
                n_allowance=await getallowance();
                lasttime=checktime;
                if(n_allowance<amount){
                    sendEmail("授权量不足","授权量不足");
                    res.send({
                        success:false,
                        data:{
                            error:"Insufficient authorization"
                        }
                    });
                    return;
                }
            }else{
                sendEmail("授权量不足","授权量不足");
                res.send({
                    success:false,
                    data:{
                        error:"Insufficient authorization"
                    }
                });
                return;
            }
        }
    }
    
    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }
    let checkorderid ="select orderid from withdraw where orderid=?"
    let orderidsql = await conn.select(checkorderid,params["orderid"])
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                result:"Repeated order submission"
            }
        });
    }

    let sqlStr = "INSERT INTO withdraw(spender,amount,orderid)VALUES(?,?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        // sendEmail("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
    });
    return;
});

exports.postwithdrawsign = router.get("/postwithdrawsign", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["auditor","spender","amount","deadline","sign_r","sign_s","sign_v","orderid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    {
        let selsql = "SELECT amount FROM withdraw where flag_withdraw ='F'";
        let sqlrq = await conn.select(selsql,null);
        let amount = 0;
        for (let i in sqlrq) {
            amount+=sqlrq[i]
        }
        amount+=params.amount;
        if (n_allowance<amount) {
            let checktime=Date.now()/1000;
            if (lasttime<(checktime-15)) {
                n_allowance=await getallowance();
                lasttime=checktime;
                if(n_allowance<amount){
                    sendEmail("授权量不足","授权量不足");
                    res.send({
                        success:false,
                        data:{
                            error:"Insufficient authorization"
                        }
                    });
                    return;
                }
            }else{
                sendEmail("授权量不足","授权量不足");
                res.send({
                    success:false,
                    data:{
                        error:"Insufficient authorization"
                    }
                });
                return;
            }
        }
    }
    
    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }

    let checkorderid ="select orderid from withdraw_auditor where orderid=?"
    let orderidsql = await conn.select(checkorderid,params["orderid"])
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                result:"Repeated order submission"
            }
        });
    }
    

    let sqlStr = "INSERT INTO withdraw_auditor("+
    "auditor,spender,amount,deadline,sign_r,sign_s,sign_v,orderid)VALUES("+
    "?,?,?,?,?,?,?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        // sendEmail("Wallet:sign orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
    });
    return;
});
exports.checkorderid = router.post("/checkorderid", async (req, res) => {
    // var params = url.parse(req.body, true).query;
    // console.log(req.body);
    let orderids =req.body.orderids;
    let sqlStr = "select * from mainwithdraw where event_name='e_Withdraw' and data3 in (?)"
    let orderids_u=new Array;
    for (let i in orderids) {
        let neworderid = orderids[i]+"0000000000000000000000000000000000000000";
        orderids_u.push(neworderid)
    }
    // console.log(orderids_u);
    let info = await conn.select(sqlStr,[orderids_u])
    // console.log(info);
    let showinfos =new Array;

    for(let i in info){
        let showinfo=new Object;
        showinfo["block_logIndex"]=info[i].block_logIndex;
        showinfo["transaction_hash"]=info[i].transaction_hash;
        showinfo["to"]=info[i].data1;
        showinfo["amount"]=info[i].data2;
        showinfo["orderid"]=info[i].data3.substring(0,26);
        showinfos.push(showinfo);
    }
    res.send({
        success:true,
        data:{
            req:showinfos
        }
    });
    return;
});
exports.checkrecharge = router.get("/checkrecharge", async (req, res) => {
    var params = url.parse(req.url, true).query;
    let check =["blocknumber"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }
    let checkrechargesql ="select * from Transfer_station where block_number>=?"
    let info = await conn.select(checkrechargesql,params["blocknumber"]);

    let showinfos =new Array;

    for(let i in info){
        let showinfo=new Object;
        showinfo["block_number"]=info[i].block_number;
        showinfo["block_logIndex"]=info[i].block_logIndex;

        showinfo["from"]=info[i].data0;
        showinfo["to"]=info[i].data1;
        showinfo["amount"]=info[i].data2;
        showinfos.push(showinfo);
    }
    res.send({
        success:true,
        data:{
            req:showinfos
        }
    });
    return;

});

var {newcontractcall}=require("../contractcall");
const {getcontractinfo}=require('../../nodetool/readcontracts');
exports.getallowance = router.get("/getallowance", async (req, res) => {
    let selsql = "SELECT amount FROM withdraw where flag_withdraw ='F'";
    let sqlrq = await conn.select(selsql,null);
    let amount = 0;
    for (let i in sqlrq) {
        amount+=sqlrq[i]
    }
    let data = await getallowance() -amount;
    res.send({
        success:true,
        data:{
            value:data
        }
    });
    return;
});

async function getallowance(){
    let contractinfo = await getcontractinfo();
    var params = new Object();
    params["contractname"]="vii_s";
    params["fun"]="allowance";
    params["params"]=["0x8c327f1aa6327f01a9a74cec696691ceaac680e2",contractinfo.mainwithdraw.address];
    let data = await newcontractcall(params);
    return Number(data.data.result);
}