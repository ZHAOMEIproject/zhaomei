const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = global.secret;
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
    await Order_repair();
    var withdrawcheck = await checkwithdrawevent();
    if(withdrawcheck.length>0){
        console.log("error withdrawcheck");
        var withdrawupdate = await updatewithdrawevent(["error","error","error"]);
        return;
    }
    var withdrawlock = await lockwithdrawevent();
    if(withdrawlock.changedRows==0){
        console.log("No need to deal with withdrawlock");
        return;
    }

    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/1";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.mainwithdraw.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.mainwithdraw.address, 
        contractinfo.mainwithdraw.abi, 
        provider
    );

    // let nonce = await provider.getTransactionCount(account.address);
    let contractWithSigner = await contract.connect(wallet);


    var withdrawevent = await getwithdrawevent();

    var upinfo=new Array();
    for (let i in withdrawevent) {
        try {
            await contractWithSigner.estimateGas.Withdraw_permit(withdrawevent[i]);

        } catch (error) {
            await wait(3000);
            try {
                await contractWithSigner.estimateGas.Withdraw_permit(withdrawevent[i]);
            } catch (error) {
                upinfo.push(Object.values(withdrawevent[i]));
            }
            continue;
        }


        upinfo.push(Object.values(withdrawevent[i]));
    }
    // console.log(upinfo);

    

    try {
        await contractWithSigner.estimateGas.lot_Withdraw_permit(upinfo);
        let gasPrice = Math.trunc(await provider.getGasPrice()*1.1);
        let tx = await contractWithSigner.lot_Withdraw_permit(upinfo,{ gasPrice: gasPrice});
        let block = await provider.getBlockNumber()
        // console.log(tx.hash);
        // await tx.wait();
        // console.log(tx);

        let nonce = tx.nonce;
        var withdrawupdate = await updatewithdrawevent([nonce,block,tx.hash]);
        
        if(withdrawupdate.changedRows==0){
            console.log("error withdraw_update");
            return;
        }
        console.log("success withdraw_update");
    } catch (error) {
        console.log(error);
        var withdrawupdate = await updatewithdrawevent(["error","error","error"]);
        console.log("withdraw error");
        // sendEmail("Wallet error","lot_Withdraw_permit");
    }
    return;
}

async function Order_repair(){
    let sqlstr ="select orderid from withdraw where nonces='error'";
    let callinfo = await connection.select(sqlstr,null);
    if(callinfo.length==0){
        return;
    }
    // console.log(callinfo);
    let sqlstr_2 = "select * from mainwithdraw where event_name='e_Withdraw' and data3 in (?)";

    let event_error_orderids=new Array;
    let error_orderids=new Array;
    for(let i in callinfo){
        error_orderids.push(callinfo[i].orderid);
        event_error_orderids.push(callinfo[i].orderid+"0000000000000000000000000000000000000000");
    }
    let true_orderids = await connection.select(sqlstr_2,event_error_orderids);
    // console.log(true_orderids);
    let update_orderids=new Array;
    // console.log(error_orderids);
    for(let i in true_orderids){
        let true_orderid = true_orderids[i].data3.substring(0,26);
        update_orderids.push(true_orderid)
        error_orderids.splice(error_orderids.indexOf(true_orderid),1);
    }
    // console.log(error_orderids);
    // console.log(update_orderids);
    if(update_orderids.length!=0){
        let sqlstr_3 = "update withdraw set nonces='true' where orderid in (?)";
        connection.select(sqlstr_3,[update_orderids]);
    }
    if(error_orderids.length!=0){
        let sqlstr_4 = "update withdraw set nonces='error2' where orderid in (?)";
        connection.select(sqlstr_4,[error_orderids]);
    }
}
async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}