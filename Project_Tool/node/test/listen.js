const web3 = require('web3');
const {getcontractinfo}=require('../nodetool/chainid_readcontracts');
var web3js;

test();
async function test(){
    var contractinfo =await getcontractinfo();
    contractinfo[3]["TE_order"].address='0x6B258b8523196eCB2470D2E8F4D8c5a24FFC5E45';
    // console.log(contractinfo[3]["TE_order"]);
    web3js = new web3(contractinfo[3]["TE_order"].network.url);
    let listen = await getContractEvents(contractinfo[3]["TE_order"],12524100,12524212);
    console.log(listen[0].raw);
}

// Get Contract Events
const getContractEvents = (info,from_timestamp,toBlock) =>{
    return new Promise(async (resolve, reject)=> {
        let contract = new web3js.eth.Contract(info.abi,info.address);
        contract.getPastEvents('allEvents', {
            fromBlock: from_timestamp,
            toBlock: toBlock,
        }, function(error, result){
            resolve(result);
        })
    })
}

module.exports = {
    getContractEvents,
};