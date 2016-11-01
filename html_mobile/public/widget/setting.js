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
                app.toast("修改密码成功")
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
            var detailsr_tpl = $$('script#LowPrise').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#lPrise").html(tpl(data.data))
            console.log(data)
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
                    app.toast("修改个人最低价成功")
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
        var re = /^[0-9]{6}$/;
        console.log(usedmi);
        app.resetpas(used, newp, confirm)
        if (used == null || used == '') {
            app.toast("不能输入空");
            return false;
        } else if (newp == null || newp == '') {
            app.toast("不能输入空");
            return false;
        } else if (confirm == null || confirm == '') {
            app.toast("不能输入空");
            return false;
        } else if (!re.test(used)) {
            app.toast("原始密码错误");
            return false;
        } else if (!re.test(newp)) {
            app.toast("两次输入不一致");
            return false;
        } else if (!re.test(confirm)) {
            app.toast("两次输入不一致");
            return false;
        } else if (newp != confirm) {
            app.toast("两次密码输入不一致");
            return false;
        } else {
            var token = app.storage.get("userArr").token
            app.resetpas(token, used, newp)
            app.toast("修改密码成功成功");
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

               $$("#Applydi").on("click",function () {
                   var amt = $$("#money7").val();
                   var rccAcc = $$("#airPlay").val();
                   var rccAcc1 = $$("#weChat").val();
                   if ($$('#money1').prop("checked")){
                       app.withApply1(token,amt,rccAcc)
                   }else if ($$('#money2').prop("checked")) {
                       app.withApply(token,amt,rccAcc1)
                   }else {
                       app.toast("操作失败")
                   }
               })
                console.log(data)
            }

            return app.doAjax(root.interFace.findTotalProfit, 'post', param, succCallBack)
        }
    })()
    //提现支付宝申请方法
app.withApply1 = (function () {
        return function (token,amt,rccAcc) {
            var param = {
                "token": app.storage.get("userArr").token,
                "amt": amt,
                "payModel": "0",
                "rccAcc": rccAcc
            }
            var succCallBack = function (data, status, response) {
                var data = JSON.parse(data);
                console.log(data)
                if (data.errorCode == "0") {
                    app.toast("提现成功")
                } else {
                    app.toast("提现失败")
                }
            }
            return app.doAjax(root.interFace.drawMoney, 'post', param, succCallBack)
        }
    })()

//提现微信申请方法
app.withApply = (function () {
    return function (token,amt,rccAcc1) {
        var param = {
            "token": app.storage.get("userArr").token,
            "amt": amt,
            "payModel": "1",
            "rccAcc": rccAcc1
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if(data.errorCode=="0"){
                app.toast("提现成功")
            }else {
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
