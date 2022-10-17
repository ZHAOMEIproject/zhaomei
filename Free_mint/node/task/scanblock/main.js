const {scanblock} =require('./fun/scanblock');
exports.main = async function main(){
    // console.log("start",Date.now());
    await scanblock();
    // console.log("end",Date.now());
    // process.nextTick(()=>{
    //     await scanblock();
    //     console.log("end");
    // })
}