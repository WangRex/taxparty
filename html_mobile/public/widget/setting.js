/**
 * Created by david.chen on 2016/10/14.
 */

/*设置支付密码方法*/
app.setpaypass = (function () {
    return function (token, pused, pnewp, exists) {
        var param = {
            "token": token,
            "newPass": pnewp,
            "oldPass": pused,
            "exists": exists,


        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.errorCode == "0") {
                app.toast("修改密码成功");
                view.about.router.loadPage('about/set.html');
            } else if (data.errorCode == "1111") {
                app.toast("原始密码输入错误")
            } else {
                app.toast("修改失败")
            }

        }
        return app.doAjax(root.interFace.saveUserPayPwd, 'post', param, succCallBack)
    }
})()

//判断支付密码的方法
app.resetpaypass = (function () {
    return function (token, pused, pnewp, exists, errorCode) {
        var param = {
            "token": token,
            "exists": exists,
            "errorCode": errorCode


        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var detailsr_tpl = $$('script#PayPwd').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#reset").html(tpl(data.data));
            $$("#complete1").on("click", function () {
                var pused = $$("#pusedmi").val();
                var pnewp = $$("#pnewmi").val();
                var confirm = $$("#confirm").val();
                var re = /^[0-9]{6}$/;
                // console.log(pusedmi);
                // app.resetpas(pused, pnewp, confirm)
                // if (pused == null || pused == '') {
                //     app.toast("不能输入空");
                //     return false;
                // } else if (pnewp == null || pnewp == '') {
                //     app.toast("不能输入空");
                //     return false;
                // } else if (confirm == null || confirm == '') {
                //     app.toast("不能输入空");
                //     return false;
                // } else
                //     if (!re.test(pused)) {
                //     app.toast("原始密码错误");
                //     return false;
                // } else
                //     if (!re.test(pnewp)) {
                //     app.toast("两次输入不一致");
                //     return false;
                // } else if (!re.test(confirm)) {
                //     app.toast("两次输入不一致");
                //     return false;
                // } else
                if (pnewp != confirm) {
                    app.toast("两次密码输入不一致");
                    return false;
                } else {
                    var token = app.storage.get("userArr").token
                    app.setpaypass(token, pused, pnewp, data.data.exists)
                        // if(data.data.errorCode=="0"){
                        // app.toast("修改密码11成功")
                        // }else if (data.data.errorCode=="1111"){
                        //     app.toast("原始密码输入错误")
                        // }else {
                        //     app.toast("修改失败")
                        // }

                }
            })

            if (data.data.exists == "false") {
                $$("#pusedmi1").hide();
            }
        }
        return app.doAjax(root.interFace.queryPayPwd, 'post', param, succCallBack)
    }
})()

/*重置手机登录密码方法*/
app.resetpas = (function () {
    return function (token, used, newp) {
        var param = {
            "token": token,
            "oldpwd": used,
            "user_password": newp

        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
            if (data.errorCode == 1070) {
                app.toast("您输入的原始密码错误")
            }
            app.toast("修改密码成功");
            view.about.router.loadPage('about/set.html')
                /*   if (data.errorCode == '0') {
                 app.toast(data.errorMessage);

                 setTimeout(function () {
                 //view.main.router.loadPage('index.html');

                 }, 2000)
                 }*/
        }

        return app.doAjax(root.interFace.updateUserPassword, 'post', param, succCallBack)
    }
})()

/*个人最低价*/
app.setmoney = (function () {
    return function (token, cont) {
        var param = {
            "token": token,
            "lowest_amt": cont
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

            /*    if (data.errorCode == '0') {
             app.toast(data.errorMessage);

             setTimeout(function () {
             //view.main.router.loadPage('index.html');

             }, 2000)
             }*/
        }

        //view.main.router.loadPage('about/set.html');
        return app.doAjax(root.interFace.saveBestPrice, 'post', param, succCallBack)
    }
})()

//退出登录的方法

app.logout = (function () {
    return function (token) {
        var param = {
            "token": app.storage.get("userArr").token
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)

            if (data.errorCode == "0") {
                app.toast(data.errorMessage)
                app.storage.clr();
                setTimeout(function () {
                    $$('#user_list').html('');
                    $$("div.home_main_mod a").attr("href", "#");
                    var home_tpl = $$('script#home_head_tpl').html();
                    $$("#home_pnel").html(home_tpl)
                    $$("#ask_list").html('<div class="not">等待解答中...</div>');
                    $$("#answer_list").html('<div class="not">无解决的问题</div>');
                    var tobarBtn_not_tpl = $$("script#tobarBtn_not_tpl").html();
                    $$("#tobarBtn").html(tobarBtn_not_tpl)
                    f7app.showTab('#home');
                    window.location.reload();
                    //view.main.router.loadPage('signin/login.html');
                }, 1000)
            } else {
                app.toast(data.errorMessage)
            }
        }

        return app.doAjax(root.interFace.exit, 'post', param, succCallBack);

    }
})()


//查询个人最低价的方法
app.searchPrise = (function () {
    return function (token) {
        var param = {
            "token": app.storage.get("userArr").token
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var code = data.errorCode;
            if (code == '500') {
                app.toast(data.errorMessage);
                return false;
            }
            view.about.router.loadPage('about/set-money.html')
            var detailsr_tpl = $$('script#LowPrise').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#lPrise").html(tpl(data.data))
            console.log(data.data.lowestAmt)
            $$("#srt-bu").on("click", function () {
                var duan = $$("#mum").val();
                console.log(duan);
                if (duan == null || duan == '') {
                    app.toast("不能输入空");
                    return false;
                } else if (!/^[1-9]\d*$/.test(duan)) {
                    app.toast("请输入大于零的数字");
                    return false
                } else {
                    var token = app.storage.get("userArr").token
                    app.setmoney(token, duan);
                    app.toast("修改个人最低价成功");
                    view.about.router.loadPage('about/set.html');

                }
            })
        }
        return app.doAjax(root.interFace.qureyBestPrise, 'post', param, succCallBack)
    }
})()


//提示音
f7app.onPageInit('services', function (page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    $$("#prompt").on("change", function () {
        var json = {
            "key": "NewSoundState",
            "val": "true"
        };
        InvokeApp.setItem(function () {}, function () {}, json);
    })

    $$("#notice").on("change", function () {
        NativeStorage.setItem("NoticeSoundState", "true", function () {}, function () {})
    })
})

// /*手机提现密码*/
// f7app.onPageInit('setpassword', function (page) {
//     alert()
//     $$("#modify").on("click", function () {
//         var pused = $$("#pusedmi").val();
//         var pnewp = $$("#pnewmi").val();
//         var confirm = $$("#confirm").val();
//         var re = /^[0-9]{6}$/;
//         console.log(pusedmi);
//         // app.resetpas(pused, pnewp, confirm)
//         if (pused == null || pused == '') {
//             app.toast("不能输入空");
//             return false;
//         } else if (pnewp == null || pnewp == '') {
//             app.toast("不能输入空");
//             return false;
//         } else if (confirm == null || confirm == '') {
//             app.toast("不能输入空");
//             return false;
//         } else if (!re.test(pused)) {
//             app.toast("原始密码错误");
//             return false;
//         } else if (!re.test(pnewp)) {
//             app.toast("两次输入不一致");
//             return false;
//         } else if (!re.test(confirm)) {
//             app.toast("两次输入不一致");
//             return false;
//         } else if (pnewp != confirm) {
//             app.toast("两次密码输入不一致");
//             return false;
//         } else {
//             var token = app.storage.get("userArr").token
//             app.setpaypass(token, pused, pnewp)
//             app.toast("修改支付密码成功成功");
//         }
//     })
// });


/*重置手机登录密码*/
f7app.onPageInit('resetpas', function (page) {
    $$("#modify").on("click", function () {
        var used = $$("#usedmi").val();
        var newp = $$("#newmi").val();
        var confirm = $$("#confirm").val();
//        var re = /^[0-9]{6}$/;
        console.log(used + "============" + newp + "================" + confirm);
        if (used == null || used == '') {
            app.toast("旧密码不能为空");
            return false;
        } else if (used.toString().trim().length < 6) {
            app.toast("旧密码不能少于6位");
            return false;
        }else if (newp == null || newp == '') {
            app.toast("新密码不能为空");
            return false;
        } else if (newp.toString().trim().length < 6) {
            app.toast("新密码不能少于6位");
            return false;
        } else if (confirm == null || confirm == '') {
            app.toast("确认新密码不能为空");
            return false;
        } else if (confirm.toString().trim().length < 6) {
            app.toast("确认密码不能少于6位");
            return false;
        } else if (newp != confirm) {
            app.toast("两次密码输入不一致");
            return false;
        } else {
            var token = app.storage.get("userArr").token
            app.resetpas(token, used, newp)
        }
    })
});
/*设置提现密码*/
// f7app.onPageInit('setpassword', function (page) {
//     $$("#complete").on("click", function () {
//         var pass = $$("#password").val();
//         var repeat = $$("#repeat").val();
//         var re = /^[0-9]{6}$/;
//         console.log(pass, repeat);
//         if (pass == null || pass == '') {
//             app.toast("不能输入空");
//
//             return false;
//         } else if (repeat == null || repeat == '') {
//             app.toast("不能输入空");
//
//             return false;
//         } else if (!re.test(pass)) {
//             app.toast("两次密码输入不一致");
//
//             return false;
//         } else if (!re.test(repeat)) {
//             app.toast("两次密码输入不一致");
//
//             return false;
//         } else if (pass != repeat) {
//             app.toast("两次密码输入不一致");
//
//             return false;
//         } else {
//             var token = app.storage.get("userArr").token
//             app.setpaypass(token, pass);
//             app.toast("设置支付密码成功");
//         }
//
//     })
// });

// //个人最低价
// f7app.onPageInit('set-money', function (page) {
//     $$("#srt-bu").on("click", function () {
//         var duan = $$("#mum").val();
//         console.log(duan);
//         if (duan == null || duan == '') {
//             app.toast("不能输入空");
//             return false;
//         } else if (!/^[1-9]\d*$/.test(duan)) {
//             app.toast("请输入大于零的数字");
//             return false
//         } else {
//             var token = app.storage.get("userArr").token
//             app.setmoney(token, duan);
//             app.toast("修改个人最低价成功")
//         }
//     })
//
// });

//查询是否有个人最低价




//退出登录
f7app.onPageInit('set', function (page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    $$("#search").on('click', function () {
        var token = app.storage.get("userArr").token;
        app.searchPrise(token)
    })
    $$("#low").on('click', function () {
        var token = app.storage.get("userArr").token;
        app.resetpaypass(token)
    })
    $$("#prompt").on("change", function () {
        var json = {
            "key": "NewSoundState",
            "val": "true"
        };
        InvokeApp.setItem(function () {}, function () {}, json);
    })

    $$("#notice").on("change", function () {
        NativeStorage.setItem("NoticeSoundState", "true", function () {}, function () {})
    })

});


$$(document).on("click", "#dologout", function () {
    view.about.router.back()
    app.logout()
})


//提现的初始页面方法
app.withdrawals = (function () {
        return function (token) {
            var param = {
                "token": app.storage.get("userArr").token
            }

            var succCallBack = function (data, status, response) {
                var data = JSON.parse(data);
                var detailsr_tpl = $$('script#withdraw').html();
                var tpl = Template7.compile(detailsr_tpl);
                $$("#money").html(tpl(data.data));
                //金额限制不超过小数点后2位
                app.myNumberic = function (e, len) {
                    var obj = e.srcElement || e.target;
                    var dot = obj.value.indexOf("."); //alert(e.which);
                    len = (typeof (len) == "undefined") ? 2 : len;
                    var key = e.keyCode || e.which;
                    if (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40)) //这里为了兼容Firefox的backspace,tab,del,方向键
                        return true;
                    if (key <= 57 && key >= 48) { //数字
                        if (dot == -1) //没有小数点
                            return true;
                        else if (obj.value.length <= dot + len) //小数位数
                            return true;
                    } else if ((key == 46) && dot == -1) { //小数点
                        return true;
                    }
                    return false;
                }


                $$("#Applydi").on("click", function () {
                    var amt = Number($$("#money7").val());
                    var rccAcc = $$("#airPlay").val();
                    var rccAcc1 = $$("#weChat").val();
                    if (Number($$("#money7").val()) < 0.01) {
                        app.toast("输入的金额不可以小于最低值！")
                        return false;
                    }else if(Number($$('#availiableMoney').text().trim())< Number($$("#money7").val())){
                        app.toast("输入的金额不可以大于可转金额！")
                        return false;
                    }

                    if ($$('#money1').prop("checked")) {
                        app.withApply1(token, amt, rccAcc)
                    } else if ($$('#money2').prop("checked")) {
                        app.withApply(token, amt, rccAcc1)
                    } else {
                        app.toast("请选择提现类型")
                    }
                })
                console.log(data)
            }

            return app.doAjax(root.interFace.findTotalProfit, 'post', param, succCallBack)
        }
    })()
    //提现支付宝申请方法
app.withApply1 = (function () {
    return function (token, amt, rccAcc) {
        var param = {
            "token": app.storage.get("userArr").token,
            "amt": amt.toString(),
            "payModel": "0",
            "rccAcc": rccAcc
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.errorCode == "0") {
                app.toast("提现成功");
                //view.about.router.loadPage('about/set.html');
            } else {
                app.toast("提现失败")
            }
        }
        return app.doAjax(root.interFace.drawMoney, 'post', param, succCallBack)
    }
})()

//提现微信申请方法
app.withApply = (function () {
        return function (token, amt, rccAcc1) {
            var param = {
                "token": app.storage.get("userArr").token,
                "amt": amt.toString(),
                "payModel": "1",
                "rccAcc": rccAcc1
            }
            var succCallBack = function (data, status, response) {
                var data = JSON.parse(data);
                console.log(data)
                if (data.errorCode == "0") {
                    app.toast("提现成功");
                    //                    view.about.router.loadPage('about/set.html');
                } else {
                    app.toast("提现失败")
                }
            }

            return app.doAjax(root.interFace.drawMoney, 'post', param, succCallBack)
        }
    })()
    //提现的初始页面
f7app.onPageInit('withdraw', function (page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.withdrawals(token);
    // $$("#Applydi").on("click", function () {
    //     var token = app.storage.get("userArr").token;
    //     app.withApply(token)
    //
    // })
});
