"use strict";
var Q = require("q");
var lodash = require('lodash');
var gotoErrorPage = require('../exception/error').gotoErrorPage;
var common = require('../common/common');
var asyncCallback = common.asyncCallback;
var gatewaydb = require('../leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;
var UserModel = gatewaydb.UserModel;
module.exports = function(app) {
    app
        .get('/ses/index',function (req, res) {
            res.render("index");
         })
        .get('/ses/home',home)
        .post('/ses/updpwd',doUpdpwd)
        .post('/ses/updbasic',doUpdbasic);

};

var home = asyncCallback(function *(req, res) {
    try{
        var gatewayData = yield gatewaydb.get(GatewayModel.getKey());
        res.render('pages/home',gatewayData);
    }catch(error){
        gotoErrorPage(req, res, error,false);
    }
});
var doUpdpwd = asyncCallback(function *(req, res) {
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

var doUpdbasic = asyncCallback(function *(req, res) {
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
