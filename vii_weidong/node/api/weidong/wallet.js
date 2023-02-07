// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const { sendEmailandto } = require("../../nodetool/email");
const { ethers } = require("ethers");
const {creatwallet} = require("./creatwallet");
exports.checkwallet = router.post("/useridcheckwallet", async (req, res) => {
    var params = req.body;
    // let check =["userid","path"];
    let check =["userid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let userid=params.userid;
        let path = "0";
        let account = await creatwallet(userid,path);
        {
            let select = "select * from wallet where userid=?;"
            let sqlinfo = await conn.select(select,userid);
            // console.log(sqlinfo);
            if (sqlinfo.length>0) {
                res.send({
                    success:true,
                    data:{
                        userid:userid,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                });
                return;
            }
        }
        {
            let str = "insert into wallet(userid,mnemonic,path,address,private) values(?,?,?,?,?)";
            let sqlparams=[userid,await account._mnemonic().phrase,path,account.address,account._signingKey().privateKey];
            let orderidsql = await conn.select(str,sqlparams);
            res.send({
                success:true,
                data:{
                    userid:userid,
                    mnemonic:await account._mnemonic().phrase,
                    address:account.address,
                    private:account._signingKey().privateKey
                }
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            error:error
        });
    }
    return;
});
exports.checkwallet = router.post("/checkwallet", async (req, res) => {
    var params = req.body;
    let check =["userid","path"];
    // let check =["userid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let userid=params.userid;
        let path =params.path;
        let account = await creatwallet(userid,path);
        {
            let select = "select * from wallet where userid=?;"
            let sqlinfo = await conn.select(select,userid);
            // console.log(sqlinfo);
            if (sqlinfo.length>0) {
                res.send({
                    success:true,
                    data:{
                        userid:userid,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                });
                return;
            }
        }
        {
            let str = "insert into wallet(userid,mnemonic) values(?,?)";
            let sqlparams=[userid,await account._mnemonic().phrase];
            let orderidsql = await conn.select(str,sqlparams);
            res.send({
                success:true,
                data:{
                    userid:userid,
                    mnemonic:await account._mnemonic().phrase,
                    address:account.address,
                    private:account._signingKey().privateKey
                }
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            error:error
        });
    }
    return;
});