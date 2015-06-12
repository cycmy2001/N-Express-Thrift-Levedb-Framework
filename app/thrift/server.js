"use strict";
var thrift = require('thrift');
var GatewayService = require('./gen-nodejs/GatewayService'),
    ntypes = require('./gen-nodejs/node_types');

var getGatewayInfo = function(result) {
    console.log("node server getGatewayInfo");
    var gateway = new ntypes.Gateway({
        "ip": "127.0.0.1",
        "gateway":"127.0.0.2",
        "netmask":"255.255.255.0",
        "thriftPort":9521,
        "thriftRemoteIp":"192.168.3.1",
        "thriftRemotePort":9523
    });
    result(null, gateway);
};
var updGatewayInfo = function(gateway, result) {
    console.log("node server updGatewayInfo:",gateway);
    result(null);
};

var delGatewayInfo = function(id, result) {
    console.log("node server delGatewayInfo:", id);
    result(null,true);
};

var server = thrift.createServer(GatewayService, {
    getGatewayInfo: getGatewayInfo,
    updGatewayInfo: updGatewayInfo,
    delGatewayInfo: delGatewayInfo
},{transport: thrift.TBufferedTransport});

server.listen(9090,function(){
    console.log('server_buffered listen port 9090')
});

//var server_framed = thrift.createServer(GatewayService, {
//    getGatewayInfo: getGatewayInfo,
//    updGatewayInfo: updGatewayInfo,
//    delGatewayInfo: delGatewayInfo
//},{transport: thrift.TFramedTransport});
//
//server_framed.listen(9090,function(){
//    console.log('server_framed listen port 9090')
//});

//var server_buffered = thrift.createServer(GatewayService, {
//    getGatewayInfo: getGatewayInfo,
//    updGatewayInfo: updGatewayInfo,
//    delGatewayInfo: delGatewayInfo
//}, {transport: thrift.TBufferedTransport});
//server_buffered.listen(9091,function(){
//    console.log('server_buffered listen port 9091')
//});
