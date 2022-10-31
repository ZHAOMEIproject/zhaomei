const fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname,'../../Hardhat_Contract/deployments/newinfo/');

// test();

// async function test(){
//     let a = await loadcontractinfo(filePath);
//     return console.log(a);
// }

var jsonFile = require('jsonfile')
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
                    let filedir = path.join(filePath, filename);
                    info.push(filedir)
                });
            }
            resolve(info);
        });
    });
}

var jsonFile = require('jsonfile')
exports.getcontractinfo = async function getcontractinfo(){
    // return await loadcontractinfo(filePath);
    let info = new Object();
    let filelist = await loadcontractinfo(filePath);
    for (let i in filelist) {
        let fileinfo = await jsonFile.readFile(filelist[i]);
        let chainId =fileinfo.network.chainId;
        if(!(info[chainId] !== null && typeof info[chainId] === 'object')){
            info[chainId]=new Object();
        }
        info[chainId][fileinfo.contractName] = fileinfo;
    }
    return info;
}