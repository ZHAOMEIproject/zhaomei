// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/contractapi", require("./contractapi"));
    app.use("/v1/apigetsign", require("./apigetsign"));

    console.log(`RestApi start loading`);
}