

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
            model: "gpt-3.5-turbo-0613",
            "max_tokens": 150,
            messages: messages
        });
        return response;
    } catch (error) {
        console.log(error);
        return error
    }
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
            if (send2tokens([...messages,nowhistory.text])>200) {
                break;
            }
            messages.unshift(nowhistory.text)
            nowhistory=nowhistory.parentMessage
        }else{
            break
        }
    } while (true);
    return messages;
}
function send2tokens(sends){
    const encoding = require('@dqbd/tiktoken').encoding_for_model('gpt-3.5-turbo-0301');
    // const tokenizer = require('@dqbd/tiktoken').get_encoding("cl100k_base")
    let num_tokens = 0;
    for (let i in sends) {
        num_tokens += 4
        for (let j in sends[i]) {
            num_tokens += (encoding.encode(sends[i][j])).length
            if (j=="name") {
                num_tokens += -1
            }
        }
    }
    num_tokens += 2
    return num_tokens
}

{
    let resulttextid = sendafter(
        {"role": "system", content:"一大堆武康大楼的资料"},
        {"role": "user", content:"武康大楼怎么去？"});
    let resulttextid2 = sendafter(
        {"role": "assistant", content:"武康大楼去的方法"},
        {"role": "user", content:"用地铁怎么去？"},resulttextid);
    let nowhistory=historys[resulttextid2];
    historys[resulttextid].text.content +="test"
    main();
    async function main() {
        global.send2tokens = {
            max_tokens: 500
        }
        let calltext = {
            role: 'user',
            content:"武康大楼怎么去？"
        }
        let messages = await sendbefor(calltext, resulttextid2)
        console.log(messages);
        // let result = await calltext2gpt3();
        let result ={
            "id": "chatcmpl-6tWoH0lDT7qrvjpK1q9ZdbNToEZeQ",
            "object": "chat.completion",
            "created": 1678692181,
            "model": "gpt-3.5-turbo-0301",
            "usage": {
                "prompt_tokens": 38,
                "completion_tokens": 123,
                "total_tokens": 161
            },
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "武康大楼位于上海市徐汇区，具体地址为上海市徐汇区武康路378号。您可以乘坐地铁1号线或10号线到陕西南路站，从1号口或12号口出站，步行约10分钟即可到达武康大楼。您也可以选择乘坐公交车，在武康路站下车，步行约5分钟即可到达。"
                    },
                    "finish_reason": "stop",
                    "index": 0
                }
            ]
        }
        let endid = await sendafter(calltext, result.choices[0].message,resulttextid2);
        console.log(historys,endid);
    }
}