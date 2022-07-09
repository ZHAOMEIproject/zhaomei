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
    let chainId = Object.keys(contractinfo);
    for(let i=0;i<chainId.length;i++){
        console.log(contractinfo[chainId[0]]);
        // for (let j = 0; j < contractinfo[chainId[i]].length; j++) {
        //     let sqlinfo = [
        //         contractinfo[chainid[i]][i].contractName,
        //         contractinfo[chainid[i]][i].network.chainId,
        //         contractinfo[chainid[i]][i].network.url,
        //         contractinfo[chainid[i]][i].address]
        //     selSql = "select * from dictionary_value where contract = ? and chainid = ? and url=? and address = ?";
        //     if((await sqlcall(selSql,sqlinfo)).length==0){
        //         sqlinfo.push(contractinfo[chainid[i]][i].blocknumber);
        //         selSql = "INSERT INTO `dictionary_value` VALUES (?,?,?,?,?)";
        //         await sqlcall(selSql,sqlinfo);
        //     }
        //     selSql = "SHOW TABLES like '"+contractinfo[chainid[i]][i].contractName+"'";
        //     if((await sqlcall(selSql,null)).length==0){
        //         selSql = "CREATE TABLE "+contractinfo[chainid[i]][i].contractName+" ("+
        //         "`event_id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT,"+
        //             "`block_number` int(255) NULL DEFAULT NULL,"+
        //             "`block_event_id` int(255) NULL DEFAULT NULL,"+
        //             "`event_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
        //             "`from` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
        //             "`to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
        //             "`transaction_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,"+
        //             "`update_time` datetime(0) NULL DEFAULT NULL,"+
        //             "PRIMARY KEY (`event_id`) USING BTREE,"+
        //             "UNIQUE INDEX `owner`(`block_number`, `block_event_id`, `event_name`, `transaction_hash`) USING BTREE"+
        //           ") ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic"
        //         await sqlcall(selSql,null);
        //     }
            
        // }
    }
}

async function scancontract(contractinfo){
    let web3Show = require("./web3Show");
}

module.exports = {
    checkandcreatdatabase,
    scancontract
};