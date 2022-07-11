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
                abi_sql+="`data"+x+"` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,";
            }

            selSql = "SHOW TABLES like '"+contractinfo[i][j].contractName+"'";
            if((await sqlcall(selSql,null)).length==0){
                selSql = "CREATE TABLE "+contractinfo[i][j].contractName+" ("+
                    "`event_id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT,"+
                    "`block_number` int(255) NULL DEFAULT NULL,"+
                    "`block_event_id` int(255) NULL DEFAULT NULL,"+
                    "`transaction_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
                    "`event_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
    
                    abi_sql+
    
                    "`update_time` datetime(0) NULL DEFAULT NULL,"+
                    "PRIMARY KEY (`event_id`) USING BTREE,"+
                    "INDEX `hash`(`transaction_hash`) USING BTREE,"+
                    "INDEX `data0`(`data0`) USING BTREE"+
                ") ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic"
                await sqlcall(selSql,null);
            }
        }
    }
}

async function scancontract(contractinfo){
    let web3Show = require("./web3Show");
    web3Show.setweb3js("123")
}

module.exports = {
    checkandcreatdatabase,
    scancontract
};