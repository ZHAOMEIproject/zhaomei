global.secret = require("../../privateinfo/.secret.json");

async function main() {
    var { ChatGPTAPI } = await import('chatgpt');
    const api = new ChatGPTAPI({
        apiKey: global.secret.vii_chatgpt.apiKey
    })

    // send a message and wait for the response
    let res = await api.sendMessage('What is OpenAI?')
    console.log(res.text)

    // send a follow-up
    res = await api.sendMessage('Can you expand on that?', {
        conversationId: res.conversationId,
        parentMessageId: res.id
    })
    console.log(res.text)

    // send another follow-up
    res = await api.sendMessage('What were we talking about?', {
        conversationId: res.conversationId,
        parentMessageId: res.id
    })
    console.log(res.text)
}
main()