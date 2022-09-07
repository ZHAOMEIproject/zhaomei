const {scanblock} =require('./fun/scanblock');
exports.main = async function main(){
    await scanblock();
    console.log("end");
    // process.nextTick(()=>{
    //     await scanblock();
    //     console.log("end");
    // })
}