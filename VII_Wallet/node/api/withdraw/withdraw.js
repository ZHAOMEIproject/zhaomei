// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const {sendEmail} = require("../../nodetool/email");



// exports.postwithdraw = router.get("/postwithdrawservicenonce", async (req, res) => {
//     var params = url.parse(req.url, true).query;

//     let check =["spender","amount","servicenonce","orderid"];
//     if(!check.every(key=>key in params)){
//         res.send({
//             success:false,
//             error:"error params"
//         });
//         return;
//     }
//     let sqlparams=[];
//     for(let i in check){
//         sqlparams.push(params[check[i]]);
//     }
//     // check
//     let checkservicenonce ="select servicenonce from withdraw ORDER BY servicenonce DESC LIMIT 0,1"
//     let servicenonce = await conn.select(checkservicenonce,null)
//     if(servicenonce.length==0){
//         servicenonce=[{"servicenonce":0}];
//     }
//     servicenonce[0].servicenonce++;
//     // console.log(servicenonce[0].servicenonce+1,params.servicenonce);
//     if((servicenonce[0].servicenonce!=params.servicenonce)){
//         res.send({
//             success:false,
//             data:{
//                 error:"error servicenonce",
//                 servicenonce:servicenonce[0].servicenonce
//             }
//         });
//         sendEmail("Wallet:servicenonce error","error servicenonce");
//         return;
//     }

//     let sqlStr = "INSERT INTO withdraw(spender,amount,servicenonce,orderid)VALUES(?,?,?,?)";
//     try {
//         await conn.select(sqlStr,sqlparams);
//     } catch (error) {
//         res.send({
//             success:false,
//             data:{
//                 error:error
//             }
//         });
//         sendEmail("Wallet:orderid error ","error orderid");
//         return;
//     }

//     res.send({
//         success:true,
//     });
//     return;
// });

exports.postwithdraw = router.get("/postwithdraw", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["spender","amount","orderid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }
    let checkorderid ="select orderid from withdraw where orderid=?"
    let orderidsql = await conn.select(checkorderid,params["orderid"])
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                result:"Repeated order submission"
            }
        });
    }

    let sqlStr = "INSERT INTO withdraw(spender,amount,orderid)VALUES(?,?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        sendEmail("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
    });
    return;
});

exports.postwithdraw = router.get("/postwithdrawsign", async (req, res) => {
    var params = url.parse(req.url, true).query;

    let check =["auditor","spender","amount","auditor_nonce","deadline","sign_r","sign_s","sign_v","orderid"];
    if(!check.every(key=>key in params)){
        res.send({
            success:false,
            error:"error params"
        });
        return;
    }
    let sqlparams=[];
    for(let i in check){
        sqlparams.push(params[check[i]]);
    }

    let checkorderid ="select orderid from withdraw_auditor where orderid=?"
    let orderidsql = await conn.select(checkorderid,params["orderid"])
    if(orderidsql.length!=0){
        res.send({
            success:true,
            data:{
                result:"Repeated order submission"
            }
        });
    }
    

    let sqlStr = "INSERT INTO withdraw_auditor("+
    "auditor,spender,amount,auditor_nonce,deadline,sign_r,sign_s,sign_v,orderid)VALUES("+
    "?,?,?,?,?,?,?,?,?)";
    try {
        await conn.select(sqlStr,sqlparams);
    } catch (error) {
        res.send({
            success:false,
            data:{
                error:error
            }
        });
        sendEmail("Wallet:sign orderid error ","error orderid");
        return;
    }

    res.send({
        success:true,
    });
    return;
});

// exports.postwithdraw = router.get("/getwithdrawnonce", async (req, res) => {
//     let sqlStr = "select servicenonce from withdraw ORDER BY servicenonce DESC LIMIT 0,1;";
//     let nonce = await conn.select(sqlStr,null)
//     let s_nonce=0;
//     if(nonce.length!=0){
//         s_nonce=nonce[0].servicenonce
//     }
//     res.send({
//         success:true,
//         data:{
//             nonce:s_nonce,
//         }
//     });
//     return;
// });

// const BigNumber = require("bignumber.js");
exports.postwithdraw = router.post("/checkorderid", async (req, res) => {
    // var params = url.parse(req.body, true).query;
    // console.log(req.body);
    let orderids =req.body.orderids;
    let sqlStr = "select * from mainwithdraw where event_name='e_Withdraw' and data4 in (?)"
    let orderids_u=new Array;
    for (let i in orderids) {
        let neworderid = orderids[i]+"0000000000000000000000000000000000000000";
        orderids_u.push(neworderid)
    }
    // console.log(orderids_u);
    let info = await conn.select(sqlStr,[orderids_u])
    // console.log(info);
    let showinfos =new Array;

    for(let i in info){
        let showinfo=new Object;
        showinfo["block_logIndex"]=info[i].block_logIndex;
        showinfo["transaction_hash"]=info[i].transaction_hash;
        showinfo["to"]=info[i].data1;
        showinfo["amount"]=info[i].data2;
        showinfo["orderid"]=info[i].data4.substring(0,26);
        showinfos.push(showinfo);
    }
    res.send({
        success:true,
        data:{
            req:showinfos
        }
    });
    return;
});