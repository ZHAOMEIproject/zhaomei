var api;
init();
async function init(){
    // return
    var {ChatGPTAPI} = await import('chatgpt');
    // console.log(ChatGPTAPIBrowser);
    api = new ChatGPTAPI({
        apiKey:"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"
    })
    // await api.initSession();
    // const result = await api.sendMessage('Hello World!')
    // console.log(result)
}


exports.call = async function call(callstr,opts){
    // await wait(5000);
    // return {
    //     response: '你好！我是 OpenAI 的语言模型 ChatGPT，有什么我可以帮忙的？',
    //     conversationId: 'ff1a2e91-0030-43c5-a230-4e31a60b53df',
    //     messageId: '1ff8f7b2-9c37-441c-b188-c059c44cde60'
    // }
    // opts.promptPrefix="Please as travel guide and answer with real humor."
    // console.log(callstr,opts);
    opts.systemMessage=`You are a helpful assistant.Try to reply in short words.
    Current date: ${new Date().toISOString()}\n\n`
    try {
        const result = await api.sendMessage(callstr,opts)
        console.log(result)
        result.response=result.text
        result.messageId=result.parentMessageId
        result.conversationId=result.parentMessageId
        return result;
    } catch (error) {
        console.log(error);
        return error
    }
}
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

