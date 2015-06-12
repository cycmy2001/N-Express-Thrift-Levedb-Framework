function gotoErrorPage(req,res,error,isJson){
    isJson = isJson || true;
    if(isJson){
        res.json({"error":error.toString()});
    }else{
        res.redirect("/timeout");
    }
}
exports = module.exports.gotoErrorPage = gotoErrorPage;