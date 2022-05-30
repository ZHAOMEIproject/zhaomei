/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var magicworld_url;
var magicworld_port;
function start_dev(){
    console.log("start_dev ing")
    magicworld_url = "127.0.0.1";
    magicworld_port = "8080";
    global.mysqlGlobal = require("./config/mysql/test-mysql.json")
}

function start_test(){
    console.log("start_pro ing")
    magicworld_url = "154.91.156.113";
    magicworld_port = "8083";
    global.mysqlGlobal = require("./config/mysql/test-mysql.json")
}

function start_pro(){
    console.log("start_pro ing")
    magicworld_url = "154.82.72.75";
    magicworld_port = "8085";
    global.mysqlGlobal = require("./config/mysql/online-mysql.json")
}

// Arouse the express
const express = require("express");
const app = express();

// Arouse the swagger
const swagger = require("./config/swagger");
swagger.swaggerConfig(app,magicworld_url,magicworld_port);

// Arouse the service
const service = require("./config/service");
service.serviceConfig(app,magicworld_url,magicworld_port);

// Arouse rest api
const restApi = require("./config/restApi");
restApi.restApiConfig(app);

// // Arouse the task
// const timingTask = require("./blockchain/timing-task");
// timingTask.taskStart();
