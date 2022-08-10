const fs = require('fs');
const child_process = require('child_process');
var numCPUs = require('os').cpus().length

for(var i=0; i<numCPUs; i++) {
    var worker_process = child_process.fork("support.js", [i]);    
  
    worker_process.on('close', function (code) {
       console.log('子进程已退出，退出码 ' + code);
    });
 }