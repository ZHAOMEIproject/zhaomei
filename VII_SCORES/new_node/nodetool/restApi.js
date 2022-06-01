// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/scores", require("../api/scores/scores"));

    console.log(`RestApi start loading`);
}