"use strict";
var url = require('url');
var Q = require("q");
var lodash = require('lodash');
var gotoErrorPage = require('../exception/error').gotoErrorPage;
var common = require('../common/common');
var asyncCallback = common.asyncCallback;
var gatewaydb = require('../leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;

module.exports = function(app) {
    app.get('/ses/menu/:dir/:page',menuNavMiddleware,menu);
};
var menu = function (req, res) {
    console.log('menu:'+req.url);
    var dir = req.params.dir;
    var page = req.params.page;
    var renderTo = 'pages/'+dir+'/'+page;
    if(page=='setbasic'){
        setbasic(req,res,renderTo);
    }else{
        res.render(renderTo);
    }
};
/**
 * 基本设置页面
 * @type {*|Function}
 */
var setbasic = asyncCallback(function *(req,res,renderTo){
    try{
        var gatewayData = yield gatewaydb.get(GatewayModel.getKey());
        res.render(renderTo,gatewayData);
    }catch(error){
        gotoErrorPage(req, res, error);
    }
});

function menuNavMiddleware(req,res,next){
    var arg = url.parse(req.url, true).query;//arg => { aa: '001', bb: '002' }
    var nav = arg.nav;
    var menuNavItem=[];
    if(nav){
        menuNavItem = lodash.words(nav, /[^,]+/g);
    }
    res.locals.menuNavItem =menuNavItem;
    next();
}