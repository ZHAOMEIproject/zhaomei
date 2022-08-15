const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = require('../../../../../privateinfo/.secret.json');
const {sendEmail} = require("../../nodetool/email");
// 查报错事件
async function checkwithdrawevent(selectParams){
    let selsql = "SELECT * FROM withdraw where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
// 锁定转账事件
async function lockwithdrawevent(){
    let selsql = "update withdraw set flag_now='S'where flag_withdraw ='F' and flag_now = 'F'";
    return await connection.select(selsql,null);
}
// 获取转账事件
async function getwithdrawevent(){
    let selsql = "SELECT spender,amount,orderid FROM withdraw where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,null);
}
// 更新转账事件
async function updatewithdrawevent(selectParams){
    let selsql = "update withdraw set flag_withdraw='S',flag_now = 'F' , withdraw_time = unix_timestamp() , nonces = ? , block = ? , hash = ? where flag_withdraw ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}

exports.withdraw = async function withdraw(){
    var withdrawcheck = await checkwithdrawevent();
    if(withdrawcheck.length>0){
        console.log("error withdrawcheck");
        return;
    }
    var withdrawlock = await lockwithdrawevent();
    if(withdrawlock.changedRows==0){
        console.log("No need to deal with withdrawlock");
        return;
    }
    var withdrawevent = await getwithdrawevent();
    var upinfo=new Array();
    for (let i in withdrawevent) {
        upinfo.push(Object.values(withdrawevent[i]));
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

    let nonce = await provider.getTransactionCount(account.address);
    let gasPrice = await provider.getGasPrice()*1.1;
    gasPrice = Math.trunc(gasPrice);
    let contractWithSigner = await contract.connect(wallet);

    try {
        await contractWithSigner.estimateGas.lot_Withdraw_permit(upinfo);
        let tx = await contractWithSigner.lot_Withdraw_permit(upinfo,{ gasPrice: gasPrice});
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
    } catch (error) {
        console.log(error);
        let block = await provider.getBlockNumber()
        var withdrawupdate = await updatewithdrawevent([nonce,block,"error"]);
        if(withdrawupdate.changedRows==0){
            console.log("error withdrawupdate");
        }
        console.log("withdraw error");
        // sendEmail("Wallet error","lot_Withdraw_permit");
    }
    return;
}