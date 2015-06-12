var constjson = require('./app/config/const.json');
var express  = require('express');
var config   = require(__dirname + '/app/config/config');
var common = require('./app/common/common');
var app      = express();

app.config = config;

require('./app/config/express')(app, express);
require('./app/config/startExecute')();

//node --nouse-idle-notification --expose-gc xxx.js
//node --nouse-idle-notification --expose-gc --trace-gc --trace-gc-verbose xxx.js
module.exports = app;
