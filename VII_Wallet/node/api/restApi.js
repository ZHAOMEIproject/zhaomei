// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/withdraw", require("./withdraw/withdraw"));

    console.log(`RestApi start loading`);
}