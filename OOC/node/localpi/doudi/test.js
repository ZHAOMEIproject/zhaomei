const jsonFile = require('jsonfile')

main();

async function main() {
    let signinfo = await jsonFile.readFileSync("./key_sign/wlk.json");
    let newobj = new Array();
    for (let i in signinfo) {
        newobj.push(i);
        if (newobj.length==100) {
            break;
        }
    }
    console.log(newobj.length);
    await jsonFile.writeFileSync("./key_sign/address.json",newobj, { spaces: 2, EOL: '\r\n' });
}