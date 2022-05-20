/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_dev();

// =======================================================================================

// magic-v2 start Set
var levelnft_url;
var levelnft_port;
function start_dev(){
    console.log("start_dev ing")
    levelnft_url = "127.0.0.1";
    levelnft_port = "10880";
    global.mysqlGlobal = require("./config/mysql/test-mysql.json")
}

function start_test(){
    console.log("start_pro ing")
    levelnft_url = "154.82.72.75";
    levelnft_port = "8701";
    global.mysqlGlobal = require("./config/mysql/test-mysql.json")
}

function start_pro(){
    console.log("start_pro ing")
    levelnft_url = "154.82.72.75";
    levelnft_port = "8702";
    global.mysqlGlobal = require("./config/mysql/online-mysql.json")
}

// Arouse the express
const express = require("express");
const app = express();

// Arouse the service
const service = require("./config/service");
service.serviceConfig(app,levelnft_url,levelnft_port);

// Arouse the task
const timingTask = require("./blockchain/timing-task");
timingTask.taskStart();
