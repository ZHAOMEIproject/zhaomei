const {getcontractinfo}=require('../../nodetool/readcontracts');
const connection = require("../../nodetool/sqlconnection");
const ethers = require('ethers');
const secret = global.secret;
const {sendEmailandto} = require("../../nodetool/email");
// 查报错事件
async function checkVII_POAPevent(selectParams){
    let selsql = "SELECT * FROM mint_list where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}
// 锁定mint事件
async function lockVII_POAPevent(){
    let selsql = "update mint_list set flag_now='S'where flag_mint ='F' and flag_now = 'F'";
    return await connection.select(selsql,null);
}
// 获取mint事件
async function getVII_POAPevent(){
    let selsql = "SELECT account,tokenid FROM mint_list where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,null);
}
// 更新mint事件
async function updateVII_POAPevent(selectParams){
    let selsql = "update mint_list set flag_mint='S',flag_now = 'F' , mint_time = unix_timestamp() , nonces = ? , block = ? , hash = ? where flag_mint ='F' and flag_now = 'S'";
    return await connection.select(selsql,selectParams);
}


exports.VII_POAP = async function VII_POAP(){
    await Order_repair();
    // return;
    var VII_POAPcheck = await checkVII_POAPevent();
    if(VII_POAPcheck.length>0){
        console.log("error VII_POAPcheck");
        var VII_POAPupdate = await updateVII_POAPevent(["error","error","error"]);
        return;
    }
    var VII_POAPlock = await lockVII_POAPevent();
    if(VII_POAPlock.changedRows==0){
        console.log("No need to deal with VII_POAPlock");
        return;
    }
    // return;
    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.VII_POAP.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo.VII_POAP.address, 
        contractinfo.VII_POAP.abi, 
        provider
    );

    // let nonce = await provider.getTransactionCount(account.address);
    let contractWithSigner = await contract.connect(wallet);


    var VII_POAPevent = await getVII_POAPevent();
    
    // console.log(VII_POAPevent);
    // console.log(Object.values(VII_POAPevent[0]));
    // return
    var upinfo=new Array();
    for (let i in VII_POAPevent) {
        try {
            await contractWithSigner.estimateGas.single_mint(Object.values(VII_POAPevent[0]));
        } catch (error) {
            console.log(error);
            continue;
        }
        upinfo.push(Object.values(VII_POAPevent[i]));
    }
    // console.log(upinfo);
    // console.log("END");
    // return
    try {
        let estimateGas = await contractWithSigner.estimateGas.mint_list(upinfo);
        let gasPrice = Math.trunc(await provider.getGasPrice()*1.01);
        if ((await provider.getBalance(account.address))<(estimateGas*gasPrice*100)) {
            // condition
            sendEmailandto("303113525@qq.com","VII_POAP余额不足","VII_POAP余额不足");
            return;
        }
        let tx = await contractWithSigner.mint_list(upinfo,{ gasPrice: gasPrice});
        let block = await provider.getBlockNumber()
        // console.log(tx.hash);
        // await tx.wait();
        // console.log(tx);

        let nonce = tx.nonce;
        var VII_POAPupdate = await updateVII_POAPevent([nonce,block,tx.hash]);
        
        if(VII_POAPupdate.changedRows==0){
            console.log("error VII_POAP_update");
            return;
        }
        console.log("success VII_POAP_update");
    } catch (error) {
        console.log(error);
        var VII_POAPupdate = await updateVII_POAPevent(["error","error","error"]);
        console.log("VII_POAP error");
        // sendEmail("Wallet error","lot_VII_POAP_permit");
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
    // let sqlstr_2 = "(select * from VII_POAP where event_name='TransferSingle' and data1 in (?) and data3 in (?)";
    let sqlstr_2 = "select data2,data3 from VII_POAP where event_name='TransferSingle' and (data2,data3) in ((?),(?));";
    // let sqlstr_2 = "select data2,data3 from VII_POAP where event_name='TransferSingle' and data2 in (?);";

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
    // console.log("true_orderids",true_orderids,"\nupdate_orderids",update_orderids,"\nerror_orderids",error_orderids);
    for(let i in true_orderids){
        update_orderids.push([true_orderids[i].data2,true_orderids[i].data3])
        error_orderids.splice(error_orderids.indexOf([true_orderids[i].data2,true_orderids[i].data3])-1,1);
    }
    // console.log("true_orderids",true_orderids,"\nupdate_orderids",update_orderids,"\nerror_orderids",error_orderids);
    // return;
    // if (update_orderids.length==1) {
    //     update_orderids.push(update_orderids[0]);
    // }
    // console.log(update_orderids);
    // return
    if(update_orderids.length!=0){
        console.log(update_orderids);
        let sqlstr_3 = "update mint_list set nonces='true' where (account,tokenid) in ((?));";
        // connection.select(sqlstr_3,[update_orderids]);
        if (update_orderids.length==1) {
            connection.select(sqlstr_3,[...update_orderids,["0","0"]]);
        }else{
            connection.select(sqlstr_3,update_orderids);
        }
    }
    if(error_orderids.length!=0){
        // let sqlstr_4 = "update mint_list set nonces='error2' where (account,tokenid) in ((?),(?));";
        let sqlstr_4 = "update mint_list set nonces='error2' where (account,tokenid) in ((?))";

        // console.log(error_orderids);
        if (update_orderids.length==1) {
            // connection.select(sqlstr_4,[['0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2', '4' ],["0","0"]]);
            connection.select(sqlstr_4,[error_orderids,["0","0"]]);

        }else{
            connection.select(sqlstr_4,error_orderids);
        }
    }
}