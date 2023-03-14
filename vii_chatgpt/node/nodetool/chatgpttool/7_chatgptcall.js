module.exports = {
    testcalltext2gpt3,
    calltext2gpt3
}
var jsonFile = require('jsonfile')
const {
    sendafter,
    sendbefor,
    show_history
} = require('./7_history.js')
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
        // var {
        //     ChatGPTAPI
        // } = await import('chatgpt');
        // api = new ChatGPTAPI({
        //     apiKey: g_opt.OPENAI_API_KEY
        // })
        // isInitialized = true;

        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: g_opt.OPENAI_API_KEY,
        });
        api = new OpenAIApi(configuration);
        await new Promise(resolve => setTimeout(resolve, 2000));
        isInitialized = true;
    }
}
// {
//     var jsonFile = require('jsonfile')
//     // let calltext = require('./test/calltext.json');
//     let calltext = {
//         system: '根据对话以及资料简单回答问题，如果根据对话和资料不能回答问题，说“我不知道，请你问得详细点”。 资料:  武康大楼的容积率很高，充分地利用已有的地皮，底层因人行道狭窄，设置骑楼，将底层商店退进，让出通道。楼层为外廊式公寓，居室大多南向。户型组合灵活，有一室户、二室户、三室户和四室户等，共有居室 63 套、佣人房 30 多间。厨房沿北外廊布置，卫生间间接采光设通风道和引窗。垂直交通除了楼梯外，还设置了 3 部电梯。 建筑立面为法国文艺复兴风格，一、二层是东南亚常有的骑楼样式，拱门形成的长廊可以供行人遮阳避雨，立面是水泥墙面，如同一个莲花的基座，底层外墙为连续拱形券廊。三至七层为清水红砖墙，设计有三角形的窗楣，铁栅栏的小阳台，顶层的阳台沿着整个大楼外墙转了一圈。三层和顶层设环通走廊，既可以作为消防通道又替代腰线，起到美化立面的作用。三层立面采用三角形欧式窗楣装饰、四至五层立面部分设挑阳台。 历史文化 相关人物 1953 年，一些文化演艺界名流均入住此间，包括赵丹、王人美、秦怡、孙道临、郑君里、王文娟等。 活动 2021 年端午假期，短短 3 天武康大楼所在的衡复历史风貌区竟迎来了 40 多万名游客打卡。 所获荣誉 1994 年，武康大楼入选第二批上海市优秀历史建筑。 [ 6 ] 2021 年端午假期，武康大楼再度登上上海的热门景点榜单。 参观信息 地理位置 武康大楼位于上海市徐汇区淮海中路 1850 号，武康路、兴国路、淮海路、天平路、余庆路口五街交汇处。 开放时间 全年、全天开放。 门票价格 门票免费。 交通路线 公交：乘坐公交 26 、 911 、 926 路至淮海中路武康路站下。 ',
//         calltext: '武康大楼怎么去？'
//     }
//     let opts={
//         scene: '武康大楼',
//         timeoutMs: 100000,
//         systemMessage: '根据对话以及资料简单回答问题，如果根据对话和资料不能回答问题，说“我不知道，请你问得详细点”。 资料:  武康大楼的容积率很高，充分地利用已有的地皮，底层因人行道狭窄，设置骑楼，将底层商店退进，让出通道。楼层为外廊式公寓，居室大多南向。户型组合灵活，有一室户、二室户、三室户和四室户等，共有居室 63 套、佣人房 30 多间。厨房沿北外廊布置，卫生间间接采光设通风道和引窗。垂直交通除了楼梯外，还设置了 3 部电梯。 建筑立面为法国文艺复兴风格，一、二层是东南亚常有的骑楼样式，拱门形成的长廊可以供行人遮阳避雨，立面是水泥墙面，如同一个莲花的基座，底层外墙为连续拱形券廊。三至七层为清水红砖墙，设计有三角形的窗楣，铁栅栏的小阳台，顶层的阳台沿着整个大楼外墙转了一圈。三层和顶层设环通走廊，既可以作为消防通道又替代腰线，起到美化立面的作用。三层立面采用三角形欧式窗楣装饰、四至五层立面部分设挑阳台。 历史文化 相关人物 1953 年，一些文化演艺界名流均入住此间，包括赵丹、王人美、秦怡、孙道临、郑君里、王文娟等。 活动 2021 年端午假期，短短 3 天武康大楼所在的衡复历史风貌区竟迎来了 40 多万名游客打卡。 所获荣誉 1994 年，武康大楼入选第二批上海市优秀历史建筑。 [ 6 ] 2021 年端午假期，武康大楼再度登上上海的热门景点榜单。 参观信息 地理位置 武康大楼位于上海市徐汇区淮海中路 1850 号，武康路、兴国路、淮海路、天平路、余庆路口五街交汇处。 开放时间 全年、全天开放。 门票价格 门票免费。 交通路线 公交：乘坐公交 26 、 911 、 926 路至淮海中路武康路站下。 '
//       }
//     main();
//     async function main() {
//         // let simpleinput=[testinput[0]]
//         // console.log(calltext.calltext, opts);
//         // return
//         // await wait(1000)
//         let answer = await calltext2gpt3(calltext.calltext, opts);
//         console.log(answer);
//         await jsonFile.writeFileSync("./test/answer.json", answer, { spaces: 2, EOL: '\r\n' });
//     }
// }
// {
//     let resulttextid = sendafter(
//         {"role": "system", content:"一大堆武康大楼的资料"},
//         {"role": "user", content:"武康大楼怎么去？"});
//     let resulttextid2 = sendafter(
//         {"role": "assistant", content:"武康大楼去的方法"},
//         {"role": "user", content:"用地铁怎么去？"},resulttextid);
//     // let nowhistory=historys[resulttextid2];
//     console.log(show_history());
// }
const testresult = require('./test/answer.json');
function testcalltext2gpt3(calltext, opts) {
    return testresult;
}
// console.log(testcalltext2gpt3());
async function calltext2gpt3(calltext, opts) {
    await checkopt();
    while (!isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    try {
        let system = [
            {
                role: 'system',
                content: opts.systemMessage
            }
        ]
        let input = [
            {
                role: 'user',
                content: calltext
            }
        ]
        // console.log(system,input);
        let messages = await sendbefor([...system, ...input], opts["parentMessageId"]);
        // console.log(messages);
        // const result = {
        //     "id": "chatcmpl-6tWoH0lDT7qrvjpK1q9ZdbNToEZeQ",
        //     "object": "chat.completion",
        //     "created": 1678692181,
        //     "model": "gpt-3.5-turbo-0301",
        //     "usage": {
        //         "prompt_tokens": 38,
        //         "completion_tokens": 123,
        //         "total_tokens": 161
        //     },
        //     "choices": [
        //         {
        //             "message": {
        //                 "role": "assistant",
        //                 "content": "result"
        //             },
        //             "finish_reason": "stop",
        //             "index": 0
        //         }
        //     ]
        // }

        const result = await api.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            "max_tokens": 150,
            messages: messages
        });
        // console.log(result)
        let endid = await sendafter(...input, result.data.choices[0].message, opts["parentMessageId"]);
        
        // console.log(show_history());
        return {
            response:result.data.choices[0].message.content,
            parentMessageId:endid,
            messageId:endid,
            conversationId:endid,
        };
    } catch (error) {
        console.log(error);
        return error
    }
}