/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_dev();

// =======================================================================================

// start Set
var node_info;
var setinfo;
function start_dev(){
    console.log("start_dev ing")
    setinfo = require("/root/learn/.secret.json");
    node_info = setinfo.VII_FRAME_NODE;
    global.mysqlGlobal = setinfo.VII_FRAME_SQL;
}

// Arouse the task
const timingTask = require("./chainscan/timing-task");
timingTask.taskStart();
