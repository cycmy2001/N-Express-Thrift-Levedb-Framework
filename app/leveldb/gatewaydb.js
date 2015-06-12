var constjson = require('../config/const.json');
var level = require('level');
var db = level(constjson.level_gateway_db, {valueEncoding: 'json'});
var base = require('./base')(db);
exports = module.exports.getDB=base.getDB;
exports = module.exports.close=base.close;
exports = module.exports.open=base.open;
exports = module.exports.destroyDb=base.destroyDb;
exports = module.exports.put=base.put;
exports = module.exports.get=base.get;
exports = module.exports.upd=base.upd;
exports = module.exports.del=base.del;
exports = module.exports.delAll=base.delAll;
exports = module.exports.batch=base.batch;
exports = module.exports.find=base.find;


//---------------------------------------model------------------------------
var model = require('model');
model.config.useTimestamps=false;
model.config.useUTC=false;
/**
 https://github.com/geddy/model
 var u  = Gateway.create({ip: "127.0.0.1",gateway:"127.0.0.2",netmask:"255.255.255.0"});
 console.log(u.toJSON());
 console.log(u.isValid());
 console.log(u.getKey());
 Gateway model
 */
var Gateway = function () {
    this.defineProperties({
        ip:               { type: 'string',required:true,length:{max: 15} },
        gateway:          { type: 'string',required:true,length:{max: 15} },
        netmask:          { type: 'string',required:true,length:{max: 15} },
        thriftPort:       { type: 'int'},
        thriftRemoteIp:   { type: 'string',length:{max: 15}},
        thriftRemotePort: { type: 'int'}
    });
    // set default values
    this.beforeValidate = function (params) {
        params.thriftPort = params.thriftPort || 9521;
        params.thriftRemoteIp = params.thriftRemoteIp || '0.0.0.0';
        params.thriftRemotePort = params.thriftRemotePort || 9522;
    };
    this.getKey = function () {
        return 'gateway!gateway';
    };
};
/**
 * User model
 * @constructor
 */
var User = function () {
    this.defineProperties({
        password:         { type: 'string',required:true,length:{max: 15} }
    });
    // set default values
    this.beforeValidate = function (params) {
        params.password = params.password || 'admin';
    };
    this.getKey = function () {
        return 'gateway!user';
    };
};

exports = module.exports.GatewayModel = model.register('Gateway', Gateway);
exports = module.exports.UserModel = model.register('User', User);