"use strict";
var path = require('path');
var fs = require('fs');
var bodyParser=require('body-parser');
var expressSession=require('express-session');
var uuid=require('node-uuid');
var lodash=require('lodash');
var common = require('../common/common');

module.exports = function (app, express) {
    // settings
    app.set('env', 'development');
    app.set('port', app.config.server.port);

    // use ejs-locals for all ejs templates:
    app.engine('ejs', require('ejs-locals'));
    app.set('view engine', 'ejs');
    app.set('views', path.join(app.config.root, 'app/views'));
    //cache static elements example:css,js
    var oneYear = 31557600000;
    app.use(express.static(path.normalize(app.config.root + '/public'), { maxAge: oneYear }));

    app.locals.appinfo = app.config.appinfo;
    app.locals.lodash   = lodash;
    app.locals.menuNavItem   = [];

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var sess = {
        name: ['node-water', 'sid'].join('.'),
        resave: false,
        saveUninitialized: true,
        secret: 'node-water',
        genid: function(req) {
            return uuid.v4(); // use UUIDs for session IDs
        }
        //,
        ////默认登陆后24小时后超时。
        //cookie: {
        //    maxAge:1000*60*60*24
        //}
    };
    app.use(expressSession(sess));

    app.use(function (req, res, next) {
        var flag = req.body.flag;//initial
        var gatewayflag = common.isGatewaydbLock();
        if(gatewayflag){
            next();
        }else{
            if(flag){
                next();
            }else{
                res.render('pages/other/initial');
            }
        }
    });
    
    // Initialize controllers
    (function requireControllers(dir, params) {
        fs.readdirSync(dir).forEach(function (file) {
            console.log(file)
            // Do not process system files or dirs (started with ".")
            if (file.match(/^\./)) {
                return;
            }
            // Get stats for each file
            var stats = fs.statSync(path.join(dir, file));
            if (stats.isFile()) {
                // Require controller
                require(path.join(dir, file)).apply(null, params);
            }
            else if (stats.isDirectory()) {
                // Recursive require controllers in sub-directories
                requireControllers(path.join(dir, file), params);
            }
        });
    })(path.normalize(__dirname + '/../controllers'), [app]);
};
