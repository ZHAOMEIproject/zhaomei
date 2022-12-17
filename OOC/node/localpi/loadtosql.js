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
    let sql = "select address,typemint from address_sign where center = 'F';"
    let rqinfo = await mysqlconn.sqlcall(sql, null);
    let output = new Object();
    for (let i in rqinfo) {
        // console.log(rqinfo[i]);
        let input = new Array();
        input = [
            rqinfo[i]["address"],
            2,
            secret.baseinfo.blocktime,
            rqinfo[i]["typemint"]
        ]
        let sign_rq = await getsign(
            secret.baseinfo.chainId, secret.baseinfo.contractname,
            [...input]
        )

        let updatesql = "update address_sign set amount=?,deadline=?,v=?,r=?,s=?,center='S' where address = ?;"
        let updateinfo = await mysqlconn.sqlcall(updatesql, [2, secret.baseinfo.blocktime, ...Object.values(sign_rq), rqinfo[i].address]);
        console.log(rqinfo[i]["address"]);
        output[rqinfo[i]["address"]] = [...input, ...Object.values(sign_rq)];
    }
    console.log(output);
    await jsonFile.writeFileSync("./test.json", output, { spaces: 2, EOL: '\r\n' });
}