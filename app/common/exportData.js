var common = require('./common');
var gatewaydb = require('../leveldb/gatewaydb');

function exportGatewayData(){
    var rt ={};
    return gatewaydb.getDB()
        .then(function (db) {
            rt.db=db;
            var path = __dirname+'/export/gatewaydb.data';
            return common.exportData(db,path);
        })
        .then(function (exportInfo) {
            rt.exportInfo=exportInfo;
            return rt;
        })
}
exports = module.exports.exportGatewayData = exportGatewayData;