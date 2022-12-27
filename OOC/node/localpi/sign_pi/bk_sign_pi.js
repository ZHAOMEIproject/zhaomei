const { getsign } = require("../../api/sign/getsign");
const mysqlconn = require("../../nodetool/sqlconnection");
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const jsonFile = require('jsonfile')
// loading
{
    setinfo = require("../../../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.ROOT_SQL;
}


main();

async function main() {
    global.mysqlGlobal.database = "VII_OOC";
    let signinfo = await jsonFile.readFileSync("../doudi/key_sign/OG.json");
    // let signinfo = await jsonFile.readFileSync("../doudi/key_sign/WL.json");
    // let signinfo = await jsonFile.readFileSync("../50_mint/key_sign/OG.json");
    // let signinfo = await jsonFile.readFileSync("../2_mint/key_sign/WL.json");
    
    let replacesql = "replace into address_sign(address,amount,deadline,typemint,v,r,s,center) values(?)"
    for (let i in signinfo) {
        let replaceinfo = await mysqlconn.sqlcall(replacesql, [[...signinfo[i], "B"]]);
        // console.log(replaceinfo);
    }
}