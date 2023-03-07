const pool = require("../../../nodetool/sqlconnection");


async function day_balance(body) {
    const { from, to, nftId,timestamp } = body;
    // const timestamp = Math.floor(Date.now() / 1000);
    const now = new Date(timestamp*1000 + (8 * 60 * 60 * 1000));
    const date = (now).toISOString().slice(0, 10);
    const sqlStatements=[`
        INSERT INTO nft_records (date, user, nft, timestamp, balance)
        VALUES ('${date}', '${from}', 
            COALESCE(
                (SELECT nft FROM(
                    SELECT nft  FROM nft_records
                    WHERE user = '${from}' AND date = '${date}'
                    ORDER BY timestamp DESC LIMIT 1)AS a
                ), 0
            ) - 1,
            '${timestamp}',
            COALESCE(
                (SELECT balance FROM(SELECT balance FROM nft_records
                    WHERE user = '${from}' 
                    ORDER BY timestamp DESC LIMIT 1)AS a
                ), 0
            )-1
        )
        ON DUPLICATE KEY UPDATE nft = nft - 1,balance=balance-1;
        `,`
        INSERT INTO nft_records (date, user, nft,timestamp, balance)
        VALUES ('${date}', '${to}', 
            COALESCE(
                (SELECT nft FROM(
                    SELECT nft FROM nft_records
                    WHERE user = '${to}' AND date = '${date}'
                    ORDER BY timestamp DESC LIMIT 1) AS a
                ),0
            )+1,
            '${timestamp}',
            COALESCE(
                (SELECT balance FROM(SELECT balance FROM nft_records
                    WHERE user = '${to}' 
                    ORDER BY timestamp DESC LIMIT 1)AS a
                ), 0
            )+1
        )
        ON DUPLICATE KEY UPDATE nft = nft + 1,balance=balance+1;
        `
    ]
    const bk_sqlStatements=[
        `
        INSERT INTO nft_records (date, user, nft,timestamp)
        VALUES ('${date}', '${from}', COALESCE(
            (SELECT nft FROM(
                SELECT nft FROM nft_records
                WHERE user = '${from}' AND date = '${date}'
                ORDER BY timestamp DESC LIMIT 1
            ) AS a),0) - 1,'${timestamp}')
        ON DUPLICATE KEY UPDATE nft = nft - 1;
        `,`
        INSERT INTO nft_records (date, user, nft,timestamp)
        VALUES ('${date}', '${to}', COALESCE(
            (SELECT nft FROM(
                SELECT nft FROM nft_records
                WHERE user = '${to}' AND date = '${date}'
                ORDER BY timestamp DESC
                LIMIT 1
            ) AS a),0) + 1,'${timestamp}')
        ON DUPLICATE KEY UPDATE nft = nft + 1;
        `
    ]
    try {
        await pool.beginTransaction(sqlStatements);
        // console.log("try");
    } catch (error) {
        console.log(error);
    }
    return;
}

module.exports={
    day_balance
}