const fs = require('fs');
const csv = require('csv-parser');
module.exports = {
    testurl2texts,
    url2texts
}

// Load the cl100k_base tokenizer
const tokenizer = require('@dqbd/tiktoken').get_encoding('cl100k_base');

const results = [];

fs.createReadStream('processed/scraped.csv')
  .pipe(csv())
  .on('data', (data) => {
    const encoded_text = tokenizer.encode(data.text); //对文本进行编码
    data.n_tokens = encoded_text.length; //保存编码后的token数量到新列
    results.push(data);
  })
  .on('end', () => {
    // 绘制直方图
    const data = results.map(r => r.n_tokens);
    // console.log(n_tokens);
    const bins = 5; // 设置区间数量
    const minVal = Math.min(...data); // 计算最小值
    const maxVal = Math.max(...data); // 计算最大值
    const binSize = Math.ceil((maxVal - minVal) / bins); // 计算每个区间的大小

    // 初始化直方表
    const histogram = new Array(bins).fill(0);

    // 计算每个区间内数值的个数
    data.forEach((val) => {
      const binIndex = Math.floor((val - minVal) / binSize);
      histogram[binIndex]++;
    });

    // 输出直方表
    for (let i = 0; i < bins; i++) {
      const binLabel = `${minVal + i * binSize}-${minVal + (i + 1) * binSize}`;
      const binCount = Math.round(histogram[i]/data.length*50);
      const bar = '='.repeat(binCount);
      console.log(`${binLabel}: ${bar}`);
    }

  });
