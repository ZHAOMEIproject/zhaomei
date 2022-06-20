const web3 = require('web3');
// getBlockNumber
const getBlockNumber = (url) =>{
    web3js = new web3(url);
    return new Promise(async (resolve, reject)=> {
        web3js.eth.getBlockNumber().then(function(result){
            resolve(result);
        });
    })
}

// Get Contract Events
const getContractEvents = (info,from_timestamp,toBlock) =>{
    web3js = new web3(info.network.url);
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