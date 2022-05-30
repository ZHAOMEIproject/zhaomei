// serviceConfig
exports.serviceConfig = function serviceConfig(app,foxdata_url,foxdata_port){
    app.listen(foxdata_port, () => console.log("Server running at "+foxdata_url+":"+foxdata_port));//Print the interface use case address
    app.use(require("body-parser").json());
    app.use(require("body-parser").urlencoded({extended: false}));

    //  Set up cross-domain access
    app.all("*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Content-Type", "application/json;charset=utf-8");
        res.header("Access-Control-Allow-Credentials", true);//Carrying a cookie across domain request
        req.method.toUpperCase() === "OPTIONS" ? res.sendStatus(200) : next();//Prevents interfaces from being responded to during the pre-request phase
    });
}