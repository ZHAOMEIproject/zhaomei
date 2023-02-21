global.secret = require("../../privateinfo/.secret.json");

async function main(){
    var {ChatGPTAPIBrowser} = await import('chatgpt');
    const api = new ChatGPTAPIBrowser({
        email: global.secret.vii_chatgpt.email,
        password: global.secret.vii_chatgpt.password
    })
    await api.initSession()
    
    const result = await api.sendMessage('Hello World!')
    console.log(result.response)
}
main()