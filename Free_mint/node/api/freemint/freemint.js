// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const mysql = require("mysql2");
const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");

exports.gethotlist= router.get("/gethotlist",async(req,res)=>{
    let sqlstr="select address,nonce from nft_address order by nonce desc limit 10";
    let hotlist=await sql.sqlcall_uncon(conn,sqlstr,null);
    res.send({
        success:true,
        data:{
            hotlist:hotlist
        },
    });
    return;
})
exports.gethotlist= router.get("/getlatemint",async(req,res)=>{
    var params = url.parse(req.url, true).query;
    let check =["address"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let sqlstr="select * from nft_event where address=? order by blocknumber desc limit 10";
    let latemint=await sql.sqlcall_uncon(conn,sqlstr,params.address);
    let sqladdstr="select * from nft_address where address=?"
    let contractinfo=await sql.sqlcall_uncon(conn,sqladdstr,params.address);
    let sqlmint="select * from nft_trans where address=?and amount=1 order by timestamp desc limit 1";
    let mintdata=await sql.sqlcall_uncon(conn,sqlmint,params.address);
    // console.log(params.address,latemint);
    res.send({
        success:true,
        data:{
            contractinfo:contractinfo[0],
            latemint:latemint,
            mintdata:mintdata[0]
        },
    });
    return;
})