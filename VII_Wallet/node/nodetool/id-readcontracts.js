const fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname, '../../Hardhat_Contract/deployments/');

// test();

// async function test(){
//     return console.log(await loadcontractinfo(filePath));
// }

var jsonFile = require('jsonfile')
function loadcontractinfo(filePath) {
    return new Promise(function (resolve, reject) {
        let info = new Array();
        fs.readdir(filePath, async function (err, files) {
            if (err) {
                console.warn(err, "读取文件夹错误！")
                global.zwjerror = true;
                reject();
            } else {
                for (const filename of files) {
                    const filedir = path.join(filePath, filename);
                    const stats = await fs.promises.stat(filedir);

                    if (stats.isDirectory()) {
                        const subInfo = await loadcontractinfo(filedir);
                        info = info.concat(subInfo);
                    } else {
                        info.push(filedir);
                    }
                }
            }
            resolve(info);
        });
    });
}

exports.getcontractinfo = async function getcontractinfo() {
    // return await loadcontractinfo(filePath);
    let info = new Object();
    let filelist = await loadcontractinfo(filePath);
    for (let i in filelist) {
        let fileinfo = await jsonFile.readFile(filelist[i]);
        try {
            var chainId = fileinfo.network.chainId;
        } catch (error) {
            continue;
        }
        if (!(info[chainId] !== null && typeof info[chainId] === 'object')) {
            info[chainId] = new Object();
        }
        info[chainId][fileinfo.contractName] = fileinfo;
    }
    return info;
}
var loc_allinfo
// var loc_allinfo = require("../../deployments/all.json");
exports.loc_getcontractinfo = async function loc_getcontractinfo() {
    if (loc_allinfo) {
        return loc_allinfo;
    }
    loc_allinfo = require("../../deployments/all.json");
    return loc_allinfo;
    // return loc_allinfo;
}