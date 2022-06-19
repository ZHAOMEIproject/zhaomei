const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = require('../../../../../privateinfo/.secret.json');
async function getwithdrawevent(){
    let selsql = "SELECT spender,amount FROM withdraw where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,null);
}
async function checkwithdrawevent(selectParams){
    let selsql = "SELECT * FROM withdraw where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
async function lockwithdrawevent(){
    let selsql = "update withdraw set flag_now='S'where flag_withdraw ='F' and flag_now = 'F'";
    return await connection.select(selsql,null);
}
async function updatewithdrawevent(selectParams){
    let selsql = "update withdraw set flag_withdraw='S',flag_now = 'N',withdraw_time=unix_timestamp(),"+
    "nonces=?,block=?,hash=?"+
    "where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
exports.withdraw = async function withdraw(){
    withdrawsign();
}

async function withdrawsign(){
    // var withdrawcheck = await checkwithdrawevent();
    // if(withdrawcheck.length>0){
    //     console.log("error withdrawcheck");
    //     return;
    // }
    // var withdrawlock = await lockwithdrawevent();
    // if(withdrawlock.changedRows==0){
    //     console.log("success withdrawlock");
    //     return;
    // }
    var withdrawevent = await getwithdrawevent();
    var upinfo=new Array();
    for (let i = 0; i < withdrawevent.length; i++) {
        upinfo.push([withdrawevent[i].spender,withdrawevent[i].amount]);
    }
    console.log(upinfo);



    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.mainwithdraw.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.mainwithdraw.address, 
        contractinfo.mainwithdraw.abi, 
        provider
    );

    let contractWithSigner = contract.connect(wallet);
    let tx = await contractWithSigner.lot_Withdraw_permit(upinfo);
    console.log(tx.hash);
    // await tx.wait();
    // console.log("down");
    
    var withdrawupdate = await updatewithdrawevent();
    if(withdrawupdate.changedRows>0){
        console.log("success withdrawupdate");
        return;
    }
    
}