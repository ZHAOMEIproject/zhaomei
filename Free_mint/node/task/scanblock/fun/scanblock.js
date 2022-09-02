var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("https://api.mycryptoapi.com/eth");

const connection = require("../../../nodetool/sqlconnection");
exports.scanblock = async function test(){
    // let nowblocknumber = await web3.eth.getBlockNumber();
    let nowblocknumber = 15456524;
    // console.log(nowblocknumber);
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    // console.log(blockinfo);
    let contracttraninfo = await web3.eth.getTransaction(blockinfo.transactions[5])

    console.log(contracttraninfo);
    // return;
    if(contracttraninfo.to==null){
        contracttraninfo["to"] = await getconadd(contracttraninfo.from,contracttraninfo.nonce);
    }
    
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
    let getinfo = await connection.sqlcall(checkcreat,address);
    // 记录合约信息
    if(getinfo.length==0){
        let name = await contract1.methods.name().call();
        let symbol = await contract1.methods.symbol().call();
        let creater = contracttraninfo["from"];
        let creat_time = contracttraninfo["blockNumber"];
        try {
            totalsupply = await contract1.methods.totalSupply().call();
        } catch (error) {
        }

        nfttype;

        let sqlstr="replace into nft_address(address,lasttime,nonce,name,symbol,creater,creat_time,totalsupply,nfttype)value(?,?,?,?,?,?,?,?,?)";
        let sqlp = [address,creat_time,0,name,symbol,creater,creat_time,0,nfttype];
        await connection.sqlcall(sqlstr,sqlp);
        getinfo = await connection.sqlcall(checkcreat,address);
    }
    let events = await contract1.getPastEvents('Transfer',{
        fromBlock:contracttraninfo.blockNumber,
        toBlock:contracttraninfo.blockNumber
    });
    let mintamount=0;
    let minter;
    // console.log(events[0]);
    for(let i in events){
        if(events[i].transactionHash!=contracttraninfo.hash){
            continue;
        }
        if (events[i].returnValues.from=="0x0000000000000000000000000000000000000000") {
            mintamount++;
            minter=events[i].returnValues.to.toLowerCase();
        }
    }
    web3.eth.accounts.wallet.add(web3.eth.accounts.create().privateKey);
    // console.log(web3.eth.accounts.wallet[0]);
    // return;
    if (mintamount==0) {
        return;
    }else{
        let data = contracttraninfo.input;
        let flag=data.indexOf(minter.slice(2));
        let estimate;
        // console.log(flag,data,minter);
        try {
            if(flag!=-1){
                // console.log(web3.eth.accounts.wallet[0].address.slice(2));
                data = data.slice(0,flag)+web3.eth.accounts.wallet[0].address.slice(2)+data.slice((flag+40));
                // console.log(data);
                estimate = await web3.eth.estimateGas({
                    to:contracttraninfo.to,
                    data:data
                })
            }else{
                console.log(contracttraninfo.to,data);
                estimate = await web3.eth.estimateGas({
                    to:contracttraninfo.to,
                    data:data
                })
            }
        } catch (error) {
            console.log(error);
        }
        console.log(estimate);
        if(estimate){
            let sqlin = "insert into nft_event(transaction,address,to_add,amount,calldata,flag_address) VALUES(?,?,?,?,?,?)";
            let inputinfo = [contracttraninfo.hash,contracttraninfo.to,minter,mintamount,data,flag!=-1]
            console.log(inputinfo);
            await connection.sqlcall(sqlin,inputinfo);
        }
    }


    // let estimate;
    // try {
    //     estimate = await web3.eth.estimateGas({
    //         to:contracttraninfo.to,
    //         data:contracttraninfo.input
    //     })
    // } catch (error) {
    //     console.log(error);
    // }
    // console.log(estimate);
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