"use strict";
var Q = require("q");
var gotoErrorPage = require('../exception/error').gotoErrorPage;
var initialData = require('../common/initialData');
var common = require('../common/common');
var asyncCallback = common.asyncCallback;
var gatewaydb = require('../leveldb/gatewaydb');
var UserModel = gatewaydb.UserModel;

module.exports = function(app) {
    app
        .all('/ses/*', hasLogin)
        .get('/',function(req, res){
            res.render("pages/login");
         })
        .get('/timeout',function(req,res){
            res.render("pages/other/timeout");
        })
        .post('/initialData',doInitialData)
        .post('/login',doLogin)
        .post('/logout',doLogout);
};

var doLogout = function (req, res) {
    if(req.session){
        req.session.destroy();
    }
    res.json({"goto":"/"});
};

var doInitialData = asyncCallback(function *(req, res) {
    try{
        var allResult = yield Q.all([
            initialData.initialGatewayData(),
            common.makeGatewaydbLock()
        ]);
        res.json({"info":"数据初始化成功！","goto":"/"});
    }catch(error){
        gotoErrorPage(req, res, error);
    }
});

var doLogin = asyncCallback(function *(req, res) {
    try{
        var userData = yield gatewaydb.get(UserModel.getKey());
        var pagePwd = common.mkpwd(req.body.password);
        if (pagePwd === userData.password) {
            req.session.isLogin = true;
            res.json({"goto":"/ses/index?"+req.sessionID});
        } else {
            res.json({"info":"密码错误！"});
        }
    }catch(error){
        gotoErrorPage(req, res, error);
    }
});

function hasLogin(req, res, next) {
    if (req.session && req.session.isLogin) {
       next();
    } else {
        res.redirect("/timeout");
    }
    //next();
}