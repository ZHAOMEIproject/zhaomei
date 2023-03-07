global.secret = require("../../../privateinfo/.secret.json");
global.mysqlGlobal = global.secret.VII_OOC_SQL;
global.name = global.secret.VII_OOC_SQL.database;

const pool = require("./nodetool/sqlconnection");

const event = { from: 'Alice', to: 'Bob', tokenId: '123456', id: 'event-123' };
processEvent(event);
async function processEvent(event) {
    // 解析事件参数
    const { from, to, tokenId } = event;

    // // 获取当前日期和时间戳
    // const now = new Date();
    // const timestamp = now.getTime() / 1000;
    // let test=  new Date(1606639939*1000);
    // const date = now.toISOString().slice(0, 10);


    const now = 1678118400;
    let test=  new Date(now*1000);
    console.log(now,test, new Date());
    // const sqlstr = `
    //     INSERT INTO nft_records (date, user, nft)
    //     VALUES ('${date}', '${from}', (SELECT nft FROM(
    //     SELECT nft FROM nft_records
    //     WHERE user = '${from}' AND date = '${date}'
    //     ORDER BY timestamp DESC
    //     LIMIT 1
    //     ) AS a) - 1)
    //     ON DUPLICATE KEY UPDATE nft = nft - 1;
        
    //     INSERT INTO nft_records (date, user, nft)
    //     VALUES ('${date}', '${to}', (SELECT nft FROM(
    //         SELECT nft FROM nft_records
    //         WHERE user = '${to}' AND date = '${date}'
    //         ORDER BY timestamp DESC
    //         LIMIT 1
    //     ) AS a) + 1)
    //     ON DUPLICATE KEY UPDATE nft = nft + 1;
    // `;
    // // console.log(sqlstr);
    // let result = await pool.sqlcall(sqlstr,null);
    // console.log(result);
    
}