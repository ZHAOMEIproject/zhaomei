var fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname,'../../Hardhat_Contract/deployments/newinfo/');
//调用文件遍历方法
fileDisplay(filePath);



async function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    var info = new Array();
    fs.readdir(filePath, function(err, files) {
        if (err) {
            console.warn(err, "读取文件夹错误！")
        } else {
            //遍历读取到的文件列表
            files.forEach(function(filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function(eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        if (isFile) {
                            // info.push(require(filedir));
                            // console.log(filedir);
                            // console.log(require(filedir));
                            // console.log(info);

                            console.log(path.basename(filedir));
                        }
                        if (isDir) {
                            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}
