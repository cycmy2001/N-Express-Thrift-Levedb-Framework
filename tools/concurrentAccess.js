var Q = require('q');
var request = require('request');
var qRequest = Q.nfbind(request);

var _arrClient = [];
var _clientCount=10;
for(var i=0;i<_clientCount;i++){
    _arrClient.push(i)
}


function a() {
    _arrClient.forEach(function(v){

var options = {
  url: 'http://192.168.3.194'
};

        qRequest(options)
            .then(function (result) {
                console.log(v+'*'+result[0].statusCode);
            })
            .catch(console.error);
    });
}
/**


function a() {
    _arrClient.forEach(function(v){
        qRequest('http://192.168.3.195/menu/basic/setbasic?nav='+v)
            .then(function (result) {
                console.log(v+'*'+result[0].statusCode);
            })
            .catch(console.error);
    });
}
**/

setInterval(a,5000);
//a();


