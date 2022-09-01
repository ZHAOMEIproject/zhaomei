var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("https://api.mycryptoapi.com/eth");

exports.scanblock = async function test(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    let nowblocknumber = 12299047;
    // console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    // console.log(blockinfo);
    let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[167])

    
    // console.log(contracttraninfo);
    // return;
    let estimate;
    if(contracttraninfo.to==null){
        contracttraninfo["to"] = await getconadd(contracttraninfo.from,contracttraninfo.nonce);
        let nftflag = await checknft(contracttraninfo);
        if(!nftflag){
            return;
        }
    }else{
        let nftflag = await checknft(contracttraninfo);
        if(!nftflag){
            return;
        }

        // try {
        //     estimate = await web3.eth.estimateGas({
        //         to:contracttraninfo.to,
        //         data:contracttraninfo.input
        //     })
        // } catch (error) {
        //     console.log(error);
        // }
        // console.log(estimate);
    }
    // console.log(contracttraninfo);
    
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
async function getconadd(sender,nonce){
    // nonce = 0x0;
    // console.log(sender,nonce);
    var input_arr = [ sender, nonce ];
    var rlp_encoded = rlp.encode(input_arr);

    var contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

    var contract_address = contract_address_long.substring(24); //Trim the first 24 characters.
    // console.log("contract_address: " + contract_address);
    return "0x"+contract_address;
}
const connection = require("../../../nodetool/sqlconnection");
async function checknft(contracttraninfo){
    var erc721hash = "0x80ac58cd";
    var erc1155hash = "0xd9b67a26";
    var iercnft=require("./iercnft.json");
    let address = contracttraninfo["to"];
    var contract1 = new web3.eth.Contract(iercnft,address);
    let nfttype;
    if(await contract1.methods.supportsInterface(erc721hash).call()){
        nfttype="ERC721";
    }else if(await contract1.methods.supportsInterface(erc1155hash).call()){
        nfttype="ERC1155";
    }else{
        return false;
    }
    let checkcreat = "select * from nft_address where address=?";
    let getinfo = connection.sqlcall(checkcreat,address);
    if(getinfo.length==0){
        let name = await contract1.methods.name().call();
        let symbol = await contract1.methods.symbol().call();
        let creater = contracttraninfo["from"];
        let creat_time = contracttraninfo["blockNumber"];
        let totalsupply;
        let baseur
        try {
            totalsupply = await contract1.methods.totalSupply().call();
        } catch (error) {
        }

        nfttype;

        let sqlstr="replace into nft_address(address,lasttime,nonce,name,symbol,creater,creat_time,totalsupply,nfttype)value(?,?,?,?,?,?,?,?,?)";
        let sqlp = [address,creat_time,0,name,symbol,creater,creat_time,0,nfttype];
        await connection.sqlcall(sqlstr,sqlp);
        getinfo = connection.sqlcall(checkcreat,address);
    }
    let events = await contract1.getPastEvents('Transfer',{
        fromBlock:contracttraninfo.blockNumber,
        toBlock:contracttraninfo.blockNumber
    });
    // console.log(events[0].returnValues.from);
    let sender = contracttraninfo.from;
    let minter = events[i].returnValues.to;
    let mintamount=0;
    for(let i in events){
        if (events[i].returnValues.from=="0x0000000000000000000000000000000000000000") {
            if(sender!=minter){
                continue;
            }
            mintamount++;
        }
    }
    if(mintamount!=0){
        
    }
    try {
        if(nfttype=="ERC721"){
            if(getinfo.tokenurl==null){
                // 获取tokenurl
                let tokenurl;
                try {
                    tokenurl = await contract1.methods.tokenURI(0).call();
                } catch (error) {
                    try {
                        tokenurl = await contract1.methods.baseURI().call();
                    } catch (error) {
                    }
                }
                let sqlurl="update nft_address set tokenurl=? where address=?";
                if (tokenurl!=null) {
                    await connection.sqlcall(sqlurl,[tokenurl,address]);
                }
            }

        }else if(nfttype=="ERC1155"){
            if(getinfo.tokenurl==null){
                // 获取tokenurl
                let tokenurl;
                try {
                    tokenurl = await contract1.methods.uri(0).call();
                } catch (error) {
                }
                let sqlurl="update nft_address set tokenurl=? where address=?";
                if (tokenurl!=null) {
                    await connection.sqlcall(sqlurl,[tokenurl,address]);
                }
            }
        }
    } catch (error) {
    }
    return nfttype;
}