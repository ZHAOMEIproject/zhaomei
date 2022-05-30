/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var magicworld_url;
var magicworld_port;

function start_test(){
    console.log("start_dev ing")
    setinfo = require("/root/learn/.secret.json");
    node_info = setinfo.VII_SCORES_NODE;
    global.mysqlGlobal = setinfo.VII_SCORES_SQL;
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
