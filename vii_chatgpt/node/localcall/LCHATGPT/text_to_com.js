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
global.secret = require("../../../../../privateinfo/.secret.json");
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

let chatendstr = '\n以上是武康大楼的资料。请按以下格式编写3个openai的训练数据集。\n{"prompt":"<从上述资料提出关于武康大楼的问题>", "completion":"<从上述资料整理出的答案> END"}'

const request = require('request');
function post(url, data) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body);
                resolve(json);
            } else {
                console.log(error);
                resolve(error);
            }
        });
    })
}
async function l_chatcall(prompt){
    let url='http://127.0.0.1:10915/v1/chatgpt/chatcall';
    let data = {
        "callstr": prompt+chatendstr,
        "user": "zwj",
        opts:global.opts
    };
    let req = await post(url, data);
    // console.log(req);
    global.opts={
        conversationId:req.data.conversationId,
        parentMessageId:req.data.messageId,
        "action":"variant"
    }
    return {
        data:{
            choices:[
                {
                    text:req.data.response
                }
            ]
        }
    };
}
module.exports = {
    l_chatcall,
    detection,
    subsection,
    gptcall,
    addfile
}