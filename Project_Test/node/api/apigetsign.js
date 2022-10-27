// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;

const {getsign} = require('./sign/getsign');

exports.contractapi = router.get("/getsign", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["order","amount","deadline"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let tx = await getsign(params.order,params.amount,params.deadline);
    
    res.send({
        success:true,
        data:{
            result:tx
        },
    });
    return;
});
