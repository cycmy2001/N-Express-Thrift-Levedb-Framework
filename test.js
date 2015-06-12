var common = require('./app/common/common');
common.exeInitialGatewayData()
    .then(function(result){
        console.log(result)
    }).catch(console.error);

//common.exeExportGatewayData()
//    .then(function(result){
//        console.log(result)
//    }).catch(console.error);