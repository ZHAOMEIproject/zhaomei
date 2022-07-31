/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    // await taskSyncchainscan()
    // console.log(`scan set out`);
    global.mysqlGlobal.database=global.name;

    // await taskSyncwithdraw()
    // await taskSyncwithdraw_sign()

    setTimeout(function () {
        setInterval(taskSyncchainscan,1000*30);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);
    setTimeout(function () {
        setInterval(taskSyncwithdraw,1000*30);// task I,Synchronization levelnft event record,Do it every 10s
    }, 10);
    setTimeout(function () {
        setInterval(taskSyncwithdraw_sign,1000*30);// task I,Synchronization levelnft event record,Do it every 10s
    }, 20);
}

// async function taskSynchronizationlevelnftEventRecord() {
//     console.log("task I   (20s)  ========>  synchronization levelnft Event Record ...");
//     const levelnft = require("./levelnft");
//     await levelnft.disposeEventslevelnft();// 处理事件结果
// }
async function taskSyncwithdraw() {
    console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
    const withdraw = require("./withdraw/withdraw");
    await withdraw.withdraw();// 处理事件结果
}

async function taskSyncwithdraw_sign() {
    console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
    const withdraw_sign = require("./withdraw/withdraw_sign");
    await withdraw_sign.withdraw_sign();// 处理事件结果
}
async function taskSyncchainscan() {
    console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
    const chainscan = require("./chainscan/scan");
    await chainscan.scan();// 处理事件结果
}