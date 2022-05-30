const request = require("request");
const connection = require("./connection");
const validator = require('validator');

// 获取事件日志最后更新区块高度
async function eventsLoglastBlockNumber(){
    let selSql = "SELECT key_value as last_block_number FROM dictionary_value where key_id='block_number_ido'";
    return await connection.select(selSql,null);
}

// 交易哈希 唯一索引
async function getIsExistCurrentRecord(event_name,transaction_hash){
    let selSql = "select count(0) as count from ido_events_log WHERE event_name=? and transaction_hash=?";
    let selectParams = [ event_name,transaction_hash ];
    return await connection.select(selSql,selectParams);
}

// 处理事件结果
exports.disposeEventsIDO = async function disposeEventsIDO(){

    let web3Show = require("./../show/web3Show");
    let idoContract = "0x1ccC0632687c562a94f49Cf9bA08f5963D6665E4";// IDO合约地址

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
        let response = await web3Show.getContractEvents(idoContract,block_number,toBlock);
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

                let farm_id = 0;
                let count = 0;
                let amount = 0;
                let amount2= 0;

                if(json[i].event=="OwnershipTransferred"){
                    from_address = json[i].returnValues.previousOwner;
                    to_address = json[i].returnValues.newOwner;
                    content = "IDO合约创建";
                }else if(json[i].event=="JoinSwap"){
                    from_address = json[i].returnValues._account;
                    to_address = json[i].address;
                    farm_id = json[i].returnValues._swapId;
                    count = json[i].returnValues._swapNowJoinTotalCount;
                    amount = json[i].returnValues._payUsdtAmount/Math.pow(10,18).toFixed(4);
                    amount2 = json[i].returnValues._swapMacAmount/Math.pow(10,18).toFixed(4);
                    content = "加入IDO";
                }

                // III. 添加事件日记记录
                let addSqlParams =  [ json[i].blockNumber,json[i].event,json[i].transactionHash,from_address,to_address,content,farm_id,count,amount,amount2 ];
                await addEventLog(addSqlParams);
                console.log("disposeEventsFarm result =============> insert: ",json[i].blockNumber,json[i].transactionHash,content);
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
    let addSql = "INSERT INTO ido_events_log(block_number,event_name,transaction_hash,from_address,to_address,content,update_time,farm_id,count,amount,amount2) " +
        "VALUES(?,?,?,?,?,?,now(),?,?,?,?)";
    connection.insert(addSql,addSqlParams);
};

// 最后检测区块链高度
function updateEventsLoglastBlockNumber(toBlock){
    let updateSql = "update dictionary_value set key_value=? where key_id='block_number_ido'";
    connection.insert(updateSql,toBlock);
};