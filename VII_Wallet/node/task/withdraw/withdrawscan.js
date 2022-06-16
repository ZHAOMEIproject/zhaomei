const connection = require("../nodetool/sqlconnection");
// 获取未处理的转账
exports.eventwithdrawundeal = async function eventwithdrawundeal(){
    let selSql = "SELECT * FROM withdraw where flag_withdraw='F'";
    return await connection.select(selSql,null);
}