// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const {getcontractinfo}=require('../nodetool/id-readcontracts');
const ethers = require('ethers');
const secret = global.secret;

exports.contractinfo = router.get("/", async (req, res) => {
    const contractinfo = await getcontractinfo();
    res.send({
        success:true,
        data:{
            contractinfo:contractinfo
        },
    });
    return;
});

exports.contractapi = router.get("/read", async (req, res) => {
    var params = url.parse(req.url, true).query;
    
    let check =["id","contractname","fun","params"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    params.params= JSON.parse(params.params);
    let data = await contractcall(params)

    res.send(
        data
    );
    return;
});

exports.checkorderid = router.post("/postread", async (req, res) => {
    var params = req.body;
    // console.log(params);
    
    let check =["id","contractname","fun","params"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    // params.params= JSON.parse(params.params);
    let data = await contractcall(params)

    res.send(
        data
    );
    return;
});

let {contractcall}=require("./contractcall");
exports.test = router.get("/test", async (req, res) => {
    var params = url.parse(req.url, true).query;
    
    let check =["id","contractname","fun","params"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    params.params= JSON.parse(params.params);

    let data = await contractcall(params)

    res.send(
        data
    );
    return;
});