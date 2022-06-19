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
    setinfo = require("/root/learn/.secret.json");
    // node_info = setinfo.VII_SCORES_NODE;
    // host = node_info.host;
    // port = 9999;
    global.mysqlGlobal = setinfo.VII_Wallet_SQL;
}


// Arouse the express
// const express = require("express");
// const app = express();

// Arouse the swagger
// const swagger = require("./nodetool/swagger");
// swagger.swaggerConfig(app,host,port);

// Arouse the service
const service = require("./nodetool/service");
service.serviceConfig(app,host,port);

// Arouse rest api
// const restApi = require("./nodetool/restApi");
// restApi.restApiConfig(app);

// // Arouse the task
// const timingTask = require("./blockchain/timing-task");
// timingTask.taskStart();
