/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    await taskscanblock();

    // await taskSyncchainscan();
    // setTimeout(function () {
    //     setInterval(taskSyncchainscan,1000);// task I,Synchronization levelnft event record,Do it every 10s
    // }, 0);
}

async function taskscanblock() {
    console.log("task I   (20s)  ========>  taskscanblock ...");
    const scanblock = require("./scanblock/main");
    await scanblock.main();// 处理事件结果
}

// async function taskSyncchainscan() {
//     console.log("task I   (20s)  ========>  taskSyncwithdraw ...");
//     const chainscan = require("./chainscan/scan");
//     await chainscan.scan();// 处理事件结果
// }