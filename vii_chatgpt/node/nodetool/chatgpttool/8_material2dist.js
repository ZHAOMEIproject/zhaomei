module.exports = {
    testmaterial2split,
    material2split
}
const {
    text2splits,
    text2split,
    text2splits2
} = require('./3_text2split');
const {
    split2embeddings,
} = require('./4_split2embedding');
const fs = require('fs');
var jsonFile = require('jsonfile')
// {
//     main();
//     async function main() {

//         global.text2split = {
//             max_tokens: 500
//         }
//         let testinput = [
//             await r_txt('./material/武康大楼.txt')
//         ];
//         await testmaterial2split(testinput, "武康大楼");

//     }
// }

async function testmaterial2split(ebds, key) {
    let splits = await text2splits2(ebds);
    // console.log(splits);
    // return;
    let embeddings = await split2embeddings(splits);
    // console.log(embeddings);
    await jsonFile.writeFileSync("./material/material" + key + ".json", embeddings, { spaces: 2, EOL: '\r\n' });
}
// console.log(testmaterial2split());
async function material2split(ebds) {

}


async function r_txt(filePath) {
    return new Promise(resolve => {
        fs.readFile(filePath, 'utf8', async function (err, data) {
            data = removeNewlines(data);
            resolve(data)
        });
    })
}

function removeNewlines(text) {
    text = text.replace(/\\\\/g, '\\');
    text = text.replace(/\n|\\n|\t|\r|\b|\f|\v/g, ' ');
    text = text.replace(/ {2,}/g, ' ');
    text = text.replace(/ {2,}/g, ' ');
    return text;
}