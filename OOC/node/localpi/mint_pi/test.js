let info =require("./mintinfo.json");

mian()

function mian(){
    console.log(info.events[0].args[2].hex);
    console.log(parseInt(info.events[0].args[2].hex,16));
}