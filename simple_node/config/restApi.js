// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/ido", require("./../api/ido/ido"));

    console.log(`RestApi start loading`);
}