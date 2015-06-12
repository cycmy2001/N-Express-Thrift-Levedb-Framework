/**
 * node decpwd.js '29302664649d0d4fbf3252768d8543a0'
 */
var crypto=require('crypto');
var crypted= process.argv.splice(2)[0];
if(!crypted){
    throw new Error('no crypted argv.');
}
console.log(decpwd(crypted));
function decpwd(crypted){
    var decipher = crypto.createDecipher('aes-128-cbc','synjones');
    var dec = decipher.update(crypted,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}








