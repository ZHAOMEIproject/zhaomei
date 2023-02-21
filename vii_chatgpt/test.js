
const crypto = require('crypto');
var callhistory = new Map();
async function main(){
    // {
    //     const map1 = new Map();
    //     map1.set('a', 1);
    //     map1.set('b', 2);
    //     map1.set('c', 3);
    //     console.log(map1.get('d'));
    //     // console.log(map1.get('a'));
    //     // // Expected output: 1
    
    //     // map1.set('a', 97);
    
    //     // console.log(map1.get('a'));
    //     // // Expected output: 97
    
    //     // console.log(map1.size);
    //     // // Expected output: 3
    
    //     // map1.delete('b');
    
    //     // console.log(map1.size);
    //     // // Expected output: 2
    // }
    // {
    //     var {v4} = await import('uuid');
    //     console.log(v4());
    //     console.log(v4());
    // }
    {
        const map1 = new Map();
        let callstr="你好";
        let opts
        ={
            "conversationId": "194cb915-9f2e-458d-bb56-91424607c6b4",//对话窗口id
            "parentMessageId": "5ae046c7-e1bb-4090-8be2-f7b5cab7100c",//上一句话的messageId
            "action":"variant"
        }
        const hash = crypto.createHash('sha256');
        if (!opts) {
            opts={}
        }
        console.log(callstr+opts.conversationId+opts.parentMessageId+opts.action);
        hash.update(callstr+opts.conversationId+opts.parentMessageId+opts.action);
        const output = hash.digest('hex');
        map1.set(output, {
            "response": "你好！我是 OpenAI 的语言模型 ChatGPT，有什么我可以帮忙的？",
            "conversationId": "ff1a2e91-0030-43c5-a230-4e31a60b53df",
            "messageId": "1ff8f7b2-9c37-441c-b188-c059c44cde60"
        });
        console.log(map1.get(output));
    }

}
main()
