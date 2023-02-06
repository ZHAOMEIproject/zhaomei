var api;
init();
async function init(){
    return
    var {ChatGPTAPIBrowser} = await import('chatgpt');
    // console.log(ChatGPTAPIBrowser);
    api = new ChatGPTAPIBrowser({
        email: global.secret.vii_chatgpt.email,
        password: global.secret.vii_chatgpt.password
    })
    await api.initSession();
    const result = await api.sendMessage('Hello World!')
    console.log(result)
}


exports.call = async function call(callstr,opts){
    await wait(5000);
    return {
        response: '你好！我是 OpenAI 的语言模型 ChatGPT，有什么我可以帮忙的？',
        conversationId: 'ff1a2e91-0030-43c5-a230-4e31a60b53df',
        messageId: '1ff8f7b2-9c37-441c-b188-c059c44cde60'
    }
    try {
        const result = await api.sendMessage(callstr,opts)
        console.log(result)
        return result;
    } catch (error) {
        return error
    }
}
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

