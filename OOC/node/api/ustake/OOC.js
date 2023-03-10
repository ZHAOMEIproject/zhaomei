// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

module.exports = router;
// const mysql = require("mysql2");
// const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");
const { getsign } = require('../sign/getsign');

exports.getsign = router.post("/getsign", async (req, res) => {
    try {
        var params = req.body;
        params["id"] = "7156777";
        params["contractname"] = "mainwithdraw";
        params["deadline"] = "9999999999"
        // console.log(params);
        // let check = ["id", "contractname", "params","privateKey"];
        let check = ["id", "contractname", "password"];
        if (!check.every(key => key in params)) {
            res.send({
                success: false,
                error: "error params"
            });
            return;
        }
        if (params.password != "746506be965e60fbb432cda623261cf2") {
            res.send({
                success: false,
                error: "error passwork"
            });
            return;
        }
        // params=[["0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","100","v","r","s"],100]
        // params={"auditor":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","spender":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","amount":"1000","nonce":"100","deadline":"9999999999"}
        // console.log(Object.values(params.params));
        // let check2 = ["auditor", "spender", "amount", "orderid", "deadline"];
        let check2 = ["spender", "amount", "orderid", "deadline"];
        if (!check2.every(key => key in params)) {
            res.send({
                success: false,
                error: "error params key"
            });
            return;
        }
        let signparams = [];
        for (let i in check2) {
            signparams.push(params[check2[i]]);
        }
        let tx = await getsign(
            params.id,
            params.contractname,
            signparams,
            params.privateKey
        );
        res.send({
            success: true,
            data: [
                ...tx
            ],
        });


        return;
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: error
        });
        return;
    }
})

exports.getsmall = router.post("/getsmall", async (req, res) => {
    try {
        var params = req.body;
        // console.log(params);
        let check = ["start", "address"];
        if (!check.every(key => key in params)) {
            res.send({
                success: false,
                error: "error params"
            });
            return;
        }
        const sqlstr = `
            SELECT * FROM nft_records
            WHERE user='${params.address}' and timestamp >'${params.start}' and timestamp <='${params.end}'
            ORDER BY balance ASC LIMIT 1;
        `;

        let result = await sql.sqlcall(sqlstr);
        if (result.length == 0) {
            const sqlstr = `
                SELECT * FROM nft_records
                WHERE user='${params.address}'
                ORDER BY balance ASC LIMIT 1;
            `;
            result = await sql.sqlcall(sqlstr);
        }
        // console.log(result);
        res.send({
            success: true,
            data: result,
        });


        return;
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: error
        });
        return;
    }
})