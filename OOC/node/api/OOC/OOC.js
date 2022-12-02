// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

module.exports = router;
const mysql = require("mysql2");
const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");

exports.getsigninfo = router.get("/getsigninfo", async (req, res) => {
    try {
        var params = url.parse(req.url, true).query;
        // var params = req.body;
        // console.log(params);
        // let info = require("../../localpi/test.json");


        let check =["address"];
        if(!check.every(key=>key in params)){
            res.send({
                success:false,
                error:"error params"
            });
            return;
        }
        // res.send({
        //     success:false,
        //     error:"test"
        // });
        // return;

        let sqlstr = "select address,amount,deadline,typemint,v,r,s from address_sign where address=?";
        let info = await sql.sqlcall_uncon(conn,sqlstr,params.address);
        if(info.length==0){
            res.send({
                success:true,
                data:{
                    success:false,
                    message:"can't find",
                }
            });
            return;
        }
        res.send({
            success:true,
            data:{
                success:false,
                
            }
        });
    } catch (error) {
        res.send({
            success:false,
            error:"error call"
        });
    }
    return;
})

// const {getsign}=require("../sign/getsign");
exports.postwhite = router.get("/postwhite", async (req, res) => {
    try {
        var params = url.parse(req.url, true).query;
        // var params = req.body;
        // console.log(params);
        // let info = require("../../localpi/test.json");


        let check =["address","amount","typemint"];
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

        

        let sqlstr = "insert ignore into address_sign(address,amount,typemint) values(?,?,?)";
        let info = await sql.sqlcall_uncon(conn,sqlstr,sqlparams);

        res.send({
            success:true,
            data:{
                success:true,
                info:info
            }
        });
    } catch (error) {
        res.send({
            success:false,
            error:"error call"
        });
    }
    return;
})

exports.owlsigninfo = router.get("/owlsigninfo", async (req, res) => {
    let info = require("../../localpi/sign_pi/test.json");

    res.send({
        success:true,
        data:info
    });
    return;
})