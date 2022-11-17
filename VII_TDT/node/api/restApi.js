// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/contractapi", require("./contractapi"));
    // app.use("/v1/apigetsign", require("./apigetsign"));
    app.use("/v1/VII_TDT", require("./VII_POAP/VII_POAP"));
    console.log(`RestApi start loading`);
}