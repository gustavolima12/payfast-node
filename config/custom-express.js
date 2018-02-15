var express = require('express'),
    consign = require('consign'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');

module.exports = function() {
    var app = express();
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);
    
        return app;
};