var common = require('./app/common/common');
var gatewaydb = require('./app/leveldb/gatewaydb');
var GatewayModel = gatewaydb.GatewayModel;
//common.getNetworkInfo().then(function(networkInfo){
//    console.log(networkInfo)
//}).then(null, console.error);

//common.replaceInterfaces('address 192.168.80.3','address 192.168.80.1').then(function(result){
//    console.log(result);
//}).catch(console.error);

var Q = require("q");
//function eventually(value) {
//    return Q.delay(value, 1000);
//}
//Q.all([
//    common.replaceInterfaces('address 192.168.80.3','address 192.168.80.1'),
//    //common.replaceInterfaces('gateway 192.168.80.1','gateway 192.168.80.11'),
//    common.replaceInterfaces('netmask 255.255.255.0','netmask 255.255.255.1')
//    //gatewaydb.upd(GatewayModel.getKey(),{ip: "192.168.3.111",gateway:"192.168.3.2",netmask:"255.255.255.1"})
//])
//.spread(function (x, y) {
//    console.log(x, y);
//})
//.catch(console.error);
