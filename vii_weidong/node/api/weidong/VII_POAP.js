// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const { sendEmailandto } = require("../../nodetool/email");
const { creatwallet } = require("./creatwallet");

let poapcontractinfo = {
    address: "0xD5e264f146661797FF7F849A56eF4CD13a5432b9",
    erc: "erc1155",
    chainid: "1030",
    chainname: "Conflux eSpace",
    blockrpc: "https://evm.confluxrpc.com",
    blockexplorer: "https://evm.confluxscan.net"
}
exports.postmint = router.post("/postmint", async (req, res) => {
    var params = req.body;

    let check = ["account", "tokenid"];
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "error params"
        });
        return;
    }
    params.account = toChecksumAddress(params.account);
    let check2 = ["key"];
    if (!check2.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914002",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "no key"
        });
        return;
    }
    let key_set = "8d7b3b976dd7dc3f54ab3e6d234c30ff";
    if (params["key"] != key_set) {
        res.send({
            success: false,
            errorCode: "10914003",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
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
    // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
    // return
    if (orderidsql.length != 0) {
        res.send({
            success: false,
            errorCode: "10914004",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "Repeated order submission"
        });
        return;
    }

    let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
    try {
        await conn.select(sqlStr, sqlparams);
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914005",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: error
        });
        // sendEmailandto("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success: true,
        data: {
            success: true,
            poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                tokenid: tokenid
            }

        }
    });
    return;
});

var { newcontractcall } = require("../contractcall");
const { getcontractinfo } = require('../../nodetool/readcontracts');
const BigNumber = require("bignumber.js");

exports.checkaccount = router.post("/checkaccount", async (req, res) => {
    var params = req.body;

    let check = ["account", "tokenid"];
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "error params"
        });
        return;
    }
    try {
        let data = await getbalanceOf(params.account, params.tokenid);
        // console.log(data);
        if (data == 0) {
            res.send({
                success: true,
                data: {
                    success: false,
                    poapcontractinfo: {
                        ...baseinfo(poapcontractinfo,params),
                        tokenid: tokenid
                    }
                }
            });
        } else {
            res.send({
                success: true,
                data: {
                    success: true,
                    poapcontractinfo: {
                        ...baseinfo(poapcontractinfo,params),
                        tokenid: tokenid
                    }
                }
            });
        }
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914006",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "blockchain call error"
        });
    }
});



async function getbalanceOf(account, tokenid) {
    // let contractinfo = await getcontractinfo();
    var params = new Object();
    params["contractname"] = "VII_POAP";
    params["fun"] = "balanceOf";
    params["params"] = [account, tokenid];
    let data = await newcontractcall(params);
    // console.log(contractinfo.mainwithdraw.address,data);
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


exports.phonepostmint = router.post("/phonepostmint", async (req, res) => {
    var params = req.body;
    let check = ["phone", "tokenid"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "error params",
        });
        return;
    }
    let check2 = ["key"];
    if (!check2.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914002",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "no key"

        });
        return;
    }
    let key_set = "8d7b3b976dd7dc3f54ab3e6d234c30ff";
    if (params["key"] != key_set) {
        res.send({
            success: false,
            errorCode: "10914003",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
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
    // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
    // return
    if (orderidsql.length != 0) {
        res.send({
            success: false,
            errorCode: "10914004",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "Repeated order submission"
        });
        return;
    }

    let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
    try {
        await conn.select(sqlStr, sqlparams);
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914005",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: error
        });
        // sendEmailandto("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success: true,
        data: {
            success: true,
            poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                tokenid: tokenid
            }


        }
    });
    return;
});
exports.phonecheckaccount = router.post("/phonecheckaccount", async (req, res) => {
    var params = req.body;

    let check = ["phone", "tokenid"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "error params"
        });
        return;
    }
    try {
        let data = await getbalanceOf(params.account, params.tokenid);
        // console.log(data);
        if (data == 0) {
            res.send({
                success: true,
                data: {
                    success: false,
                    poapcontractinfo: {
                        ...baseinfo(poapcontractinfo,params),
                        tokenid: tokenid
                    }
                }
            });
        } else {
            res.send({
                success: true,
                data: {
                    success: true,
                    poapcontractinfo: {
                        ...baseinfo(poapcontractinfo,params),
                        tokenid: tokenid
                    }
                }
            });
        }
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914006",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid
                }
            },
            errorMessage: "blockchain call error"
        });
    }
});
exports.phonegetnft = router.post("/phonegetnft", async (req, res) => {
    var params = req.body;
    let check = ["phone"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            data: {
                poapcontractinfo: {
                    ...baseinfo(poapcontractinfo,params)
                    
                }
            },
            errorMessage: "error params",
        });
        return;
    }
});

function baseinfo(poapcontractinfo,params) {
    return{
        ...poapcontractinfo,
        nftlink: (poapcontractinfo.blockexplorer + "/nft/" + poapcontractinfo.address + "/" + params.tokenid),
        user: params.account,
    }
}