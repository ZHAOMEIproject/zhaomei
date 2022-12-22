const jsonFile = require('jsonfile')

main()
async function main() {
    for (let i = 0; i < 10000; i++) {
        let info ={
            "name": "OddOwl Club #"+i,
            "image": "ipfs://bafybeia2asm44gvothrqgvi54kjbnohaefbawnqlmfrtycwqemaeksmhw4"
        }
        await jsonFile.writeFileSync("./json/"+i+".json", info, { spaces: 2, EOL: '\r\n' });
    }
}