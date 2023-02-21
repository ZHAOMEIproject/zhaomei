// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/chatgpt", require("./chatgpt/chatgpt"));
    console.log(`RestApi start loading`);
}