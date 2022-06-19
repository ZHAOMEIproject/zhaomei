/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = function taskStart(){
    console.log(`Tasks start loading`);
    taskSyncwithdraw();
    // setTimeout(function () {
    //     setInterval(taskwithdraw,1000*20);// task I,Synchronization levelnft event record,Do it every 10s
    // }, 0);

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