const {getcontractinfo}=require('../../nodetool/id-readcontracts');
const {checkandcreatdatabase,scancontract} =require('./fun/scansql');

exports.scan = async function scan(){
    var contractinfo =await getcontractinfo();
    await scancontract(contractinfo);
    console.log("end");
}