"use strict";

module.exports = function (ROOT_PATH) {
    var config = {
        server: {
            port: 80,
            hostname: '0.0.0.0'
        },
        root: ROOT_PATH,
        appinfo:{
            name:'新中新控水网关 V1.0'
        }
    };
    return config;
};
