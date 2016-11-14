//登陆
app.login = (function () {
    return function (user, pass) {

        var param = {
            "username": user,
            "user_password": pass
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data.errCode)

            if (data.errCode == '0') {

                console.log(data.data)

                var obj = {
                    token: data.token,
                    username: user
                }
                
                var json = {
                    "key": "username",
                    "val": user
                };
                //Chrome调试可以注释掉这两行代码，但是请勿提交到SVN
                /*InvokeApp.setItem(function(){},function(){},json);//调用原生插件缓存用户名
                InvokeApp.BindAccount(function(){},function(){},{});//调用原生插件绑定阿里百川推送账号
               */
                app.toast("登录成功！")

                app.storage.set('userArr', data);

                setTimeout(function () {
                    view.main.router.loadPage('index.html');
                }, 1)

            } else if (data.errorCode == '101') {
                app.toast(data.errorMessage)
            }
        }

        return app.doAjax(root.interFace.login, 'post', param, succCallBack)
    }
})();

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
                app.toast("注册成功！");
                view.main.router.loadPage('signin/login.html');
            } else {
                app.toast("验证码过期或者不正确！");
            }
        }

        return app.doAjax(root.interFace.register, 'post', param, succCallBack)
    }

})()


//校验
app.isLR = (function () {
    var re = /^[0-9a-zA-Z]+$/;
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
        } else if (!re.test(pswd)) {
            app.toast("密码只能是数字、大小写字母！");
            return false
        } else {
            app.login(user, pswd)
        }

    }

    //注册校验
    function isregister() {
        var re = /^[0-9a-zA-Z]+$/;

        var icode = $$("#icode").val();
        var users = $$("#users").val();
        var pswd1 = $$("#pswd1").val();
        var pswd2 = $$("#pswd2").val();
        var codes = $$("#codes").val();

        if (!users) {
            app.toast('请输入邮箱或手机号码！');
            return false
        } else if (!app.empty.tel.test(users) && !app.empty.emi.test(users)) {
            app.toast('请输入正确的手机号码或邮箱!');
            return false
        } else if (!pswd1) {
            app.toast('请输入密码!');
            return false
        } else if (pswd1.length < 6) {
            app.toast('密码不能小于6位!');
            return false
        } else if (!re.test(pswd1)) {
            app.toast("密码只能是数字、大小写字母！");
            return false
        } else if (!pswd2) {
            app.toast('请输入确认密码!');
            return false
        } else if (pswd2.length < 6) {
            app.toast('密码不能小于6位!');
            return false
        } else if (!re.test(pswd2)) {
            app.toast("密码只能是数字、大小写字母！");
            return false
        } else if (pswd2 !== pswd1) {
            app.toast('两次密码输入不一致!');
            return false
        } else if (!codes) {
            app.toast('验证码不能为空!');
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
            var index = $$("#verifyCode");
            var num = 59;
            var txt = "获取验证码";
            console.log(data)

            function time() {
                if (num == 0) {
                    index.removeClass("disabled");
                    index.html(txt);
                    num = 59;
                } else {
                    index.addClass("disabled");
                    index.html(num + 'S');
                    num--;
                    setTimeout(function () {
                        time(index)
                    }, 1000)
                }
            }
            if (data.errorCode == 0) {
                time();

            } else if (data.errorCode == 1102) {
                app.toast(data.errorMessage);
            }
        }
        var findVerifyCode = root.interFace.findVerifyCode;
        return app.doAjax(findVerifyCode, 'post', param, succCallBack)
    }
})()


//获取手机邮箱验证码
app.verifyTelCode = (function () {
    return function (flag, tel) {

        var param = {
            flag: flag,
            userAcc: tel,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var index = $$("#getTelNum");
            var num = 59;
            var txt = "获取验证码";
            console.log(data)

            function time() {
                if (num == 0) {
                    index.removeClass("disabled");
                    index.html(txt);
                    num = 59;
                } else {
                    index.addClass("disabled");
                    index.html(num + 'S');
                    num--;
                    setTimeout(function () {
                        time(index)
                    }, 1000)
                }
            }

            if (data.errorCode == 0) {
                time();
            } else if (data.errorCode == 1103) {
                app.toast(data.errorMessage)
            }
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


        var userArr = app.storage.get("userArr");

        if (userArr == null) {
            app.toast("您还没有登录");
            return false
        }


        var param = {
            "token": app.storage.get("userArr").token,
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if (data != null && data.data != null) {
                var nodes = data.data;

                $$.each(nodes, function (index, value) {
                    value["time_y"] = value.new_subtime.substr(0, 4);
                    value["time_m"] = value.new_subtime.substr(5, 2);
                    value["time_d"] = value.new_subtime.substr(8, 3);
                    value["time_mi"] = value.new_subtime.substr(11, 5)
                });

                console.log(nodes);
                var news_list_tpl = $$('script#news_list_tpl').html();
                var tpl = Template7.compile(news_list_tpl);
                $$("#news_list").html(tpl(nodes));
            } else {
                app.toast('未查询到数据!');
            }

        }

        var getAllInform = root.interFace.getAllInform

        return app.doAjax(getAllInform, 'post', param, succCallBack)

    }
})();

// 资讯详情
app.newsDetails = (function () {
    return function (listId) {
        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": listId
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode != "0") {
                app.toast(data.errorMessage);
            } else {
                if (data.data) {
                    var nodes = data.data;
                    if (nodes.date) {
                        nodes["time_y"] = nodes.date.substr(0, 4);
                        nodes["time_m"] = nodes.date.substr(5, 2);
                        nodes["time_d"] = nodes.date.substr(8, 3);
                        nodes["time_mi"] = nodes.date.substr(11, 5);
                    } else {
                        nodes["time_y"] = "";
                        nodes["time_m"] = "";
                        nodes["time_d"] = "";
                        nodes["time_mi"] = "";
                    }
                    console.log(nodes);

                    var news_data_tpl = $$('script#news_data_tpl').html();
                    var tpl = Template7.compile(news_data_tpl);
                    $$("#news_data").html(tpl(nodes));

                    if (nodes.comments > 0) {
                        var comment_list_tpl = $$('script#comment_list_tpl').html();
                        var tpl = Template7.compile(comment_list_tpl);
                        $$("#comment_list").html(tpl(nodes.comment));
                    }
                }

                var common_tpl = $$('script#common_tpl').html();
                var tpl = Template7.compile(common_tpl);
                $$("#common_c").html(tpl(nodes));
            }
        };

        var getInform = root.interFace.getInform;

        return app.doAjax(getInform, 'post', param, succCallBack);

    }
})();

// 资讯详情
app.newsDetailsCustom = (function () {
    return function (listId, succCallBack) {
        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": listId
        }

        var getInform = root.interFace.getInform;

        return app.doAjax(getInform, 'post', param, succCallBack);

    }
})();

// 资讯详情点赞
app.newslikeInform = (function () {
    return function (listId, likeFlag) {

        var param = {
            "token": app.storage.get("userArr").token,
            "like_flag": likeFlag,
            "inform_id": listId
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == 0) {
                var succCallBackUpdateLike = function (data, status, response) {
                    var data = JSON.parse(data);
                    var nodes = data.data;
                    if (likeFlag == 0) {
                        var html = '<img src="../static/images/img/shou_03.png" width="13px;" alt="点赞">';
                    } else {
                        var html = '<img src="../static/images/img/thumb52.png" width="13px;" alt="点赞">';
                    }
                    $$("#likeBtn").attr("data-like-flag", nodes.like_flag);
                    $$("#likeBtn").html(html);
                };
                app.newsDetailsCustom(listId.trim(), succCallBackUpdateLike);
            } else {
                app.toast(data.errorMessage);
            }
            console.log(data);

        };

        var likeInform = root.interFace.likeInform;

        return app.doAjax(likeInform, 'post', param, succCallBack);
    }
})();

// 资讯详情收藏
app.newsCollectInform = (function () {
    return function (inform_id) {

        var param = {
            "token": app.storage.get("userArr").token,
            "inform_id": inform_id
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            app.toast(data.errorMessage);
            console.log(data);

        };

        var saveCollection = root.interFace.saveCollection;

        return app.doAjax(saveCollection, 'post', param, succCallBack);
    }
})();


// 资讯评论reload
app.commentInformReload = (function () {

    return function (token, listId, succCallBack) {
        var param = {
            "token": token,
            "inform_id": listId,
        };

        var getInform = root.interFace.getInform;

        return app.doAjax(getInform, 'post', param, succCallBack);
    }
})();


// 资讯评论
app.commentInform = (function () {

    return function (listId, val, time) {
        var token = app.storage.get("userArr").token;
        var param = {
            "token": token,
            "inform_id": listId,
            "comment": val,
            "time": time + '',
            "username": '15210044288'
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                app.toast(data.errorMessage || "评论成功！");
                var succCallBackReloadComments = function (data) {
                    var data = JSON.parse(data);
                    var nodes = data.data;
                    if (nodes.comments > 0) {
                        var comment_list_tpl = $$('script#comment_list_tpl').html();
                        var tpl = Template7.compile(comment_list_tpl);
                        $$("#comment_list").html(tpl(nodes.comment));
                    }
                    $$("#commentsCount").html(nodes.comments);
                    $$("#textarea_val").val("");
                }
                app.commentInformReload(token, listId, succCallBackReloadComments);
            } else {
                app.toast(data.errorMessage || "评论失败！");
            }

        };

        var commentInform = root.interFace.commentInform;

        return app.doAjax(commentInform, 'post', param, succCallBack);
    }
})();

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
            $$("#collect_list").html(tpl(nodes));

            console.log(data);

        }

        var queryCollectionListByUID = root.interFace.queryCollectionListByUID;

        return app.doAjax(queryCollectionListByUID, 'post', param, succCallBack);
    }
})();

//取消收藏
app.disCollectNews = (function () {
    return function (tuc_id) {

        var param = {
            "token": app.storage.get("userArr").token,
            "tuc_id": tuc_id
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errCode == 0) {
                app.toast(data.errorMessage || "取消收藏成功！");
            } else {
                app.toast(data.errorMessage || "取消收藏失败！");
            }

        }

        var updateCollectionByCID = root.interFace.updateCollectionByCID;

        return app.doAjax(updateCollectionByCID, 'post', param, succCallBack);
    }
})();
