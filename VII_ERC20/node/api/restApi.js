// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/contractapi", require("./contractapi"));
    // app.use("/v1/apigetsign", require("./apigetsign"));
    // app.use("/v1/withdraw", require("./withdraw/withdraw"));
    console.log(`RestApi start loading`);
}