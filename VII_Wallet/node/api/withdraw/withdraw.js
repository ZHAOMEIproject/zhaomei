// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const {sendEmail} = require("../../nodetool/email");

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
    // check
    let checkservicenonce ="select servicenonce from withdraw ORDER BY servicenonce DESC LIMIT 0,1"
    let servicenonce = await conn.select(checkservicenonce,null)
    if((servicenonce[0].nonce+1)!=params.servicenonce){
        res.send({
            success:false,
            data:{
                error:"error servicenonce"
            }
        });
        sendEmail("Wallet error","error servicenonce");
        return;
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
    let sqlStr = "INSERT INTO withdraw_auditor("+
    "auditor,spender,amount,auditor_nonce,deadline,sign_r,sign_s,sign_v)VALUES("+
    "?,?,?,?,?,?,?,?)";
    await conn.select(sqlStr,sqlparams)

    res.send({
        success:true,
    });
    return;
});

exports.postwirhdraw = router.get("/getwirhdrawnonce", async (req, res) => {
    let sqlStr = "select servicenonce from withdraw ORDER BY servicenonce DESC LIMIT 0,1;";
    let nonce = await conn.select(sqlStr,null)
    res.send({
        success:true,
        data:{
            nonce:nonce[0].nonce
        }
    });
    
    // if(nonce[0].nonce==nonce[0].id){
    //     res.send({
    //         success:true,
    //         data:{
    //             nonce:nonce[0].nonce
    //         }
    //     });
    // }else{
    //     res.send({
    //         success:false,
    //         data:{
    //             nonce:"nonce error"
    //         }
    //     });
    // }
    
    return;
});

