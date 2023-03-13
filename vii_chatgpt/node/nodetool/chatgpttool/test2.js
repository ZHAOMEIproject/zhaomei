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
function sendbefor(calltext, parentMessageId) {
    let messages = [calltext];
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


let resulttextid = sendafter({content:"1"},{content:"2"});
let resulttextid2 = sendafter({content:"3"},{content:"4"},resulttextid);
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
let messages=sendbefor("123",resulttextid2);
console.log(messages);