// const math = require("math");

Exponential(1000,1950)
function Exponential(score,max){
    if(score>1704.882){
        score = 150*(Math.log(score,2))
    }else{
        score = 39*Math.sqrt(score)
    }
    console.log(score*max/1950);
    return score*max/1950;
}