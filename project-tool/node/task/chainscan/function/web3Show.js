const web3 = require('web3');

var web3js;
async function setweb3js(url){
    console.log(web3js);
    web3js=url;
    console.log(web3js);
}

// getBlockNumber
const getBlockNumber = () =>{
    return new Promise(async (resolve, reject)=> {
        web3js.eth.getBlockNumber().then(function(result){
            resolve(result);
        });
    })
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
    getBlockNumber,
    getContractEvents,
};