'use strict';
const express = require('express');
const app = express();

//以下是产生泄漏的代码
let theThing = null;
let replaceThing = function () {
    let leak = theThing;
    let unused = function () {
        if (leak)
            console.log("hi")
    };
    
    // 不断修改theThing的引用
    theThing = {
        longStr: new Array(1000000),
        someMethod: function () {
            console.log('a');
        }
    };
};

app.get('/leak', function closureLeak(req, res, next) {
    replaceThing();
    res.send('Hello Node');
});

app.listen(8082);