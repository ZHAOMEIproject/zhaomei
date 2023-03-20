/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    // await taskSyncchainscan()
    // console.log(`scan set out`);
    global.mysqlGlobal.database=global.name;

    await taskSyncwithdraw()
    await taskSyncwithdraw_sign()
    
    // await taskSyncchainscan()
    // console.log(`scan set out`);

    setTimeout(function () {
        setInterval(taskSyncchainscan,1000*10);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);
    setTimeout(function () {
        setInterval(taskSyncwithdraw,1000*60);// task I,Synchronization levelnft event record,Do it every 10s
    }, 10);
    setTimeout(function () {
        setInterval(taskSyncwithdraw_sign,1000*60);// task I,Synchronization levelnft event record,Do it every 10s
    }, 20);
}
async function taskSyncwithdraw() {
    console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
    const withdraw = require("./withdraw/withdraw");
    await withdraw.withdraw();// 处理事件结果
}

async function taskSyncwithdraw_sign() {
    console.log("task I   (20s)  ========>  taskSyncwithdraw_sign ...");
    const withdraw_sign = require("./withdraw/withdraw_sign");
    await withdraw_sign.withdraw_sign();// 处理事件结果
}
async function taskSyncchainscan() {
    console.log("task I   (20s)  ========>  taskSyncchainscan ...");
    const chainscan = require("./chainscan/scan");
    await chainscan.scan();// 处理事件结果
}