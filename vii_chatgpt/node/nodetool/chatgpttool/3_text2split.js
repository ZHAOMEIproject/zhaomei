
const tokenizer = require('@dqbd/tiktoken').get_encoding('cl100k_base');

module.exports = {
    testtext2splits,
    text2splits,
    text2split,
    text2splits2
}


// {
//     var jsonFile = require('jsonfile')
//     let testinput = require('./test/texts.json');
//     main();
//     async function main() {
//         let splits = await text2splits(testinput)
//         console.log(splits);
//         await jsonFile.writeFileSync("./test/splits.json", splits, { spaces: 2, EOL: '\r\n' });
//     }
// }
const testresult = require('./test/splits.json');
function testtext2splits() {
    return testresult;
}
// console.log(testtext2splits());

let g_opt = {
    max_tokens: 1000
}
async function checkopt() {
    let now_opt = global.text2split;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
            }
        }
    }
}
async function text2splits(texts) {
    await checkopt();
    let tasks = new Array;
    for (let i in texts) {
        tasks.push(text2split(texts[i]))
    }
    let temporary = await Promise.all(tasks);
    let results = temporary.reduce((accumulator, currentArray) => {
        return [...accumulator, ...currentArray];
    }, []);
    return results;
}
async function text2split(text) {
    await checkopt();
    let half = g_opt.max_tokens / 2;
    const sentences = await text.split(/(?<=[。？！：；.:;])/);
    const n_tokens = sentences.map((sentence) => tokenizer.encode(" " + sentence).length);

    let tokens_so_far = 0;
    let currentSegment = '';
    let all = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const token = n_tokens[i];
        if (token > half) {
            continue;
        }
        if (tokens_so_far + token > g_opt.max_tokens) {
            all.push({
                segment: currentSegment,
                token: tokens_so_far
            });
            tokens_so_far = 0;
            currentSegment = '';
        }
        currentSegment += sentence;
        tokens_so_far += token;
        if (i === sentences.length - 1) {
            all.push({
                segment: currentSegment,
                token: tokens_so_far
            });
        }
    }
    return all;
}

async function text2splits2(texts) {
    await checkopt();
    let tasks = new Array;
    for (let i in texts) {
        tasks.push(text2split2(texts[i]))
    }
    let temporary = await Promise.all(tasks);
    let results = temporary.reduce((accumulator, currentArray) => {
        return [...accumulator, ...currentArray];
    }, []);
    return results;
}
async function text2split2(text) {
    await checkopt();
    let half = g_opt.max_tokens / 2;
    const sentences = await text.split(/(?<=[。？！：；.:;])/);
    const n_tokens = sentences.map((sentence) => tokenizer.encode(" " + sentence).length);

    let tokens_so_far = 0;
    let currentSegment = '';
    let all = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const token = n_tokens[i];
        if (token > half) {
            continue;
        }
        if (tokens_so_far + token > g_opt.max_tokens) {
            all.push({
                segment: currentSegment,
                token: tokens_so_far
            });
            tokens_so_far = 0;
            currentSegment = '';
        }
        currentSegment += sentence;
        tokens_so_far += token;
        if (i === sentences.length - 1) {
            all.push({
                segment: currentSegment,
                token: tokens_so_far
            });
        }
    }
    for (let i = 0; i < all.length - 1; i++) {
        all[i] = {
            segment: all[i].segment + all[i + 1].segment,
            token: all[i].token + all[i + 1].token
        }
    }
    all.pop()

    return all;
}