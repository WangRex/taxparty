/* ===== 手机找回密码 ===== */
f7app.onPageBeforeAnimation('findpswd', function (page) {

    //console.log(page.url);

});


//获取验证码
$$(document).on('click', "#getTelNum", function () {
    var slef = $$(this);
    var tel = $$("#telnum").val();
    var qiu = app.storage.set("tel")
    var num = 59;
    var txt = $$(this).text();
    var getmail = $$("#getmail").val();
    if (!tel) {
        app.toast('手机号不能为空!');
        return false
    } else if (app.empty.tel.test(tel)) {
        app.verifyTelCode('0', tel)
    } else {
        app.toast('请输入正确的手机号码!')
    }
    function time(index) {
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
})


//手机找回密码后设置新密码
$$(document).on('click', "#telcomplete", function () {
    var pass = $$("#sixnum").val();
    var repeat = $$("#sixnum2").val();
    var re = /^[0-9a-zA-Z]+$/;
    console.log(pass, repeat);
    if (pass == null || pass == '') {
        app.toast("请输入密码!");

        return false;
    }else if (pass.length<6) {
        app.toast("请输入至少6位密码!");

        return false;
    }else if (!re.test(pass)) {
        app.toast("密码只能是数字、大小写字母！");

        return false;
    } else if (repeat == null || repeat == '') {
        app.toast("请再次输入密码!");

        return false;
    }else if (repeat.length<6) {
        app.toast("请输入至少6位密码!");

        return false;
    }else if (!re.test(repeat)) {
        app.toast("密码只能是数字、大小写字母！");

        return false;
    } else if (pass != repeat) {
        app.toast("两次输入密码不一致，请重新输入！");

        return false;
    } else {
        app.findpswd_shou( pass);
    }

})



//忘记密码-手机号找回
$$(document).on("click", "#nextstep", function () {
    var tel = $$("#telnum").val();
    var verif_code = $$("#verif_code").val()

    if (!tel) {
        app.toast('手机号不能为空!');
        return false
    } else if (!app.empty.tel.test(tel)) {
        app.toast('请输入正确的手机号码!')
    } else if (!verif_code) {
        app.toast('验证码不能为空');
    } else {
        /*view.main.router.loadPage('signin/findpswd_input.html');*/
        app.findpswd_qiur(verif_code,tel)
    }
})



//邮箱找回
$$(document).on("click", "#emailcomplete", function () {
    var pass = $$("#email").val();

    if (!pass) {
        app.toast("请输入邮箱");
        return false;
    } else if (app.empty.emi.test(pass)) {
        app.findpswd_input(pass);
    } else {
        app.toast("请输入正确的邮箱");
    }
})
$$(document).on('click', "#complete", function () {

    var slef = $$(this);
    var getmail = $$("#getmail").val();


    if (!getmail) {
        app.toast('邮箱不能为空!');
        return false
    } else if (app.empty.emi.test(getmail)) {
        app.findpswd_input(getmail)
    } else{

        app.toast('请输入正确的邮箱号码!')
    }

    

})
//手机找回密码方法-确认验证码方法
app.findpswd_qiur = (function () {
    return function (verif_code,tel) {
        var param = {
             "flag":"0",
            "verifyCode":verif_code,
            "account":tel
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            if (data.errorCode == '0'){
                view.main.router.loadPage('signin/findpswd_input.html');
            }else{
                app.toast("验证码过期或者不正确");
            }
            console.log(data)
        }

        return app.doAjax(root.interFace.checkVerifyCode, 'post', param, succCallBack)
    }
})()
//手机找回密码方法
app.findpswd_shou = (function () {
    return function (pass) {
        var param = {
            "account":$$("#telnum").val(),
            "pwd":pass
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == '0'){
                app.toast("密码重置成功！");
                view.main.router.loadPage('signin/login.html');
            }
            console.log(data)
        }

        return app.doAjax(root.interFace.updateLoginPwd, 'post', param, succCallBack)
    }
})()
//发送密码到邮箱方法
app.findpswd_input = (function () {
    return function (email) {
        var param = {

            "email": email
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == '0'){
                app.toast("密码重置成功！");
                view.main.router.loadPage('signin/login.html');
            }else if(data.errorCode == '1202'){
                app.toast("您还未注册用户");
            }
            console.log(data)
        }

        return app.doAjax(root.interFace.sendUserPsdMail, 'post', param, succCallBack)
    }
})();

//确认密码方法
app.findpswd = (function () {
    return function (pass) {
        var param = {
            "token": app.storage.get("userArr").token,
            "user_password": pass
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.getBackPass, 'post', param, succCallBack)
    }
})()

/* ===== 确认密码 ===== */
f7app.onPageBeforeAnimation('findpswd_input', function (page) {

    /* console.log(page.url);
    alert(page.url)
    */

});


//
// //法规6大部法收藏列表方法
// app.query = (function () {
//     return function () {
//         var param = {
//             "token": app.storage.get("userArr").token
//         }
//
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//
//             console.log(data)
//             var xsaxs=data.data[0].law_id;
//
//             var detailsr_tpl = $$('script#detailsr_list_tpl').html();
//             var tpl = Template7.compile(detailsr_tpl);
//             $$("#searchbar_list").html(tpl(data.data))
//
//
//         }
//
//
//
//         return app.doAjax(root.interFace.getCollecLaw, 'post', param, succCallBack)
//     }
// })()
//
// //法规搜索方法
// app.queryList = (function () {
//     return function (fileid, filename) {
//         var param = {
//             "token": app.storage.get("userArr").token,
//             "fileid": fileid,
//             "filename": filename
//
//         }
//
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//
//             console.log(data)
//         }
//
//         return app.doAjax(root.interFace.searchLaw, 'post', param, succCallBack)
//     }
// })()
//
//
//
// /* ===== 法规搜索 ===== */
// f7app.onPageBeforeAnimation('query', function (page) {
//
//     console.log(page.url);
//
//     app.query()
//
//     $$("#queryfile").on("click", function () {
//
//         var fileid = $$("#fileid").val(); //文件字号
//         var filename = $$("#filename").val(); //文件名
//         if (!fileid && !filename) {
//             app.toast("请输入文件字号或者文件名");
//         } else {
//             view.main.router.loadPage('index/queryList.html?id=' + fileid + '&name=' + filename + '');
//         }
//     })
//
// });
//
// /* ===== 法规搜索列表 ===== */
// f7app.onPageBeforeAnimation('queryList', function (page) {
//
//     console.log(page.query);
//
//     var fileid = page.query.id;
//     var filename = page.query.name;
//
//     app.queryList(fileid, filename)
//
// });
//
// /*
// app.querydetail = (function (statueid) {
//     return function (statueid) {
//   var param = {
//             "token": app.storage.get("userArr").token,
//             "statue_id": statueid
//
//         }
//
//     }
//
//
// })()
// */
//  app.test = function(id){
//
//           console.log(id);
//
//        };
//
//
// //法规详情方法
// app.queryDetails = (function () {
//     return function (statueid) {
//         var param = {
//             "token": app.storage.get("userArr").token,
//             "law_id":statueid
//
//         }
//
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//
//             console.log(data)
//
//            var detailsr_tpl = $$('script#detailsr_info').html();
//            var tpl = Template7.compile(detailsr_tpl);
//            $$("#detailsInfo").html(tpl(data.data))
//         }
//          view.main.router.loadPage('index/queryDetails.html');
//
//         return app.doAjax(root.interFace.getStatuteInfo, 'post', param, succCallBack)
//     }
// })()
// // ===== 法规详情页 =====
// f7app.onPageBeforeAnimation('queryDetails', function (page) {
//
//      var statueid = app.query.id;
//       console(statueid);
//     app.queryDetails(statueid)
//
//
//
// });


