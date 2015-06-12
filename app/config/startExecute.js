"use strict";
var common = require('../common/common');
var gatewaydb = require('../leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;
module.exports = function () {
    if(common.isGatewaydbLock()){
        common.getNetworkInfo().then(function(networkInfo){
            gatewaydb.upd(GatewayModel.getKey(),networkInfo).then(null, console.error);
        }).then(null, console.error);
    }
};
