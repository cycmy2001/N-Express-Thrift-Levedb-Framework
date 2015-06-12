"use strict";
var Q = require("q");
var lodash = require('lodash');
var common = require('../../common/common');
var asyncCallback = common.asyncCallback;
var initialData = require('../../common/initialData');
var gatewaydb = require('../../leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;
var UserModel = gatewaydb.UserModel;

exports.s = function(req, res){
    res.render("pages/login");
};
exports.doLogout = function (req, res) {
    if(req.session){
        req.session.destroy();
    }
    res.json({"goto":"/"});
};
exports.index = function (req, res) {
    res.render("index");
};
exports.home = asyncCallback(function *(req, res) {
    try{
        var gatewayData = yield gatewaydb.get(GatewayModel.getKey());
        res.render('pages/home',gatewayData);
    }catch(error){
        gotoErrorPage(req, res, error,false);
    }
});
exports.menu = function (req, res) {
    var dir = req.params.dir;
    var page = req.params.page;
    var renderTo = 'pages/'+dir+'/'+page;
    if(page=='setbasic'){
        gatewaydb.get(GatewayModel.getKey())
            .then(function (data) {
                res.render(renderTo,data);
            }).catch(function (error) {
                gotoErrorPage(req, res, error);
            });
    }else{
        res.render(renderTo);
    }
};

exports.doInitialData = asyncCallback(function *(req, res) {
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

exports.doLogin = asyncCallback(function *(req, res) {
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
exports.doUpdpwd = asyncCallback(function *(req, res) {
    try{
        var userData = yield gatewaydb.get(UserModel.getKey());
        var oldpwd = common.mkpwd(req.body.oldpwd);
        var userPwd = userData.password;
        if (oldpwd === userPwd) {
            var newpwd = common.mkpwd(req.body.newpwd);
            var updUserData = yield gatewaydb.upd(UserModel.getKey(),{password:newpwd});
            res.json({"info":"密码修改成功！"});
        }else{
            res.json({"info":"原密码不正确,密码修改失败！"});
        }
    }catch(error){
        gotoErrorPage(req, res, error);
    }
});

exports.doUpdbasic = asyncCallback(function *(req, res) {
    try{
        var updData = req.body.updData;
        if(updData){
            var updObj = JSON.parse(updData);
            var networkInfo = yield common.getNetworkInfo();
            var allResult = yield Q.all([
                common.replaceInterfaces(networkInfo,updObj),
                gatewaydb.upd(GatewayModel.getKey(),updObj)
            ]);
            yield common.exeCommand('reboot -d 5');
            res.json({"info":"数据修改成功！网关将重启.稍后请重新登陆."});
        }else{
            res.json({"info":"修改数据为Null.修改失败！"});
        }
    }catch(error){
        gotoErrorPage(req, res, error);
    }
});


function gotoErrorPage(req,res,error,isJson){
    isJson = isJson || true;
    if(isJson){
        res.json({"error":error.toString()});
    }else{
        res.redirect("/timeout");
    }
}


