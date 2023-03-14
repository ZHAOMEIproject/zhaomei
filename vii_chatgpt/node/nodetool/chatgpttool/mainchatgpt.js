const {
    testsearch2urls,
    search2urls
} = require('./1_search2url');
const {
    testurl2texts,
    url2texts
} = require('./2_url2text');
const {
    testtext2splits,
    text2splits,
    text2split
} = require('./3_text2split');
const {
    q_testsplit2embeddings,
    testsplit2embeddings,
    split2embeddings,
    split2embedding
} = require('./4_split2embedding');
const {
    testembedding2dists,
    embedding2dists
} = require('./5_embedding2dist');
const {
    testdist2calltext,
    dist2calltext
} = require('./6_dist2calltext');
const {
    testcalltext2gpt3,
    calltext2gpt3
} = require('./7_chatgptcall');
var jsonFile = require('jsonfile')
module.exports = {
    // onlineSearch,
    // materialcall
    call
}
// let input = {
//     callstr: "武康大楼怎么去？",
//     opts:{
//         parentMessageId: "parentMessageId",
//         systemMessage: "",
//         scene: "武康大楼"
//     }
// }
// materialcall(input.callstr, input.opts)
async function call(callstr,opts) {
    opts["scene"]="武康大楼"
    let embeddings = await jsonFile.readFileSync(__dirname+"/material/material" + opts.scene + ".json");
    let q_plits = await text2split(callstr);
    let q_embeddings = await split2embedding(...q_plits);
    let dist = await embedding2dists(embeddings, q_embeddings);
    let calltext = await dist2calltext(dist, q_embeddings);
    // console.log(q_plits);
    opts["systemMessage"] = calltext.system
    // console.log(calltext,opts);
    let answer = await calltext2gpt3(calltext.calltext, opts);
    // console.log(answer);
    return answer
    // console.log(embeddings);
}
// async function onlineSearch(input) {
//     let searchresults = await search2urls(input.text);
//     searchresults = searchresults.items
//     let urls = [];
//     for (let i in searchresults) {
//         urls.push(searchresults[i].link);
//     }
//     // console.log(urls);
//     let plits = await text2splits(await url2texts(urls));
//     let q_plits = await text2split(input.text);
//     // console.log(q_plits);
//     let embeddings = await split2embeddings(plits);
//     let q_embeddings = await q_split2embeddings(q_plits);
//     let dist = await embedding2dists(embeddings, q_embeddings);
//     // console.log(dist);
//     // console.log(q_embeddings);
//     let calltext = await dist2calltext(dist, q_embeddings);
//     // console.log(calltext);
//     // var jsonFile = require('jsonfile')
//     // await jsonFile.writeFileSync("./tool/test/calltext.json", calltext, { spaces: 2, EOL: '\r\n' });
//     // return
//     let opts = {
//         systemMessage: calltext.system
//     }
//     let answer = await calltext2gpt3(calltext.calltext + input.systemMessage, opts);
//     console.log(answer);
// };