// Global Express Framework
const express = require("express");
const router = express.Router();

module.exports = router;

exports.contractapi = router.get("/owlsigninfo", async (req, res) => {
    let info = require("../../localpi/test.json");

    res.send({
        success:true,
        data:info
    });
    return;
})