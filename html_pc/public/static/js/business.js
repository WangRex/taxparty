//登陆
app.login = (function () {
    return function (user, pass) {

        var param = {
            "username": user,
            "user_password": pass,
        }

        var succCallBack = function (data, status, response) {
            
            console.log(data)
            
            var data = JSON.parse(data);
            console.log(data)
            if (data.errorCode == '0') {

                var obj = {
                    token: data.data[4],
                    username: user
                }

                app.storage.set('userArr', obj);

                app.toast('登陆成功!')

                setTimeout(function () {
                    view.main.router.loadPage('index.html');
                }, 2000)

            } else if (data.errorCode == '101') {
                app.toast(data.errorMessage)
            }
        }

        return app.doAjax(root.interFace.login, 'post', param, succCallBack)
    }
})()

//注册
app.register = (function () {

    return function (i_code, user, pass, v_code) {

        var param = {
            invite_code: i_code,
            username: user,
            user_password: pass,
            verify_code: v_code,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data);

            if (data.errorCode == '0') {

            }
        }

        return app.doAjax(root.interFace.register, 'post', param, succCallBack)
    }

})()


//校验
app.isLR = (function () {

    //登陆校验
    function islogin() {
        var user = $$("#user").val();
        var pswd = $$("#pswd").val();

        if (!user) {
            app.toast('请输入邮箱或手机号码');
            return false
        } else if (!pswd) {
            app.toast('请输入密码');
            return false
        } else if (pswd.length < 6) {
            app.toast('密码不能小于6位');
            return false
        } else {
            app.login(user, pswd)
        }

    }

    //注册校验
    function isregister() {
        var icode = $$("#icode").val();
        var users = $$("#users").val();
        var pswd1 = $$("#pswd1").val();
        var pswd2 = $$("#pswd2").val();
        var codes = $$("#codes").val();

        if (!users) {
            app.toast('请输入邮箱或手机号码');
            return false
        } else if (!app.empty.tel.test(users) && !app.empty.emi.test(users)) {
            app.toast('请输入正确的手机号码或邮箱');
            return false
        } else if (!pswd1) {
            app.toast('请输入密码');
            return false
        } else if (pswd1.length < 6) {
            app.toast('密码不能小于6位');
            return false
        } else if (!pswd2) {
            app.toast('请输入确认密码');
            return false
        } else if (pswd2 !== pswd1) {
            app.toast('密码输入不一致');
            return false
        } else if (!codes) {
            app.toast('请输入验证码');
            return false
        } else {
            app.register(icode, users, pswd2, codes)
        }
    }

    return {
        l: islogin,
        r: isregister
    }
})()

//获取验证码
app.verifyCode = (function () {
    return function (type, user) {

        var param = {
            user_type: type,
            username: user,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.getUserPhoneVerifyCode, 'post', param, succCallBack)
    }
})()


//上传头像
app.upUserImg = (function () {

    return function (userImg) {
        var param = {
            "username": app.storage.get("userArr").username,
            "img": userImg
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.saveAvatar, 'post', param, succCallBack)
    }
})()