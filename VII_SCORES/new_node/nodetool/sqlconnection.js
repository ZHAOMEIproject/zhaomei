/*Database connection encapsulation*/
const mysql = require("mysql");

// sqlcall
exports.sqlcall = function sqlcall(selSql,selSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(selSql, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SQLCALL ERROR] - ', err.message);
                resolve(err);
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
        conn.end();
    });
}

// sqlcall
exports.sqlcall = function sqlcall(selSql,selSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(selSql, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SQLCALL ERROR] - ', err.message);
                resolve(err);
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
        conn.end();
    });
}

// SELECT
exports.select = function select(selSql,selSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(selSql, selSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                resolve(err);
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);
            resolve(data);
        });
        conn.end();
    });
}

// UPDATE
exports.update = function update(updSql,updSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(updSql, updSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                resolve(err);
                return;
            }
            resolve();
        });
        conn.end();
    });
}
// replace
exports.replace = function replace(updSql,updSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(updSql, updSqlParams, function (err, result) {
            if (err) {
                console.log('[replace ERROR] - ', err.message);
                resolve(err);
                return;
            }
            resolve();
        });
        conn.end();
    });
}
// insert
exports.insert = function insert(updSql,updSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(updSql, updSqlParams, function (err, result) {
            if (err) {
                console.log('[insert ERROR] - ', err.message);
                resolve(err);
                return;
            }
            resolve();
        });
        conn.end();
    });
}