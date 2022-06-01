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
    node_info = setinfo.VII_SCORES_NODE;
    global.mysqlGlobal = setinfo.VII_SCORES_SQL;
}

// Arouse the express
const express = require("express");
const app = express();

// Arouse the swagger
const swagger = require("./nodetool/swagger");
swagger.swaggerConfig(app,node_info.host,node_info.port);

// Arouse the service
const service = require("./nodetool/service");
service.serviceConfig(app,node_info.host,node_info.port);

// Arouse rest api
const restApi = require("./nodetool/restApi");
restApi.restApiConfig(app);

// // Arouse the task
// const timingTask = require("./blockchain/timing-task");
// timingTask.taskStart();
