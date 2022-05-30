// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');

// Load configuration file
const mysql = require("mysql");
const conn = mysql.createConnection(global.mysqlGlobal);
module.exports = router;

// 1. 我的IDO释放记录
exports.getReleaseList = router.get("/getReleaseList", (req, res) => {
    // Parsing URL parameters
    var params = url.parse(req.url, true).query;
    let address = params.address;

    const sqlStr = "select address,DATE_FORMAT(time,'%Y-%c-%d %H:%i:%s') as time,amount from ido_release_info where address = ?"

    let selectParams = [ address ]
    conn.query(sqlStr, selectParams, (err, result) => {
        if (err) return res.send({code: 10000, data: "For failure"});
        res.send({
            code: 0, data: result
        });
    });
});

