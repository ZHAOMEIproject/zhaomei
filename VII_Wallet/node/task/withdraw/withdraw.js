const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = require('../../../../../privateinfo/.secret.json');
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

async function withdrawsign(){
    // const contractinfo = await getcontractinfo();
    // var path = "m/44'/60'/0'/0/0";
    // const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    
    // let provider = new ethers.providers.JsonRpcProvider(contractinfo.mainwithdraw.network.url);
    // let wallet = new ethers.Wallet(account._signingKey(), provider);

    // let contract = new ethers.Contract(
    //     contractinfo.mainwithdraw.address, 
    //     contractinfo.mainwithdraw.abi, 
    //     provider
    // );
    // let contractWithSigner = contract.connect(wallet);
    // for(let i=0;i<10;i++){
    //     let tx = await contractWithSigner.c_monitor_lock("true");
    //     await tx.wait();
    //     console.log(tx.hash);
    // }

    // show = await contract.methods.MONITOR_switch().call();
    // console.log(show);

    var withdrawevent = await getwithdrawevent();
    console.log(withdrawevent);
    
}