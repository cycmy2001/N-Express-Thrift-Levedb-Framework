var url = require('url');
var lodash = require('lodash');
var Route = require('express').Router();
var action = require('./action/localAction');
Route
    .all('/ses/*', hasLogin)
    .get('/ses/index',action.index)
    .get('/ses/home',action.home)
    .get('/ses/menu/:dir/:page',menuNavMiddleware,action.menu)
    .post('/ses/updpwd',action.doUpdpwd)
    .post('/ses/updbasic',action.doUpdbasic)

    .get('/',action.s)
    .get('/timeout',function(req,res){
        res.render("pages/other/timeout");
    })
    .post('/initialData',action.doInitialData)
    .post('/login',action.doLogin)
    .post('/logout',action.doLogout);

module.exports = Route;

function menuNavMiddleware(req,res,next){
    var arg = url.parse(req.url, true).query;//arg => { aa: '001', bb: '002' }
    var nav = arg.nav;
    var menuNavItem=[];
    if(nav){
        menuNavItem = lodash.words(nav, /[^,]+/g);
    }
    res.locals.menuNavItem =menuNavItem;
    next();
};

function hasLogin(req, res, next) {
    //if (req.session && req.session.isLogin) {
    //   next();
    //} else {
    //    res.redirect("/timeout");
    //}
    next();
};