// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
const ethscan = require("./ethscan");

// Load configuration file
const conn = require("../../nodetool/sqlconnection");

module.exports = router;

// 1. 返回最新分数以及存储数据库
exports.getReleaseList = router.get("/update", async (req, res) => {
    // Parsing URL parameters
    var params = url.parse(req.url, true).query;
    let address = params.address;

    let data = await Promise.all([ethscan.otherinfo(address),ethscan.nftinfo(address),ethscan.usdtbalance(address),ethscan.ethbalance(address)]);
    let sqlStr = "replace into address_scores("
    +"address,opensea_buy,opensea_buy_s,"
    +"opensea_gas_use,opensea_gas_use_s,"
    +"opensea_eth_use,opensea_eth_use_s,"
    +"total_gas_use,total_gas_use_s,"
    +"success_nonce,success_nonce_s,"
    +"main_nft,main_nft_s,"
    +"total_nft,total_nft_s,"
    +"usdt,usdt_s,"
    +"eth,eth_s,"
    +"market_score,on_chain_score,nft_score,wallet_score,total_score,date,lastranking,totaluser)"
    +"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,unix_timestamp(),?,?)";

    let time = Date.now()/1000;
    let market_score = data[0][1] + data[0][3] + data[0][5];
    let on_chain_score = data[0][7] + data[0][9];
    let nft_score = data[1][1] + data[1][3];
    let wallet_score = data[2][1] + data[3][1];
    let total_score = market_score+ on_chain_score +nft_score+ wallet_score;


    let sqlgettotaluser ="select count(1) as totaluser from address_scores;";
    var totaluser = await conn.select(sqlgettotaluser);
    totaluser = totaluser[0].totaluser;
    let sqlgetranking ="select count(DISTINCT address) as ranking from address_scores where total_score>"+ total_score +";";
    var ranking = await conn.select(sqlgetranking);
    ranking = ranking[0].ranking+1;

    let selectParams = [address,...data[0],...data[1],...data[2],...data[3],market_score,on_chain_score,nft_score,wallet_score,total_score,ranking,totaluser];

    let detailed ={
        address:address,
        opensea_buy:data[0][0],
        opensea_buy_s:data[0][1],
        opensea_gas_use:data[0][2],
        opensea_gas_use_s:data[0][3],
        opensea_eth_use:data[0][4],
        opensea_eth_use_s:data[0][5],
        total_gas_use:data[0][6],
        total_gas_use_s:data[0][7],
        success_nonce:data[0][8],
        success_nonce_s:data[0][9],

        main_nft:data[1][0],
        main_nft_s:data[1][1],
        total_nft:data[1][2],
        total_nft_s:data[1][3],

        usdt:data[2][0],
        usdt_s:data[2][1],
        eth:data[3][0],
        eth_s:data[3][1],

        total_score:total_score,
        market_score:market_score,
        on_chain_score:on_chain_score,
        nft_score:nft_score,
        wallet_score:wallet_score,

        time:time,
        ranking:ranking,
        totaluser:totaluser
    }
    let err = await conn.insert(sqlStr,selectParams)
    if(err){
        res.send({
            success:false
        });
        return;
    }
    res.send({
        success:true,
        data: detailed
    });

});
// 2. 返回最新两组数据
exports.getList = router.get("/last", async (req, res) => {
    // Parsing URL parameters
    var params = url.parse(req.url, true).query;
    let address = params.address;

    let sqlStr = "select * from address_scores where address=? order by date DESC limit 2";
    let info = await conn.select(sqlStr,address);

    // info["success"]=true;
    res.send({
        success:true,
        data:info
    });
});