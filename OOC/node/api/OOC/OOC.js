// Global Express Framework
const express = require("express");
const router = express.Router();

module.exports = router;

exports.contractapi = router.get("/getsigninfo", async (req, res) => {
    var params = url.parse(req.url, true).query;
    // var params = req.body;
    // console.log(params);
    let info = require("../../localpi/test.json");

    res.send({
        success:true,
        data:info
    });
    return;
})