/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    await taskSyncchainscan()
    // console.log(`scan set out`);
    global.mysqlGlobal.database=global.name;

    await taskSyncVII_POAP()
    
    setTimeout(function () {
        setInterval(taskSyncchainscan,1000*10);// task I,Synchronization levelnft event record,Do it every 10s
    }, 10);
    setTimeout(function () {
        setInterval(taskSyncVII_POAP,1000*10);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);
}
async function taskSyncVII_POAP() {
    console.log("task I   (20s)  ========>  taskSyncVII_POAP ...");
    const VII_POAP = require("./VII_POAP/VII_POAP");
    await VII_POAP.VII_POAP();// 批量mint
}

async function taskSyncchainscan() {
    console.log("task I   (20s)  ========>  taskSyncchainscan ...");
    const chainscan = require("./chainscan/scan");
    await chainscan.scan();// 扫块
}