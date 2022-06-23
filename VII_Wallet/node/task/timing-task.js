/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = function taskStart(){
    console.log(`Tasks start loading`);
    setTimeout(function () {
        setInterval(taskSyncwithdraw,1000*20);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);
    setTimeout(function () {
        setInterval(taskSyncwithdraw_sign,1000*20);// task I,Synchronization levelnft event record,Do it every 10s
    }, 3);
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