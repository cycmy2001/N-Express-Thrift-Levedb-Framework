var common = require('../app/common/common');
var gatewaydb = require('../app/leveldb/gatewaydb');
var db = gatewaydb.getDB();
db.db.approximateSize('a','z', function (err, size) {
    if (err) return console.error('Ooops!', err);
    console.log('Approximate size of range is %d', size)
});

//common.destroyDb(db);