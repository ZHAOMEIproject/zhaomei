const fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname,'../deployments/newinfo/');

function loadcontractinfo(filePath){
    return new Promise(function(resolve,reject){
        let info = new Array();
        fs.readdir(filePath,function(err, files) {
            if (err) {
                console.warn(err, "读取文件夹错误！")
                global.zwjerror =true;
                reject();
            } else {
                files.forEach(function(filename) {
                    var filedir = path.join(filePath, filename);
                    info[filename.substring(0, filename.lastIndexOf("."))]=require(filedir);
                });
            }
            resolve(info);
        });
    });
}

exports.getcontractinfo = async function getcontractinfo(){
    return await loadcontractinfo(filePath);
}