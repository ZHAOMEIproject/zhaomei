const {getsign} = require("../api/sign/getsign");
const mysqlconn = require("../nodetool/sqlconnection");
// loading
{
    setinfo = require("../../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.ROOT_SQL;
}


main();

async function main(){
    global.mysqlGlobal.database="Vii_Owl_v2";
    let sql = "select address,nonce,typemint,deadline from address_sign where center = 'F';"
    let reinfo = await mysqlconn.sqlcall(sql,null);
    // console.log(reinfo);
    let sign_info={
        "id":80001,
        "contractname":"VII_OWL"
    }
    for(let i in reinfo){
        getsign(sign_info.id,sign_info.contractname,)
    }
}