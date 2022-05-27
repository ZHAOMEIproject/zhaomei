/*Database connection encapsulation*/
const mysql = require("mysql");

// SELECT ALL
exports.selectAll = function selectAll(sqlAll){
    const conn = mysql.createConnection(conglobal.mysqlGlobalfig);
    conn.connect();
    conn.query(sqlAll,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
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
                return;
            }
            let dataString = JSON.stringify(result);
            let data = JSON.parse(dataString);

            resolve(data);
        });
        conn.end();
    });
}

// INSERT
exports.insert = function insert(addSql,addSqlParams) {
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();

    conn.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });

    conn.end();
}

// UPDATE
exports.update = function update(updSql,updSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();

    return new Promise(function (resolve, reject) {

        conn.query(updSql, updSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            resolve();
        });
        conn.end();
    });
}

// DELET
exports.deleteData = function deleteData(delSql,delSqlParams){
    const conn = mysql.createConnection(config);
    conn.connect();

    conn.query(delSql,delSqlParams,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return;
        }
        // console.log('--------------------------DELETE----------------------------');
        // console.log('DELETE affectedRows',result.affectedRows);
        // console.log('-----------------------------------------------------------------\n\n');
    });
    
    conn.end();
}

// replace
exports.replace = function replace(updSql,updSqlParams){
    const conn = mysql.createConnection(global.mysqlGlobal);
    conn.connect();
    return new Promise(function (resolve, reject) {
        conn.query(updSql, updSqlParams, function (err, result) {
            if (err) {
                console.log('[replace ERROR] - ', err.message);
                return;
            }
            resolve();
        });
        conn.end();
    });
}