
async function getsize(filePath) {
    return new Promise(resolve => {
        // 读取文件
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            // 统计汉字数量
            const cn = data.match(/[\u4e00-\u9fa5]/g) ? data.match(/[\u4e00-\u9fa5]/g).length : 0;
            // 统计英文单词数量
            const en = data.match(/[a-zA-Z]+/g) ? data.match(/[a-zA-Z]+/g).length : 0;
            resolve({
                cn,
                en,
                total: cn + en,
            })
        });

    })
}
