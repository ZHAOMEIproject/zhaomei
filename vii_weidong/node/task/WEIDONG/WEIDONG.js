const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = global.secret;
const {sendEmailandto} = require("../../nodetool/email");
// 查报错事件
async function checkWEIDONGevent(selectParams){
    let selsql = "SELECT * FROM mint_list where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
// 锁定mint事件
async function lockWEIDONGevent(){
    let selsql = "update mint_list set flag_now='S'where flag_mint ='F' and flag_now = 'F'";
    return await connection.select(selsql,null);
}
// 获取mint事件
async function getWEIDONGevent(){
    let selsql = "SELECT account,tokenid FROM mint_list where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,null);
}
// 更新mint事件
async function updateWEIDONGevent(selectParams){
    let selsql = "update mint_list set flag_mint='S',flag_now = 'F' , mint_time = unix_timestamp() , nonces = ? , block = ? , hash = ? where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}


exports.WEIDONG = async function WEIDONG(){
    await Order_repair();
    // return;
    var WEIDONGcheck = await checkWEIDONGevent();
    if(WEIDONGcheck.length>0){
        console.log("error WEIDONGcheck");
        var WEIDONGupdate = await updateWEIDONGevent(["error","error","error"]);
        return;
    }
    var WEIDONGlock = await lockWEIDONGevent();
    if(WEIDONGlock.changedRows==0){
        console.log("No need to deal with WEIDONGlock");
        return;
    }
    // return;
    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.WEIDONG.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.WEIDONG.address, 
        contractinfo.WEIDONG.abi, 
        provider
    );

    // let nonce = await provider.getTransactionCount(account.address);
    let contractWithSigner = await contract.connect(wallet);


    var WEIDONGevent = await getWEIDONGevent();
    
    // console.log(WEIDONGevent);
    // console.log(Object.values(WEIDONGevent[0]));
    // return
    var upinfo=new Array();
    for (let i in WEIDONGevent) {
        try {
            await contractWithSigner.estimateGas.single_mint(Object.values(WEIDONGevent[0]));
        } catch (error) {
            console.log(error);
            continue;
        }
        upinfo.push(Object.values(WEIDONGevent[i]));
    }
    // console.log(upinfo);
    // console.log("END");
    // return
    try {
        let tx={"hash":""};
        let block;
        let nonce;
        if (upinfo.length!=0) {
            let estimateGas = await contractWithSigner.estimateGas.mint_list(upinfo);
            let gasPrice = Math.trunc(await provider.getGasPrice()*1.01);
            if ((await provider.getBalance(account.address))<(estimateGas*gasPrice*100)) {
                // condition
                sendEmailandto("303113525@qq.com","WEIDONG余额不足","WEIDONG余额不足");
                return;
            }
            tx = await contractWithSigner.mint_list(upinfo,{ gasPrice: gasPrice});
            block = await provider.getBlockNumber()
            // console.log(tx.hash);
            // await tx.wait();
            // console.log(tx);

            nonce = tx.nonce;
            
        }
        var WEIDONGupdate = await updateWEIDONGevent([nonce,block,tx.hash]);
            
            if(WEIDONGupdate.changedRows==0){
                console.log("error WEIDONG_update");
                return;
            }
            console.log("success WEIDONG_update");

        
    } catch (error) {
        console.log(error);
        var WEIDONGupdate = await updateWEIDONGevent(["error","error","error"]);
        console.log("WEIDONG error");
        // sendEmail("Wallet error","lot_WEIDONG_permit");
    }
    return;
}

async function Order_repair(){
    let sqlstr ="select account,tokenid from mint_list where nonces='error'";
    let callinfo = await connection.select(sqlstr,null);
    // console.log(callinfo);
    if(callinfo.length==0){
        return;
    }
    // let sqlstr_2 = "(select * from WEIDONG where event_name='TransferSingle' and data1 in (?) and data3 in (?)";
    let sqlstr_2 = "select data2,data3 from WEIDONG where event_name='TransferSingle' and (data2,data3) in ((?),(?));";
    // let sqlstr_2 = "select data2,data3 from WEIDONG where event_name='TransferSingle' and data2 in (?);";

    let error_orderids=new Array;
    for(let i in callinfo){
        error_orderids.push([callinfo[i].account,callinfo[i].tokenid]);
        // error_orderids.push([callinfo[i].account,callinfo[i].tokenid]);
    }
    // console.log(error_orderids);
    // return
    // let true_orderids = await connection.select(sqlstr_2,[["0x1","2"],["0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","2"]]);
    let true_orderids;
    if (error_orderids.length==1) {
        true_orderids = await connection.select(sqlstr_2,[error_orderids,["0","0"]]);
    }else{
        true_orderids = await connection.select(sqlstr_2,error_orderids);
    }
    // console.log(true_orderids);
    // return
    let update_orderids=new Array;
    console.log("true_orderids",true_orderids,"\nupdate_orderids",update_orderids,"\nerror_orderids",error_orderids);
    for(let i in true_orderids){
        update_orderids.push([true_orderids[i].data2,true_orderids[i].data3])
        error_orderids.splice(error_orderids.indexOf([true_orderids[i].data2,true_orderids[i].data3]),1);
    }
    console.log("true_orderids",true_orderids,"\nupdate_orderids",update_orderids,"\nerror_orderids",error_orderids);
    // return;
    // if (update_orderids.length==1) {
    //     update_orderids.push(update_orderids[0]);
    // }
    // console.log(update_orderids);
    // return
    if(update_orderids.length!=0){
        console.log("true",update_orderids);
        let sqlstr_3 = "update mint_list set nonces='true' where (account,tokenid) in ((?),(?));";
        // connection.select(sqlstr_3,[update_orderids]);
        if (update_orderids.length==1) {
            connection.select(sqlstr_3,[...update_orderids,["0","0"]]);
        }else{
            connection.select(sqlstr_3,update_orderids);
        }
    }
    if(error_orderids.length!=0){
        // let sqlstr_4 = "update mint_list set nonces='error2' where (account,tokenid) in ((?),(?));";
        let sqlstr_4 = "update mint_list set nonces='error2' where (account,tokenid) in ((?),(?))";

        console.log("error2",error_orderids);
        if (error_orderids.length==1) {
            // connection.select(sqlstr_4,[['0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2', '4' ],["0","0"]]);
            connection.select(sqlstr_4,[error_orderids,["0","0"]]);

        }else{
            connection.select(sqlstr_4,error_orderids);
        }
    }
}
