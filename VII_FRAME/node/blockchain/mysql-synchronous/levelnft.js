const request = require("request");
const connection = require("./connection");
const validator = require('validator');

// 获取事件日志最后更新区块高度
async function eventsLoglastBlockNumber(){
    let selSql = "SELECT key_value as last_block_number FROM dictionary_value where key_id='block_number_levelnft'";
    return await connection.select(selSql,null);
}

// 交易哈希 唯一索引
async function getIsExistCurrentRecord(event_name,transaction_hash){
    let selSql = "select count(0) as count from levelnft_events_log WHERE event_name=? and transaction_hash=?";
    let selectParams = [ event_name,transaction_hash ];
    return await connection.select(selSql,selectParams);
}

// 处理事件结果
exports.disposeEventslevelnft = async function disposeEventslevelnft(){

    let web3Show = require("./../show/web3Show");
    let levelnftContract = "0x0F16be277b1a54cB98A0683b8f43122F239C61C9";// levelnft合约地址

    // 最后检测区块链高度
    let block_number_mysql = await eventsLoglastBlockNumber();
    let block_number = block_number_mysql[0].last_block_number;
    let toBlock = parseInt(block_number)+parseInt(100);

    // 获取链上当前区块
    let now_blockNumber = await web3Show.getBlockNumber();
    if(toBlock>now_blockNumber){
        toBlock = now_blockNumber; // update toBlock
    }

    return new Promise(async function (resolve, reject) {
        let response = await web3Show.getContractEventsBylevelnft(levelnftContract,block_number,toBlock);
        let json = JSON.parse(JSON.stringify(response));

        if (json.length >= 1) {
            for(let i=0;i<json.length;i++){
                // I. events_name+transaction_hash 唯一索引
                let isExistCurrentRecord = await getIsExistCurrentRecord(json[i].event,json[i].transactionHash);
                if(isExistCurrentRecord[0].count>=1){
                    continue;//结束此轮循环
                }

                // II. 筛选数据
                let from_address = "-";
                let to_address = "-";
                let content = "-";

                let tokenId = 0;

                if(json[i].event=="Transfer"){
                    content = "levelnft转账";
                    from_address = json[i].returnValues.from;
                    to_address = json[i].returnValues.to;
                    tokenId = json[i].returnValues.tokenId;
                    // III. 添加事件日记记录
                    updatetokenidowner([tokenId,to_address]);
                }
                let addSqlParams =  [ json[i].blockNumber,json[i].event,json[i].transactionHash,from_address,to_address,content,tokenId ];
                await addEventLog(addSqlParams);
                console.log("disposeEventslevelnft result =============> insert: ",json[i].blockNumber,json[i].transactionHash,content);
            }
            resolve();
        }

        // 最后检测区块链高度
        await updateEventsLoglastBlockNumber(toBlock);
        console.log("updateEventsLoglastBlockNumber =============> block_number: ", block_number," ==> toBlock", toBlock);
    })
}

// 添加Event_Log
function addEventLog(addSqlParams){
    let addSql = "INSERT INTO levelnft_events_log(block_number,event_name,transaction_hash,from_address,to_address,content,update_time,tokenid) " +
        "VALUES(?,?,?,?,?,?,now(),?)";
    connection.insert(addSql,addSqlParams);
};

// 最后检测区块链高度
function updateEventsLoglastBlockNumber(toBlock){
    let updateSql = "update dictionary_value set key_value=? where key_id='block_number_levelnft'";
    connection.update(updateSql,toBlock);
};
// 更新拥有者
function updatetokenidowner(addSqlParams){
    let updateSql = "replace into tokenowner(tokenid,owner) values(?,?)";
    connection.replace(updateSql,addSqlParams);
};