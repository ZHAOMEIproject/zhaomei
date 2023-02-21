
const 

main()
async function main() {
    console.log(await post('http://127.0.0.1:10915/v1/chatgpt/chatcall', data));
}
const request = require('request');
function post(url, data) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body);
                resolve(json);
            } else {
                console.log(error);
                resolve(error);
            }
        });
    })
}