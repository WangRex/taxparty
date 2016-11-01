//修改头像ajax请求
app.saveAvatar = (function () {

    return function (token, img) {

        var param = {
            "token": token,
            "img": img
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == "0") {
                app.storage.set("userImg", param.img)
                app.toast("头像修改成功!")
            } else {
                app.toast("修改失败，请重试!")
            }

        };

        var saveAvatar = root.interFace.saveAvatar;
        return app.doAjax(saveAvatar, 'post', param, succCallBack)

    }

})();




//我的页面个人信息ajax请求
app.getUserInfo = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.data == null) {
                app.toast("请登录")
                return false
            }

            var detailsr_tpl = $$('script#user_tpl').html();
            var tpl = Template7.compile(detailsr_tpl);
            var myData = data.data[0];
            if (myData.post_type == "2") {
                myData.post_type = "充值卡";
            } else if (myData.post_type == "1") {
                myData.post_type = "VIP";
            } else if (myData.post_type == "0") {
                myData.post_type = "SVIP";
            }

            $$("#user_list").html(tpl(myData));

            $$("#avatar").css("backgroundImage", 'url(' + myData.avatar + ')')

            if (myData.marker == "1") {
                $$("#marker1").attr("class", "about-marker-11");
            } else if (myData.marker == "2") {
                $$("#marker2").attr("class", "about-marker-12");
            }

            if (myData.major == "无") {
                $$("#major123").hide();
            }

            app.vipTypeInit(token); //vip选择初始化

            $$('#Eject').on('click', function () {
                var token = app.storage.get("userArr").token;

                var succCallBack = function (data, status, response, address) {
                    var data = JSON.parse(data);

                }
                app.Eject(token);

            });


            /* ===== 我的头像上传 ===== */
            $$("#fileup").on("change", "input", function () {
                var slef = this;
                var file = slef.files[0];
                console.log(file)
                app.fileupImg.getOrientation(file, function (direction) {
                    var direction = direction;
                    var reader = new FileReader();
                    reader.onload = function () {
                        var result = reader.result;
                        // 安卓4.1兼容问题
                        var base64 = reader.result.split(',')[1];
                        var dataUrl = 'data:image/png;base64,' + base64;
                        var img = new Image();
                        img.src = result;
                        img.onload = function () {
                            var dataUrl = app.fileupImg.compressImage(img, direction);
                            slef.parentNode.style.backgroundImage = 'url(' + dataUrl + ')';
                            slef.parentNode.setAttribute('data-img', dataUrl)

                            var token = app.storage.get("userArr").token;
                            app.saveAvatar(token, dataUrl);

                            app.loader.show()
                        }
                    }
                    reader.readAsDataURL(file);
                })

            })

        };

        var getUserInfo = root.interFace.getUserInfo;
        return app.doAjax(getUserInfo, 'post', param, succCallBack)

    }

})()

/* ===== 首页-> 我的 支付功能 ===== */

/**
 * 陈雪阳
 * 2016-10-18
 */
var myApp = new Framework7();

app.vipTypeInit = (function () {
    return function (token) {

        $$('#index-pay-money').val(''); //初始化金额不显示
        $$('#index-pay-money').attr('readonly', 'readonly');
        $$('#SVIP').hide();
        $$('#VIP').hide();
        $$('#card').hide();
        //app.vipType(app.storage.get("userArr").token, '0');
        //svip的click事件
        $$('#radio_tab input[name="radio"]').click(function () {
            var token = app.storage.get("userArr").token
                //var amt = $$("#index-pay-money").val(); //支付金额
            var vipType = $$('#radio_tab input[name="radio"]:checked').val(); //支付类型
            if (vipType == "SVIP") {
                vipType = '0';
            } else if (vipType == "VIP") {
                vipType = '1';
            } else if (vipType == "card") {
                vipType = '2';
            }
            if (this.value == 'SVIP') {
                //$$('#index-pay-money').val('999');
                app.vipType(token, vipType);
                $$('#index-pay-money').attr('readonly', 'readonly');
                $$('#SVIP').show();
                $$('#VIP').hide();
                $$('#card').hide();
            }
        });

        //vip选择change事件
        $$('#radio_tab input[name="radio"]').change(function () {
            var token = app.storage.get("userArr").token
                //var amt = $$("#index-pay-money").val(); //支付金额
            var vipType = $$('#radio_tab input[name="radio"]:checked').val(); //支付类型
            if (vipType == "SVIP") {
                vipType = '0';
            } else if (vipType == "VIP") {
                vipType = '1';
            } else if (vipType == "card") {
                vipType = '2';
            }

            if (this.value == 'SVIP') {
                //$$('#index-pay-money').val('999');
                app.vipType(token, vipType);
                $$('#index-pay-money').attr('readonly', 'readonly');
                $$('#SVIP').show();
                //$$('#SVIP').hide();
                $$('#VIP').hide();
                $$('#card').hide();
            }
            if (this.value == 'VIP') {
                //$$('#index-pay-money').val('99');
                app.vipType(token, vipType);
                $$('#index-pay-money').attr('readonly', 'readonly');
                $$('#VIP').show();
                $$('#SVIP').hide();
                //$$('#VIP').hide();
                $$('#card').hide();
            }
            if (this.value == 'card') {
                //$$('#index-pay-money').val('');
                app.vipType(token, vipType);
                $$('#index-pay-money').removeAttr('readonly', 'readonly');
                $$('#card').show();
                $$('#SVIP').hide();
                $$('#VIP').hide();
                // $$('#card').hide();
            }
        });

        //更多优惠的click事件
        $$("#more_1").on("click", function () {
            app.more(app.storage.get("userArr").token, "0");

        });
        $$("#more_2").on("click", function () {
            app.more(app.storage.get("userArr").token, "1");
        });

        //支付金钱校验，支付click事件
        $$("#index-pay-btn").on("click", function () {
            var token = app.storage.get("userArr").token;
            var amt = $$("#index-pay-money").val(); //支付金额
            var vipType = $$('#radio_tab input[name="radio"]:checked').val(); //支付类型
            var payacc = "122"; //支付人的账号

            console.log(amt);
            if (!amt) {
                app.toast("不能输入空");
                return false;
            }
            /*else if (!/^[1-9]\d*$/.test(amt)) {
                        app.toast("请输入大于0的数字");
                        return false;
                        }*/
            else if (amt < 200) {
                if (vipType == 'card') {
                    app.toast("最低充值金额200.00元");
                    return false;
                } else {
                    myApp.modal({
                        title: '请选择支付方式',
                        text: '<div id="pay-model">' +
                            '<div>' +
                            '<a id="pay-zfb" onclick="app.paymodel(1)"><img src="../static/images/img/zhi.png" alt="支付宝" height="60"></a>' +
                            '<a id="pay-wx" onclick="app.paymodel(2)"><img src="../static/images/img/wei.png" alt="微信" height="60"></a>' +
                            '</div>' +
                            '<div><p>支付宝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信</p></div>' +
                            '</div>',
                        buttons: [
                            {
                                text: '取消',
                                bold: true,
                                close: true
                            }
                        ]

                    });
                }
            } else {
                myApp.modal({
                    title: '请选择支付方式',
                    text: '<div id="pay-model">' +
                        '<div>' +
                        '<a id="pay-zfb" onclick="app.paymodel(1)"><img src="../static/images/img/zhi.png" alt="支付宝" height="60"></a>' +
                        '<a id="pay-wx" onclick="app.paymodel(2)"><img src="../static/images/img/wei.png" alt="微信" height="60"></a>' +
                        '</div>' +
                        '<div><p>支付宝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信</p></div>' +
                        '</div>',
                    buttons: [
                        {
                            text: '取消',
                            bold: true,
                            close: true
                        }
                    ]
                });
            }

        });

    }
})();

//VIP的ajax请求
app.vipType = (function () {
    return function (token, vipType) {

        var param = {
            "token": token,
            "vipType": vipType
        };

        // $$("#haha").hidden;

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            var type = data.sale;
            for (i in type) {
                if (type[i].sale_type == "0") {
                    $$('#index-pay-money').val(type[i].sale_price);
                    document.getElementById('SVIP_1').innerHTML = type[i].sale_discount;
                } else if (type[i].sale_type == "1") {
                    $$('#index-pay-money').val(type[i].sale_price);
                    document.getElementById('VIP_1').innerHTML = type[i].sale_discount;
                } else if (type[i].sale_type == "2") {
                    $$('#index-pay-money').val('');
                    document.getElementById('card_1').innerHTML = type[i].sale_discount;
                }
            }
        }
        var vipType = root.interFace.vipT; //vip类型金额接口
        return app.doAjax(vipType, 'post', param, succCallBack);
    }
})();

//更多优惠的ajax请求
app.more = (function () {
    return function (token, vipType) {
        var param = {
            "token": token,
            "vipType": vipType
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            var type = data.sale;
            for (i in type) {
                if (type[i].sale_type == "0") {
                    //$$('#index-pay-money').val(type[i].sale_price);
                    document.getElementById('svip_t').innerHTML = type[i].sale_details;
                    document.getElementById('svip_detail').innerHTML = type[i].sale_discount;
                } else if (type[i].sale_type == "1") {
                    //$$('#index-pay-money').val(type[i].sale_price);
                    document.getElementById('vip_t').innerHTML = type[i].sale_details;
                    document.getElementById('vip_detail').innerHTML = type[i].sale_discount;
                }
            }
        }
        var vipType = root.interFace.vipT; //vip类型金额接口
        return app.doAjax(vipType, 'post', param, succCallBack);

    }
})();

//paymodel的方法
app.paymodel = (function () {
    return function (payModel) {
        var token = app.storage.get("userArr").token
        var amt = $$("#index-pay-money").val(); //支付金额
        var vipType = $$('#radio_tab input[name="radio"]:checked').val(); //支付类型
        var payacc = "122";
        f7app.closeModal();
        if (payModel == 1) {
            payModel = "ALI";
            app.aliPay(token, amt, vipType, payModel, payacc); //支付宝支付
        } else if (payModel == 2) {
            payModel = "wx";
            var rem = "备注";
            var desc = "购买vip";
            var uasge = "zhifu"; //付款来源用途
            app.wxPay(token, amt, rem, payModel, desc, uasge, payacc); //      应该调微信接口
        }
    }
})();
//用户微信充值的ajax请求
app.wxPay = (function () {
    return function (token, amt, rem, payModel, desc, uasge, payacc) {
        var param = {
            "token": token,
            "tran_amt": amt,
            "flow_rem": rem, //备注
            "pay_mode": payModel,
            "rcc_user_id": payacc, //收款人id
            "tran_uasge": uasge,
            "flow_desc": desc
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            var partnerid = data.data.partnerid;
            var prepayid = data.data.prepayid;
            var noncestr = data.data.noncestr;
            //console.log(noncestr);
            var timestamp = data.data.timestamp;
            var sign = data.data.sign;
            //调用微信原生接口
            var params = {
                partnerid: partnerid, // merchant id
                prepayid: prepayid, // prepay id
                noncestr: noncestr, // nonce
                timestamp: timestamp, // timestamp
                sign: sign, // signed string
            };

            Wechat.sendPaymentRequest(params, function () {
                //alert("Success");
                //支付成功
                view.about.router.loadPage('about/pay-success.html'); //跳转到支付成功的界面
                myApp.modal({
                    text: '是否现在打印发票？',
                    buttons: [
                        {
                            text: '是',
                            close: true,
                            onClick: function () {
                                //app.toast("打印发票");
                                view.about.router.loadPage('about/ticket.html'); //跳转到打印发票的页面
                            }
                        },
                        {
                            text: '否',
                            close: true,
                            onClick: function () {
                                //app.toast("个人界面");
                                view.about.router.back('/index.html'); //退回到个人界面
                            }
                        },
                    ],
                });

            }, function (reason) {
                //alert("Failed: " + reason);
                //支付失败
                view.about.router.loadPage('about/pay-fail.html'); //跳转到支付失败的界面
            });

        }

        var pay = root.interFace.wxPay; //微信支付接口()
        return app.doAjax(pay, 'post', param, succCallBack)

    }
})();

//用户支付宝充值ajax请求
app.aliPay = (function () {

    return function (token, amt, vipType, payModel, payacc) {
        var param = {
            "token": token,
            "amt": amt,
            "vipType": vipType,
            "payModel": payModel,
            "payacc": payacc
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            var uuid = data.data; //订单号
            console.log(uuid);

            var amt = $$("#index-pay-money").val(); //支付金额
            var vipType = $$('#radio_tab input[name="radio"]:checked').val(); //支付类型

            //支付宝原生接口
            var out_trade_no = uuid; //订单号
            var subject = vipType; //商品名称（vip类型）
            var body = "xx"; //描述
            var total_fee = amt; //价格
            var callbackUrl = "http://1c59h33192.iok.la:14681/tz-core/novalidate/alipay/AlipayNotifyUrl.do";
            alipay.pay(out_trade_no, subject, body, total_fee, function (data) {
                //alert(success);
                //支付成功
                if (data.substring(16, 20) == "9000") {
                    //alert("支付成功");
                    view.about.router.loadPage('about/pay-success.html'); //跳转到支付成功的界面
                    myApp.modal({
                        text: '是否现在打印发票？',
                        buttons: [
                            {
                                text: '是',
                                close: true,
                                onClick: function () {
                                    //app.toast("打印发票");
                                    view.about.router.loadPage('about/ticket.html'); //跳转到打印发票的页面
                                }
                                },
                            {
                                text: '否',
                                close: true,
                                onClick: function () {
                                    //app.toast("个人界面");
                                    view.about.router.back('/index.html'); //退回到个人界面
                                }
                                },
                            ],
                    });
                } else {
                    //alert("支付失败");
                    view.about.router.loadPage('about/pay-fail.html'); //跳转到支付失败的界面
                }

            }, function (error) {
                // alert("error" + error);
                // alert("支付出错");
                view.about.router.loadPage('about/pay-fail.html'); //跳转到支付失败的界面
            }, callbackUrl);

        }
        var pay = root.interFace.zfbPay; //支付宝支付接口
        return app.doAjax(pay, 'post', param, succCallBack)
    }
})();

////获取来源列表
app.queryTaxProperty = (function () {
    return function (token, father_id, succCallBack) {
        var param = {
            "token": token,
            "father_id": father_id
        };

        return app.doAjax(root.interFace.queryTaxProperty, 'post', param, succCallBack);
    }
})();
//修改用户昵称和个性签名 开始
app.edituser = (function () {
    return function (token, nick_name, signa) {

        var param = {
            "token": token,
            "nick_name": nick_name,
            "signa": signa

        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
        };

        var edituser = root.interFace.updateUserInfo
        return app.doAjax(edituser, 'post', param, succCallBack)

    }
})();

app.edituserInit = (function () {
    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            var detailsr_tpl1 = $$('script#edituser_tpl').html();
            var tpl1 = Template7.compile(detailsr_tpl1);
            $$("#edituser_list").html(tpl1(data.data[0]));

            //提交昵称和签名
            $$("#submitUser").on("click", function () {
                var nick_name = $$("#nick_name").val();
                var signa = $$("#signa").val();
                console.log(signa);
                if (nick_name == null || nick_name == "") {
                    app.toast("昵称不能为空");
                    return false;
                } else if (signa == null || signa == "") {
                    app.toast("签名不能为空");
                    return false;
                } else {
                    var token = app.storage.get("userArr").token
                    app.edituser(token, nick_name, signa);
                    app.toast("修改成功");
                }
            })
        };

        var edituserInit = root.interFace.getUserInfo
        return app.doAjax(edituserInit, 'post', param, succCallBack)

    }
})();

f7app.onPageBack('edituser', function () {
    var token = app.storage.get("userArr").token
    app.getUserInfo(token);
});

f7app.onPageInit('edituser', function (page) {
    
    //绑定返回键
    window.localStorage["page"] = 'about';
    
    var token = app.storage.get("userArr").token
    app.edituserInit(token);
});
//修改用户昵称和个性签名 结束

//申请线下服务者 开始
app.service = (function () {
    return function (token, real_name, card_id, phone_number, region_code, major, line_service_slogan, company_post, service_region_id, taxproperty_code, level) {
        var param = {
            "token": token,
            "real_name": real_name,
            "card_id": card_id,
            "phone_number": phone_number,
            "region_code": region_code,
            "major": major,
            "line_service_slogan": line_service_slogan,
            "company_post": company_post,
            "service_region_id": service_region_id,
            "taxproperty_code": taxproperty_code,
            "level": level


        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var service = root.interFace.updateUserLevel
        return app.doAjax(service, 'post', param, succCallBack)

    }
})();

//初始化下拉框
app.serviceInit = (function () {
    return function (token) {

        //初始化税务领域
        var taxPicker01 = new mui.PopPicker({
            layer: 1
        });

        $$("#taxproperty_code1").on('click', function (event) {
            var self = this;
            app.queryTaxProperty(token, "01", function (data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function (i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                taxPicker01.setData(array);
                taxPicker01.show(function (items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data_id", items[0].value);
                });
            });
        }, false);

        //初始化专业资格
        var taxPicker02 = new mui.PopPicker({
            layer: 1
        });

        $$("#major1").on('click', function (event) {
            var self = this;
            var array = ["注册会计师", "注册税务师", "律师", "特许公认会计师", "美国注册会计师", "注册资产评估师", "其他"];
            console.log(array.value);
            taxPicker02.setData(array);
            taxPicker02.show(function (items) {
                var t = (items[0] || {});
                self.value = t;

            });

        }, false);

        //初始化适用地区
        var areaPicker3 = new mui.PopPicker({
            layer: 3
        });

        areaPicker3.setData(cityData3);
        $$("#region_code1").on('click', function (event) {
            var self = this;
            areaPicker3.show(function (items) {
                var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                self.value = t;
                self.setAttribute("data_id", items[2].value);
            });
        }, false);

        /*areaPicker3.pickerElement[0].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         console.log(eventData.item.value);
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCity(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);

         areaPicker3.pickerElement[1].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCounty(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);*/

        var areaPicker2 = new mui.PopPicker({
            layer: 3
        });

        areaPicker2.setData(cityData3);
        $$("#service_region_id").on('click', function (event) {
            var self = this;
            areaPicker2.show(function (items) {
                var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                self.value = t;
                self.setAttribute("data_id", items[2].value);
            });
        }, false);

        /*areaPicker2.pickerElement[0].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         console.log(eventData.item.value);
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCity(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);

         areaPicker2.pickerElement[1].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCounty(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);*/



        return "success";
    }

})();

//获取线下服务者的页面信息
app.serviceValue = (function () {
    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            var detailsr_tpl2 = $$('script#service_tpl').html();
            var tpl2 = Template7.compile(detailsr_tpl2);


            if (data.data != null) {
                $$("#apply1").hide();
                $$("#service_list").html(tpl2(data.data));
                app.serviceInit(token);

            } else {
                $$("#service_list").hide()
                app.serviceInit(token);
            }


            $$("#submitService").on("click", function () {
                var real_name = $$("#real_name1").val();
                var card_id = $$("#card_id1").val();
                var phone_number = $$("#phone_number1").val();
                var region_code = $$("#region_code1").attr("data_id");
                var major = $$("#major1").val();
                var line_service_slogan = $$("#line_service_slogan").val();
                var company_post = $$("#company_post1").val();
                var service_region_id = $$("#service_region_id").attr("data_id");
                var taxproperty_code = $$("#taxproperty_code1").attr("data_id");
                var first = $$("#first1").prop("checked");
                var level = "2";

                console.log(real_name, card_id, phone_number, region_code, major, line_service_slogan, company_post, service_region_id, taxproperty_code, level);
                if (region_code == null || region_code == "") {
                    app.toast("工作地点不能为空");
                    return false;
                } else if (major == null || major == "") {
                    app.toast("专业资格不能为空");
                    return false;
                } else if (line_service_slogan == null || line_service_slogan == "") {
                    app.toast("线下服务口号不能为空");
                    return false;
                } else if (service_region_id == null || service_region_id == "") {
                    app.toast("线下服务区域不能为空");
                    return false;
                } else if (taxproperty_code == null || taxproperty_code == "") {
                    app.toast("擅长税务领域不能为空");
                    return false;
                } else if (!first) {
                    app.toast("请同意《税务在线服务协议》");
                    return false;
                } else {
                    var token = app.storage.get("userArr").token
                    app.service(token, real_name, card_id, phone_number, region_code, major, line_service_slogan, company_post, service_region_id, taxproperty_code, level);
                    app.toast("申请线下服务者提交成功");
                    app.checking(token, level);
                }

            })


        };
        var serviceValue = root.interFace.getUserLevel
        return app.doAjax(serviceValue, 'post', param, succCallBack)
    }
})();


f7app.onPageInit('service', function (page) {
    
    //绑定返回键
    window.localStorage["page"] = 'about';
    
    var token = app.storage.get("userArr").token;
    console.log(token);
    app.serviceValue(token);

});
//申请线下服务者 结束

//申请解答者 开始
app.application = (function () {

    return function (token, real_name, card_id, phone_number, region_code, major, company_post, taxproperty_code, level) {

        var param = {
            "token": token,
            "real_name": real_name,
            "card_id": card_id,
            "phone_number": phone_number,
            "region_code": region_code,
            "major": major,
            "company_post": company_post,
            "taxproperty_code": taxproperty_code,
            "level": level
        };
        console.log(param);
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var application = root.interFace.updateUserLevel
        return app.doAjax(application, 'post', param, succCallBack)

    }
})();

//申请解答者页面初始化
app.applicationInit = (function () {
    return function (token) {

        //初始化税务领域
        var taxPicker01 = new mui.PopPicker({
            layer: 1
        });

        $$("#taxproperty_code").on('click', function (event) {
            var self = this;
            app.queryTaxProperty(token, "01", function (data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function (i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);

                    });
                }
                taxPicker01.setData(array);
                taxPicker01.show(function (items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data_id", items[0].value);
                    console.log(items[0].value)
                });
            });
        }, false);

        //初始化专业资格
        var taxPicker02 = new mui.PopPicker({
            layer: 1
        });

        $$("#major").on('click', function (event) {
            var self = this;
            var array = ["注册会计师", "注册税务师", "律师", "特许公认会计师", "美国注册会计师", "注册资产评估师", "其他"];
            console.log(array.value);
            taxPicker02.setData(array);
            taxPicker02.show(function (items) {
                var t = (items[0] || {});
                self.value = t;
                self.setAttribute("data_id", items[0].value);
                console.log(items[0].value)
            });

        }, false);

        //
        var areaPicker3 = new mui.PopPicker({
            layer: 3
        });

        areaPicker3.setData(cityData3);
        $$("#region_code").on('click', function (event) {
            var region_code = $$("#region_code").attr("data_id");
            console.log(this);
            var self = this;
            areaPicker3.show(function (items) {
                var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                self.value = t;
                self.setAttribute("data_id", items[2].value);
                console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
            });
        }, false);

        /*areaPicker3.pickerElement[0].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         console.log(eventData.item.value);
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCity(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);

         areaPicker3.pickerElement[1].addEventListener('change', function (event) {
         var nextPickerElement = this.nextSibling;
         if (nextPickerElement && nextPickerElement.picker) {
         var eventData = event.detail || {};
         var preItem = eventData.item || {};
         if (app.queryCity) {
         var token = app.storage.get("userArr").token;
         app.queryCounty(token, eventData.item.value, function (data) {
         var array = [];
         var data = JSON.parse(data);
         if (data) {
         $$.each(data.data, function (i, e) {
         var obj = {};
         obj.value = e.region_code;
         obj.text = e.region_name;
         array.push(obj);
         });
         }
         nextPickerElement.picker.setItems(array);
         });
         }
         }
         }, false);*/
        return "success";
    }

})();

app.applicationValue = (function () {
    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            var detailsr_tpl2 = $$('script#application_tpl').html();
            var tpl2 = Template7.compile(detailsr_tpl2);

            if (data.data != null) {
                $$("#apply").hide();
                $$("#application_list").html(tpl2(data.data));
                app.applicationInit(token);
            } else {
                $$("#application_list").hide()
                app.applicationInit(token);
            }



            $$("#submit").on("click", function () {
                var real_name = $$("#real_name").val();
                var card_id = $$("#card_id").val();
                var phone_number = $$("#phone_number").val();
                var region_code = $$("#region_code").attr("data_id");
                var major = $$("#major").val();
                var company_post = $$("#company_post").val();
                var taxproperty_code = $$("#taxproperty_code").attr("data_id");
                var first = $$("#first").prop("checked");
                var level = "1";

                console.log(real_name, card_id, phone_number, region_code, major, company_post, taxproperty_code);

                if (region_code == null || region_code == "") {
                    app.toast("工作地点不能为空");
                    return false;
                } else if (major == null || major == "") {
                    app.toast("专业资格不能为空");
                    return false;
                } else if (taxproperty_code == null || taxproperty_code == "") {
                    app.toast("擅长税务领域不能为空");
                    return false;
                } else if (!first) {
                    app.toast("请同意《税务在线服务协议》");
                    return false;
                } else {
                    var token = app.storage.get("userArr").token
                    app.application(token, real_name, card_id, phone_number, region_code, major, company_post, taxproperty_code, level);
                    app.toast("解答者申请成功");
                }
                if (region_code == null || region_code == "") {
                    app.toast("工作地点不能为空");
                    return false;
                } else if (major == null || major == "") {
                    app.toast("专业资格不能为空");
                    return false;
                } else if (taxproperty_code == null || taxproperty_code == "") {
                    app.toast("擅长税务领域不能为空");
                    return false;
                } else if (!first) {
                    app.toast("请同意《税务在线服务协议》");
                    return false;
                } else {
                    var token = app.storage.get("userArr").token
                    app.application(token, real_name, card_id, phone_number, region_code, major, company_post, taxproperty_code, level);
                    app.toast("解答者申请成功");
                    app.checking(token, level);
                }

            })

        };
        var applicationValue = root.interFace.getUserLevel
        return app.doAjax(applicationValue, 'post', param, succCallBack)
    }
})();

f7app.onPageInit('application', function (page) {
    
    //绑定返回键
    window.localStorage["page"] = 'about';
    
    var token = app.storage.get("userArr").token;
    console.log(token);
    app.applicationValue(token);
});
//申请解答者 结束

//客服
$$(document).on("click", "a#custom", function () {
    var token = app.storage.get("userArr").token;
    var url = this.getAttribute("href").replace('#', '');
    app.customMess(token, url)
})

app.customMess = (function () {
    return function (token, url) {
        var param = {
            token: token
        };

        console.log(param)

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)

            if (data.errorCode == "0") {
                console.log(url);
                app.storage.set("customMsg", data)
                view.about.loadPage(url)
            } else {
                app.toast('客户繁忙，请稍后再试。')
            }
        }

        var messages = root.interFace.messages;
        app.doAjax(messages, 'post', param, succCallBack)
    }
})()

f7app.onPageInit('custom', function (page) {
    var token = app.storage.get("userArr").token;
    console.log(token);
    var wkitArr = app.storage.get("customMsg");
    console.log(wkitArr)

    WKIT.init({
        container: document.getElementById('J_demo'),
        width: 700,
        height: 500,
        appkey: wkitArr.appkey,
        uid: wkitArr.uid,
        credential: wkitArr.credential,
        touid: wkitArr.touid,
    });

    wkitArr = {};
});

//查询申请者前面还有多少人审核
app.checking = (function () {
    return function (token, level) {
        var param = {
            "token": token,
            "level": level
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            alert("您处于预申请状态，前面有" + data.data + "位用户正在排队审核，请耐心等待");
        };
        var checking = root.interFace.Checking
        return app.doAjax(checking, 'post', param, succCallBack)

    }
})()