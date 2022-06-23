// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");

exports.postwirhdraw = router.get("/postwirhdraw", async (req, res) => {
    var params = url.parse(req.url, true).query;
    

    let check =["spender","amount","servicenonce"];
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
    let sqlStr = "INSERT INTO withdraw(spender,amount,servicenonce)VALUES(?,?,?)";
    await conn.select(sqlStr,sqlparams);

    res.send({
        success:true,
    });
    return;
});

exports.postwirhdraw = router.get("/postwirhdrawsign", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["auditor","spender","amount","auditor_nonce","deadline","sign_r","sign_s","sign_v"];
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
    let sqlStr = "INSERT INTO withdraw_sign("+
    "auditor,spender,amount,auditor_nonce,sign_r,sign_s,sign_v,deadline)VALUES("+
    "?,?,?,?,?,?,?,?,?)";
    await conn.select(sqlStr,sqlparams)

    res.send({
        success:true,
    });
    return;
});