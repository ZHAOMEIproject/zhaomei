// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/checkerc721", require("../api/checkerc721/checkerc721"));

    console.log(`RestApi start loading`);
}