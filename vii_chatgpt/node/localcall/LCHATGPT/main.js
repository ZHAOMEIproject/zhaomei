const { subsection, detection, gptcall, addfile, l_chatcall } = require("./text_to_com")
// let sendopt = {
//     "model": "text-davinci-003",//选择模型
//     "temperature": 0.5,//创新性0-1
//     "max_tokens": 2048,//最大输出token
//     "top_p": 0.8,//关联性
//     "n": 2,//同问题多输出
//     "presence_penalty": 0.6,//重复惩罚
//     "frequency_penalty": 0.0,//频率惩罚
//     "stop": ["Human:", "AI:"],//停止符号
// }
// let ex_input = {
//     filePath,
//     wordsPerSegment,
//     max_tokens,
//     n,
// }
let input = ['file.txt', 200, 1000, 4, "save.txt"]
// detection(...input);
main(...input);
async function main(
    filePath,
    wordsPerSegment,
    max_tokens,
    n,
    savefile,
) {
    let segments = await subsection(filePath, wordsPerSegment / 2);
    // console.log(segments[0] + segments[1]);
    for (let i = 0; i < 10; i++) {
        for (let i = 1; i < segments.length; i++) {
            console.log(i);
            let response = await l_chatcall((segments[i-1]+segments[i]),max_tokens,n)
            let res_data= response.data.choices;
            for (let i in res_data) {
                // console.log(res_data[i]);
                console.log(res_data[i].text);
                await addfile(("\n"+res_data[i].text),savefile)
            }
        }
    }



    // let response = await gptcall((segments[0]+segments[1]),max_tokens,n)
    // let response = await gptcall(("test"),max_tokens,1)
    // let res_data= response.data.choices;
    // let res_data = [
    //     {
    //         text: '\n' +
    //             '{"prompt":"武康大楼是什么样的建筑？", "completion":"武康大楼是一座位于上海市静安区的现代化商业大厦，其设计风格独特，外观醒目，内部设施齐全，是一座集商务、休闲、娱乐为一体的综合性大厦。END"}',
    //         index: 0,
    //         logprobs: null,
    //         finish_reason: 'stop'
    //     }
    // ];
    // for (let i in res_data) {
    //     console.log(res_data[i].text);
    //     await addfile(("\n"+res_data[i].text+"\n"),savefile)
    // }
    // {
    //     console.log(await l_chatcall((segments[0] + segments[1])));
        
    // }
}
async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
  }
  
