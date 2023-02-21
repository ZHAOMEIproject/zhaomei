const { lby } = require("./text_to_com")




let input = ['text.jsonl', 200, 1000, 4, "newtext.jsonl"]
// detection(...input);
main(...input);
async function main(
    filePath,
    wordsPerSegment,
    max_tokens,
    n,
    savefile,
){
    lby(filePath,savefile);
}