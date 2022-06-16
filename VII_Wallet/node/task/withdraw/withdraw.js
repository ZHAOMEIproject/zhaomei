const {getcontractinfo}=require('./readcontracts');
const connection = require("../../nodetool/sqlconnection");
const Web3 = require('web3');
async function getwithdrawevent(){
    let selsql = "SELECT * FROM withdraw where flag_withdraw ='F' limit 1";
    return await connection.select(selSql,null);
}
exports.withdraw = async function withdraw(){
    



}

async function withdrawsign(){
    const contractinfo = await getcontractinfo();

    const web3 = new Web3(contractinfo.);

}