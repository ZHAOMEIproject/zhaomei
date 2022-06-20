/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var setinfo;

function start_test(){
    console.log("start_dev ing")
    // setinfo = require("../../../privateinfo/.secret_official.json");
    setinfo = require("../../../privateinfo/.secret.json");
    global.mysqlGlobal = setinfo.mysql;
    global.name = "project_tool";
    global.zwjerror = false;
}


// // Arouse the express
// const express = require("express");
// const app = express();

// // Arouse the swagger
// const swagger = require("./nodetool/swagger");
// swagger.swaggerConfig(app,host,port);

// // Arouse the service
// const service = require("./nodetool/service");
// service.serviceConfig(app,host,port);

// // Arouse rest api
// const restApi = require("./nodetool/restApi");
// restApi.restApiConfig(app);

// Arouse the task
const timingTask = require("./task/timing-task");
timingTask.taskStart();
