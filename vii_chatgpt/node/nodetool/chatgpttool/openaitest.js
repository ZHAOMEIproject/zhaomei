
main()
async function main(){
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello world"}],
    });
    console.log(completion.data.choices[0].message);
}