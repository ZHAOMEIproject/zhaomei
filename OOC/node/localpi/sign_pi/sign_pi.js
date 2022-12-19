const {getsign} = require("../../api/sign/getsign");
const mysqlconn = require("../../nodetool/sqlconnection");
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const jsonFile = require('jsonfile')
const createKeccakHash = require('keccak')

// loading
{
    setinfo = require("../../../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.ROOT_SQL;
}


main();

async function main(){
    global.mysqlGlobal.database="VII_OOC";
    let sql = "select address,typemint from address_sign where center = 'F';"
    let rqinfo = await mysqlconn.sqlcall(sql,null);
    let output = new Object();
    for(let i in rqinfo){
        // console.log(rqinfo[i]);
        let input = new Array();
        input=[
            toChecksumAddress(rqinfo[i]["address"]),
            2,
            secret.baseinfo.blocktime,
            rqinfo[i]["typemint"]
        ]
        let sign_rq = await getsign(
            secret.baseinfo.chainId,secret.baseinfo.contractname,
            [...input]
        )

        let updatesql ="update address_sign set address=?,amount=?,deadline=?,v=?,r=?,s=?,center='S' where address = ?;"
        let updateinfo = await mysqlconn.sqlcall(updatesql, [toChecksumAddress(rqinfo[i]["address"]),2, secret.baseinfo.blocktime, ...Object.values(sign_rq),rqinfo[i].address]);
        console.log(rqinfo[i]["address"]);
        output[rqinfo[i]["address"]]=[...input, ...Object.values(sign_rq)];
    }
    await jsonFile.writeFileSync("./test.json", output, { spaces: 2, EOL: '\r\n' });
}

function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}