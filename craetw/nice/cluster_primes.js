/**
 * - 加载clustr模块
 * - 设定启动进程数为cpu个数
 */
var cluster = require('cluster')
// var numCPUs = 1;
var numCPUs = require('os').cpus().length
const fs = require('fs')

let primes = []

let {creatw} = require('./web3_creatw');
const prompt = require('prompt');
prompt.start();

const args = {
};


if (cluster.isMaster) {
    let warning = "---------------二子靓号------------\n" +
    "为您私人定制！最新技术断网生成更安全！为您安全保驾护航！如果您未从客服哪里购买正版APP，您的密钥很有可能遭到泄露！因为软件断网生成不会夹杂卡密验证系统，所以购买正版软件，让私钥更安全！\n" +
    "购买正版联系：@erzi66\n" +
    "合约node等定制开发：@biyuanzz\n";
    console.log(warning);
    // parame
    console.log("\n请输入地址尾号");
    prompt.addProperties(args, ['parame'], (err) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync('input.txt', warning,{flag:"a"},  function(err) {
            if (err) {
                return console.error(err);
            }
        });
        // console.dir(args);
        for (var i = 0; i < numCPUs; i++) {
            const worker = cluster.fork() // 启动子进程
            //  在主进程中，这会发送消息给特定的工作进程
            {
                let random =i + new Date().getTime();
                worker.send({cpu:i , random: random ,args:args})
            }
            worker.on('message', (msg) => {
                primes = primes.concat(msg.data)
                worker.kill()
            })
        }
        // 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件
        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died')
        })
    });
} else {
    // 监听子进程发送的信息
    process.on('message',async (msg) => {
        console.log(msg)
        const { cpu, random ,args} = msg
        const data = await creatw(cpu,random,args)
        // 在工作进程中，这会发送消息给主进程
        process.send({ data: data })
    })
}

