/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var node_info;
var host;
var port;

function start_test(){
    console.log("start_dev ing")
    global.secret = require("../../../privateinfo/.secret.json");
    node_info = global.secret.vii_chatgpt_NODE;
    host = node_info.host;
    port = node_info.port;
    global.name ="vii_chatgpt";
    global={
        ...global,
        search2url:{
            key: 'AIzaSyANCrDSRXHPNOmmsB51yGqWLmlCRsjkJzU',
            cx: '77ea1dfd64ff74371',
            num: 10,
        },
        text2split : {
            max_tokens: 1000
        },
        split2embedding:{
            OPENAI_API_KEY: "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"
        },
        dist2calltext:{
            max_len: 1000
        },
        chatgptcall:{
            OPENAI_API_KEY: "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"
        },
        history:{
            max_token:3000
        },
        
    }
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
const restApi = require("./api/restApi");
restApi.restApiConfig(app);