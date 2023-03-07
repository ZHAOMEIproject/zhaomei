global.secret = require("../../../privateinfo/.secret.json");
global.mysqlGlobal = global.secret.VII_OOC_SQL;
global.name = global.secret.VII_OOC_SQL.database;
const mysql = require('mysql2');


const sqlStatements = [
    `
        INSERT INTO nft_records (date, user, nft)
        VALUES ('2022-12-20', '0x0000000000000000000000000000000000000000', COALESCE(
            (SELECT nft FROM(
                SELECT nft FROM nft_records
                WHERE user = '0x0000000000000000000000000000000000000000' AND date = '2022-12-20'
                ORDER BY timestamp DESC
                LIMIT 1
            ) AS a),0) - 1)
        ON DUPLICATE KEY UPDATE nft = nft - 1;
    `,
    `
        INSERT INTO nft_records (date, user, nft)
        VALUES ('2022-12-20', '0xDc66019E46d7E8ac9F155fF0668c9e1Fca34421F', COALESCE(
            (SELECT nft FROM(
                SELECT nft FROM nft_records
                WHERE user = '0xDc66019E46d7E8ac9F155fF0668c9e1Fca34421F' AND date = '2022-12-20'
                ORDER BY timestamp DESC
                LIMIT 1
            ) AS a),0) + 1)
        ON DUPLICATE KEY UPDATE nft = nft + 1;
    `
];
main();
async function main(){
    console.log(await sql());;
    console.log("end");
    return
}
async function sql(){
    return new Promise(async function (resolve, reject) {
        const connection = mysql.createConnection(global.mysqlGlobal);
        try {
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
                    console.log('Transaction completed successfully.');
                    resolve(true)
                });
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });
}