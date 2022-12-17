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

    let input = new Array();
    input = [
        "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
        2,
        secret.baseinfo.blocktime,
        1
    ]
    let sign_rq = await getsign(
        secret.baseinfo.chainId, secret.baseinfo.contractname,
        [...input]
    )
    console.log(sign_rq);
}