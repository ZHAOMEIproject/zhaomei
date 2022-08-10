var Web3 = require('web3');
var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");

exports.scanblock = async function scanblock(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    let nowblocknumber = 15313796;
    console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    console.log(blockinfo);
    console.log(await web3.eth.getTransaction(blockinfo.transactions[0]));
}