/*Database connection encapsulation*/
const mysql = require("mysql2");
const pool = mysql.createPool({
    connectionLimit: 20,
    ...global.mysqlGlobal
});
// sqlcall
async function sqlcall(selSql,selSqlParams){
    return new Promise(function (resolve, reject) {
        try {
            pool.query(selSql, selSqlParams,async function (err, result) {
                if (err) {
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.log("sql请求过多，等待1秒");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        resolve(await sqlcall(sqlStatements))
                        return;
                    }else{
                        throw err;
                    }
                }
                let dataString = JSON.stringify(result);
                let data = JSON.parse(dataString);
                resolve(data);
                
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}
async function beginTransaction(sqlStatements){
    return new Promise(async function (resolve, reject) {
        try {
            pool.getConnection(async function(err, connection) {
                if (err) {
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.log("sql请求过多，等待1秒");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        resolve(await beginTransaction(sqlStatements))
                        return;
                    }else{
                        throw err;
                    }
                }
                connection.beginTransaction(function (err) {
                    if (err) throw err;
                
                    sqlStatements.forEach(function (sql) {
                        connection.query(sql, function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                        });
                    });
                    
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        connection.release();
                        // console.log('Transaction completed successfully.');
                        resolve(true)
                    });
                });
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}

function sqlcall_uncon(conn,sqlcall,selSqlParams){
    return new Promise(function (resolve, reject) {
        conn.query(sqlcall, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SQLCALL ERROR] - ', err.message);
                resolve(err);
                global.zwjerror = true;
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
    });
}
module.exports={
    beginTransaction,
    sqlcall,
    sqlcall_uncon
}