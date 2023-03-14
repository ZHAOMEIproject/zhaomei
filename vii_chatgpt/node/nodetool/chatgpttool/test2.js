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



let resulttextid = sendafter(
    {"role": "system", content:"一大堆武康大楼的资料"},
    {"role": "user", content:"武康大楼怎么去？"});
let resulttextid2 = sendafter(
    {"role": "assistant", content:"武康大楼去的方法"},
    {"role": "user", content:"用地铁怎么去？"},resulttextid);
let nowhistory=historys[resulttextid2];
historys[resulttextid].text.content +="test"
// do {
//     if (nowhistory) {
//         console.log(nowhistory.text);
//         nowhistory=nowhistory.parentMessage
//     }else{
//         break
//     }
// } while (true);
// let messages=sendbefor("123",resulttextid2);
// console.log(messages);


{
    main();
    async function main() {
        global.send2tokens = {
            max_tokens: 500
        }
        let calltext = "武康大楼怎么去？"
        let messages = await sendbefor(calltext, resulttextid2)
        console.log(messages);
        // let result = await chatgptcall();
        // await sendafter(calltext, result);

    }
}