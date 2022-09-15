/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds==
exports.taskStart = async function taskStart(){
    console.log(`Tasks start loading`);
    // blocknumber=await scanblock.getblocknumber()-1;
    await taskscanblock();
    setTimeout(function () {
        setInterval(taskscanblock,1000*5);// task I,Synchronization levelnft event record,Do it every 10s
    }, 1000*5);
}
async function taskscanblock() {
    console.log("task I   (20s)  ========>  taskscanblock ...");
    const scanblock = require("./scanblock/main");
    await scanblock.main();
}
