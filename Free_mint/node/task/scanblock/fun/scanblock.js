var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("https://api.mycryptoapi.com/eth");

exports.scanblock = async function test(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    let nowblocknumber = 12347219;
    console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    console.log(blockinfo);
    let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[110])
    console.log(contracttraninfo);
    try {
        let estimate = await web3.eth.estimateGas({
            to:contracttraninfo.to,
            data:contracttraninfo.input
        })
        console.log(estimate);
    } catch (error) {
        console.log(error);
    }
    // console.log(estimate);
    console.log("no out");
}
exports.scanblock = async function scanblock(){
    let nowblocknumber = await web3.eth.getBlockNumber();
    // let nowblocknumber = 12347219;
    // console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    // console.log(blockinfo);
    for(let i in blockinfo.transactions){
        let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[i]);
        if(contracttraninfo.to==null){

        }

    }
    let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[110])
    console.log(contracttraninfo);
    try {
        let estimate = await web3.eth.estimateGas({
            to:contracttraninfo.to,
            data:contracttraninfo.input
        })
        console.log(estimate);
    } catch (error) {
        console.log(error);
    }
    // console.log(estimate);
    console.log("no out");
}

const rlp = require('rlp');
const keccak = require('keccak');
function getconadd(sender,nonce){
    nonce = 0x0;

    var input_arr = [ sender, nonce ];
    var rlp_encoded = rlp.encode(input_arr);

    var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

    var contract_address = contract_address_long.substring(24); //Trim the first 24 characters.
    console.log("contract_address: " + contract_address);
}

