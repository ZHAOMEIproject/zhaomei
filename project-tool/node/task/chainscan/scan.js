const {getcontractinfo}=require('../../nodetool/readcontracts');
const {checkandcreatdatabase,scancontract} =require('./function/scansql');

exports.scan = async function scan(){
    var contractinfo =await getcontractinfo();
    await checkandcreatdatabase(global.name,contractinfo);
    // await scancontract(contractinfo);
    console.log("end");
}