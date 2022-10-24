const fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname,'../../Hardhat_Contract/deployments/newinfo/');

// test();

// async function test(){
//     return await loadcontractinfo(filePath);
// }

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
                    var contractinfo = require(filedir);
                    info[filename.substring(0, filename.lastIndexOf("."))]=contractinfo;
                    info.push(contractinfo);
                });
            }
            resolve(info);
        });
    });
}

exports.getcontractinfo = async function getcontractinfo(){
    return await loadcontractinfo(filePath);
}