var constjson = require('../config/const.json');
var level = require('level');
var db = level(constjson.level_protocol_db, {valueEncoding: 'json'});
module.exports = require('./base')(db);

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