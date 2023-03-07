const web3 = require('web3');

var web3js;
async function setweb3js(url){
    web3js=new web3(url);
}
// async function testshow(){
//     console.log(web3js);
// }

// getBlockNumber
const getBlockNumber = () =>{
    return new Promise(async (resolve, reject)=> {
        web3js.eth.getBlockNumber().then(function(result){
            resolve(result);
        });
    })
}
const getBlock = (now_blockNumber) =>{
    return new Promise(async (resolve, reject)=> {
        web3js.eth.getBlock(now_blockNumber).then(function(result){
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
            if (error) {
                console.log(error);
                reject(error)
            }
            resolve(result);
        })
    })
}

module.exports = {
    getBlockNumber,
    getContractEvents,
    setweb3js,
    getBlock,
    // testshow,
};