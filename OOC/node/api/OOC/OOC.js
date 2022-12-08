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
        // console.log("0x6F5D8Ba12aF7681206be37Cee36d2FbD4Ebff3f4");
        // console.log(toChecksumAddress("0x6F5D8Ba12aF7681206be37Cee36d2FbD4Ebff3f4"));
        let info = await sql.sqlcall(sqlstr,toChecksumAddress(params.address));
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
        // console.log(info);
        res.send({
            success:true,
            data:{
                success:true,
                info:info[0],
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
        let info = await sql.sqlcall(sqlstr,sqlparams);

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