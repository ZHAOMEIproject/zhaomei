/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    await taskSyncchainscan()
    // console.log(`scan set out`);
    global.mysqlGlobal.database=global.name;

    await taskSyncWEIDONG()
    
    setTimeout(function () {
        setInterval(taskSyncchainscan,1000*60);// task I,Synchronization levelnft event record,Do it every 10s
    }, 10);
    setTimeout(function () {
        setInterval(taskSyncWEIDONG,1000*60);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);
}
async function taskSyncWEIDONG() {
    console.log("task I   (20s)  ========>  taskSyncWEIDONG ...");
    const WEIDONG = require("./WEIDONG/WEIDONG");
    await WEIDONG.WEIDONG();// 批量mint
}

async function taskSyncchainscan() {
    console.log("task I   (20s)  ========>  taskSyncchainscan ...");
    const chainscan = require("./chainscan/scan");
    await chainscan.scan();// 扫块
}