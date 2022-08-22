/*Database connection encapsulation*/
const mysql = require("mysql2");

// sqlcall
exports.sqlcall = function sqlcall(selSql,selSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(selSql, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SQLCALL ERROR] - ', selSql , err.message);
                resolve(err);
                global.zwjerror = true;
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
        conn.end();
    });
}

exports.sqlcall_uncon = function sqlcall_uncon(conn,sqlcall,selSqlParams){
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

// SELECT
exports.select = function select(selSql,selSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(selSql, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message,selSql);
                reject('[SELECT ERROR] - ', err.message,selSql)
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);

            resolve(data);
        });
        conn.end();
    });
}