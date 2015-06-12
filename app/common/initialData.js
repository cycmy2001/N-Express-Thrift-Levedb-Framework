var Q = require('q');
var common = require('./common');
var gatewaydb = require('../leveldb/gatewaydb');
var Gateway = gatewaydb.GatewayModel;
var User = gatewaydb.UserModel;

function initialGatewayData(){
    var user = User.create({password: common.mkpwd('admin')});
    var rt ={};
    return gatewaydb.delAll()
        .then(function (delAllInfo) {
            rt.delAllInfo=delAllInfo;
            return common.getNetworkInfo();
        })
        .then(function (networkInfo) {
            rt.networkInfo=networkInfo;

            var gateway = Gateway.create(networkInfo);
            var ops = [
                {type: 'put', key: gateway.getKey(), value: gateway.toJSON()}
                , {type: 'put', key: user.getKey(), value: user.toJSON()}
            ];
            return gatewaydb.batch(ops);
        })
        .then(function (r) {
            rt.batchInfo=r;
            return rt;
        })
}
exports = module.exports.initialGatewayData = initialGatewayData;




