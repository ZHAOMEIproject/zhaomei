import { ChatGPTAPIBrowser } from 'chatgpt'

async function main(){
    const api = new ChatGPTAPIBrowser({
        email: "kflcsd@gmail.com",
        password: "XHKFDKxhlcdlx629"
    })
    await api.initSession()
    
    const result = await api.sendMessage('Hello World!')
    console.log(result.response)
}
main()