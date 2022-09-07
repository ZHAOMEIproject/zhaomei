var Web3 = require('web3');
// var web3 = new Web3("wss://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
var web3 = new Web3("http://127.0.0.1:8545");
// var web3 = new Web3("ws://127.0.0.1:8546");

const connection = require("../../../nodetool/sqlconnection");
var erc721hash = "0x80ac58cd";
var erc1155hash = "0xd9b67a26";
var iercnft=require("./iercnft.json");
web3.eth.defaultAccount = "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2";
// const mysql = require("mysql2");
// const conn = mysql.createConnection(global.mysqlGlobal);
exports.getblocknumber = async function getblocknumber(){
    return await web3.eth.getBlockNumber();
}
exports.scanblock = async function scanblock(blocknumber){
    // await testfun();
    // return;
    let nowblocknumber = await web3.eth.getBlockNumber();
    if(nowblocknumber<=blocknumber){
        return false;
    }else{
        nowblocknumber=blocknumber;
    }
    // nowblocknumber = 15475522;
    console.log(nowblocknumber,Date.now());
    
    let blockinfo = await web3.eth.getBlock(nowblocknumber);
    // console.log(blockinfo);
    // web3.eth.accounts.wallet.add(web3.eth.accounts.create().privateKey);
    let l =blockinfo.transactions.length;
    // let test=197;
    // for(let i=test;i==test;i++){
    for(let i in blockinfo.transactions){
        // console.log(i);
        await wait(10000/l);
        scantransactions(i,blockinfo.transactions[i])
    }
    return true;
}

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
async function scantransactions(i,now_transactions){
    // return;
    // console.log(i,now_transactions);
    let contracttraninfo = await web3.eth.getTransaction(now_transactions);
    while (!contracttraninfo) {
        console.log("error",i,now_transactions);
        await wait(5000);
        contracttraninfo = await web3.eth.getTransaction(now_transactions);
    }
    // console.log(i,contracttraninfo);
    if(contracttraninfo.to==null){
        contracttraninfo["to"] = await getconadd(contracttraninfo.from,contracttraninfo.nonce);
    }
    // console.log(i,contracttraninfo);
    let address = contracttraninfo["to"];
    var contract1 = new web3.eth.Contract(iercnft,address);
    let nfttype;
    // console.log(now_transactions);
    try {
        // console.log(await contract1.methods.name().call());
        // console.log(await contract1.methods.supportsInterface("0x80ac58cd").call(
        //     // {
        //     //     // from:"0x0000000000000000000000000000000000000000",
        //     //     gas:3000000
        //     // }
        // ));
        let flag = await Promise.all([contract1.methods.supportsInterface(erc721hash).call(),contract1.methods.supportsInterface(erc1155hash).call()])
        if(flag[0]){
            nfttype="ERC721";
        }else if(flag[1]){
            nfttype="ERC1155";
        }else{
            return;
        }
        // console.log(nfttype);
    } catch (error) {
        // console.log(error);
        return;
    }
    
    let checkcreat = "select * from nft_address where address=?";
    let getinfo = await connection.sqlcall(checkcreat,address);
    // 记录合约信息
    let blocknumber = contracttraninfo.blockNumber;
    if(getinfo.length==0){
        let name,symbol,creater,totalsupply;
        try {
            name = await contract1.methods.name().call();
        } catch (error) {}
        try {
            symbol = await contract1.methods.symbol().call();
        } catch (error) {}
        creater = contracttraninfo.from;
        try {
            totalsupply = await contract1.methods.totalSupply().call();
        } catch (error) {
        }
        nfttype;

        let sqlstr="replace into nft_address(address,lasttime,nonce,name,symbol,creater,blocknumber,totalSupply,nfttype)value(?,UNIX_TIMESTAMP(NOW()),?,?,?,?,?,?,?)";
        let sqlp = [address,0,name,symbol,creater,blocknumber,totalsupply,nfttype];
        await connection.sqlcall(sqlstr,sqlp);
        getinfo = await connection.sqlcall(checkcreat,address);
    }else{
        let update="update nft_address set nonce = (select count(1) from nft_trans where timestamp>(UNIX_TIMESTAMP(NOW())-86400)and address=?) where address=?";
        await connection.sqlcall(update,[address,address]);
    }
    // let test = blocknumber-1;
    // console.log(test,blocknumber);
    let events = await contract1.getPastEvents('Transfer',{
        fromBlock:blocknumber,
        toBlock:blocknumber
    });
    // console.log(events);
    let mintamount=0;
    let minter;
    let mint_event=new Array;
    let transactionHash = contracttraninfo.hash;
    for(let j in events){
        if(events[j].transactionHash!=transactionHash){
            continue;
        }
        if (events[j].returnValues.from=="0x0000000000000000000000000000000000000000") {
            mintamount++;
            minter=events[j].returnValues.to.toLowerCase();
            mint_event.push([blocknumber,address,transactionHash,minter,events[j].returnValues.tokenId])
        }
    }
    if (mint_event.length!=0) {
        let insert_event='insert into nft_event(blocknumber,address,transaction,to_add,tokenid) values ?';
        // console.log(mint_event);
        await connection.sqlcall(insert_event,[mint_event]);
        let update="update nft_address set totalMinted=totalMinted+? where address=?";
        await connection.sqlcall(update,[mint_event.length,address]);
    }
    if (mintamount==0) {
        return;
    }else{
        let data = contracttraninfo.input;
        let flag=data.indexOf(minter.slice(2));
        let estimate;
        // console.log(flag,data,minter);
        try {
            // console.log(address);
            if(flag!=-1){
                // console.log(web3.eth.accounts.wallet[0].address.slice(2));
                data = data.slice(0,flag)+"8C327f1Aa6327F01A9A74cEc696691cEAAc680e2"+data.slice((flag+40));
                // console.log(data);
                estimate = await web3.eth.estimateGas({
                    to:address,
                    data:data
                })
            }else{
                estimate = await web3.eth.estimateGas({
                    to:address,
                    data:data
                })
            }
        } catch (error) {
            // console.log(address,data);
            // console.log("zwj2",error);
        }
        // console.log(estimate);
        if(estimate){
            let sqlin = "insert into nft_trans(blocknumber,address,transaction,to_add,amount,calldata,flag_address,timestamp) VALUES(?,?,?,?,?,?,?,UNIX_TIMESTAMP(NOW()))";
            let inputinfo = [blocknumber,address,transactionHash,minter,mintamount,contracttraninfo.input,flag!=-1]
            // console.log(inputinfo);
            await connection.sqlcall(sqlin,inputinfo);
            console.log("success");
            let checkfisttime="select firstMintTime from nft_address where address=?";
            let check = await connection.sqlcall(checkfisttime,address);
            if (check.firstMintTime==null) {
                let update="update nft_address set firstMintTime=UNIX_TIMESTAMP(NOW()) where address=?";
                await connection.sqlcall(update,address);
            }
        }
    }
    return;
}
async function testfun(){
    let sqlstr='insert into nft_event(address,tokenid) values ?';
    let mint_event=new Array;
    mint_event.push(["4","5"])
    await connection.sqlcall(sqlstr,[mint_event]);
}
async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}