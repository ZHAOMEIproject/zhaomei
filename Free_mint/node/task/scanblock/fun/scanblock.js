var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("https://api.mycryptoapi.com/eth");


const erc165abi=[{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const rlp = require('rlp');
const keccak = require('keccak');

exports.scanblock = async function scanblock(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    // {
    //     let nonce = "0x"+(16).toString(16);
    //     let useraddress = "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03";
        // var input_arr = [ useraddress, nonce ];
        // var rlp_encoded = rlp.encode(input_arr);
        // var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');
        // var contract_address = "0x"+contract_address_long.substring(24);
        // console.log(useraddress,nonce,"contract_address: " + contract_address);
    // }
    // creat contract
    {
        let nowblocknumber = 12287507;
        // console.log(nowblocknumber);
        let blockinfo = await web3.eth.getBlock(nowblocknumber);
        // console.log(blockinfo);
        let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[155])
        // console.log(contracttraninfo);
        if(contracttraninfo.to==null){
            let nonce = "0x"+contracttraninfo.nonce.toString(16);
            let useraddress = contracttraninfo.from;
            var input_arr = [ useraddress, nonce ];
            var rlp_encoded = rlp.encode(input_arr);
            var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');
            var contract_address = "0x"+contract_address_long.substring(24);
            // console.log(useraddress,nonce,"contract_address: " + contract_address);
            let contract_code = await web3.eth.getCode(contract_address);
            // console.log(contract_code);
            if(contract_code!=null){
                let contract = new web3.eth.Contract(erc165abi,contract_address);
                let checkerc721hash = "0x80ac58cd";
                let checkerc1155hash = "0xd9b67a26";
                let checkinfo = await contract.methods.supportsInterface(checkerc721hash).call();
                console.log(checkinfo);
            }
        }
        
        // "0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03"
        // "0xf2b8db4aed8247ec94dc2277
        // "bc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
    }
    // do contract
    {
        // let nowblocknumber = 12299047;
        // // console.log(nowblocknumber);
        // let blockinfo = await web3.eth.getBlock(nowblocknumber);
        // // console.log(blockinfo);
        // let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[167])
        // console.log(contracttraninfo);
    }
    // try {
    //     let estimate = await web3.eth.estimateGas({
    //         to:contracttraninfo.to,
    //         data:contracttraninfo.input
    //     })
    //     console.log(estimate);
    // } catch (error) {
    //     console.log(error);
    // }
    // console.log(estimate);
}