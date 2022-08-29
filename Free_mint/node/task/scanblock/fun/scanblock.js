var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("https://api.mycryptoapi.com/eth");

exports.scanblock = async function test(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    let nowblocknumber = 12287507;
    // console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    // console.log(blockinfo);
    let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[155])
    // console.log(contracttraninfo);
    let estimate;
    if(contracttraninfo.to==null){
        contracttraninfo["to"] = getconadd(contracttraninfo.from,contracttraninfo.nonce);
        let nftflag = checknft(contracttraninfo["to"]);
        if(nftflag){
            let sqlstr = "";
            
        }
    }else{
        try {
            estimate = await web3.eth.estimateGas({
                to:contracttraninfo.to,
                data:contracttraninfo.input
            })
        } catch (error) {
            console.log(error);
        }
        // console.log(estimate);
    }
    console.log(contracttraninfo);
    
}
// exports.scanblock = async function scanblock(){
//     let nowblocknumber = await web3.eth.getBlockNumber();
//     // let nowblocknumber = 12347219;
//     // console.log(nowblocknumber);
//     let blockinfo = await web3.eth.getBlock(nowblocknumber);
//     // console.log(blockinfo);
//     for(let i in blockinfo.transactions){
//         let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[i]);
//         if(contracttraninfo.to==null){
//             contracttraninfo["from"] = getconadd(blockinfo.transactions[i].from,blockinfo.transactions[i].nonce);
//         }
//         console.log(contracttraninfo);
//     }
// }

const rlp = require('rlp');
const keccak = require('keccak');
function getconadd(sender,nonce){
    // nonce = 0x0;
    // console.log(sender,nonce);
    var input_arr = [ sender, nonce ];
    var rlp_encoded = rlp.encode(input_arr);

    var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

    var contract_address = contract_address_long.substring(24); //Trim the first 24 characters.
    // console.log("contract_address: " + contract_address);
    return "0x"+contract_address;
}

async function checknft(address){
    var erc721hash = "0x80ac58cd";
    var erc1155hash = "0xd9b67a26";
    var erc165abi=[
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    var contract1 = new web3.eth.Contract(erc165abi,address);
    let info = await contract1.methods.supportsInterface(erc721hash).call();
    if(!info){
        info = await contract1.methods.supportsInterface(erc1155hash).call();
    }
    return info;
}