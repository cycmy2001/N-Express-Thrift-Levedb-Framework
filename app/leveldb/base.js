var lodash = require('lodash');
var Q = require('q');
function leveldbFun(db) {
    var app = function() {

    };
    app.getDB = function(fn){
        var deferred = Q.defer();
        if(db) deferred.resolve(db);
        else deferred.reject(new Error('no db object'));
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.close = function(fn) {
        var deferred = Q.defer();
        db.close(function(error){
            if(error) deferred.reject(error);
            else deferred.resolve(db.location + ' is closed!');
        });
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.open = function(fn) {
        var deferred = Q.defer();
        db.open(function(error){
            if(error) deferred.reject(error);
            else deferred.resolve(db.location + ' is open!');
        });
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.destroyDb = function(fn) {
        var deferred = Q.defer();
        app.close().then(function(result){
            db.options.db.destroy(db.location,function(error){
                if(error) deferred.reject(error);
                else deferred.resolve(db.location + ' is destroy!');
            });
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise.nodeify(fn); // the promise is returned
    };

    app.put = function (key, value,fn){
        var deferred = Q.defer();
        if (key && value) {
            db.put(key, value, function (error) {
                if(lodash.isObject(value)){
                    value = JSON.stringify(value);
                }
                if(error) deferred.reject(error);
                else deferred.resolve('key='+key+':value='+value);
            });
        }else{
            deferred.reject(new Error('no key or value'));
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.get = function (key,fn){
        var deferred = Q.defer();
        if (key) {
            db.get(key, function (error, value) {
                if(error) deferred.reject(error);
                else deferred.resolve(value);
            });
        } else {
            deferred.reject(new Error('no key'));
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.upd = function (key,value,fn){
        var deferred = Q.defer();
        if (key && value) {
            app.get(key)
                .then(function (dbResult) {
                    try{
                        return lodash.defaults(value,dbResult);
                    }catch(e){
                        throw new Error('replace value is error!');
                    }
                })
                .then(function (newData) {
                    app.del(key)
                        .then(function (result) {
                            return app.put(key, newData);
                        })
                        .then(function (result) {
                            deferred.resolve(result);
                        })
                        .catch(function(error){
                            deferred.reject(error);
                        });
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
        } else {
            deferred.reject(new Error('no key or no value'));
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.del = function(key,fn){
        var deferred = Q.defer();
        if (key) {
            db.del(key, function (error) {
                if(error) deferred.reject(error);
                else deferred.resolve('key='+key);
            })
        } else {
            deferred.reject(new Error('no key'));
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    app.delAll = function(fn){
        var deferred = Q.defer();
        db.createReadStream().on('data', function (data) {
            app.del(data.key).catch(function(error){
                deferred.reject(error);
            });
        }).on('error', function (error) {
            deferred.reject(error);
        }).on('close', function () {
            deferred.resolve('all '+db.location + ' data is deleted!');
        }).on('end', function () {
            deferred.resolve('all '+db.location + ' data is deleted!');
        });
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    //批量操作
    app.batch = function(arr,fn) {
        var deferred = Q.defer();
        if (Array.isArray(arr)) {
            var batchList = [];
            arr.forEach(function (item) {
                var listMember = {};
                if (item.hasOwnProperty('type')) {
                    listMember.type = item.type;
                }
                if (item.hasOwnProperty('key')) {
                    listMember.key = item.key;
                }
                if (item.hasOwnProperty('value')) {
                    listMember.value = item.value;
                }
                if (listMember.hasOwnProperty('type') && listMember.hasOwnProperty('key') && listMember.hasOwnProperty('value')) {
                    batchList.push(listMember);
                }
            });
            if (batchList && batchList.length > 0) {
                db.batch(batchList, function (error) {
                    if(error) deferred.reject(error);
                    else deferred.resolve(batchList);
                })
            } else {
                deferred.reject(new Error('array Membre format error'));
            }
        } else {
            deferred.reject(new Error('not array'));
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };

    //查找 (支持前置匹配)
    app.find=function(find,fn){
        var deferred = Q.defer();
        var option = {keys: true, values: true, revers: false, limit: 20, fillCache: true};
        if (!find)
            deferred.reject(new Error('nothing'));
        else {
            if (find.prefix) {
                option.start = find.prefix;
                option.end = find.prefix.substring(0, find.prefix.length - 1)
                    + String.fromCharCode(find.prefix[find.prefix.length - 1].charCodeAt() + 1);
            }
            if (find.limit)
                option.limit = find.limit;
            db.createReadStream(option).on('data', function (data) {
                deferred.resolve(data);
            }).on('error', function (error) {
                deferred.reject(error);
            }).on('close', function () {
            }).on('end', function () {
            });
        }
        return deferred.promise.nodeify(fn); // the promise is returned
    };
    return app;
}
exports = module.exports = leveldbFun;
