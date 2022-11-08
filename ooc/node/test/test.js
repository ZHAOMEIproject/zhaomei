// 如果本地缓存起到类似全局变量的功能
let z = {c:1,d:{e:2}};
let shouyelist = {...z};
let fuyelist = {...z};
console.log(shouyelist);
console.log(fuyelist);
z.d.e=4;
console.log(shouyelist);
console.log(fuyelist);