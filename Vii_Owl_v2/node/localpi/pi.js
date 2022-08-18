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
    let check =["address","typemint","deadline"];

    for(let i in rqinfo){
        console.log(rqinfo[i]);
        let input = new Array();
        for(let j in check){
            input.push(rqinfo[i][check[j]]);
        }

        let sign_rq = await getsign(sign_info.id,sign_info.contractname,[...input,rqinfo[i].nonce])
        console.log(sign_rq);
        params["params"]=[[...input,...Object.values(sign_rq)],rqinfo[i].nonce]
        let result = await readcontracts(params);
        console.log(result);
        
    }
}