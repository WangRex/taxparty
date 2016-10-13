//登陆
app.login = (function () {
    return function (user, pass) {

        var param = {
            "username": user,
            "user_password": pass,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.errCode == '0') {

                var obj = {
                    token: data.token,
                    username: user
                }

                app.storage.set('userArr', data);

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
            check_errorCode: v_code,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data);

            if (data.errorCode == '0') {
                view.main.router.loadPage('index.html');
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
            flag: type,
            userAcc: user
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }
        var getUserPhoneVerifyCode = root.interFace.getUserPhoneVerifyCode;
        return app.doAjax(getUserPhoneVerifyCode, 'post', param, succCallBack)
    }
})()


//获取手机邮箱验证码
app.verifyTelCode = (function () {
    return function (tel) {

        var param = {
            tel_num: tel,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }

        var getUserPhoneVerifyCode = root.interFace.getUserPhoneVerifyCode;

        return app.doAjax(getUserPhoneVerifyCode, 'post', param, succCallBack)
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
        var saveAvatar = root.interFace.saveAvatar;
        return app.doAjax(saveAvatar, 'post', param, succCallBack)
    }
})()

// 资讯一览
app.newsList = (function () {
    return function () {

        var param = {
            "token": app.storage.get("userArr").token,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.data != null) {
                var nodes = data.data;

                $$.each(nodes, function (index, value) {
                    value["time_y"] = value.new_subtime.substr(0, 4);
                    value["time_m"] = value.new_subtime.substr(5, 2);
                    value["time_d"] = value.new_subtime.substr(8, 3);
                    value["time_mi"] = value.new_subtime.substr(11, 5)
                })

            console.log(nodes)
                var news_list_tpl = $$('script#news_list_tpl').html();
                var tpl = Template7.compile(news_list_tpl);
                $$("#news_list").html(tpl(nodes))
            } else {
                app.toast('未查询到数据!')
            }

        }

        var getAllInform = root.interFace.getAllInform

        return app.doAjax(getAllInform, 'post', param, succCallBack)

    }
})()

// 资讯详情
app.newsDetails = (function () {
    return function (listId) {
        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": listId
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var nodes = data.data;
            console.log(nodes)

            var news_data_tpl = $$('script#news_data_tpl').html();
            var tpl = Template7.compile(news_data_tpl);
            $$("#news_data").html(tpl(nodes))

            var common_tpl = $$('script#common_tpl').html();
            var tpl = Template7.compile(common_tpl);
            $$("#common_c").html(tpl(nodes))

        }

        var getInform = root.interFace.getInform

        return app.doAjax(getInform, 'post', param, succCallBack)

    }
})()

// 资讯详情点赞
app.newslikeInform = (function () {
    return function (listId) {

        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": listId
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

        }

        var likeInform = root.interFace.likeInform

        return app.doAjax(likeInform, 'post', param, succCallBack)
    }
})()


// 资讯评论
app.commentInform = (function () {

    return function (listId, val, time) {
        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": listId,
            "comment": val,
            "time": time + '',
            "username":'15210044288'
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

        }

        var commentInform = root.interFace.commentInform

        return app.doAjax(commentInform, 'post', param, succCallBack)
    }
})()

app.collectList = (function () {
    return function () {

        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var nodes = data.data;

            var collect_news_list_tpl = $$('script#collect_news_list_tpl').html();
            var tpl = Template7.compile(collect_news_list_tpl);
            $$("#collect_list").html(tpl(nodes))

            console.log(data)

        }

        var queryCollectionListByUID = root.interFace.queryCollectionListByUID

        return app.doAjax(queryCollectionListByUID, 'post', param, succCallBack)
    }
})()