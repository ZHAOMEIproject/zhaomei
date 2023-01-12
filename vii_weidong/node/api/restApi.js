// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/contractapi", require("./contractapi"));
    // app.use("/v1/apigetsign", require("./apigetsign"));
    // app.use("/v1/OOC", require("./OOC/OOC"));
    app.use("/v1/weidongpoap", require("./weidong/weidong"));
    app.use("/v1/weidongwallet", require("./weidong/wallet"));
    console.log(`RestApi start loading`);
}