const topnft = require("./topnft.json");
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const deploymentPath = path.resolve(__dirname, `./`);
var dir= deploymentPath+`/topnftinfo.json`;

let newinfo=new Array();
for(i=topnft.data.list.length-1;i>=0;i--){
    newinfo.push(topnft.data.list[i].collTags.contract);
    console.log(i);
}
console.log(newinfo);
writeFile(dir, JSON.stringify(newinfo, null, 2));
// console.log(topnft.data.list[0].collTags.contract);