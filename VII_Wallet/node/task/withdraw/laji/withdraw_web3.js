const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const Web3 = require('web3');
const ethers = require('ethers');
const secret = global.secret;
async function getwithdrawevent(){
    let selsql = "SELECT * FROM withdraw where flag_withdraw ='F'";
    return await connection.select(selsql,null);
}
async function updatewithdrawevent(selectParams){
    let selsql = "update withdraw set flag_withdraw='F',withdraw_time=unix_timestamp(),"+
    "nonces=?,block=?,hash=? WHERE id = ? and flag_withdraw ='F'";
    return await connection.select(selsql,selectParams);
}
exports.withdraw = async function withdraw(){
    withdrawsign();
}
dfr
async function withdrawsign(){
    const contractinfo = await getcontractinfo();
    const web3 = new Web3(contractinfo.mainwithdraw.network.url);
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);


    web3.eth.accounts.wallet.add(account._signingKey())


    const contract = new web3.eth.Contract(
        contractinfo.mainwithdraw.abi,
        contractinfo.mainwithdraw.address
        ,{
            from:account.address
        }
    );

    // let show = await contract.methods.MONITOR_switch().call();
    // console.log(show);
    for(let i=0;i<10;i++){
        await contract.methods.c_monitor_lock("true").send({
            gas:~~(await contract.methods.c_monitor_lock("true").estimateGas()*1.1)
            ,nonce
        }).on('transactionHash',function(hash){
            console.log("transactionHash:",hash);
        }).on('receipt', function(receipt){
            console.log("receipt:",receipt);
        }).on('error', function(error, receipt){
            console.log("error:",error,receipt);
        });
    }
    

    // show = await contract.methods.MONITOR_switch().call();
    // console.log(show);

    // var withdrawevent = await getwithdrawevent();
    // for(let i=0;i<withdrawevent.length;i++){
    //     var selectParams = ["108","1081","0x23333",withdrawevent[i].id]
    //     web3.eth.Contract
    //     // updatewithdrawevent(selectParams);
    //     console.log(selectParams);
    // }
    
}