const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
    testurl2texts,
    url2texts
}

// {
//     var jsonFile = require('jsonfile')
//     let testinput = require('./test/urls.json');
//     main();
//     async function main() {
//         let texts = await url2texts(testinput)
//         await jsonFile.writeFileSync("./test/texts.json", texts, { spaces: 2, EOL: '\r\n' });
//     }
// }

const testresult = require('./test/texts.json');
function testurl2texts(urls) {
    return testresult;
}
// console.log(testurl2texts());

async function url2texts(urls) {
    let results = new Array;
    let tasks = new Array;
    for (let i in urls) {
        tasks.push(url2text(urls[i]))
    }
    let temporary = await Promise.all(tasks);
    for (let i in temporary) {
        if (temporary[i]) {
            results.push(temporary[i])
        }
    }
    return results;
}
async function url2text(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $('script').remove();
        $('style').remove();
        const text = $('body').text();
        if (text.includes('You need to enable JavaScript to run this app.')) {
            console.log(`Unable to parse page ${url} due to JavaScript being required`);
        } else {
            return removeNewlines((text + url));
            // fs.writeFileSync(filePath, text);
        }
    } catch (error) {
        // console.log(error);
        console.log("error", url);
    }
}

function removeNewlines(text) {
    text = text.replace(/\\\\/g, '\\');
    text = text.replace(/\n|\\n|\t|\r|\b|\f|\v/g, ' ');
    text = text.replace(/ {2,}/g, ' ');
    text = text.replace(/ {2,}/g, ' ');

    return text;
}