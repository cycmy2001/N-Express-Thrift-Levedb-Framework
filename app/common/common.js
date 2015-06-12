var Q = require('q');
var lodash = require('lodash');
var exec = require('child_process').exec;
var os = require('os');
var crypto=require('crypto');
var fs = require('fs');
var JSONStream = require('JSONStream');
var constjson = require('../config/const.json');
//http://elf8848.iteye.com/blog/1995638

/**
 * exec command
 * @param command
 * @param callback(error,value)
 */
function exeCommand(command,callback){
    var deferred = Q.defer();
    exec(command, function(error,stdout,stderr){
        if(stderr) {
            deferred.reject(new Error(stderr));
        }else if(error){
            deferred.reject(error);
        }else{
            var value = lodash.trimRight(stdout,'\n');
            deferred.resolve(value);
        }
    });
    return deferred.promise.nodeify(callback); // the promise is returned
}

/**
 * getNetworkInfo
 */
function getNetworkInfo(){
    var ret = {
        ip:'127.0.0.1',
        gateway:'0.0.0.0',
        netmask:'255.255.255.0'
    };
    return exeCommand('cat /etc/network/interfaces | grep \'address\' | awk \'{print $2}\'')
        .then(function(ip){
            ret.ip = ip;
            return exeCommand('cat /etc/network/interfaces | grep \'gateway\' | awk \'{print $2}\'');
        })
        .then(function(gateway){
            ret.gateway = gateway;
            return exeCommand('cat /etc/network/interfaces | grep \'netmask\' | awk \'{print $2}\'');
        })
        .then(function(netmask){
            ret.netmask = netmask;
            return ret;
        });
}

/**
 * replaceInterfaces
 */
function _replaceInterfaces(src,des){
    return exeCommand("sed -i 's/^"+src+"/"+des+"/' /etc/network/interfaces")
        .then(function(){
            return src + ' replace to ' +des;
        })
}

/**
 * replaceInterfaces
 * @param src {ip:xx,gateway:xx,netmask:xx}
 * @param des {ip:xx, gateway:xx,netmask:xx}
 * @param callback
 * @returns {*}
 */
function replaceInterfaces(src,des,callback){
    var deferred = Q.defer();
    if(lodash.isObject(src) && lodash.isObject(des)){

        if ((src.hasOwnProperty('ip')
                && src.hasOwnProperty('gateway')
                && src.hasOwnProperty('netmask'))
            && (des.hasOwnProperty('ip')
                && des.hasOwnProperty('gateway')
                && des.hasOwnProperty('netmask'))
        ) {
            Q.all([
                _replaceInterfaces('address ' + src.ip, 'address ' + des.ip),
                _replaceInterfaces('gateway ' + src.gateway, 'gateway ' + des.gateway),
                _replaceInterfaces('netmask ' + src.netmask, 'netmask ' + des.netmask)
            ]).spread(function (address, gateway, netmask) {
                    var ret = {
                        address: address,
                        gateway: gateway,
                        netmask: netmask
                    };
                    deferred.resolve(ret);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

        } else {
            deferred.reject(new Error('params has error properties'));
        }
    }else{
        deferred.reject(new Error('params is not object'));
    }

    return deferred.promise.nodeify(callback); // the promise is returned
}

/**
 * total memory
 * @returns {number}
 */
function totalMem(){
    var m = os.totalmem()/1024/1024;
    return m.toFixed();
}
/**
 * free memory
 * @returns {number}
 */
function freeMem(){
    var m = os.freemem()/1024/1024;
    return m.toFixed();
}
/**
 * used memory
 * @returns {number}
 */
function usedMem(){
    return totalMem() - freeMem();
}

/**
 * 导出指定db的所有内容
 * @param db
 * @param path
 * @param callback
 */
function exportData(db,path,callback) {
    var deferred = Q.defer();
    if(db && path){
        var writeable = fs.createWriteStream(path);
        var readStream = db.createReadStream();
        readStream.pipe(JSONStream.stringify()).pipe(writeable);
        writeable.on("finish", function() {
            deferred.resolve('export '+db.location+' data to ' + path );
        });
        writeable.on("error", function(error) {
            deferred.reject(error);
        });
    }else{
        deferred.reject(new Error('no db object or no export path.'));
    }
    return deferred.promise.nodeify(callback); // the promise is returned
}

/**
 * @param text
 * @returns {*}
 */
function mkpwd(text){
    var crypto=require('crypto');
    var cipher = crypto.createCipher('aes-128-cbc','synjones');
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function isGatewaydbLock(){
    return fs.existsSync(constjson.level_gateway_db+'/gatewaydb.lock');
}

function makeGatewaydbLock(){
    var openFile = Q.nfbind(fs.open);
    return openFile(constjson.level_gateway_db+'/gatewaydb.lock','w');
}
/**
 * asyncCallback
 * eg:
 *  asyncCallback(function *(arg1,arg2){
 *      var a = yield step1;
 *      ....
 *  })
 * @param gen
 * @returns {Function}
 */
function asyncCallback(gen) {
    return function() {
        return Q.async(gen).apply(null, arguments).done();
    };
};

exports = module.exports.asyncCallback = asyncCallback;
exports = module.exports.exeCommand = exeCommand;
exports = module.exports.exportData = exportData;
exports = module.exports.totalMem = totalMem;
exports = module.exports.usedMem = usedMem;
exports = module.exports.freeMem = freeMem;
exports = module.exports.getNetworkInfo = getNetworkInfo;
exports = module.exports.replaceInterfaces = replaceInterfaces;

exports = module.exports.mkpwd = mkpwd;
exports = module.exports.isGatewaydbLock = isGatewaydbLock;
exports = module.exports.makeGatewaydbLock = makeGatewaydbLock;


