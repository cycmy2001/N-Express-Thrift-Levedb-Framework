"use strict";
var thrift = require('thrift');
var GatewayService = require('./gen-nodejs/GatewayService'),
    ntypes = require('./gen-nodejs/node_types');

var connection = thrift.createConnection('192.168.3.195', 9090),
    client = thrift.createClient(GatewayService, connection);

connection.on('error', function(err) {
    console.error(err);
});



client.getGatewayInfo(function(err, response) {
    if (err) {
        console.log("error "+err);
    } else {
        console.log(response);
    }
    connection.end();
});

var gateway = new ntypes.Gateway({
    "ip": "127.0.0.1",
    "gateway":"127.0.0.2",
    "netmask":"255.255.255.0",
    "thriftPort":9521,
    "thriftRemoteIp":"192.168.3.1",
    "thriftRemotePort":9522
});
client.updGatewayInfo(gateway,function(err, response) {
    if (err) {
        console.log("error "+err);
    } else {
        console.log(response);
    }
    connection.end();
});

client.delGatewayInfo(1,function(err, response) {
    if (err) {
        console.log("error "+err);
    } else {
        console.log(response);
    }
    connection.end();
});

