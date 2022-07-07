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

    // let data = await Promise.all([ethscan.otherinfo(address),ethscan.nftinfo(address),ethscan.usdtbalance(address),ethscan.ethbalance(address)]);
    let data = await getnewinfo(address);

    if(global.zwjerror){
        global.zwjerror = false;
        res.send({
            success:false
        });
        return;
    }

    let sqlStr = "select * from address_scores where address=? order by time DESC limit 2";
    let info = await conn.select(sqlStr,address);
    info[0]["totaluser"]=data[0].totaluser;
    info[0]["ranking"]= data[0].ranking;
    info[0]= Object.assign(info[0],ethscan.scores_max);
    if(info.length==1){
        info.push(info[0]);
    }else{
        info[1]["totaluser"]=data[0].totaluser;
        info[1]["ranking"]= data[0].ranking;
        info[1]= Object.assign(info[1],ethscan.scores_max);
    }
    
    res.send({
        success:true,
        data: info
    });
    return;
});
// 2. 返回最新两组数据
exports.getList = router.get("/last", async (req, res) => {
    // Parsing URL parameters
    var params = url.parse(req.url, true).query;
    let address = params.address;

    let sqlStr = "select * from address_scores where address=? order by time DESC limit 2";
    let info = await conn.select(sqlStr,address);
    if(info.length==0){
        let data = await getnewinfo(address);
        if(global.zwjerror){
            global.zwjerror = false;
            res.send({
                success:false
            });
            return;
        }
        info.push(data[0]);
    }

    let sqlgettotaluser ="select count(DISTINCT address) as totaluser from address_scores;";
    var totaluser= await conn.select(sqlgettotaluser);
    totaluser = totaluser[0].totaluser;
    let sqlgetranking ="select count(DISTINCT address) as ranking from address_scores where total_score>"+ info[0].total_score +";";
    var ranking= await conn.select(sqlgetranking);
    ranking = ranking[0].ranking+1;

    info[0]["totaluser"]=totaluser;
    info[0]["ranking"]= ranking;
    info[0]= Object.assign(info[0],ethscan.scores_max);
    
    if(info.length==1){
        info.push(info[0]);
    }else{
        info[1]["totaluser"]=totaluser;
        info[1]["ranking"]= ranking;
        info[1]= Object.assign(info[1],ethscan.scores_max);
    }
    
    res.send({
        success:true,
        data:info
    });
});


async function getnewinfo(address){
    let data = await Promise.all([ethscan.otherinfo(address),ethscan.nftinfo(address)]);
    
    for(let i in data){
        if(global.zwjerror){
            return;
        }
    }

    
    
    data = Object.assign({},data[0],data[1]);
    let sqlStr = "replace into address_scores("
    +"address,opensea_buy,opensea_buy_s,"
    +"opensea_gas_use,opensea_gas_use_s,"
    +"opensea_eth_use,opensea_eth_use_s,"
    +"fistopenseatime,"

    +"success_nonce, success_nonce_s,"
    +"main_nft,main_nft_s,"
    +"blue,blue_s,"
    +"superblue,superblue_s,"
    +"fist721time,"

    +"total_nft,total_nft_s,topaccount,"
    
    +"market_score,on_chain_score,nft_score,"
    +"total_score,time,lastranking,totaluser)"
    +"values(?,?,?,?,?,?,?,?,  ?,?,?,?,?,?,?,?,?,?,?,?,  ?,?,?,?, unix_timestamp(),?,?)";

    let market_score = data.opensea_buy_s + data.opensea_gas_use_s + data.opensea_eth_use_s;
    let on_chain_score = data.success_nonce_s + data.main_nft_s + data.blue_s + data.superblue_s;
    let nft_score = data.total_nft_s;
    let total_score = market_score+ on_chain_score +nft_score;

    let sqlgettotaluser ="select count(DISTINCT address) as totaluser from address_scores;";
    var totaluser= await conn.select(sqlgettotaluser);
    totaluser = totaluser[0].totaluser;
    let sqlgetranking ="select count(DISTINCT address) as ranking from address_scores where total_score>"+ total_score +";";
    var ranking= await conn.select(sqlgetranking);
    ranking = ranking[0].ranking+1;

    // let selectParams = [address,...data,...data,...data[2],...data[3],market_score,on_chain_score,nft_score,wallet_score,total_score,ranking,totaluser];

    let selectParams = [address,...Object.values(data),market_score,on_chain_score,nft_score,total_score,ranking,totaluser];

    let err = await conn.insert(sqlStr,selectParams);

    sqlStr = "select * from address_scores where address=? order by time DESC limit 1";
    let info = await conn.select(sqlStr,address);
    info[0]["totaluser"]=totaluser;
    info[0]["ranking"]= ranking;

    if(err){
        global.zwjerror=true;
        return
    }

    return info;
}