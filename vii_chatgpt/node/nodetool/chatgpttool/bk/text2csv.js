const axios = require('axios');
const cheerio = require('cheerio');
let {
    testsplits,
    splits
} = require('./split');
module.exports = {
    testtext2csvs,
    text2csvs
}
// const testresult = require('./test/test2csv.json');
async function testtext2csvs(texts) {
    return testsplits();
}

async function viewtext2csv(tokens) {
    // let results=text;
    const data = tokens;
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
}
async function savetext2csv(tokens) {
    // let results=text;
    const data = tokens;
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
}

main();
async function main() {
    let splits = await testsplits();
    // console.log(splits);
    console.log(await viewtext2csv(splits.tokens));
}