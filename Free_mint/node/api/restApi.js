// restApiConfig
exports.restApiConfig = function restApiConfig(app){
    // app.use("/v1/withdraw", require("./withdraw/withdraw"));
    // app.use("/v1/contractapi", require("./contractapi"));
    app.use("/v1/freemint", require("./freemint/freemint"));
    


    console.log(`RestApi start loading`);
}