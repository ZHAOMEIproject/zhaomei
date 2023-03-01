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
    setinfo = require("../../../privateinfo/.secret_official.json");
    // setinfo = require("../../../privateinfo/.secret.json");
    node_info = setinfo.vii_weidong_NODE;
    host = node_info.host;
    port = node_info.port;
    global.mysqlGlobal = setinfo.vii_weidong_SQL;
    global.zwjerror = false;
    global.name =global.setinfo.vii_weidong_SQL.database;
}


// Arouse the express
const express = require("express");
const app = express();

// // Arouse the swagger
// const swagger = require("./nodetool/swagger");
// swagger.swaggerConfig(app,host,port);

// Arouse the service
const service = require("./nodetool/service");
service.serviceConfig(app,host,port);

// Arouse rest api
const restApi = require("./api/restApi");
restApi.restApiConfig(app);

// // Arouse the task
// const timingTask = require("./blockchain/timing-task");
// timingTask.taskStart();
