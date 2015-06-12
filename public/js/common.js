function ajaxPost(url,data,fn){

    $.ajax({
        async:false,
        type: "POST",
        dataType: "json",
        url: url,
        data: data,
        traditional:true,
        success: fn,
        error: function(jqXHR, textStatus, errorThrown){
            alert('error ' + textStatus + " " + errorThrown);
            window.parent.location.href='/timeout';
        }
    });
}

function ipReg(value, element){
    return this.optional(element) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(value) && RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256);
}
function integerReg(value, element){
    return this.optional(element) || /^[+]?[0-9]+\d*$/i.test(value);
}