jQuery(function($) {
    $('#updpwdBtn').on('click', function(e) {
        var params ={
            oldpwd: $("#oldpwd").val(),
            newpwd: $("#newpwd").val()
        };
        alert(params.newpwd);
        if(params.oldpwd==='' || params.newpwd===''){
            alert('原密码或新密码不可为空.');
            return;
        }
        $.ajax({
            async:false,
            type: "POST",
            dataType: "json",
            url: "/updpwd",
            data: params,
            traditional:true,
            success: function (data) {
                if(data.error){
                    alert(data.error);
                }else{
                    if(data.goto){
                        location.href = data.goto;
                    }else{
                        alert(data.info);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
        e.preventDefault();
    });
});