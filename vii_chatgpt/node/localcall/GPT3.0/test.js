const fs = require('fs');
const filePath = 'file.txt';



main();
async function main() {
    let segments = await fun(200);
    console.log(segments);
}
async function subsection(wordsPerSegment) {
    return new Promise(resolve => {
        // 读取文件
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                return;
            }

            // 将文本按照句号、问号、感叹号等标点符号分割成句子数组
            const sentences = data.split(/(?<=[。？！])/);

            let segments = [];
            let currentSegment = '';

            // 遍历每个句子
            for (let i = 0; i < sentences.length; i++) {
                const sentence = sentences[i];

                // 如果当前段加上当前句子的字数超过了每段字数限制，则将当前段保存，并开始一个新的段
                if (currentSegment.length + sentence.length > wordsPerSegment) {
                    segments.push(currentSegment);
                    currentSegment = '';
                }

                // 将当前句子添加到当前段中
                currentSegment += sentence;

                // 如果当前段已经是最后一段，则将当前段保存
                if (i === sentences.length - 1) {
                    segments.push(currentSegment);
                }
            }
            resolve(segments)
            // // 打印分段结果
            // console.log('分段结果：');
            // segments.forEach((segment, index) => {
            //     console.log(`第 ${index + 1} 段：${segment}`);
            // });
        });
    })


}
