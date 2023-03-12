module.exports = {
    testcalltext2gpt3,
    calltext2gpt3
}
var jsonFile = require('jsonfile')

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
        var {
            ChatGPTAPI
        } = await import('chatgpt');
        api = new ChatGPTAPI({
            apiKey: g_opt.OPENAI_API_KEY
        })
        isInitialized = true;
    }
}
// {
//     var jsonFile = require('jsonfile')
//     let calltext = require('./test/calltext.json');
//     main();
//     async function main() {
//         // let simpleinput=[testinput[0]]
//         let opts={
//             systemMessage:calltext.system
//         }
//         // console.log(calltext.calltext, opts);
//         // return
//         // await wait(1000)
//         let answer = await testcalltext2gpt3(calltext.calltext, opts)
//         console.log(answer);
//         await jsonFile.writeFileSync("./test/answer.json", answer, { spaces: 2, EOL: '\r\n' });
//     }
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
        const result = await api.sendMessage(calltext, opts)
        // console.log(result)
        return result;
    } catch (error) {
        console.log(error);
        return error
    }
}