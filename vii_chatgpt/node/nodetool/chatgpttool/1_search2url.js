const https = require('https');
module.exports = {
    testsearch2urls,
    search2urls
}


// var jsonFile = require('jsonfile')
// main();
// async function main() {
//     let urls=await search2urls("武康大楼怎么去？")
//     await jsonFile.writeFileSync("./test/urls.json", urls, { spaces: 2, EOL: '\r\n' });
// }

let testresult = require('./test/urls.json');
function testsearch2urls() {
    return testresult;
}
// console.log(testsearch2urls());
let g_opt = {
    key: 'AIzaSyANCrDSRXHPNOmmsB51yGqWLmlCRsjkJzU',
    cx: '77ea1dfd64ff74371',
    num: 10,
}
async function checkopt() {
    let now_opt = global.search2url;
    if (now_opt) {
        for (let i in now_opt) {
            const element = now_opt[i];
            if (element && g_opt[i] != element) {
                g_opt[i] = element;
            }
        }
    }
}
async function search2urls(question) {
    await checkopt();
    let { items } = await googelsearch(question);
    // console.log(items);
    let urls = [];
    for (let i in items) {
        urls.push(items[i].link)
    }
    return urls;
}

function googelsearch(question) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'customsearch.googleapis.com',
            path: `/customsearch/v1?key=${g_opt.key}&num=${g_opt.num}&cx=${g_opt.cx}&q=${encodeURIComponent(question)}`,
            method: 'GET'
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
}
