/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
let blocknumber;
const scanblock = require("./scanblock/fun/scanblock");
// const mysql = require("mysql2");
// global.conn = mysql.createConnection(global.mysqlGlobal);
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    blocknumber=await scanblock.getblocknumber()-1;
    await taskscanblock();

    setTimeout(function () {
        setInterval(taskscanblock,1000*5);// task I,Synchronization levelnft event record,Do it every 10s
    }, 1000*5);
}
// const scanblock = require("./scanblock/main");
let lock = false;
async function taskscanblock() {
    if (lock) {
        return;
    }
    lock=true;
    console.log("task I   (20s)  ========>  taskscanblock ...");
    let flag = blocknumber
    if (await scanblock.scanblock(flag)) {
        blocknumber++;
    };
    lock = false;
    return;
}

// async function taskSyncchainscan() {
//     console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
//     const chainscan = require("./chainscan/scan");
//     await chainscan.scan();// 处理事件结果
// }