const jsonFile = require('jsonfile')

main()

async function main(){
    let b_ac=await jsonFile.readFileSync("./end.json");
    let k_ac=await jsonFile.readFileSync("../localpi/key_sign/OG_k.json");
    let key = new Array();
    for (let i in b_ac) {
        key.push(k_ac[b_ac[i]]);
    }
    await jsonFile.writeFileSync("./endofkey.json",key, { spaces: 2, EOL: '\r\n' });
}

async function read_write(){

}