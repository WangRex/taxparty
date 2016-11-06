var loginModule = (function(lm) {

    lm.init = function() {
        $(document).on("click", "#dologin", function() {
            lm.login();
        })
    }

    lm.login = function() {
        var data = {
            "username": $("#username").val(),
            "user_password": $("#password").val()
        }
        globalModule.globalAjax(root.interFace.login, data, function(result) {
            console.log(result.token);
            app.store.set('user', result);
            window.location.replace("index.html");
        }, 'post');
    }
    return lm;
}(loginModule || {}));

$(function() {
    loginModule.init();
});
