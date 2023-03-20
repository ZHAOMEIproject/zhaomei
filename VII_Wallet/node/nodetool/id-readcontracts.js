const fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname,'../../Hardhat_Contract/deployments/newinfo/');

// test();

// async function test(){
//     let a = await loadcontractinfo(filePath);
//     return console.log(a);
// }

function loadcontractinfo(filePath){
    return new Promise(function(resolve,reject){
        let info = new Object();
        fs.readdir(filePath,function(err, files) {
            if (err) {
                console.warn(err, "读取文件夹错误！")
                global.zwjerror =true;
                reject();
            } else {
                files.forEach(function(filename) {
                    let filedir = path.join(filePath, filename);
                    let fileinfo = require(filedir);
                    let chainId =fileinfo.network.chainId;
                    if(!(info[chainId] !== null && typeof info[chainId] === 'object')){
                        info[chainId]=new Object();
                    }
                    info[chainId][filename.substring(0, filename.lastIndexOf("."))] = fileinfo;
                });
            }
            resolve(info);
        });
    });
}

exports.getcontractinfo = async function getcontractinfo(){
    return await loadcontractinfo(filePath);
}