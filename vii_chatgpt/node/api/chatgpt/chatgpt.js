// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const chatgpt = require("./chatgptcall.js");

exports.test = router.get("/", async (req, res) => {
    res.send({
        success: true,
        data: {
            str: "success"
        },
    });
    return;
});
// {
//     "callstr":"你好呀",
//     "opts":{
//         "conversationId": "194cb915-9f2e-458d-bb56-91424607c6b4",//对话窗口id
//         "parentMessageId": "5ae046c7-e1bb-4090-8be2-f7b5cab7100c",//上一句话的messageId
//         "action":"variant"
//     }
// }

var nowtask = {
    flagtime: 0,
    user: "string",
    flag: true,
    response: "string",
    conversationId: "string",
    messageId: "string"
}
const crypto = require('crypto');
var callhistory = new Map();
exports.chatgpt = router.post("/chatcall", async (req, res) => {

    var params;
    // console.log(req.body);
    if (req.body.callstr != null) {
        params = req.body;
    } else {
        params = url.parse(req.url, true).query;
    }
    console.log(params);
    let check = ["callstr", "user"];
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10915000",
            errorMessage: "error params",
        });
        return;
    }
    // console.log(nowtask.flag,nowtask.flagtime + 60000,Date.now(),(nowtask.flagtime + 60000) >= Date.now());

    // 哈希check下是否有历史请求过。
    if (!params.opts) {
        params.opts={}
    }
    params.opts["timeoutMs"]=60000;
    const hash = crypto.createHash('sha256');
    hash.update(callstr+params.opts.conversationId+params.opts.parentMessageId+params.opts.action);
    const output = hash.digest('hex');
    let checkhistory=callhistory.get(output);
    if (checkhistory) {
        res.send({
            success: true,
            data: {
                ...checkhistory
            },
        });
        return;
    }
    if (checknowtask()) {
        let callstr = params.callstr;
        nowtask.flagtime = Date.now();
        nowtask.flag = false;
        nowtask.user = params.user;
        const result = await chatgpt.call(callstr, params.opts);
        // 预防严重超时影响新请求
        if (!timeout(-500)) {
            nowtask.flag = true;
            nowtask.response = result.response;
            nowtask.conversationId = result.conversationId;
            nowtask.messageId = result.messageId;
            checkhistory.set(output,result);
        }
        res.send({
            success: true,
            data: {
                ...result
            },
        });
        return;
    } else {
        // console.log(nowtask.user != params.user);
        if (nowtask.user != params.user) {
            res.send({
                success: false,
                errorCode: "10915000",
                errorMessage: "Wait for another user's request",
            });
            return
        }
        while ((!nowtask.flag) || !checknowtask()) {
            await wait(500);
        }
        if (timeout()) {
            res.send({
                success: false,
                errorCode: "10915000",
                errorMessage: "timeout",
            });
            nowtask.flag = true;
            return
        } else {
            res.send({
                success: true,
                data: {
                    response: nowtask.response,
                    conversationId: nowtask.conversationId,
                    messageId: nowtask.messageId
                },
            });
            nowtask.flag = true;
            return
        }
    }

});
exports.getinfo = router.post("/getinfo", async (req, res) => {
    res.send({
        success: true,
        data: {
            nowtask
        },
    });
});
function checknowtask() {
    // 除了上锁时间未超时，其他都是可创建新任务。
    if (timeout() || nowtask.flag) {
        return true
    }
    return false
}
function timeout(change) {
    if (!change) {
        change = 0;
    }
    console.log(nowtask.flagtime + 60000, change);
    console.log(nowtask.flagtime + 60000 + change);
    return Date.now() >= (nowtask.flagtime + 60000 + change)
}
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}
