"use strict";
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var config = require('./development.config')(rootPath);
module.exports = config;

