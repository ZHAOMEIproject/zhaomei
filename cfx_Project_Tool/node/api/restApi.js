// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    app.use("/v1/withdraw", require("./withdraw/withdraw"));



    app.use("/v1/contractapi", require("./contractapi"));

    


    console.log(`RestApi start loading`);
}