const request = require("request");
main();

async function main(){
    let url ="https://ipfs.io/ipfs/QmTb8uK4Y2QKGTNpo6iBe1vafkRtKZfcMGrYYP23x6WqT5/1047";
    let info = await getbyurl(url)
    console.log(info);
}
function getbyurl(url){
    return new Promise(function (resolve, reject) {
        request({
            timeout:10000,    // Set timeout
            method:'GET',     // Set method
            url:url
        },async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body);
                resolve(json);
            }else{
                console.log("message --> get api event contract fail.");
                console.log(error);
                resolve();
            }
        })
    })
}