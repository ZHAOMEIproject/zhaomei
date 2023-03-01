// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const { sendEmailandto } = require("../../nodetool/email");
const { creatwallet } = require("./creatwallet");
var { newcontractcall } = require("../contractcall");
const { getcontractinfo } = require('../../nodetool/id-readcontracts');
const BigNumber = require("bignumber.js");
const ethers = require('ethers');
let poapcontractinfo;
//  = {
//     address: "0xD5e264f146661797FF7F849A56eF4CD13a5432b9",
//     erc: "erc1155",
//     chainid: "1030",
//     chainname: "Conflux eSpace",
//     blockrpc: "https://evm.confluxrpc.com",
//     blockexplorer: "https://evmtestnet.confluxscan.net/"
// }
contractset();

async function ownerOf(tokenid) {
    
    // let contractinfo = await getcontractinfo();
    // console.log(contractinfo.mainwithdraw.address,data);
    var params = new Object();
    params["contractname"] = "WEIDONG";
    params["fun"] = "ownerOf";
    params["params"] = [tokenid];
    let data = await newcontractcall(params);
    if (data.success===false) {
        return false
    }
    return data.data.result;
}


const createKeccakHash = require('keccak')

function toChecksumAddress(address) {
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'

    for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }

    return ret
}
exports.test = router.post("/test", async (req, res) => {
    // let contractinfo = await getcontractinfo();
    // for (let i in contractinfo) {
    //     poapcontractinfo = {
    //         address: contractinfo[i]["WEIDONG"].address,
    //         erc: "erc1155",
    //         chainid: contractinfo[i]["WEIDONG"].network.chainId,
    //         chainname: contractinfo[i]["WEIDONG"].network.name,
    //         blockrpc: contractinfo[i]["WEIDONG"].network.url,
    //         blockexplorer: "https://evmtestnet.confluxscan.net/"
    //     }
    //     break;
    // }
    console.log(poapcontractinfo);
    res.send({
        success: true,
        test: poapcontractinfo
    });
    return;
});

exports.useridpostmint = router.post("/useridpostmint", async (req, res) => {
    try {
        var params = req.body;
        let check = ["userid", "tokenid"];
        // let check =["account","tokenid"];
        let path = "0";
        let userid = params.userid;
        let account = await creatwallet(userid, path);
        // params.account = toChecksumAddress(params.account);
        params.account = toChecksumAddress(account.address);
        params.userid = params.account;
        let tokenid = params.tokenid;
        let data = account.address
        // let sqlstr = "select userid from wallet where address=?";
        // let useridsql = await conn.select(sqlstr, data);
        if (!check.every(key => key in params)) {
            res.send({
                success: false,
                errorCode: "10914001",
                errorMessage: "error params",
            });
            return;
        }
        let check2 = ["key"];
        if (!check2.every(key => key in params)) {
            res.send({
                success: false,
                errorCode: "10914002",
                errorMessage: "no key"

            });
            return;
        }
        let key_set = "8d7b3b976dd7dc3f54ab3e6d234c30ff";
        if (params["key"] != key_set) {
            res.send({
                success: false,
                errorCode: "10914003",
                errorMessage: "error key"
            });
            return;
        }


        let sqlparams = [];
        for (let i in check) {
            sqlparams.push(params[check[i]]);
        }
        let checkorderid = "select * from mint_list where (account,tokenid) in ((?),(?))"
        let orderidsql = await conn.select(checkorderid, [sqlparams, [0, 0]])
        // console.log(orderidsql);
        // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
        // return
        // console.log(poapcontractinfo);
        if (orderidsql.length != 0) {
            res.send({
                success: false,
                errorCode: "10914004",
                data: {
                    nftinfo: [{
                        ...(await baseinfo(poapcontractinfo, params)),
                        tokenid: tokenid,
                        owner: await ethtocfx(data),
                        ownertouserid: userid,

                    }]
                },
                errorMessage: "Repeated order submission"
            });
            return;
        }

        let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
        try {
            await conn.select(sqlStr, sqlparams);
        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                errorCode: "10914005",
                errorMessage: error
            });
            // sendEmailandto("Wallet:orderid error ","error orderid");
            return;
        }

        res.send({
            success: true,
            data: {
                success: true,
                nftinfo: [{
                    ...(await baseinfo(poapcontractinfo, params)),
                    tokenid: tokenid,
                    owner: await ethtocfx(data),
                    ownertouserid: userid,
                }]


            }
        });
        return;
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: String(error)
        });
    }
});
exports.useridcheckaccount = router.post("/useridcheckaccount", async (req, res) => {
    var params = req.body;

    let check = ["userid", "tokenid"];
    // let check =["account","tokenid"];
    let path = "0";
    let userid = params.userid;
    let account = await creatwallet(userid, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.userid = params.account;
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            errorMessage: "error params"
        });
        return;
    }
    try {
        let data = await ownerOf(params.tokenid);
        let sqlstr = "select userid from wallet where address=?";
        // console.log(data);
        let useridsql ;
        if (data) {
            useridsql = await conn.select(sqlstr, data);
            // data="0x0000000000000000000000000000000000000000";
        }else{
            useridsql=["0x0000000000000000000000000000000000000000"]
            data="0x0000000000000000000000000000000000000000";
            let mintcheckstr ="select account from mint_list where tokenid=?"
            let check=  await conn.select(mintcheckstr,tokenid);
            // console.log(check);
            if (check.length>0) {
                data=check[0].account;
            }
        }
        // console.log(data,params.account);
        if (data != params.account) {
            // console.log(useridsql,data);
            res.send({
                success: true,
                data: {
                    success: false,
                    nftinfo: [{
                        ...(await baseinfo(poapcontractinfo, params)),
                        owner: await ethtocfx(data),
                        ownertouserid: useridsql[0].userid,
                        tokenid: tokenid
                    }]
                }
            });
        } else {
            res.send({
                success: true,
                data: {
                    success: true,
                    nftinfo: [{
                        ...(await baseinfo(poapcontractinfo, params)),
                        owner: await ethtocfx(params.account),
                        ownertouserid: userid,
                        tokenid: tokenid
                    }]
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            errorCode: "10914006",
            errorMessage: "blockchain call error"
        });
    }
});

exports.useridgetnft = router.post("/useridgetnft", async (req, res) => {
    var params = req.body;
    let check = ["userid"];
    // let check =["account","tokenid"];
    let path = "0";
    let userid = params.userid;
    let account = await creatwallet(userid, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.userid = params.account;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            errorMessage: "error params",
        });
        return;
    }
    let data = account.address
    // let sqlstr = "select userid from wallet where address=?";
    // let useridsql = await conn.select(sqlstr, data);
    try {
        let nfts = await getaccountnft(account.address);
        // console.log(nfts);
        let nftinfo = new Array()
        for (let i = 0; i < nfts.tokenids.length; i++) {
            params.tokenid = nfts.tokenids[i];
            nftinfo.push(
                {
                    ...(await baseinfo(poapcontractinfo, params)),
                    tokenid: nfts.tokenids[i],
                    owner:await ethtocfx(data),
                    ownertouserid: userid,
                }
            )
        }
        res.send({
            success: true,
            data: {
                success: true,
                nftinfo: [
                    ...nftinfo
                ],
            }
        });
        return;
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            errorCode: "10914006",
            errorMessage: "blockchain call error"
        });
    }

});

async function baseinfo(poapcontractinfo, params) {
    let info = {
        ...poapcontractinfo,
        nftlink: (poapcontractinfo.blockexplorer + "/nft/" + poapcontractinfo.address + "/" + params.tokenid),
        user: await ethtocfx(params.account),
    }
    info.address = await ethtocfx(info.address)

    return info
}


async function contractset() {
    const contractinfo = await getcontractinfo();
    let oocinfo;
    for (let i in contractinfo) {
        oocinfo = contractinfo[i]["WEIDONG"];
        poapcontractinfo = {
            address: contractinfo[i]["WEIDONG"].address,
            erc: "erc721",
            chainid: contractinfo[i]["WEIDONG"].network.chainId,
            chainname: contractinfo[i]["WEIDONG"].network.name,
            blockrpc: contractinfo[i]["WEIDONG"].network.url,
            blockexplorer: "https://evmtestnet.confluxscan.net/"
        }
        break;
    }
    var path = "m/44'/60'/9'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(oocinfo.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        oocinfo.address,
        oocinfo.abi,
        provider
    );
    global.contractWithSigner = contract.connect(wallet);
}
async function getaccountnft(address) {
    let results = new Object();
    let nftbalance = await contractWithSigner["balanceOf"](address);
    results["balanceOf"] = nftbalance.toString();
    console.log(results["balanceOf"],results["balanceOf"] == 0);
    if (results["balanceOf"] == 0) {
        results["tokenids"] = new Array();
        return results;
    }
    let tasks = new Array();
    for (let i = 0; i < nftbalance; i++) {
        tasks.push(contractWithSigner["tokenOfOwnerByIndex"](address, i));
    }
    let tokenids = await Promise.all(tasks);
    results["tokenids"] = new Array();
    for (let i = 0; i < tokenids.length; i++) {
        results["tokenids"].push(tokenids[i].toString())
    }
    return results;
}
const { encode, decode } = require('@conflux-dev/conflux-address-js');
async function ethtocfx(address) {
    address = address.toLowerCase();
    // console.log(address);
    address = await encode(address, 1029, false);
    // console.log(address);
    return address.toString();
}