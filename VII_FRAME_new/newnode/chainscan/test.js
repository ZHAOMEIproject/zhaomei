var fs = require("fs")
var path = require("path")

let dir ="./";
const dir_path = path.resolve(dir)
const fileList = fs.readdirSync(dir_path)
let file = fileList[1]
file = path.join(dir, file)
let parsed = path.parse(file)
console.log(file,parsed);

// const reName = (dir, ext) => {
// 	const dir_path = path.resolve(dir)
// 	const fileList = fs.readdirSync(dir_path)
// 	for (let i = 0; i < fileList.length; i++) {
// 		let file = fileList[i]
// 		file = path.join(dir, file)
// 		if (util.isFile(file)) {
// 			let parsed = path.parse(file)
// 			let newFileName = parsed.name + ext
// 			try {
// 				fs.renameSync(file, path.join(parsed.dir, newFileName))
// 				console.log(`${file} ========> ${path.join(parsed.dir, newFileName)}`);
// 			} catch (error) {
// 				throw (error)
// 			}
// 		}
// 	}
// 	console.log('done')
// }

// var root = path.join("./")
// readDir(path.join(root))
// function readDir(path){
// 	fs.readdir(path,function(err,menu){	
// 		if(!menu)
// 			return;
// 		menu.forEach(function(ele){	
// 			fs.stat(path+"/"+ele,function(err,info){
// 				if(info.isDirectory()){
// 					console.log("dir: "+ele)
// 					readDir(path+"/"+ele);
// 				}else{
// 					let parsed = path.parse(path+"/"+ele)
// 					ele=parsed.name;
// 					console.log("file: "+ele)
// 				}	
// 			})
// 		})
// 	})
// }