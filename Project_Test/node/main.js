/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var node_info;
var host;
var port;
var setinfo;

function start_test(){
    console.log("start_dev ing")
    // setinfo = require("../../../privateinfo/.secret_official.json");
    setinfo = require("../../../privateinfo/.secret.json");
    node_info = setinfo.Project_Tool_NODE;
    host = node_info.host;
    port = node_info.port;
    global.mysqlGlobal = setinfo.Project_Tool_SQL;
    global.zwjerror = false;
    global.name ="Project_Tool";
}

// // Arouse the swagger
// const swagger = require("./nodetool/swagger");
// swagger.swaggerConfig(app,host,port);

// Arouse the express
const express = require("express");
const app = express();

// Arouse the service
const service = require("./nodetool/service");
service.serviceConfig(app,host,port);

// Arouse rest api
const restApi = require("./nodetool/restApi");
restApi.restApiConfig(app);

// // Arouse the task
// const timingTask = require("./task/timing-task");
// timingTask.taskStart();
