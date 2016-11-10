var infoModule = (function(info) {

    info.init = function() {
        $(document).on("click", "#dologin", function() {
            lm.login();
        });
        $(document).on("click", "#doregister", function() {
            lm.register();
        });
    }

    info.login = function() {
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

    lm.register = function() {
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
    return info;
}(infoModule || {}));

$(function() {
    infoModule.init();
});
