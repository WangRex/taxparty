/* ===== 获取用户本地求助列表 - 寻我订单列表 ===== */



//寻我tab触发事件
$$("#tab2_find").on("show", function() {
    //获取token
    var token = app.storage.get("userArr").token;
    // app.findMe(token);
});


//寻我列表ajax请求
app.findMe = (function() {

    return function(token) {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == 0) {
                $$.each(data.data, function(i, e) {
                    e.cpa = false;
                    e.a_cpa = false;
                    e.cpv = false;
                    e.cta = false;
                    e.bar = false;
                    e.cpa_g = false;
                    e.other = false;
                    var major = e.major;
                    if (major) {
                        for (var j = 0; j < major.length; j++) {
                            if (major[j] == '注册会计师') {
                                e.cpa = true;
                            }
                            if (major[j] == '美国注册会计师') {
                                e.a_cpa = true;
                            }
                            if (major[j] == '注册资产评估师') {
                                e.cpv = true;
                            }
                            if (major[j] == '注册税务师') {
                                e.cta = true;
                            }
                            if (major[j] == '律师') {
                                e.bar = true;
                            }
                            if (major[j] == '特许公认会计师') {
                                e.cpa_g = true;
                            }
                            if (major[j] == '其他') {
                                e.other = true;
                            }
                        }
                    }
                    if (e.tof_stt == '0') {
                        e["status"] = '已完成'
                        e["_before"] = 'aft'
                    } else if (e.tof_stt == '1') {
                        e["status"] = '待抢单'
                        e["_before"] = 'before'
                    } else if (e.tof_stt == '2') {
                        e["status"] = '进行中'
                        e["_before"] = 'bef'
                    } else if (e.tof_stt == '7') {
                        e["status"] = '忽略'
                    }

                });

                var order_tpl = $$('script#order_list_tpl').html();
                var tpl = Template7.compile(order_tpl);
                $$("#card_container").html(tpl(data.data));

                console.log(data);

            } else {
                app.toast(app.errorMessage || "出现异常！");
            }
        }

        var getHelpListByArea = root.interFace.getHelpListByArea;

        return app.doAjax(getHelpListByArea, 'post', param, succCallBack);
    }
})();




//抢单按钮触发事件
//$$(document).on('click', '#grabOrder'+id, function () {
app.grabOrderBtn = function(helpId) {
    var token = app.storage.get("userArr").token;
    app.grabOrder(token, helpId)
}


//抢单ajax请求
app.grabOrder = (function() {

    return function(token, helpId) {

        var param = {
            "token": token,
            "help_id": helpId,
            "rem": "备注"
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.errorCode == 0) {
                app.toast("抢单成功！");
                $$('#card' + helpId).addClass("bef");
                $$('#status' + helpId).html("进行中");
            } else {
                app.toast(data.errorMessage || "抢单失败！");
            }

        };

        var grabOrder = root.interFace.grabOrder;
        return app.doAjax(grabOrder, 'post', param, succCallBack)

    }

})()


/* ===== 获取用户本地求助列表 - 寻他列表 ===== */

$$(document).on("click", ".toolbar-inner a", function() {
    var e = $$(this);
    console.log(e.hasClass("active") != true)
    if (e.hasClass("active") != true) {
        var userArr = app.storage.get("userArr");
        if (userArr == null) {
            app.toast("您还没有登录")
            return false
        };
    }
})


$$("#about").on("show", function() {

    var userArr = app.storage.get("userArr");

    if (userArr == null) {
        app.toast("您还没有登录");
        return false
    }

    var token = app.storage.get("userArr").token;
    app.getUserInfo(token);

});


//寻他首页初始化
$$("#seek").on("show", function(page) {

    console.log(page.url);

    if (page.target.id == 'seek') {
        //绑定返回键
        window.localStorage["page"] = 'seek';

        var userArr = app.storage.get("userArr");

        if (userArr == null) {
            app.toast("您还没有登录")

            $$("div.seek_mod").hide();
            return false
        };
        $$("#problem_des").keyup(function() {
            if ($$(this).val() && $$("#showCityPicker3").val() && $$("#showDataPicker").val() && $$("#offer").val()) {
                $$("#submitFounds").attr("data-flag", "true");
                $$("#submitFounds").removeAttr("disabled");
                $$("#submitFounds").attr("style", "background-color: #FF9213 !important;");
            } else {
                //                $$("#submitFounds").attr("style", "background-color: #e3e3e3 !important;");
                $$("#submitFounds").attr("disabled", "disabled");
                $$("#submitFounds").attr("style", "background-color: #e3e3e3 !important;");
                $$("#submitFounds").attr("data-flag", "false");
            }
        });
        $$("#offer").keyup(function() {


            if ($$("#problem_des").val() && $$("#showCityPicker3").val() && $$("#showDataPicker").val() && $$(this).val()) {
                $$("#submitFounds").removeAttr("disabled");
                $$("#submitFounds").attr("style", "background-color: #FF9213 !important;");
                $$("#submitFounds").attr("data-flag", "true");
            } else {
                $$("#submitFounds").attr("style", "background-color: #e3e3e3 !important;");
                $$("#submitFounds").attr("disabled", "disabled");
                $$("#submitFounds").attr("data-flag", "false");
            }

        });

        //金额限制不超过小数点后2位
        app.myNumberic = function(e, len) {
            var obj = e.srcElement || e.target;
            var dot = obj.value.indexOf("."); //alert(e.which);
            len = (typeof(len) == "undefined") ? 2 : len;
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


        var token = userArr.token;
        var area = '110102';
        app.selectSearchInfo(token, area);

    }
});

//寻他首页初始化GPS
$$("[href='#seek']").on("click", function() {
    /*f7app.confirm('是否开启GPS定位功能?', function() {
        //myApp.alert('You clicked Ok button');
        var token = app.storage.get("userArr").token;
        var area = '110102';
        app.queryServicesByArea(token, area);
    });*/
});


//寻他首页ajax请求
app.selectSearchInfo = (function() {

    return function(token, area) {

        var param = {
            "token": token,
            "area": area
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data != null) {
                $$(".tips").html('您的储值卡余额为<span class="mark"> ' + data.data[0].balance.toFixed(2) + '</span> 元');
                $$(".tips").attr("data-balance", data.data[0].balance);
                $$("#total").html(data.data[0].total);
            }

        };

        var selectSearchInfo = root.interFace.selectSearchInfo;
        return app.doAjax(selectSearchInfo, 'post', param, succCallBack)

    }

})()


//GPS定位ajax请求
app.queryServicesByArea = (function() {

    return function(token, area) {

        var param = {
            "token": token,
            "area": area
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var queryServicesByArea = root.interFace.queryServicesByArea;
        return app.doAjax(queryServicesByArea, 'post', param, succCallBack)

    }

})()

//点击寻我验证身份
$$('#findme').click(function() {
    var token = app.storage.get("userArr").token;
    app.checkIdentity(token);
});

//点击寻我验证身份
// $$('#findme').mousedown(function () {
//     var token = app.storage.get("userArr").token;
//     app.checkIdentity1(token);
// });

//寻我权限ajax请求
app.checkIdentity = (function() {

    return function(token) {

        //线下服务level=2
        var param = {
            "token": token,
            "level": "2"
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                //0是普通用户 1是解答者 2是线下服务者 只有是线下服务者才能点击寻我
                // 返回的是键值对 marker代表权限 count代表人数
                // 0 表示没有申请过 出现申请的提示
                // 1 表示审核中，出现申请等待页面，显示多少人排队
                // 2 表示审核通过，可以跳转页面
                // 3 表示审核不通过，出现审核不通过的提示页面
                if (data.data[0].marker == 0) {
                    f7app.modal({
                        text: '<img src="../static/images/img/icon_close_alt2.png" style="position:absolute;right:-20px;top:-20px;background:black;"><p>抱歉，您尚未申请成为线下服务者，我们无法向您推送问题。</p><br/><center><button class="button button-big button-fill color-main" onclick="app.applyOfflineService();">马上申请</button></center>',
                        verticalButtons: true,
                    });
                } else if (data.data[0].marker == 1) {
                    f7app.modal({
                        text: '<img src="../static/images/img/del.png" style="position:absolute;right:-20px;top:-20px;background:black;"><p>"您的申请还在排队审核中，前面还有' + data.data[0].count + '位用户。请耐心等待。"</p>',
                        verticalButtons: true,
                    });
                } else if (data.data[0].marker == 2) {
                    console.log('href="#tab2_find"');
                    f7app.showTab('#tab2_find');
                    app.findMe(token);
                } else if (data.data[0].marker == 3) {
                    f7app.modal({
                        text: '<img src="../static/images/img/del.png" style="position:absolute;right:-20px;top:-20px;background:black;"><p>抱歉，您申请成为线下服务者未通过，我们无法向您推送问题。</p><br/><center><button class="button button-big button-fill color-main" onclick="app.applyOfflineService();">重新申请</button></center>',
                        verticalButtons: true,
                        button: 'closes'
                    });
                }
            } else {
                app.toast(data.errorMessage || "出现异常！");
            }
        };

        var checkIdentity = root.interFace.checkIdentity;
        return app.doAjax(checkIdentity, 'post', param, succCallBack)

    }

})();

//申请成为线下服务者
app.applyOfflineService = (function() {
    return function() {
        f7app.closeModal();
        view.seek.router.loadPage('about/service.html');
    }

})();

//寻我权限ajax请求
app.checkIdentity1 = (function() {

    return function(token) {

        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data[0] === 0 || data.data[0] === 1) {
                $$('#findme').removeAttr('href');
            } else {
                $$('#findme').attr('href', '#tab2_find');
            }
        };

        var checkIdentity = root.interFace.checkIdentity;
        return app.doAjax(checkIdentity, 'post', param, succCallBack);

    }

})();

//叫人按钮触发事件
//叫人触发寻他支付
$$(document).on('click', '#submitFounds', function() {
    var token = app.storage.get("userArr").token;
    var problem_des = $$('#problem_des').val();;
    var tof_gps = 'gps';
    var offer = Number($$("#offer").val());
    var region_id = $$('#showCityPicker3').attr("data-id");
    var service_date = $$('#showDataPicker').val();
    if (Number($$("#offer").val()) < 0.01) {
        app.toast("输入的金额不可以小于最低值！")
    }

    myApp.modal({
        title: '请选择支付方式',
        text: '<div id="pay-model">' +
            '<div>' +
            '<a id="pay-ye" onclick="app.paymodel1(1)"><img src="../static/images/img/icond_ask_balance.png" alt="收益" height="50"></a>' +
            '<a id="pay-czk" onclick="app.paymodel1(2)"><img src="../static/images/img/icond_ask_card.png" alt="储值卡" height="50"></a>' +
            '<a id="pay-zfb" onclick="app.paymodel1(3)"><img src="../static/images/img/icond_ask_ali.png" alt="支付宝" height="50"></a>' +
            '<a id="pay-wx" onclick="app.paymodel1(4)"><img src="../static/images/img/icond_ask_wechat.png" alt="微信" height="50"></a>' +
            '</div>' +
            '<div><p>收益&nbsp;&nbsp;&nbsp;&nbsp;储值卡&nbsp;&nbsp;&nbsp;&nbsp;支付宝&nbsp;&nbsp;&nbsp;&nbsp;微信</p></div>' +
            '</div>',
        buttons: [{
            text: '取消',
            bold: true,
            close: true
        }]

    });

});



//submitFounds的方法
app.paymodel1 = (function() {
    return function(ways) {
        var token = app.storage.get("userArr").token;
        var problem_des = $$('#problem_des').val();;
        var tof_gps = 'gps';
        var offer = Number($$("#offer").val());
        var region_id = $$('#showCityPicker3').attr("data-id");
        var service_date = $$('#showDataPicker').val();
        if (Number($$("#offer").val()) < 0.01) {
            app.toast("输入的金额不可以小于最低值！")
        }
        f7app.closeModal();
        if (ways == 1) {
            ways = "sy";
            app.submitFounds(token, problem_des, tof_gps, offer, ways, region_id, service_date);
        } else if (ways == 2) {
            ways = "yue";
            app.submitFounds(token, problem_des, tof_gps, offer, ways, region_id, service_date);
        } else if (ways == 3) {
            ways = "ali";
            app.aliPayFunction(token, problem_des, tof_gps, offer, ways, region_id, service_date);
        } else if (ways == 4) {
            ways = "wx";
            app.wxPayFunction(token, problem_des, tof_gps, offer, ways, region_id, service_date);
        }
    }
})();

//寻他阿里支付
app.aliPayFunction = (function() {

    return function(token, problem_des, tof_gps, offer, ways, region_id, service_date) {

        var param = {
            "token": token,
            "tof_gps": tof_gps,
            "problem_des": problem_des,
            "offer": offer,
            "pay_type": ways,
            "service_date": service_date,
            "region_id": region_id,
            "flag": "xunta"

        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {

                var uuid = data.aliId; //订单号
                console.log(uuid);

                var amt = data.money; //支付金额
                var vipType = "叫人阿里支付"; //支付类型

                //支付宝原生接口
                var out_trade_no = uuid; //订单号
                var subject = vipType; //商品名称（vip类型）
                var body = "xx"; //描述
                var total_fee = amt; //价格
                var callbackUrl = "http://1c59h33192.iok.la:14681/tz-core/novalidate/alipay/AlipayNotifyUrl.do";
                alipay.pay(out_trade_no, subject, body, total_fee, function(data) {
                    //支付成功
                    if (data.substring(16, 20) == "9000") {
                        app.clearSubmitFounds();
                    } else {
                        app.toast("支付失败！");
                    }

                }, function(error) {
                    app.toast("支付失败！");
                }, callbackUrl);
            } else {
                app.toast(data.errorMessage || "出现异常！");
            }
        };

        var aliPayInfoResul = root.interFace.aliPayInfoResul;
        return app.doAjax(aliPayInfoResul, 'post', param, succCallBack);

    }

})();

//寻他微信支付
app.wxPayFunction = (function() {

    return function(token, problem_des, tof_gps, offer, ways, region_id, service_date) {

        var param = {
            "token": token,
            "tof_gps": tof_gps,
            "problem_des": problem_des,
            "offer": offer,
            "pay_type": ways,
            "service_date": service_date,
            "region_id": region_id,
            "flag": "xunta"

        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.errorCode == 0) {

                var wxData = data.wx;
                var partnerid = wxData.partnerid;
                var prepayid = wxData.prepayid;
                var noncestr = wxData.noncestr;
                var timestamp = wxData.timestamp;
                var sign = wxData.sign;
                //调用微信原生接口
                var params = {
                    partnerid: partnerid, // merchant id
                    prepayid: prepayid, // prepay id
                    noncestr: noncestr, // nonce
                    timestamp: timestamp, // timestamp
                    sign: sign, // signed string
                };

                Wechat.sendPaymentRequest(params, function() {
                    app.clearSubmitFounds();
                }, function(reason) {
                    app.toast(reason || "支付失败！");
                });
            } else {
                app.toast(data.errorMessage || "出现异常！");
            }
        };

        var wxPayInfoResul = root.interFace.wxPayInfoResul;
        return app.doAjax(wxPayInfoResul, 'post', param, succCallBack);

    }

})();

//提交寻他首页ajax请求
app.submitFounds = (function() {

    return function(token, problem_des, tof_gps, offer, ways, region_id, service_date) {

        var param = {
            "token": token,
            "tof_gps": tof_gps,
            "problem_des": problem_des,
            "offer": offer,
            "pay_type": ways,
            "service_date": service_date,
            "region_id": region_id

        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                app.clearSubmitFounds();
            } else {
                app.toast(data.errorMessage || "出现异常！");
            }
        };

        var submitFounds = root.interFace.submitFounds;
        return app.doAjax(submitFounds, 'post', param, succCallBack);

    }

})();

//清空叫人表单内容
app.clearSubmitFounds = (function() {

    return function() {
        $$("#problem_des").val("");
        $$("#showCityPicker3").val("");
        $$('#showCityPicker3').attr("data-id", "");
        $$("#showDataPicker").val("");
        $$('#showDataPicker').attr("data-id", "");
        $$("#offer").val("");
        app.toast("叫人成功！");
    }

})();

/* ===== 寻Ta - 订单 ===== */

//订单初始化
f7app.onPageBeforeAnimation('order', function(page) {

    //绑定返回键
    window.localStorage["page"] = 'seek';


    var swiper = new Swiper('.swiper-container', {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: true,
        slidesPerView: 'auto'
    });


    var userArr = app.storage.get("userArr");

    if (userArr == null) {
        app.toast("您还没有登录");
        return false
    }

    //获取token
    var token = app.storage.get("userArr").token;
    app.getAllFounds(token);

});

//寻他订单ajax请求
app.getAllFounds = (function() {

    return function(token) {

        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            if (data.errorCode == 0) {
                if (data.data.length == 0) {
                    app.toast("没有查找到寻他订单信息！");
                } else {
                    var unselectedOrder = [];
                    var selectedOrder = [];

                    $$.each(data.data, function(i, e) {

                        e["submit_time"] = e.helpInfo.submit_time;
                        e["region_name"] = e.helpInfo.region_name;
                        e["offer"] = e.helpInfo.offer;
                        e["tof_stt"] = e.helpInfo.tof_stt;
                        e["Complaints_Status"] = "0";
                        console.info(e.helpInfo.tof_stt)
                        if (e.helpInfo.tof_stt == '0') {
                            if (e.ComplaintsStatus == "1") {
                                e["Complaints_Status"] = e.ComplaintsStatus;
                            }
                            e["status"] = '已完成';
                            e["_before"] = 'aft';
                            e["need_id"] = e.helpInfo.help_id;
                            e["avatar"] = e.service.path_url;
                            e["phone_number"] = e.service.phone_number;
                            e["real_name"] = e.service.real_name;
                            e["major"] = e.service.major;
                            e.cpa = false;
                            e.a_cpa = false;
                            e.cpv = false;
                            e.cta = false;
                            e.bar = false;
                            e.cpa_g = false;
                            e.other = false;
                            var majorArray = e.major;
                            console.info(e.major)
                            if (majorArray) {
                                //var majorArray = major.split(',');
                                for (var j = 0; j < majorArray.length; j++) {
                                    console.info(majorArray[j]);
                                    if (majorArray[j] == '注册会计师') {
                                        console.info(majorArray[j]);
                                        e.cpa = true;
                                    }
                                    if (majorArray[j] == '美国注册会计师') {
                                        e.a_cpa = true;
                                    }
                                    if (majorArray[j] == '注册资产评估师') {
                                        e.cpv = true;
                                    }
                                    if (majorArray[j] == '注册税务师') {
                                        e.cta = true;
                                    }
                                    if (majorArray[j] == '律师') {
                                        e.bar = true;
                                    }
                                    if (majorArray[j] == '特许公认会计师') {
                                        e.cpa_g = true;
                                    }
                                    if (majorArray[j] == '其他') {
                                        e.other = true;
                                    }
                                }
                            }
                            e["help_id"] = e.helpInfo.help_id;
                            e["services_id"] = e.service.services_id;
                            selectedOrder.push(e);
                        } else if (e.helpInfo.tof_stt == '1') {
                            e["status"] = '抢单中';
                            e["_before"] = 'before';
                            e["help_id"] = e.helpInfo.help_id;
                            e["help_user_id"] = e.helpInfo.help_user_id;
                            e["problem_des"] = e.helpInfo.problem_des;
                            e["service_user_id"] = e.helpInfo.service_user_id;
                            e["tof_stt"] = e.helpInfo.tof_stt;
                            $$.each(e.service, function(idx, ele) {
                                ele.help_id = e.help_id;
                            });
                            var seek_img_list = $$('script#seek_img_list_tpl').html();
                            var tpl = Template7.compile(seek_img_list);
                            e["serviceResult"] = tpl(e.service);
                            e.helpInfo["service"] = e.service;
                            unselectedOrder.push(e);
                        } else if (e.helpInfo.tof_stt == '2') {
                            e["status"] = '进行中';
                            e["_before"] = 'bef';
                            e["help_id"] = e.helpInfo.help_id;
                            e["avatar"] = e.service.path_url;
                            e["phone_number"] = e.service.phone_number;
                            e["service_user_id"] = e.helpInfo.service_user_id;
                            e["real_name"] = e.service.real_name;
                            e["problem_des"] = e.helpInfo.problem_des;
                            e["help_user_id"] = e.helpInfo.help_user_id;
                            e["need_id"] = e.helpInfo.help_id;
                            e["tof_stt"] = e.helpInfo.tof_stt;
                            //                            e["_before"] = 'aft';
                            e["major"] = e.service.major;
                            e.cpa = false;
                            e.a_cpa = false;
                            e.cpv = false;
                            e.cta = false;
                            e.bar = false;
                            e.cpa_g = false;
                            e.other = false;
                            var majorArray = e.major;
                            console.info(e.major)
                            if (majorArray) {
                                //var majorArray = major.split(',');
                                for (var j = 0; j < majorArray.length; j++) {
                                    console.info(majorArray[j]);
                                    if (majorArray[j] == '注册会计师') {
                                        console.info(majorArray[j]);
                                        e.cpa = true;
                                    }
                                    if (majorArray[j] == '美国注册会计师') {
                                        e.a_cpa = true;
                                    }
                                    if (majorArray[j] == '注册资产评估师') {
                                        e.cpv = true;
                                    }
                                    if (majorArray[j] == '注册税务师') {
                                        e.cta = true;
                                    }
                                    if (majorArray[j] == '律师') {
                                        e.bar = true;
                                    }
                                    if (majorArray[j] == '特许公认会计师') {
                                        e.cpa_g = true;
                                    }
                                    if (majorArray[j] == '其他') {
                                        e.other = true;
                                    }
                                }
                            }
                            e["services_id"] = e.service.services_id;
                            selectedOrder.push(e);
                        } else if (e.helpInfo.tof_stt == '7') {
                            e["status"] = '忽略';
                        }

                    });
                    console.log(selectedOrder);
                    console.log(unselectedOrder);

                    if (unselectedOrder.length > 0) {
                        var order_tpl = $$('script#seek_order_uncompleted_list_tpl').html();
                        var tpl = Template7.compile(order_tpl);
                        $$("#all_card_container_unselected").html(tpl(unselectedOrder));
                    }
                    if (selectedOrder.length > 0) {
                        var order_tpl = $$('script#seek_order_list_tpl').html();
                        var tpl = Template7.compile(order_tpl);
                        $$("#all_card_container_selected").html(tpl(selectedOrder))
                    }
                }
            } else {
                app.toast(data.errorMessage || "出现异常！")
            }
        };

        var getAllFounds = root.interFace.getAllFounds;
        return app.doAjax(getAllFounds, 'post', param, succCallBack)

    }

})();


/* ===== 首页  我的 ===== */

//我的按钮触发事件
$$(document).on('click', '#expertDetail', function() {
    /*$$(document).on('click', '#about', function () {
    >>>>>>> .r974
        var token = app.storage.get("userArr").token;


        /* 




         var serviceId = "1";
         app.getServiceInfoByUID(token, serviceId);

         var service_uid = "1";
         var help_id = "1";
         app.chooseServiceUser(token, service_uid, help_id);

         var need_id = '1';
         app.completeFound(token, need_id);

         var need_id = '1';
         var complaint = '骗钱的';
         app.complaintFound(token, need_id, complaint);*/


    app.getUserInfo(token);
})



app.showExpert = function(service_user_id, help_id) {
    var token = app.storage.get("userArr").token;
    app.getSeekServiceInfoByUID(token, service_user_id, help_id);
}

app.adoptExpert = function(service_user_id, help_id) {
    var token = app.storage.get("userArr").token;
    $$('#card' + help_id).addClass("bef");
    var obj = {};
    obj.token = token;
    obj.service_user_id = service_user_id;
    obj.help_id = help_id;
    var seek_order_comp = $$("script#seek_order_comp_tpl").html();
    var lesu = Template7.compile(seek_order_comp);
    var html = lesu(obj);
    $$('#panl' + help_id).html(html);
    app.chooseServiceUser(token, service_user_id, help_id);
};


//寻他订单里的专家详情ajax请求
app.getSeekServiceInfoByUID = (function() {

    return function(token, serviceId, help_id) {

        var param = {
            "token": token,
            "serviceId": serviceId
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            var expert_details = $$("script#seek_expert_details_tpl").html();
            var lesu = Template7.compile(expert_details);
            var params = {};
            params.title = "";
            var expert = data.data[0];
            expert.cpa = false;
            expert.a_cpa = false;
            expert.cpv = false;
            expert.cta = false;
            expert.bar = false;
            expert.cpa_g = false;
            expert.other = false;
            var majorArray = expert.major;
            if (majorArray) {
                //var majorArray = major.split(',');["注册税务师", "注册会计师", "律师", "特许公认会计师"]
                for (var j = 0; j < majorArray.length; j++) {
                    if (majorArray[j] == '注册会计师') {
                        expert.cpa = true;
                    }
                    if (majorArray[j] == '美国注册会计师') {
                        expert.a_cpa = true;
                    }
                    if (majorArray[j] == '注册资产评估师') {
                        expert.cpv = true;
                    }
                    if (majorArray[j] == '注册税务师') {
                        expert.cta = true;
                    }
                    if (majorArray[j] == '律师') {
                        expert.bar = true;
                    }
                    if (majorArray[j] == '特许公认会计师') {
                        expert.cpa_g = true;
                    }
                    if (majorArray[j] == '其他') {
                        expert.other = true;
                    }
                }
            }
            expert.service_id = serviceId;
            expert.help_id = help_id;
            params.text = lesu(expert);
            console.info(expert);
            f7app.modal({
                text: params.text,
                verticalButtons: true,
                opened: function() {
                    console.info('test')
                },
            });
            $$("#icon_close_alt2").on("click", function() {
                f7app.closeModal('.modal.modal-in');
            });

        };

        var getServiceInfoByUID = root.interFace.getServiceInfoByUID;
        return app.doAjax(getServiceInfoByUID, 'post', param, succCallBack);

    }

})();



//专家详情ajax请求
app.getServiceInfoByUID = (function() {

    return function(token, serviceId) {

        var param = {
            "token": token,
            "serviceId": serviceId
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            var expert_details = $$("script#expert_details_tpl").html();
            var lesu = Template7.compile(expert_details);
            var params = {};
            params.title = "";
            var expert = data.data[0];
            expert.cpa = false;
            expert.a_cpa = false;
            expert.cpv = false;
            expert.cta = false;
            expert.bar = false;
            expert.cpa_g = false;
            expert.other = false;
            var majorArray = expert.major;
            if (majorArray) {
                //var majorArray = major.split(',');
                for (var j = 0; j < majorArray.length; j++) {
                    if (majorArray[j] == '注册会计师') {
                        expert.cpa = true;
                    }
                    if (majorArray[j] == '美国注册会计师') {
                        expert.a_cpa = true;
                    }
                    if (majorArray[j] == '注册资产评估师') {
                        expert.cpv = true;
                    }
                    if (majorArray[j] == '注册税务师') {
                        expert.cta = true;
                    }
                    if (majorArray[j] == '律师') {
                        expert.bar = true;
                    }
                    if (majorArray[j] == '特许公认会计师') {
                        expert.cpa_g = true;
                    }
                    if (majorArray[j] == '其他') {
                        expert.other = true;
                    }
                }
            }
            params.text = lesu(expert);
            f7app.modal(params);
            $$("#icon_close_alt2").on("click", function() {
                f7app.closeModal('.modal.modal-in');
            });
            $$("#askBtn").on("click", function() {
                f7app.closeModal('.modal.modal-in');
                var userId = $$(this).attr("data-id");
                view.about.router.loadPage('index/ask.html?expert_id=' + userId + '&flag=about' + '&bigKaPrice=' + expert.lowest_amt);
            });
            console.log(data);

        };

        var getServiceInfoByUID = root.interFace.getServiceInfoByUID;
        return app.doAjax(getServiceInfoByUID, 'post', param, succCallBack)

    }

})();


//确认由他帮助我ajax请求
app.chooseServiceUser = (function() {

    return function(token, service_uid, help_id) {

        var param = {
            "token": token,
            "service_uid": service_uid,
            "help_id": help_id
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                f7app.closeModal('.modal.modal-in');
                app.toast("采纳成功！");
            }
        };

        var chooseServiceUser = root.interFace.chooseServiceUser;
        return app.doAjax(chooseServiceUser, 'post', param, succCallBack)

    }

})();


//完成订单ajax请求
app.completeFound = (function() {

    return function(help_user_id, need_id, offer) {

        var token = app.storage.get("userArr").token;
        var param = {
            "token": token,
            "help_user_id": help_user_id.toString(),
            "need_id": need_id.toString(),
            "offer": offer
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode != 0) {
                app.toast(data.errorMessage);
            } else {
                var obj = {};
                obj.servers_id = help_user_id;
                obj.need_id = need_id;
                var seek_order_complaint = $$("script#seek_order_complaint_tpl").html();
                var lesu = Template7.compile(seek_order_complaint);
                var html = lesu(obj);
                $$('#panl' + need_id).html(html);
                $$('#panl' + need_id).css('background-color', '#c1e0c6');
            }
        };

        var completeFound = root.interFace.completeFound;
        return app.doAjax(completeFound, 'post', param, succCallBack)

    }

})();

//订单投诉ajax请求
app.complaintFound = (function() {

    return function(token, need_id, complaint) {

        var param = {
            "token": token,
            "need_id": need_id,
            "complaint": complaint
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
        };

        var complaintFound = root.interFace.complaintFound;
        return app.doAjax(complaintFound, 'post', param, succCallBack);

    }

})();






//我的 用户申请升级按钮触发事件
$$(document).on('click', '#saveUserLevel', function() {
    var token = app.storage.get("userArr").token;
    var real_name = 'wxl';
    var major_id = 2;
    var tax_id = 1;
    var company_post = 'company_post';
    var line_service_slogan = 'line_service_slogan';
    var service_region_id = 'service_region_id';
    var remarks = 'remarks';
    var phone_number = '15898184415';
    var level = '1';
    app.saveUserService(token, real_name, major_id, tax_id, company_post, line_service_slogan, service_region_id, remarks, phone_number, level);
})

//我的页面用户申请升级yajax请求
app.saveUserService = (function() {

    return function(token, real_name, major_id, tax_id, company_post, line_service_slogan, service_region_id, remarks, phone_number, level) {

        var param = {
            "token": token,
            "real_name": real_name,
            "major_id": major_id,
            "tax_id": tax_id,
            "company_post": company_post,
            "line_service_slogan": line_service_slogan,
            "service_region_id": service_region_id,
            "remarks": remarks,
            "phone_number": phone_number,
            "level": level,
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var saveUserService = root.interFace.saveUserService;
        return app.doAjax(saveUserService, 'post', param, succCallBack)

    }

})();
