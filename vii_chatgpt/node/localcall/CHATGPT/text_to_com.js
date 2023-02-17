const fs = require('fs');



async function subsection(filePath, wordsPerSegment) {
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

async function detection(
    filePath,
    wordsPerSegment,
) {
    let segments = await subsection(filePath, wordsPerSegment / 2)
    let n_call = segments.length;
    console.log(
        "预计呼叫次数：", n_call,
        "\n预计花费tokens: ", n_call * 1000,
        "\n预计费用: ", n_call * 0.02
    );
}
global.secret = require("/root/learn/github/privateinfo/.secret.json");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: global.secret.vii_chatgpt.key,
});
const openai = new OpenAIApi(configuration);
async function basecall(prompt,max_tokens,n) {
    const response = await openai.createCompletion({
        prompt: prompt,
        "max_tokens": max_tokens,//最大输出token
        "n": n,//同问题多输出
        "model": "text-davinci-003",//选择模型
        "temperature": 1,//创新性0-1
        "top_p": 1,//关联性
        "presence_penalty": 0.6,//重复惩罚
        "frequency_penalty": 2,//频率惩罚
        "stop": ["Human:", "AI:"],//停止符号
    });
    return response
}
let startstr = "Please answer truthfully as a friendly AI.\nHuman: "
let endstr = '\n用上面资料按此格式编写训练集。\n{"prompt":"<从上述资料提出的武康大楼问题>", "completion":"<从上述资料整理出的答案> END"}\nAI: '

async function addfile(strToAdd,filePath){
    return new Promise(resolve => {
        fs.open(filePath, 'a', function(err, fd) {
            if (err) {
              console.error(err);
              return;
            }
          
            // 将要添加的字符串写入文件末尾
            fs.write(fd, strToAdd, function(err) {
              if (err) {
                // console.error(err);
                return;
              }
            //   console.log(`"${strToAdd}" has been added to the end of the file.`);
              
              // 关闭文件
              fs.close(fd, function(err) {
                if (err) {
                  console.error(err);
                  return;
                }
                // console.log('File closed.');
              });
            });
          });
          resolve(true);
    })
}
async function gptcall(prompt,max_tokens,n) {
    let response = basecall((startstr+prompt+endstr),max_tokens,n);
    // let response = basecall(prompt,max_tokens,n);
    return response;
}



var api;
init();
async function init(){
    // return
    var {ChatGPTAPIBrowser} = await import('chatgpt');
    // console.log(ChatGPTAPIBrowser);
    api = new ChatGPTAPIBrowser({
        email: global.secret.vii_chatgpt.email,
        password: global.secret.vii_chatgpt.password
    })
    await api.initSession();
    // const result = await api.sendMessage('Hello World!')
    // console.log(result)
}

let chatendstr = '\n用上面资料按此格式编写训练集。\n{"prompt":"<从上述资料提出的武康大楼问题>", "completion":"<从上述资料整理出的答案> END"}'

async function chatgptcall(callstr,opts){
    console.log(callstr+chatendstr);
    // return
    // return {
    //     response: '你好！我是 OpenAI 的语言模型 ChatGPT，有什么我可以帮忙的？',
    //     conversationId: 'ff1a2e91-0030-43c5-a230-4e31a60b53df',
    //     messageId: '1ff8f7b2-9c37-441c-b188-c059c44cde60'
    // }
    try {
        const result = await api.sendMessage(callstr+chatendstr,opts)
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        return error
    }
}
module.exports = {
    chatgptcall,
    detection,
    subsection,
    gptcall,
    addfile
}