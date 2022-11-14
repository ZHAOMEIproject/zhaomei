const {getsign} = require("../api/sign/getsign");
const mysqlconn = require("../nodetool/sqlconnection");
// loading
{
    setinfo = require("../../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.ROOT_SQL;
}


main();

async function main(){
    global.mysqlGlobal.database="OOC";
    let sql = "select address,community,amount,typemint,deadline from address_sign where center = 'F';"
    let rqinfo = await mysqlconn.sqlcall(sql,null);
    // console.log(reinfo);
    let sign_info={
        "id":31337,
        "contractname":"OOC"
    }
    let params={
        id:80001,
        contractname:"OOC",
        fun:"signcheck"
    }
    let check =["address","community","amount","typemint","deadline"];
    let output = new Object();
    for(let i in rqinfo){
        console.log(rqinfo[i]);
        let input = new Array();
        for(let j in check){
            input.push(rqinfo[i][check[j]]);
        }
        // console.log();
        let sign_rq = await getsign(sign_info.id,sign_info.contractname,[...input])
        // console.log(sign_rq);
        // params["params"]=[[...input,...Object.values(sign_rq)],rqinfo[i].amount]
        // let result = await readcontracts(params);
        // console.log(result);
        let updatesql ="update address_sign set v=?,r=?,s=?,center='S' where address = ?;"
        let updateinfo = await mysqlconn.sqlcall(updatesql,[...Object.values(sign_rq),rqinfo[i].address]);
        if(output[rqinfo[i]["address"]]==null){
            output[rqinfo[i]["address"]] = new Object();
        }
        if(output[rqinfo[i]["address"]][rqinfo[i].typemint]==null){
            output[rqinfo[i]["address"]][rqinfo[i].typemint]=new Object();
        }
        output[rqinfo[i]["address"]][rqinfo[i].typemint][rqinfo[i].amount]=[...input, ...Object.values(sign_rq)]
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