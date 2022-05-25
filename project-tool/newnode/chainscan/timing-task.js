/*Timing task*/
// After the project starts, the scheduled task will be started in five seconds
exports.taskStart = function taskStart(){
    console.log(`Tasks start loading`);
    // taskSynchronizationlevelnftEventRecord();
    setTimeout(function () {
        setInterval(taskSynchronizationlevelnftEventRecord,1000*20);// task I,Synchronization levelnft event record,Do it every 10s
    }, 0);

}

async function taskSynchronizationlevelnftEventRecord() {
    console.log("task I   (20s)  ========>  synchronization levelnft Event Record ...");
    const levelnft = require("./mysql-synchronous/levelnft");
    await levelnft.disposeEventslevelnft();// 处理事件结果
}

var fs = require("fs")
var path = require("path")
var root = path.join("../../Hardhat_Contract/deployments/newinfo")
function newtask(){
    readDir(path.join(root))
    function readDir(path){
        fs.readdir(path,function(err,menu){	
            if(!menu)
                return;
            menu.forEach(function(ele){	
                fs.stat(path+"/"+ele,function(err,info){
                })
            })
        })
    }
}