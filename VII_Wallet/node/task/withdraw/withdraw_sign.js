const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = require('../../../../../privateinfo/.secret.json');
// 查报错事件
async function checkwithdrawevent(selectParams){
    let selsql = "SELECT * FROM withdraw_auditor where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
// 锁定转账事件
async function lockwithdrawevent(){
    let selsql = "update withdraw_auditor set flag_now='S'where flag_withdraw ='F' and flag_now = 'F'";
    return await connection.select(selsql,null);
}
// 获取转账事件
async function getwithdrawevent(){
    let selsql = "SELECT auditor,spender,amount,deadline,sign_v,sign_r,sign_s FROM withdraw_auditor where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,null);
}
// 更新转账事件
async function updatewithdrawevent(selectParams){
    let selsql = "update withdraw_auditor set flag_withdraw='S',flag_now = 'F' , withdraw_time = unix_timestamp() , nonces = ? , block = ? , hash = ? where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}

exports.withdraw_sign = async function withdraw_sign(){
    var withdrawcheck = await checkwithdrawevent();
    if(withdrawcheck.length>0){
        console.log("error withdrawcheck");
        return;
    }
    var withdrawsignlock = await lockwithdrawevent();
    if(withdrawsignlock.changedRows==0){
        console.log("success withdrawsignlock");
        return;
    }
    var withdrawevent = await getwithdrawevent();
    var upinfo=new Array();
    for (let i = 0; i < withdrawevent.length; i++) {
        upinfo.push(Object.values(withdrawevent[i]));
    }

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

    let nonce = await provider.getTransactionCount(account.address);
    let gasPrice = await provider.getGasPrice()*2;
    let contractWithSigner = await contract.connect(wallet);
    // 合约交互
    // console.log("load test");
    // console.log(upinfo);
    let tx = await contractWithSigner.lot_Withdraw_permit_auditor(upinfo,{ gasPrice: gasPrice});
    // console.log(tx.hash);
    // await tx.wait();
    // console.log(tx);
    
    let block = await provider.getBlockNumber()
    var withdrawupdate = await updatewithdrawevent([nonce,block,tx.hash]);
    if(withdrawupdate.changedRows==0){
        console.log("error withdrawupdate");
        return;
    }
    console.log("success withdrawupdate");
    return;
}