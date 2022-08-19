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
    let sql = "select address,nonce,typemint,deadline from address_sign where center = 'S';"
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
    let output = new Object();
    for(let i in rqinfo){
        console.log(rqinfo[i]);
        let input = new Array();
        for(let j in check){
            input.push(rqinfo[i][check[j]]);
        }

        let sign_rq = await getsign(sign_info.id,sign_info.contractname,[...input,rqinfo[i].nonce])
        // console.log(sign_rq);
        // params["params"]=[[...input,...Object.values(sign_rq)],rqinfo[i].nonce]
        // let result = await readcontracts(params);
        // console.log(result);
        let updatesql ="update address_sign set v=?,r=?,s=?,center='S' where address = ? and nonce=? and typemint=? and deadline=?;"
        let updateinfo = await mysqlconn.sqlcall(updatesql,[...Object.values(sign_rq),...Object.values(rqinfo[i])]);
        if(output[rqinfo[i]["address"]]==null){
            output[rqinfo[i]["address"]] = new Object();
        }
        if(output[rqinfo[i]["address"]][rqinfo[i].typemint]==null){
            output[rqinfo[i]["address"]][rqinfo[i].typemint]=new Object();
        }
        output[rqinfo[i]["address"]][rqinfo[i].typemint][rqinfo[i].nonce]=[...input, ...Object.values(sign_rq)]
    }
    console.log(output);

    const fs = require("fs")
    const path = require("path")
    let fileName ="test";
    const outputFile = path.join(__dirname, `./${fileName}.json`)
    fs.writeFile(outputFile, JSON.stringify(output, '' , ' '), (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`./${fileName}.json 创建成功！！！`)
        }
    })
}