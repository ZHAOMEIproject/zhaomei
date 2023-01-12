// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const { sendEmailandto } = require("../../nodetool/email");
const { ethers } = require("ethers");
const {creatwallet} = require("./creatwallet");
exports.checkwallet = router.post("/phonecheckwallet", async (req, res) => {
    var params = req.body;
    // let check =["phone","path"];
    let check =["phone"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let phone=params.phone;
        let path = "0";
        let account = await creatwallet(phone,path);
        {
            let select = "select * from wallet where phone=?;"
            let sqlinfo = await conn.select(select,phone);
            // console.log(sqlinfo);
            if (sqlinfo.length>0) {
                res.send({
                    success:true,
                    info:{
                        phone:phone,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                });
                return;
            }
        }
        {
            let str = "insert into wallet(phone,mnemonic,path,address,private) values(?,?,?,?,?)";
            let sqlparams=[phone,await account._mnemonic().phrase,path,account.address,account._signingKey().privateKey];
            let orderidsql = await conn.select(str,sqlparams);
            res.send({
                success:true,
                data:{
                    success:true,
                    info:{
                        phone:phone,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                }
            });
            return;
        }
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
});
exports.checkwallet = router.post("/checkwallet", async (req, res) => {
    var params = req.body;
    let check =["phone","path"];
    // let check =["phone"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    try {
        let phone=params.phone;
        let path =params.path;
        let account = await creatwallet(phone,path);
        {
            let select = "select * from wallet where phone=?;"
            let sqlinfo = await conn.select(select,phone);
            // console.log(sqlinfo);
            if (sqlinfo.length>0) {
                res.send({
                    success:true,
                    info:{
                        phone:phone,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                });
                return;
            }
        }
        {
            let str = "insert into wallet(phone,mnemonic) values(?,?)";
            let sqlparams=[phone,await account._mnemonic().phrase];
            let orderidsql = await conn.select(str,sqlparams);
            res.send({
                success:true,
                data:{
                    success:true,
                    info:{
                        phone:phone,
                        mnemonic:await account._mnemonic().phrase,
                        address:account.address,
                        private:account._signingKey().privateKey
                    }
                }
            });
            return;
        }
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
});