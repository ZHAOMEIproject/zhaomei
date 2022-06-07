const topaccount = require("./topaccount.json");
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const deploymentPath = path.resolve(__dirname, `./`);
var dir= deploymentPath+`/topaccountinfo.json`;

let newinfo=new Array();
for(i=topaccount.data.list.length-1;i>=0;i--){
    newinfo.push(topaccount.data.list[i].tags.addr);
}
writeFile(dir, JSON.stringify(newinfo, null, 2));
// console.log(topaccount.data.list[0].collTags.contract);