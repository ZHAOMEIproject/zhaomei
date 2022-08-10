const {scancontract} =require('./fun/checkerc721');

exports.scan = async function scan(){
    await scancontract(contractinfo);
    console.log("end");
}