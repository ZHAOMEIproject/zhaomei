

var api;
let g_opt = {
    OPENAI_API_KEY: "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"
}
var isInitialized = false;
checkopt();
async function checkopt() {
    let now_opt = global.chatgptcall;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
                isInitialized = false;
            }
        }
    }
    if (!isInitialized) {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: g_opt.OPENAI_API_KEY,
        });
        api = new OpenAIApi(configuration);
        isInitialized = true;
    }
}

async function calltext2gpt3(calltext, opts) {
    await checkopt();
    while (!isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    let messages = await sendbefor(calltext, opts);
    let response;
    try {
        response = await api.createEmbedding({
            model: "gpt-3.5-turbo-0301",
            "max_tokens": 150,
            messages: messages
        });
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
}

const crypto = require('crypto');
{
    let completions = {
        "model": "gpt-3.5-turbo-0301",
        "max_tokens": 150,
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant.并简要回答问题."
            },
            {
                "role": "user",
                "content": "武康大楼怎么去？"
            },
            {
                "role": "assistant",
                "content": "武康大楼位于上海市徐汇区淮海中路101号，你可以搭乘地铁1/10号线至陕西南路站，从6号出口出站步行约7分钟即可到达。也可以乘坐公交车到淮海中路陕西南路站下车，步行5分钟即可到达。祝您旅途愉快！"
            },
            {
                "role": "user",
                "content": "我上一句问的什么？"
            }
        ]
    }
    let calltext = "武康大楼怎么去？"
    let opts = {
        "parentMessageId": "12e780a5-5f9b-4464-ae09-65100def8f3e",
    }
    // await sendbefor(calltext, opts)
    let result = await chatgptcall();
    await sendafter(calltext, result);
    console.log(hash);

}




const { v4: uuidv4 } = require('uuid');
let historys = {};
function sendafter(rolecalltext, roleresult,parentMessageId) {
    let calltextid = uuidv4();
    historys[calltextid]={
        text:rolecalltext,
        parentMessage:historys[parentMessageId]
    }
    let resulttextid = uuidv4();
    historys[resulttextid]={
        text:roleresult,
        parentMessage:historys[calltextid]
    }
    return resulttextid;
}
function sendbefor(rolecalltext, parentMessageId) {
    let messages = [rolecalltext];
    let nowhistory=historys[parentMessageId];
    do {
        if (nowhistory) {
            messages.push(nowhistory.text)
            nowhistory=nowhistory.parentMessage
        }else{
            break
        }
    } while (true);
    return messages;
}