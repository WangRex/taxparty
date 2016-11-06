var indexModule = (function(im) {
    im.init = function() {
        
        //获取token，如果有值，说明已经登录了。
        var user = app.store.get('user');
        var token = "";
        if (user) {
            token = user.token;
        }

        if (token) {
            $("#loginBtn").attr("href", "javascript:void(0);");
        } else {
            $("#loginBtn").attr("href", "login.html");
        }

        $("#messageBtn").on("click", function() {
            $("#amz-header-nav").find("li").each(function(idx, ele) {
                console.log(idx);
                console.log(ele);
                $(ele).removeClass("am-active");
            });
            $(this).closest("li").addClass("am-active");
            globalModule.loadPage("banner-content", "message", function(){
                $("#banner-div").attr("class", "banners");
            });
        });

    }
    return im;
}(indexModule || {}));

indexModule.init();
