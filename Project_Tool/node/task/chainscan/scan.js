const {getcontractinfo}=require('../../nodetool/chainid_readcontracts');
const {checkandcreatdatabase,scancontract} =require('./fun/scansql');

exports.scan = async function scan(){
    var contractinfo =await getcontractinfo();
    // console.log(contractinfo["3"]["TE_order"].abi);
    // await checkandcreatdatabase(global.name,contractinfo);
    await scancontract(contractinfo);
    console.log("end");
}