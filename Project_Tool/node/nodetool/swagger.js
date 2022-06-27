// swaggerConfig
exports.swaggerConfig = function swaggerConfig(app,foxdata_url,foxdata_port){

    var swaggerUi = require('swagger-ui-express');
    var swaggerJSDoc = require('swagger-jsdoc');

    var swaggerDefinition = {
        info: {
            title: 'Node.js',
            version: 'v1',
            description: 'The interface path:'+foxdata_url+":"+foxdata_port,
        },
        host: foxdata_url+":"+foxdata_port,
        basePath: '/',
    };

    // options for the swagger docs
    var options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the Node docs
        apis: ['./swagger/*/*.js'],
    };

    // initialize swagger-jsdoc
    var swaggerSpec = swaggerJSDoc(options);

    // serve swagger
    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use('/node-swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log("Swagger running at "+foxdata_url+":"+foxdata_port+"/node-swagger");
}