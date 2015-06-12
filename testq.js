var Q = require('q');
var common = require('./app/common/common');
var gatewaydb = require('./app/leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;
var UserModel = gatewaydb.UserModel;
var gateway = GatewayModel.create({ip: "127.0.0.1",gateway:"127.0.0.2",netmask:"255.255.255.0"});
var user = UserModel.create({password: common.mkpwd('admin')});


var b = {
    ip: '192.168.3.1'
};

gatewaydb.upd(GatewayModel.getKey(),b)
    .then(function (result) {
        console.log(result);
    })
    .catch(function (error) {
        console.error(error)
    });

//console.log(lodash.keysIn(a));
//console.log(lodash.valuesIn(a));
//
//console.log(lodash.defaults(b,a));


//var c = '[]';
//
//var d = '{"a":1}';
//
//
//console.log(lodash.keysIn(c));
//console.log(lodash.valuesIn(c));
//
//console.log(lodash.defaults(d,c));




//gatewaydb.delAll()
//    .then(function(result){
//        console.log(result);
//        gatewaydb.put(GatewayModel.getKey(), gateway.toJSON()).then(function(result){
//            console.log(result);
//        }).catch(function(error){
//            console.log(error);
//        });
//    })
//    .then(null, console.error);

//gatewaydb.delAll()
//    .then(function(result){
//        console.log(result);
//        gatewaydb.put(GatewayModel.getKey(), gateway.toJSON()).then(function(result){
//            console.log(result);
//        }).catch(function(error){
//            console.log(error);
//        });
//    },function(error){
//        console.error(error);
//    });

//gatewaydb.delAll()
//    .then(function (result) {
//        console.log(result);
//        return gatewaydb.put(GatewayModel.getKey(), gateway.toJSON());
//    })
//    .then(function (result) {
//        console.log(result);
//        return gatewaydb.get(GatewayModel.getKey())
//
//    })
//    .then(function (result) {
//        console.log(result);
//        var ops = [
//            {type: 'put', key: gateway.getKey(), value: gateway.toJSON()}
//            , {type: 'put', key: user.getKey(), value: user.toJSON()}
//        ];
//        return gatewaydb.batch(ops);
//    })
//    .then(function (result) {
//        console.log(result);
//    })
//    .catch(function (error) {
//        console.log(error);
//    });


