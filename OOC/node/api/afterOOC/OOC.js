// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

module.exports = router;
// const mysql = require("mysql2");
// const conn = mysql.createConnection(global.mysqlGlobal);
const sql = require("../../nodetool/sqlconnection");

exports.getinfo = router.get("/getinfo", async (req, res) => {

    res.send({
        success:false,
        error:"error call"
    });
    return;
})
exports.updateinfo = router.get("/updateinfo", async (req, res) => {
    try {
        res.send({
            success:false,
            error:"error call"
        });
    } catch (error) {
        res.send({
            success:false,
            error:"error call"
        });
    }
    return;
})