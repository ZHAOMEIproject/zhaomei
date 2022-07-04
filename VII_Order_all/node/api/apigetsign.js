// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
const { ethers } = require("ethers");
module.exports = router;

const {getsign} = require('./sign/getsign');

let decimal={
    "1":6,
    "3":6,
    "56":18,
    "97":18
}

exports.contractapi = router.get("/getsign", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["id","contractname","order","amount","deadline"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    // let tx = new Object();

    if(decimal[params.id]==6){
        let tx = await getsign(
            params.id,
            params.contractname,
            params.order,
            params.amount*10**6,
            // params.amount,
            params.deadline
        );
        res.send({
            success:true,
            data:{
                result:tx
            },
        });
    }else if(decimal[params.id]==18){
        let tx = await getsign(
            params.id,
            params.contractname,
            params.order,
            ethers.utils.parseUnits(params.amount),
            // params.amount,
            params.deadline
        );
        res.send({
            success:true,
            data:{
                result:tx
            },
        });
    }

    
    return;
});

