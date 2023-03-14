module.exports = {
    sendafter,
    sendbefor,
    send2tokens,
    show_history
}
const main = require('ethtool');
const { v4: uuidv4 } = require('uuid');
let historys = {};
let g_opt = {
    max_token:3000
}
checkopt();
async function checkopt() {
    let now_opt = global.history;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
            }
        }
    }
}
// {
//     let resulttextid = sendafter(
//         {"role": "system", content:"一大堆武康大楼的资料"},
//         {"role": "user", content:"武康大楼怎么去？"});
//     let resulttextid2 = sendafter(
//         {"role": "assistant", content:"武康大楼去的方法"},
//         {"role": "user", content:"用地铁怎么去？"},resulttextid);
//     // let nowhistory=historys[resulttextid2];
//     // console.log(show_history());
//     main()
//     async function main(){
//         console.log(await sendbefor(
//             [
//                 {"role": "system", content:"一大堆武康大楼的资料"}
//             ],
//             resulttextid2
//         ));
//     }
// }

async function sendbefor(rolecalltexts, parentMessageId) {
    await checkopt();
    let messages = rolecalltexts;
    // console.log("test",messages);
    let nowhistory=historys[parentMessageId];
    // console.log("test",messages.length,nowhistory.text.role);
    do {
        if (nowhistory) {
            if (send2tokens([...messages,nowhistory.text])>g_opt.max_token) {
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
function send2tokens(sends){
    const encoding = require('@dqbd/tiktoken').encoding_for_model('gpt-3.5-turbo-0301');
    // const tokenizer = require('@dqbd/tiktoken').get_encoding("cl100k_base")
    let num_tokens = 0;
    // console.log("test",sends);
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
function show_history(){
    return historys;
}