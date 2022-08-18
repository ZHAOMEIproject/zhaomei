const {getsign} = require("../api/sign/getsign");
const mysqlconn = require("../nodetool/sqlconnection");
const {readcontracts}=require("../api/contractapi");
// loading
{
    setinfo = require("../../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.ROOT_SQL;
}


main();

async function main(){
    global.mysqlGlobal.database="Vii_Owl_v2";
    let sql = "select address,nonce,typemint,deadline from address_sign where center = 'F';"
    let rqinfo = await mysqlconn.sqlcall(sql,null);
    // console.log(reinfo);
    let sign_info={
        "id":80001,
        "contractname":"VII_OWL"
    }
    let params={
        id:80001,
        contractname:"VII_OWL",
        fun:"signcheck"
    }
    for(let i in rqinfo){
        console.log(rqinfo[i]);
        let values = Object.values(rqinfo[i]);
        let sign_rq = await getsign(sign_info.id,sign_info.contractname,values)
        console.log(sign_rq);
        params["params"]=[[...values,...Object.values(sign_rq)]]
        let result = await readcontracts(params);
        console.log(result);
        
    }
}