/**
 * - 加载clustr模块
 * - 设定启动进程数为cpu个数
 */
var cluster = require('cluster')
var numCPUs = require('os').cpus().length

let primes = []

let {creatw} = require('./web3_creatw');
const prompt = require('prompt');
prompt.start();

const args = {
};


if (cluster.isMaster) {
    prompt.addProperties(args, ['parame'], (err) => {
        if (err) {
            throw err;
        }
        console.dir(args);
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
    process.on('message', (msg) => {
        console.log(msg)
        const { cpu, random ,args} = msg
        const data = creatw(cpu,random,args)
        // 在工作进程中，这会发送消息给主进程
        process.send({ data: data })
    })
}

