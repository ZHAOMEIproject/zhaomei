const request = require("request");
function getApi(url){
    return new Promise(function (resolve, reject) {
        request({
            timeout:10000,    // Set timeout
            method:'GET',     // Set method
            url:url
        },async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body);
                resolve(json.result);
            }else{
                console.log("message --> get api event contract fail.");
                resolve();
            }
        })
    })
}

main();
async function main(){
    let getinfo =await getApi("ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/");
    console.log(getinfo);
}