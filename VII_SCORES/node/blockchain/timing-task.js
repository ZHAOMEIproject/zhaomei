/*Timing task*/

// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = function taskStart(){
    console.log(`Tasks start loading`);

    setTimeout(function () {
        setInterval(taskSynchronizationIDOEventRecord,1000*10);// task I,Synchronization ido event record,Do it every 10s
    }, 1000*3);

}

async function taskSynchronizationIDOEventRecord() {
    console.log("task I   (10s)  ========>  synchronization ido Event Record ...");

    const ido = require("./mysql-synchronous/ido");
    await ido.disposeEventsIDO();// 处理事件结果
}


