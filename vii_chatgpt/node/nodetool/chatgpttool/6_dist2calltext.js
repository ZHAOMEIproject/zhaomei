module.exports = {
    testdist2calltext,
    dist2calltext
}
// {
//     var jsonFile = require('jsonfile')
//     let testinput = require('./test/dists.json');
//     let q_testinput = require('./test/q_embedding.json');
//     main();
//     async function main() {
//         // let simpleinput=[testinput[0]]
//         let calltext = await dist2calltext(testinput, q_testinput)
//         console.log(calltext);
//         await jsonFile.writeFileSync("./test/calltext.json", calltext, { spaces: 2, EOL: '\r\n' });
//     }
// }
const testresult = require('./test/calltext.json');
function testdist2calltext(dists, q_dists) {
    return testresult;
}
let g_opt = {
    max_len: 1000
}
var isInitialized = false;
checkopt();
async function checkopt() {
    let now_opt = global.dist2calltext;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
                isInitialized = false;
            }
        }
    }
}
// console.log(testdist2calltext());
async function dist2calltext(dists, q_dists) {
    await checkopt();
    let systemstr ="根据对话以及资料简单回答问题，如果根据对话和资料不能回答问题，说“我不知道，请你问得详细点”。 资料: ";
    let result = "";
    let cur_len = q_dists.token;
    for (let i in dists) {
        cur_len += dists[i].token;
        if (cur_len > g_opt.max_len) {
            break;
        }
        result += dists[i].segment
    }
    // console.log(q_dists.segment);
    return {
        system:(systemstr+result),
        calltext:q_dists.segment
    }
}