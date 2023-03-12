module.exports = {
    q_testsplit2embeddings,
    testsplit2embeddings,
    split2embeddings,
    split2embedding
}
var jsonFile = require('jsonfile')
var api;
let g_opt = {
    OPENAI_API_KEY: "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"
}
var isInitialized = false;
checkopt();
async function checkopt() {
    let now_opt = global.split2embedding;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
                isInitialized = false;
            }
        }
    }
    if (!isInitialized) {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: g_opt.OPENAI_API_KEY,
        });
        api = new OpenAIApi(configuration);
        isInitialized = true;
    }
}


{
    // var jsonFile = require('jsonfile')
    // let testinput = require('./test/splits.json');
    // main();
    // async function main() {
    //     // let simpleinput=[testinput[0]]
    //     let embeddings = await split2embeddings(testinput)
    //     console.log(embeddings);
    //     await jsonFile.writeFileSync("./test/embeddings.json", embeddings, { spaces: 2, EOL: '\r\n' });
    // }
}
{
    // var jsonFile = require('jsonfile')
    // let testinput = require('./test/q_split.json');
    // main();
    // async function main() {
    //     // let simpleinput=[testinput[0]]
    //     let embeddings = await split2embedding(testinput)
    //     // console.log(testinput, embeddings);
    //     // return
    //     console.log(embeddings);
    //     await jsonFile.writeFileSync("./test/q_embedding.json", embeddings, { spaces: 2, EOL: '\r\n' });
    // }
}


const testresult = require('./test/embeddings.json');
function testsplit2embeddings() {
    return testresult;
}
const q_testresult = require('./test/q_embedding.json');
function q_testsplit2embeddings() {
    return q_testresult;
}
// console.log(testsplit2embeddings());
// console.log(q_testsplit2embeddings());
async function split2embeddings(inputs) {
    await checkopt();
    while (!isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    let tasks = new Array;
    for (let i in inputs) {
        tasks.push(split2embedding(inputs[i]))
        console.log(i);
        await wait(1100);
    }
    await Promise.all(tasks);
    return inputs;
}
async function split2embedding(input) {
    await checkopt();
    while (!isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    let response;
    try {
        response = await api.createEmbedding({
            model: "text-embedding-ada-002",
            input: input.segment,
        });
    } catch (error) {
        console.log(error);
        return
    }
    // response["data"]=await jsonFile.readFileSync('./test/oneembedding.json');
    input["embedding"] = (response.data.data[0].embedding)
    return input
}
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}
