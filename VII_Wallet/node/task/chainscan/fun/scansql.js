const {sqlcall}=require('../../../nodetool/sqlconnection');

const mysql = require("mysql2");
async function checkandcreatdatabase(name,contractinfo){
    // 查/建数据库
    let selSql = "SHOW DATABASES LIKE ?";
    if((await sqlcall(selSql,name)).length==0){
        selSql = "create database "+name;
        await sqlcall(selSql,name)
    }
    global.mysqlGlobal.database=name;

    // 查/建表
    selSql = "SHOW TABLES like 'dictionary_value'";
    if((await sqlcall(selSql,null)).length==0){
        selSql = "CREATE TABLE `dictionary_value`  ("+
            "`contract` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
            "`chainid` int(255) NULL DEFAULT NULL,"+
            "`url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
            "`address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
            "`blocknumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '-'"+
            ") ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic"
        await sqlcall(selSql,null);
    }
    for(let i in contractinfo){
        for(let j in contractinfo[i]){
            let sqlinfo = [
                contractinfo[i][j].contractName,
                contractinfo[i][j].network.chainId,
                contractinfo[i][j].network.url,
                contractinfo[i][j].address]
            selSql = "select * from dictionary_value where contract = ? and chainid = ? and url=? and address = ?";
            if((await sqlcall(selSql,sqlinfo)).length==0){
                sqlinfo.push(contractinfo[i][j].blocknumber);
                selSql = "INSERT INTO `dictionary_value` VALUES (?,?,?,?,?)";
                await sqlcall(selSql,sqlinfo);
            }

            let abi_max=0;

            for (let k in contractinfo[i][j].abi) {
                if(contractinfo[i][j].abi[k].type=='event'){
                    if(contractinfo[i][j].abi[k].inputs.length>abi_max){
                        abi_max=contractinfo[i][j].abi[k].inputs.length;
                    }
                }
            }
            let abi_sql='';
            for (let x = 0; x < abi_max; x++) {
                abi_sql+="`data"+x+"` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,";
            }

            let data_sql='';
            for (let x = 1; x < abi_max; x++) {
                data_sql+="`,`data"+x;
            }

            selSql = "SHOW TABLES like '"+contractinfo[i][j].contractName+"'";
            if((await sqlcall(selSql,null)).length==0){
                selSql = "CREATE TABLE "+contractinfo[i][j].contractName+" ("+
                    "`event_id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT,"+
                    "`block_number` int(255) NULL DEFAULT NULL,"+
                    "`block_logIndex` int(255) NULL DEFAULT NULL,"+
                    "`transaction_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
                    "`event_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+

                    abi_sql+

                    "`update_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
                    "PRIMARY KEY (`event_id`) USING BTREE,"+
                    "UNIQUE INDEX `hash`(`transaction_hash`, `block_logIndex`) USING BTREE"+
                    // ",INDEX `data`(`data0"+ data_sql +"`) USING BTREE"+
                ") ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic"
                await sqlcall(selSql,null);
            }
        }
    }
}

async function scancontract(contractinfo){
    let web3Show = require("./web3Show");
    await checkandcreatdatabase(global.name,contractinfo);
    global.mysqlGlobal.database=global.name;
    for (let i in contractinfo) {
        await web3Show.setweb3js(Object.values(contractinfo[i])[0].network.url)
        for(let j in contractinfo[i]){
            let slq_dictionary = "select * from dictionary_value where contract=? and chainid=? and url=? and address=?";
            let sqlinfo =[
                contractinfo[i][j].contractName,
                contractinfo[i][j].network.chainId,
                contractinfo[i][j].network.url,
                contractinfo[i][j].address
            ]
            let blocknumber = await sqlcall(slq_dictionary,sqlinfo);
            // console.log();
            // console.log(blocknumber[0].url);
            let fromBlock=parseInt(blocknumber[0].blocknumber);
            let toBlock = fromBlock+parseInt(100);
            let now_blockNumber = await web3Show.getBlockNumber();
            if(toBlock>now_blockNumber){
                toBlock = now_blockNumber; // update toBlock
            }
            // console.log(fromBlock,fromBlock+100);
            let eventinfo = await web3Show.getContractEvents(contractinfo[i][j],fromBlock,now_blockNumber);
            // console.log(eventinfo);
            
            for(let k in eventinfo){
                let sqleventinfo=[
                    eventinfo[k].blockNumber,
                    eventinfo[k].logIndex,
                    eventinfo[k].transactionHash,
                    eventinfo[k].event,
                ]
                let value_l = Object.values(eventinfo[k].returnValues).length/2;

                let data_n_sql="";
                let data_v_sql="";
                for (let h = 0; h < value_l; h++) {
                    data_n_sql= data_n_sql + ",data" + h;
                    data_v_sql= data_v_sql + ",?";
                    sqleventinfo.push(eventinfo[k].returnValues[h]);
                }
                let insertsql = "INSERT INTO "+ contractinfo[i][j].contractName +" (block_number,block_logIndex,transaction_hash,event_name,update_time"+
                data_n_sql+
                ") VALUES (?,?,?,?,unix_timestamp()"+
                data_v_sql+
                ")";
                
                await sqlcall(insertsql,sqleventinfo);
            }
            sqlinfo.unshift(fromBlock+100);
            let update_blocknumber = "UPDATE dictionary_value SET blocknumber=? where contract=? and chainid=? and url=? and address=?";
            await sqlcall(update_blocknumber,sqlinfo);
        }
    }
    // await test();
}





async function test(){
    let web3Show = require("./web3Show");
    await web3Show.setweb3js("https://bsc-dataseed1.binance.org");
    let info = {
        abi:[
            {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
            {"anonymous":false,"inputs":[
                    {"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},
                    {"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}
                ],"name":"Approval","type":"event"
            },
            {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},
                {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
            // {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},
            //     {"indexed":true,"internalType":"address","name":"to","type":"address"},
            //     {"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],
            //     "name":"Transfer","type":"event"},
            {"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],
                "payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},
                {"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},
            {"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
        ],
        address:"0xa2d335e471ed0d85a95cd16c357f38fa6dc13c46"
    }
    let eventinfo = await web3Show.getContractEvents(info,
        19604941 ,
        19604941 );
    console.log(eventinfo);
}

module.exports = {
    checkandcreatdatabase,
    scancontract
};