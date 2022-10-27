// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    // app.use("/v1/scores", require("../api/scores/scores"));
    app.use("/v1/contractapi", require("../api/contractapi"));
    console.log(`RestApi start loading`);
}