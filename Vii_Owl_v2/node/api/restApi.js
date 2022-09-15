// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/contractapi", require("./contractapi"));
    app.use("/v1/apigetsign", require("./apigetsign"));
    app.use("/v1/owl", require("./owl/owl"));
    console.log(`RestApi start loading`);
}