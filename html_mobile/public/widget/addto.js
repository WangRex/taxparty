//投诉方法
app.checkboxes = (function() {
    return function(token, id, comp) {
        var param = {
            token: token,
            "need_id": id,
            "complaint": comp,
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                app.toast("投诉成功！");
                $$("#checkboxesBackClickBtn").click();
            } else {
                app.toast("投诉失败！");
            }
        }

        return app.doAjax(root.interFace.complaintFound, 'post', param, succCallBack)
    }
})();

//投诉
f7app.onPageInit('checkboxes', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'seek';


    var token = app.storage.get("userArr").token;
    console.log(page.url);
    console.log(page.query.need_id);
    var need_id = page.query.need_id;
    var services_id = page.query.services_id;
    var id, txt;
    $$('#label_radio').on("click", "input", function() {
        console.log(this);
        id = this.getAttribute('data-value');
        txt = this.value;
    });

    $$("#sub_post").on("click", function() {
        console.log("id：" + typeof id);
        console.log("txt：" + typeof txt)
        if (typeof id === 'undefined') {
            app.toast('请选择投诉内容！')
            return false;
        } else {
            app.checkboxes(token, need_id, txt);
        }
    });

});

//资金方法
app.capital2 = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

            var duanlist = $$("script#duanlist").html();
            var lesu = Template7.compile(duanlist);
            $$("#list_zx").html(lesu(data.data[0]));

        }
        return app.doAjax(root.interFace.getCapitalRecord, 'post', param, succCallBack)

    }
})();

/*资金*/
f7app.onPageInit('capital', function(page) {


    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token
    app.capital2(token);


});

/* nasyer所有待回答的问题方法*/
app.answerplus = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode == 0) {
                var ansquelisttpl = $$("script#answer_questions_list_tpl").html();
                var lesul = Template7.compile(ansquelisttpl);
                $$("#answer_questions_list").html(lesul(data.data));
                $$(".answerQuestionBtn").on("click", function() {
                    var askId = $$(this).attr("data-askid");
                    view.main.router.loadPage('index/answer.html?askId=' + askId + '');
                });
                $$('.ac_2').on('click', function() {
                    var ask = $$(this).attr("data-ask");

                    var buttons = [{
                        text: '<a onclick="app.weixin2()"><img src="../static/images/img/weixin.png" alt="微信" height="60"></a>' +
                            '<a onclick="app.Circlefriends2()"><img src="../static/images/img/pengyou.png" alt="朋友圈" height="60"></a> ' +
                            '<a><img src="../static/images/img/weibo.png" alt="微博" height="60"></a>',
                        bold: true

                    }, {
                        text: '取消',
                        color: 'red'
                    }, ];

                    f7app.actions(buttons);
                });

            } else {
                app.toast(data.errorMessage);
            }
        }

        return app.doAjax(root.interFace.getAllQuestions, 'post', param, succCallBack)
    }
})();

/* nasyer所有待回答的问题*/
f7app.onPageInit('answerplus', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.checkIdentityAnswer(token);
});


//调用微信接口
app.weixin2 = (function() {
    return function() {
        if (typeof(Wechat) !== 'undefined') {
            Wechat.share({
                message: {
                    title: "税聚解答",
                    description: "诚挚邀请你加入税聚，了解更多解答信息！",
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.SESSION // share to SESSION
            }, function() {
                app.toast("分享成功");
            }, function(reason) {
                app.toast("分享失败");
            });
        }
    }
})()


//调用分享朋友圈接口
app.Circlefriends2 = (function() {
    return function() {
        if (typeof(Wechat) !== 'undefined') {
            Wechat.share({
                message: {
                    title: "税聚解答",
                    description: "诚挚邀请你加入税聚，了解更多解答信息！",
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.Timeline // share to Timeline
            }, function() {
                app.toast("分享成功");
            }, function(reason) {
                app.toast("分享失败");
            });
        }
    }
})()

//回答身份验证ajax请求
app.checkIdentityAnswer = (function() {

    return function(token) {

        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data[0] === 0 || data.data[0] === 1) {
                app.answerplus(token);
            }
        };

        var checkIdentity = root.interFace.checkIdentity;
        return app.doAjax(checkIdentity, 'post', param, succCallBack)

    }

})();

/* 题库一览方法*/
app.personaluestions = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data)

            var perstik = $$("script#perstik").html();
            var lesu = Template7.compile(perstik);
            var perstikData = {};
            perstikData.total = data.data[1].total;
            perstikData.profit = data.data[1].profit.question_income_total;
            $$("#perbox").html(lesu(perstikData));

            var perstikl = $$("script#perstikxsa").html();
            var lesul = Template7.compile(perstikl);
            $$("#jshai").html(lesul(data.data[0]));

        }

        return app.doAjax(root.interFace.getAllBank, 'post', param, succCallBack)
    }
})();

/* 题库一览*/
f7app.onPageInit('personaluestions', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.personaluestions(token);
});

//获取来源列表
app.queryNatTexOffice = (function() {
    return function(token, succCallBack) {
        var param = {
            "token": token
        };

        return app.doAjax(root.interFace.queryNatTexOffice, 'post', param, succCallBack);
    }
})();

//获取来源列表
app.queryLocTexOffice = (function() {
    return function(token, father_code, succCallBack) {
        var param = {
            "token": token,
            "father_code": father_code
        };

        return app.doAjax(root.interFace.queryLocTexOffice, 'post', param, succCallBack);
    }
})();

//题库添加方法
app.uestionsaddto = (function() {
    return function(token, source, area, ask_attribute, tax_type, collection_procedure, business_type, ask_title, answer) {
        var param = {
            "token": token,
            "source": source,
            "area": area,
            "ask_attribute": ask_attribute,
            "tax_type": tax_type,
            "collection_procedure": collection_procedure,
            "business_type": business_type,
            "ask_title": ask_title,
            "answer": answer
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            app.toast(data.errorMessage);
            if (data.errorCode == 0) {
                $$("#source").val("");
                $$("#source").attr("data-id", "");
                $$("#area").val("");
                $$("#area").attr("data-id", "");
                $$("#ask_attribute").val("");
                $$("#ask_attribute").attr("data-id", "");
                $$("#tax_type").val("");
                $$("#tax_type").attr("data-id", "");
                $$("#collection_procedure").val("");
                $$("#collection_procedure").attr("data-id", "");
                $$("#business_type").val("");
                $$("#business_type").attr("data-id", "");
                $$("#ask_title").val("");
                $$("#answer").val("");
            }
            console.log(data);
        }

        return app.doAjax(root.interFace.insertBank, 'post', param, succCallBack);
    }
})();

//题库添加数据初始化
app.uestionsaddtoInit = (function() {
    return function(token) {
        // app.queryNatTexOffice(token);
        // app.queryLocTexOffice(token, 'D110000');

        //初始化来源
        var sourcePicker = new mui.PopPicker({
            layer: 2
        });

        $$("#source").on('click', function(event) {
            var self = this;
            app.queryNatTexOffice(token, function(data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function(i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                sourcePicker.setData(array);
                sourcePicker.show(function(items) {
                    var t = (items[0] || {}).text + " " + (items[1] || {}).text;
                    self.value = t;
                    self.setAttribute("data-id", items[1].value);
                });
            });
        }, false);

        sourcePicker.pickerElement[0].addEventListener('change', function(event) {
            var nextPickerElement = this.nextSibling;
            if (nextPickerElement && nextPickerElement.picker) {
                var eventData = event.detail || {};
                var preItem = eventData.item || {};
                console.log(eventData.item.value);
                var token = app.storage.get("userArr").token;
                app.queryLocTexOffice(token, eventData.item.value, function(data) {
                    var array = [];
                    var data = JSON.parse(data);
                    if (data) {
                        $$.each(data.data, function(i, e) {
                            var obj = {};
                            obj.value = e.tax_code;
                            obj.text = e.tax_name;
                            array.push(obj);
                        });
                    }
                    nextPickerElement.picker.setItems(array);
                });
            }
        }, false);

        //初始化适用地区
        var areaPicker3 = new mui.PopPicker({
            layer: 3
        });

        areaPicker3.setData(cityData3);
        $$("#area").on('click', function(event) {
            var self = this;
            areaPicker3.show(function(items) {
                var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[2].value);
            });
        }, false);
        /*
                areaPicker3.pickerElement[0].addEventListener('change', function(event) {
                    var nextPickerElement = this.nextSibling;
                    if (nextPickerElement && nextPickerElement.picker) {
                        var eventData = event.detail || {};
                        var preItem = eventData.item || {};
                        console.log(eventData.item.value);
                        if (app.queryCity) {
                            var token = app.storage.get("userArr").token;
                            app.queryCity(token, eventData.item.value, function(data) {
                                var array = [];
                                var data = JSON.parse(data);
                                if (data) {
                                    $$.each(data.data, function(i, e) {
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

                areaPicker3.pickerElement[1].addEventListener('change', function(event) {
                    var nextPickerElement = this.nextSibling;
                    if (nextPickerElement && nextPickerElement.picker) {
                        var eventData = event.detail || {};
                        var preItem = eventData.item || {};
                        if (app.queryCity) {
                            var token = app.storage.get("userArr").token;
                            app.queryCounty(token, eventData.item.value, function(data) {
                                var array = [];
                                var data = JSON.parse(data);
                                if (data) {
                                    $$.each(data.data, function(i, e) {
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

        //初始化问题属性
        var taxPicker01 = new mui.PopPicker({
            layer: 1
        });

        $$("#ask_attribute").on('click', function(event) {
            var self = this;
            app.queryTaxProperty(token, "01", function(data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function(i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                taxPicker01.setData(array);
                taxPicker01.show(function(items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data-id", items[0].value);
                });
            });
        }, false);

        //初始化税种类型
        var taxPicker02 = new mui.PopPicker({
            layer: 1
        });

        $$("#tax_type").on('click', function(event) {
            var self = this;
            app.queryTaxProperty(token, "02", function(data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function(i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                taxPicker02.setData(array);
                taxPicker02.show(function(items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data-id", items[0].value);
                });
            });
        }, false);

        //初始化征管程序
        var taxPicker03 = new mui.PopPicker({
            layer: 1
        });

        $$("#collection_procedure").on('click', function(event) {
            var self = this;
            app.queryTaxProperty(token, "03", function(data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function(i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                taxPicker03.setData(array);
                taxPicker03.show(function(items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data-id", items[0].value);
                });
            });
        }, false);

        //初始化业务类型
        var taxPicker04 = new mui.PopPicker({
            layer: 1
        });

        $$("#business_type").on('click', function(event) {
            var self = this;
            app.queryTaxProperty(token, "04", function(data) {
                var array = [];
                var data = JSON.parse(data);
                if (data) {
                    $$.each(data.data, function(i, e) {
                        var obj = {};
                        obj.value = e.tax_code;
                        obj.text = e.tax_name;
                        array.push(obj);
                    });
                }
                taxPicker04.setData(array);
                taxPicker04.show(function(items) {
                    var t = (items[0] || {}).text;
                    self.value = t;
                    self.setAttribute("data-id", items[0].value);
                });
            });
        }, false);
        $$("#addQuestionBtn").on("click", function() {
            var source = $$("#source").attr("data-id");
            var area = $$("#area").attr("data-id");
            var ask_attribute = $$("#ask_attribute").val();
            var tax_type = $$("#tax_type").attr("data-id");
            var collection_procedure = $$("#collection_procedure").attr("data-id");
            var business_type = $$("#business_type").attr("data-id");
            var ask_title = $$("#ask_title").val();
            var answer = $$("#answer").val();
            app.uestionsaddto(token, source, area, ask_attribute, tax_type, collection_procedure, business_type, ask_title, answer);
        });
        return "success";
    }
})();

//获取来源列表
app.queryTaxProperty = (function() {
    return function(token, father_id, succCallBack) {
        var param = {
            "token": token,
            "father_id": father_id
        };

        return app.doAjax(root.interFace.queryTaxProperty, 'post', param, succCallBack);
    }
})();


//题库添加
f7app.onPageInit('uestionsaddto', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.uestionsaddtoInit(token);
});

//个人发票列表方法
app.ticketlist = (function() {
    return function(token) {
        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);
            if (data.errorCode == '0') {
                if (!data) {
                    app.toast('数据异常！');
                } else if (!data.invoice || !data.invoice[0]) {
                    app.toast('暂无数据！');
                } else {
                    $$.each(data.invoice, function(i, e) {
                        e.express_name = e.express_name + ':';
                    })
                    var post_total = $$("script#post_total_tpl").html();
                    var lesul = Template7.compile(post_total);
                    $$("#post_total").html(lesul(data));

                    var post_list = $$("script#post_list_tpl").html();
                    var lesul = Template7.compile(post_list);
                    $$("#post_list").html(lesul(data.invoice));

                    $$("#post_list").find("span.sure").on("click", function() {
                        var invoiceid = $$(this).attr("data-invoiceid");
                        console.log(invoiceid);
                        var token = app.storage.get("userArr").token;
                        console.log(token);
                        app.list_fang(token, invoiceid);
                    });
                    console.log(data);
                }
            } else {
                app.toast('系统异常！');
            }


        };

        return app.doAjax(root.interFace.getAllInvoice, 'post', param, succCallBack);
    }
})();

//确认发票接受方法
app.list_fang = (function() {
    return function(token, uisi) {
        var param = {
            "token": token,
            "invoice_id": uisi
        };

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);
            if (data.errorCode) {
                $$("#status" + uisi).attr("class", "yellow").html("达");
                $$("#buttonSure" + uisi).attr("class", "").html("交易成功");
            }
            console.log(data);
        };

        return app.doAjax(root.interFace.submitReceipt, 'post', param, succCallBack);
    }
})();

//个人发票列表
f7app.onPageInit('ticketlist', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.ticketlist(token);
    $$("#list_sd").on("click", function() {
        var uisi = 1;
        var token = app.storage.get("userArr").token;
        console.log(token);
        app.list_fang(token, uisi);
    })

});
//可开发票金额
f7app.onPageInit('ticket', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);
    app.queryUserInvoiceCount(token);
});

app.queryUserInvoiceCount = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            var cash = data.data[0].cash;
            cash = cash.toFixed(2);
            $$("#userInvoiceCount").html(cash);
            $$("#money").on("change", function() {
                var token = app.storage.get("userArr").token;
                console.log(token);
                var money = $$(this).val();
                if (Number(money) > Number(cash)) {
                    app.toast('本次开发票金额不能大于可开发票总金额！');
                    $$("#money").val('');
                }
            });
            console.log(data);
        }

        return app.doAjax(root.interFace.queryUserInvoiceCount, 'post', param, succCallBack)
    }
})();

//申请发票方法
app.ticket = (function() {
    return function(token, money, rise, Distinguish, content, address, Addressee, Telephone, kuai) {
        var param = {
            "token": token,
            "invoice_amount": money,
            "invoice_header": rise,
            "taxpayer_code": Distinguish,
            "invoice_context": content,
            "express_address": address,
            "recipient": Addressee,
            "telephone": Telephone,
            "express_fee": kuai
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            app.toast(data.errorMessage);
            console.log(data);
            if (data.errorCode == 0) {
                $$("#money").val("");
                $$("#rise").val("");
                $$("#Distinguish").val("");
                $$("#content").val("");
                $$("#address").val("");
                $$("#Addressee").val("");
                $$("#Telephone").val("");
                app.queryUserInvoiceCount(token);
            }
        }

        return app.doAjax(root.interFace.saveInvoiceInfo, 'post', param, succCallBack)
    }
})();
//申请发票
f7app.onPageInit('ticket', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';


    var token = app.storage.get("userArr").token;
    console.log(token);
    $$("#tick").on("click", function() {
        var flag = true;
        var money = $$("#money").val();
        if (!money) {
            flag = false;
            app.toast("请输入金额！");
        } else if (money) {
            var reg = new RegExp("^[0-9]*$");
            if (!reg.test(money)) {
                flag = false;
                app.toast("请输入数字!");
            }
        }
        var rise = $$("#rise").val();
        if (!rise) {
            flag = false;
            app.toast("请输入发票抬头！");
        }
        var Distinguish = $$("#Distinguish").val();
        if (!Distinguish) {
            flag = false;
            app.toast("请输入纳税人识别号！");
        }
        var content = $$("#content").val();
        if (!content) {
            flag = false;
            app.toast("请输入发票内容！");
        }
        var address = $$("#address").val();
        if (!address) {
            flag = false;
            app.toast("请输入快递地址！");
        }
        var Addressee = $$("#Addressee").val();
        if (!Addressee) {
            flag = false;
            app.toast("请输入收件人！");
        }
        var Telephone = $$("#Telephone").val();
        if (!Telephone) {
            flag = false;
            app.toast("请输入联系电话！");
        } else if (Telephone) {
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!myreg.test(Telephone)) {
                app.toast("请输入有效的手机号码！");
                flag = false;
            }
        }
        var kuai = 10;
        console.log(money, rise, Distinguish, content, address, Addressee, Telephone, kuai);
        if (flag) {
            app.ticket(token, money, rise, Distinguish, content, address, Addressee, Telephone, kuai);
        }

    });
});

//专家一览方法
app.expert = (function() {
    return function(token, region, name, Expertise) {
        var param = {
            "token": token,
            "region_code": region,
            "realName": name,
            "taxproperty_code": Expertise
        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            var expertList = $$("script#expert_list_tpl").html();
            var lesul = Template7.compile(expertList);
            var result = data.data;
            for (var i = 0; i < result.length; i++) {
                var expert = result[i];
                expert.cpa = false;
                expert.a_cpa = false;
                expert.cpv = false;
                expert.cta = false;
                expert.bar = false;
                expert.cpa_g = false;
                expert.other = false;
                var major = expert.major;
                if (major) {
                    var majorArray = major.split(',');
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

            }
            $$("#expertList").html(lesul(result));

            // app.queryProvince(token);
            // app.queryCity(token, '110000');
            // app.queryCounty(token, '110000');

            // app.queryPersonSkills(token);

            /* ===== Mui PopPicker ===== */
            mui.init();
            //选择服务地点
            var expertCityPicker3 = new mui.PopPicker({
                layer: 3
            });
            var skills2 = new mui.PopPicker({
                layer: 2
            });

            $$("#region").on('click', function(event) {
                var self = this;
                app.queryProvince(token, function(data) {
                    var array = [];
                    var data = JSON.parse(data);
                    if (data) {
                        $$.each(data.data, function(i, e) {
                            var obj = {};
                            obj.value = e.region_code;
                            obj.text = e.region_name;
                            array.push(obj);
                        });
                    }
                    expertCityPicker3.setData(array);
                    expertCityPicker3.show(function(items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                    });
                });
            }, false);

            expertCityPicker3.pickerElement[0].addEventListener('change', function(event) {
                var nextPickerElement = this.nextSibling;
                if (nextPickerElement && nextPickerElement.picker) {
                    var eventData = event.detail || {};
                    var preItem = eventData.item || {};
                    console.log(eventData.item.value);
                    var token = app.storage.get("userArr").token;
                    app.queryCity(token, eventData.item.value, function(data) {
                        var array = [];
                        var data = JSON.parse(data);
                        if (data) {
                            $$.each(data.data, function(i, e) {
                                var obj = {};
                                obj.value = e.region_code;
                                obj.text = e.region_name;
                                array.push(obj);
                            });
                        }
                        nextPickerElement.picker.setItems(array);
                    });
                }

                expertCityPicker3.pickerElement[1].addEventListener('change', function(event) {
                    var nextPickerElement = this.nextSibling;
                    if (nextPickerElement && nextPickerElement.picker) {
                        var eventData = event.detail || {};
                        var preItem = eventData.item || {};
                        if (eventData.item) {
                            console.log(eventData.item.value);
                            var token = app.storage.get("userArr").token;
                            app.queryCounty(token, eventData.item.value, function(data) {
                                var array = [];
                                var data = JSON.parse(data);
                                if (data) {
                                    $$.each(data.data, function(i, e) {
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
            }, false);

            $$("#Expertise").on('click', function(event) {
                var self = this;
                app.queryPersonSkills(token, function(data) {
                    var array = [];
                    var data = JSON.parse(data);
                    if (data) {
                        $$.each(data.data, function(i, e) {
                            var obj = {};
                            obj.value = e.tax_code;
                            obj.text = e.tax_name;
                            array.push(obj);
                        });
                    }
                    skills2.setData(array);
                    skills2.show(function(items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[1].value);
                    });
                });
            }, false);

            skills2.pickerElement[0].addEventListener('change', function(event) {
                var nextPickerElement = this.nextSibling;
                if (nextPickerElement && nextPickerElement.picker) {
                    var eventData = event.detail || {};
                    var preItem = eventData.item || {};
                    console.log(eventData.item.value);
                    var token = app.storage.get("userArr").token;
                    app.queryDetailSkills(token, eventData.item.value, function(data) {
                        var array = [];
                        var data = JSON.parse(data);
                        if (data) {
                            $$.each(data.data, function(i, e) {
                                var obj = {};
                                obj.value = e.tax_code;
                                obj.text = e.tax_name;
                                array.push(obj);
                            });
                        }
                        nextPickerElement.picker.setItems(array);
                    });
                }
            }, false);

            $$("#expertList").find("li").on("click", function() {
                var serviceId = $$(this).attr("data-serviceid");
                console.log(serviceId);
                var token = app.storage.get("userArr").token;
                console.log(token);
                app.getServiceInfoByUID(token, serviceId);
            });
            console.log(data);
        }

        return app.doAjax(root.interFace.getAllexpert, 'post', param, succCallBack);
    }
})();

//获取省份列表
app.queryProvince = (function() {
    return function(token, succCallBack) {
        var param = {
            "token": token
        };

        return app.doAjax(root.interFace.queryProvince, 'post', param, succCallBack);
    }
})();

//获取市列表
app.queryCity = (function() {
    return function(token, region_code, succCallBack) {
        var param = {
            "token": token,
            "region_code": region_code
        };

        return app.doAjax(root.interFace.queryCity, 'post', param, succCallBack);
    }
})();

//获取区列表
app.queryCounty = (function() {
    return function(token, region_code, succCallBack) {
        var param = {
            "token": token,
            "region_code": region_code
        };

        return app.doAjax(root.interFace.queryCounty, 'post', param, succCallBack);
    }
})();

//获取业务专长一级列表
app.queryPersonSkills = (function() {
    return function(token, succCallBack) {
        var param = {
            "token": token
        };

        return app.doAjax(root.interFace.queryPersonSkills, 'post', param, succCallBack);
    }
})();

//获取业务专长二级列表
app.queryDetailSkills = (function() {
    return function(token, tax_code, succCallBack) {
        var param = {
            "token": token,
            "tax_code": tax_code
        };

        return app.doAjax(root.interFace.queryDetailSkills, 'post', param, succCallBack);
    }
})();

//专家一览
f7app.onPageInit('expert', function(page) {


    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var region = "";
    var name = "";
    var Expertise = "";
    var token = app.storage.get("userArr").token;
    app.expert(token, region, name, Expertise);

    $$("#expertcike").on("click", function() {
        var region = $$("#region").attr("data-id") || "";
        var name = $$("#name").val();
        var Expertise = $$("#Expertise").attr("data-id") || "";
        var token = app.storage.get("userArr").token;
        app.expert(token, region, name, Expertise);
    });
});

//问答-咨询方法
app.Consultation = (function() {
    return function(token) {
        var param = {
            "token": token

        }
        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data);
            var perstik = $$("script#tationzans").html();
            var lesu = Template7.compile(perstik);
            $$("#problem-bj").html(lesu(data));

            var perstikl = $$("script#tationzans_lsit").html();
            var lesul = Template7.compile(perstikl);
            $$("#tation_chlsit").html(lesul(data.data));

        }

        return app.doAjax(root.interFace.getAllAsks, 'post', param, succCallBack);
    }
})();

//问答-解答方法
app.Answer = (function() {
    return function(token) {
        var param = {
            "token": token

        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);
            console.log(data);
            var perstik = $$("script#tationzans_2").html();
            var lesu = Template7.compile(perstik);
            $$("#problem-bj_2").html(lesu(data));

            var perstikl = $$("script#tationzans_lsit_2").html();
            var lesul = Template7.compile(perstikl);
            $$("#tation_chlsit_2").html(lesul(data.data));

        }

        return app.doAjax(root.interFace.getAllAnswers, 'post', param, succCallBack);
    }
})();

//问答-求助方法
app.Seekhelp = (function() {

    return function(token) {

        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            var unselectedOrder = [];
            var selectedOrder = [];

            $$.each(data.data, function(i, e) {

                e["service_date"] = e.helpInfo.service_date;
                e["region_name"] = e.helpInfo.region_name;
                e["offer"] = e.helpInfo.offer;
                e["tof_stt"] = e.helpInfo.tof_stt;
                if (e.helpInfo.tof_stt == '0') {
                    e["status"] = '已完成';
                    e["_before"] = 'aft';
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
                    var major = e.major;
                    if (major) {
                        var majorArray = major.split(',');
                        for (var j = 0; j < majorArray.length; j++) {
                            if (majorArray[j] == '注册会计师') {
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
                    e["avatar"] = e.service.path_url;
                    e["phone_number"] = e.service.phone_number;
                    e["real_name"] = e.service.real_name;
                    e["major"] = e.service.major;
                    e["help_user_id"] = e.helpInfo.help_user_id;
                    e["need_id"] = e.helpInfo.help_id;
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
                $$("#seek_help_container_unselected").html(tpl(unselectedOrder));
            }
            if (selectedOrder.length > 0) {
                var order_tpl = $$('script#seek_order_list_tpl').html();
                var tpl = Template7.compile(order_tpl);
                $$("#seek_help_container_selected").html(tpl(selectedOrder))
            }
        };

        var getAllFounds = root.interFace.getAllFounds;
        return app.doAjax(getAllFounds, 'post', param, succCallBack);

    }
})();


//援助列表ajax请求
app.help = (function() {

    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == 0) {
                var seek_help_title = $$('script#help_title_tpl').html();
                var tpl = Template7.compile(seek_help_title);
                var obj = {};
                obj.helpTotal = data.servingTotal;
                obj.count = data.count;
                obj.completeTotal = data.completeTotal;
                $$(".help_problem-bj").html(tpl(obj));

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
                $$("#help_container_card_list").html(tpl(data.data));
            } else {
                app.toast(data.errorMessage || "出现异常！");
            }

            console.log(data);
        }

        return app.doAjax(root.interFace.queryServiceList, 'post', param, succCallBack);
    }
})();

//求助标题
app.queryHelpListInfo = (function() {

    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);


            var seek_help_title = $$('script#seek_help_title_tpl').html();
            var tpl = Template7.compile(seek_help_title);
            $$(".seek_help_problem-bj").html(tpl(data));

            var unselectedOrder = [];
            var selectedOrder = [];

            $$.each(data.data, function(i, e) {

                e["service_date"] = e.helpInfo.service_date;
                e["region_name"] = e.helpInfo.region_name;
                e["offer"] = e.helpInfo.offer;
                e["tof_stt"] = e.helpInfo.tof_stt;
                if (e.helpInfo.tof_stt == '0') {
                    e["status"] = '已完成';
                    e["_before"] = 'aft';
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
                    var major = e.major;
                    if (major) {
                        var majorArray = major.split(',');
                        for (var j = 0; j < majorArray.length; j++) {
                            if (majorArray[j] == '注册会计师') {
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
                    e["avatar"] = e.service.path_url;
                    e["phone_number"] = e.service.phone_number;
                    e["real_name"] = e.service.real_name;
                    e["major"] = e.service.major;
                    e["help_user_id"] = e.helpInfo.help_user_id;
                    e["need_id"] = e.helpInfo.help_id;
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
                $$("#seek_help_container_unselected").html(tpl(unselectedOrder));
            }
            if (selectedOrder.length > 0) {
                var order_tpl = $$('script#seek_order_list_tpl').html();
                var tpl = Template7.compile(order_tpl);
                $$("#seek_help_container_selected").html(tpl(selectedOrder))
            }

            console.log(data);
        }

        var queryHelpListInfo = root.interFace.queryHelpListInfo;

        return app.doAjax(queryHelpListInfo, 'post', param, succCallBack);
    }
})();

//问答
f7app.onPageInit('problem', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    console.log("咨询");
    var token = app.storage.get("userArr").token;
    app.Consultation(token);

    $$("#tab1").on("show", function() {
        console.log("咨询");
        var token = app.storage.get("userArr").token;
        app.Consultation(token);
    });

    $$("#tab2").on("show", function() {

        console.log("解答");
        var token = app.storage.get("userArr").token;
        app.Answer(token);
    })

    $$("#tab3").on("show", function() {

        var swiper = new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });


        console.log("求助");
        var token = app.storage.get("userArr").token;
        // app.Seekhelp(token);
        app.queryHelpListInfo(token);
    })


    $$("#tab4").on("show", function() {

        console.log("求援");
        var token = app.storage.get("userArr").token;
        app.help(token);
    })

});

//重新提交邀请码方法
app.againSubmit = (function() {
        return function(token, value) {
            var param = {
                "token": token,
                "invite_errorCode": value
            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.submitInvierrorCode, 'post', param, succCallBack)
        }
    })()
    //邀请方法
app.Eject = (function(title, w, h) {
    return function(token) {
        var param = {
            "token": token

        }
        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);
            console.log(data)
            if (!data.errorCode == '0') {
                console.log("到了")

                f7app.prompt('您的邀请码', function(value) {
                    f7app.alert('您输入的是"' + value + "请确认");
                    var token = app.storage.get("userArr").token;
                    app.againSubmit(token, value)
                });


            }

        }

        return app.doAjax(root.interFace.checkInvitation, 'post', param, succCallBack)
    }
})()

//邀请
$$("#about").on("show", function() {

    /* $$("#Eject").on("click",function(){
    var creatediv= function(title,w,h){
        var pup_box=$$('<div></div>');        //创建一个父div
        //       pup_box.attr('id','parent');        //给父div设置id
        pup_box.addClass('duan_pup_box');    //添加css样式
        var content_box=$$('<div></div>');        //创建一个子div
//        content_box.attr('id','child');            //给子div设置id
        content_box.addClass('duan_content_box');    //添加css样式
        var title_h=$$('<h1></h1>');             //创建标题
        title_h.addClass('duan_title_h');
        title_h.html(title);                    //添加标题内容
        content_box.append(title_h);

        var content_div=$$('<div></div>');             //创建内容div
        content_div.addClass('duan_content');
        content_div.html('内容');
        content_box.append(content_div);

        var btn_p=$$('<p></p>');         //按钮盒子div
        btn_p.addClass('duan_btn_p');
        btn_p.html('<span class="cancel_btn">取消</span><span class="ensure">确定</span>');  //按钮
        content_box.append(btn_p);
        content_box.appendTo(pup_box);        //将子div添加到父div中
        pup_box.appendTo($$('#about'));            //将父div添加到body中

        content_box.css({width:w,height:h,marginTop:-h/2,marginLeft:-w/2});
    }*/

    $$('#Eject').on('click', function() {
        var token = app.storage.get("userArr").token;
        app.Eject(token)

    });

})

//
// //提现的初始页面方法
// app.withdrawals = (function () {
//         return function (token) {
//             var param = {
//                 "token": token
//             }
//
//             var succCallBack = function (data, status, response) {
//                 var data = JSON.parse(data);
//
//                 console.log(data)
//             }
//
//             return app.doAjax(root.interFace.findTotalProfit, 'post', param, succCallBack)
//         }
//     })()
//     //提现申请方法
// app.withApply = (function () {
//         return function (token, account, cash) {
//             var param = {
//                 "token": token,
//                 "amt": "101",
//                 "payModel": "100",
//                 "rccAcc": "12345678"
//             }
//             var succCallBack = function (data, status, response) {
//                 var data = JSON.parse(data);
//
//                 console.log(data)
//             }
//
//             return app.doAjax(root.interFace.drawMoney, 'post', param, succCallBack)
//         }
//     })()
//     //提现的初始页面
// f7app.onPageInit('withdrawals', function (page) {
//     var token = app.storage.get("userArr").token;
//     console.log(token);
//     app.withdrawals(token);
//     $$("#Applydi").on("click", function () {
//         var token = app.storage.get("userArr").token;
//         app.withApply(token)
//
//     })
// });

//提问方法
app.asklsit = (function() {
    return function(token, param) {

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.errorCode == 0) {

                var ask = data.data.ask;
                var obj = {};
                obj.ask_time = ask.ask_dateTime;
                obj.ask_bureau = ask.region_name;
                obj.cost = ask.cost;
                obj.askContext = ask.questions;
                var detailsr_tpl = $$('script#question_solve').html();
                var tpl = Template7.compile(detailsr_tpl);
                $$("#question_result_1").html(tpl(obj));

                if (data.data.answer.length != 0) {
                    var detailsr_tpl = $$('script#question_solve_list').html();
                    var tpl = Template7.compile(detailsr_tpl);
                    $$("#question_result_2").html(tpl(data.data.answer));
                } else {
                    app.toast(data.errorMessage);
                }

            } else {
                app.toast("出现异常！");
            }
        }

        return app.doAjax(root.interFace.ask, 'post', param, succCallBack);
    }
})();

//选中大咖大赏金额回传
app.getBigKaPrice = (function(page) {
    return function(page) {
        var bigKaPrice = {
            bigKaPrice: page.query.bigKaPrice ? page.query.bigKaPrice : 0
        };
        var params = [];
        params.push(bigKaPrice);
        var userType = $$("#mister_p").attr("data-userType");
        if (userType != "1") {
            var askList = $$("script#lowest_amt_sum").html();
            var tpl = Template7.compile(askList);
            $$('#lowest_amt_sum').html(tpl(params));
        }
        if (bigKaPrice.bigKaPrice == 0 && page.query.expert_id) {
            $$("#lowest_amt_sum").attr("style", "display:none;");
            $$("#reward_money").attr("style", "");
            $$("#reward_money").attr("data-required", "true");
        } else {
            $$("#lowest_amt_sum").attr("style", "");
            $$("#reward_money").attr("style", "display:none;");
            $$("#reward_money").attr("data-required", "false");
        }
    }
})();

//提问提交后页面数据加载
f7app.onPageInit('questionResult', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    console.log(token);

    var param = {
        "token": token,
        "ask_type": page.query.ask_type,

        "expert_id": page.query.expert_id,
        "region": page.query.region || "",
        "propertys": page.query.propertys || "",
        "types": page.query.types || "",
        "procedures": page.query.procedures || "",
        "businesses": page.query.businesses || "",

        "questions": page.query.questions,
        "cost": page.query.cost || 0,
        "post_type": page.query.post_type,
        "payType": page.query.payType,

    };

    if (page.query.flag == "about") {
        $$("#selectLocalTaxBureau").attr("href", "javascript:void(0);");
        $$("#questions_result-bj").attr("href", "javascript:void(0);");
    }

    app.asklsit(token, param);
});

//提问提交后页面数据加载
f7app.onPageInit('tax_bureau', function(page) {

    var token = app.storage.get("userArr").token;

    var demoPicker2 = new mui.PopPicker({
        layer: 2
    });


    $$("#menu_list_1").on('click', function(event) {
        var self = this;
        demoPicker2.setData(taxData1);
        demoPicker2.show(function(items) {
            var t1 = items[0].text;
            var t2 = items[1].text;

            $$("#input_up_data").val(t1 + t2);
            $$("#input_up_data").attr("data-value", items[1].value);
        });
    }, false);

    $$("#menu_list_2").on('click', function(event) {
        var self = this;
        demoPicker2.setData(taxData2);
        demoPicker2.show(function(items) {
            var t1 = items[0].text;
            var t2 = items[1].text;

            $$("#input_up_data").val(t1 + t2);
            $$("#input_up_data").attr("data-value", items[1].value);
        });
    }, false);

    $$("#menu_list_3").on('click', function(event) {
        var self = this;
        demoPicker2.setData(taxData3);
        demoPicker2.show(function(items) {
            var t1 = items[0].text;
            var t2 = items[1].text;

            $$("#input_up_data").val(t1 + t2);
            $$("#input_up_data").attr("data-value", items[1].value);
        });
    }, false);

    $$("#doResult").on("click", function() {
        app.getTaxBureauPrice(token, $$("#input_up_data").attr("data-value"), function(data) {
            var data = JSON.parse(data);
            console.log(data);
            var cost = 0;
            if (data.errorCode == "0") {
                cost = Number(data.data.price);
            }
            view.main.loadPage('index/ask.html?taxbureau=' + $$("#input_up_data").attr("data-value") + '&cost=' + cost);
        });

    });

});

//选中当地税局金额回传
app.getTaxBureauPrice = (function() {

    return function(token, region_code, succCallBack) {
        var param = {
            "token": token,
            "code": region_code
        }

        return app.doAjax(root.interFace.getTaxBureauPrice, 'post', param, succCallBack);
    }
})();

//提问
f7app.onPageInit('asklsit', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var token = app.storage.get("userArr").token;
    app.getBigKaPrice(page);

    var ask_type = "0";
    var ask_region = $$('#ask_region').attr("data-id") || "";
    var cost = 0;

    if (page.query.expert_id) {
        $$("#selectTaxBureau").attr("href", "javascript:void(0);");
        ask_type = "1";
    }

    var enableAskRegion = true;

    if (page.query.taxbureau && page.query.taxbureau != "null") {
        enableAskRegion = false;
        $$("#askBigShotBtn").attr("href", "javascript:void(0);");
        ask_type = "1";
        ask_region = page.query.taxbureau;
        cost = page.query.cost;
        if (!cost || cost == 0) {
            $$("#lowest_amt_sum").attr("style", "display:none;");
            $$("#reward_money").attr("style", "");
            $$("#reward_money").attr("data-required", "true");
        } else {
            $$("#lowest_amt_sum").html(cost);
        }
    }

    /* ===== Mui PopPicker ===== */
    mui.init();

    //初始化地区
    var cityPicker3 = new mui.PopPicker({
        layer: 3
    });

    cityPicker3.setData(cityData3);
    if (enableAskRegion) {
        $$("#ask_region").on('click', function(event) {
            var self = this;
            cityPicker3.show(function(items) {
                var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[2].value);
            });
        }, false);
    } else {
        $$("#ask_region").on('click', function(event) {
            app.toast("您已经选择过税局了，不需要选择地区了！");
        }, false);
    }
    //初始化问题属性
    var taxPicker01 = new mui.PopPicker({
        layer: 1
    });

    $$("#ask_ask_attribute").on('click', function(event) {

        var self = this;
        app.queryTaxProperty(token, "01", function(data) {
            var array = [];
            var data = JSON.parse(data);
            if (data) {
                $$.each(data.data, function(i, e) {
                    var obj = {};
                    obj.value = e.tax_code;
                    obj.text = e.tax_name;
                    array.push(obj);
                });
            }
            taxPicker01.setData(array);
            taxPicker01.show(function(items) {
                var t = (items[0] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[0].value);
            });
        });
    }, false);

    //初始化税种类型
    var taxPicker02 = new mui.PopPicker({
        layer: 1
    });

    $$("#ask_tax_type").on('click', function(event) {
        var self = this;
        app.queryTaxProperty(token, "02", function(data) {
            var array = [];
            var data = JSON.parse(data);
            if (data) {
                $$.each(data.data, function(i, e) {
                    var obj = {};
                    obj.value = e.tax_code;
                    obj.text = e.tax_name;
                    array.push(obj);
                });
            }
            taxPicker02.setData(array);
            taxPicker02.show(function(items) {
                var t = (items[0] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[0].value);
            });
        });
    }, false);

    //初始化征管程序
    var taxPicker03 = new mui.PopPicker({
        layer: 1
    });

    $$("#ask_collection_procedure").on('click', function(event) {
        var self = this;
        app.queryTaxProperty(token, "03", function(data) {
            var array = [];
            var data = JSON.parse(data);
            if (data) {
                $$.each(data.data, function(i, e) {
                    var obj = {};
                    obj.value = e.tax_code;
                    obj.text = e.tax_name;
                    array.push(obj);
                });
            }
            taxPicker03.setData(array);
            taxPicker03.show(function(items) {
                var t = (items[0] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[0].value);
            });
        });
    }, false);

    //初始化业务类型
    var taxPicker04 = new mui.PopPicker({
        layer: 1
    });

    $$("#ask_business_type").on('click', function(event) {
        var self = this;
        app.queryTaxProperty(token, "04", function(data) {
            var array = [];
            var data = JSON.parse(data);
            if (data) {
                $$.each(data.data, function(i, e) {
                    var obj = {};
                    obj.value = e.tax_code;
                    obj.text = e.tax_name;
                    array.push(obj);
                });
            }
            taxPicker04.setData(array);
            taxPicker04.show(function(items) {
                var t = (items[0] || {}).text;
                self.value = t;
                self.setAttribute("data-id", items[0].value);
            });
        });
    }, false);

    app.getUserBalance(token);

    var flag = false;

    $$("#questions").keyup(function() {
        if ($$(this).val()) {
            $$("#askdi").attr("style", "width:100%;");
            flag = true;
        } else {
            $$("#askdi").attr("style", "width:100%;background-color: #e3e3e3 !important;");
            flag = false;
        }
    });


    $$("#askdi").on("click", function() {
        var post_type = $$("#mister_p").attr("data-userType");
        var questions = $$("#questions").val();

        if (page.query.expert_id) {

            var reward_money = $$("#reward_money").attr("data-required");

            if (reward_money == "true" && !$$("#reward_money").val()) {
                flag = false;
                app.toast("您已经选择了大咖，请输入金额！");
            } else {
                cost = Number($$("#reward_money").val());
                flag = true;
            }
        }

        if (page.query.cost || page.query.cost == 0) {

            var reward_money = $$("#reward_money").attr("data-required");

            if (reward_money == "true" && !$$("#reward_money").val()) {
                flag = false;
                app.toast("您已经选择了未签约税局，请输入金额！");
            } else {
                cost = Number($$("#reward_money").val());
                flag = true;
            }
        }

        var lowest_amt_sum = $$('#lowest_amt_sum');
        if (!isNaN(lowest_amt_sum)) {
            cost = Number(lowest_amt_sum.text());
        }

        $$(this).attr("data-ask_type", ask_type);
        $$(this).attr("data-ask_region", ask_region);
        $$(this).attr("data-cost", cost);
        $$(this).attr("data-expert_id", page.query.expert_id || "");

        var param = {
            'ask_region': ask_region,
            'ask_ask_attribute': $$('#ask_ask_attribute').attr("data-id") || "",
            'ask_tax_type': $$('#ask_tax_type').attr("data-id") || "",
            'ask_collection_procedure': $$('#ask_collection_procedure').attr("data-id") || "",
            'ask_business_type': $$('#ask_business_type').attr("data-id") || "",
            'expert_id': page.query.expert_id || "",
            'cost': cost
        }

        if (flag) {
            if (page.query.flag == "about") {
                view.about.loadPage('index/askResult.html?ask_type=' + ask_type + '&expert_id=' + param.expert_id + '&region=' + param.ask_region + '&propertys=' + param.ask_ask_attribute + '&types=' + param.ask_tax_type + '&procedures=' + param.ask_collection_procedure + '&businesses=' + param.ask_business_type + '&questions=' + questions + '&cost=' + param.cost + '&post_type=' + post_type + '&flag=about');
            } else {
                app.askPayTypeInit(token);
                // view.main.loadPage('index/askResult.html?ask_type=' + ask_type + '&expert_id=' + param.expert_id + '&region=' + param.ask_region + '&propertys=' + param.ask_ask_attribute + '&types=' + param.ask_tax_type + '&procedures=' + param.ask_collection_procedure + '&businesses=' + param.ask_business_type + '&questions=' + questions + '&cost=' + param.cost + '&post_type=' + post_type);
            }

        } else {
            app.toast("请输入您的问题！");
        }


    })
});

//ASK支付页面选择
app.askPayTypeInit = (function() {
    return function(token) {
        myApp.modal({
            title: '请选择支付方式',
            text: '<div id="pay-model">' +
                '<div>' +
                '<a id="pay-ye" onclick="app.askpaymodel(1)"><img src="../static/images/img/icond_ask_balance.png" alt="余额" height="50"></a>' +
                '<a id="pay-czk" onclick="app.askpaymodel(2)"><img src="../static/images/img/icond_ask_card.png" alt="储值卡" height="50"></a>' +
                '<a id="pay-zfb" onclick="app.askpaymodel(3)"><img src="../static/images/img/icond_ask_ali.png" alt="支付宝" height="50"></a>' +
                '<a id="pay-wx" onclick="app.askpaymodel(4)"><img src="../static/images/img/icond_ask_wechat.png" alt="微信" height="50"></a>' +
                '</div>' +
                '<div><p>余额&nbsp;&nbsp;&nbsp;&nbsp;储值卡&nbsp;&nbsp;&nbsp;&nbsp;支付宝&nbsp;&nbsp;&nbsp;&nbsp;微信</p></div>' +
                '</div>',
            buttons: [{
                text: '取消',
                bold: true,
                close: true
            }]
        });
    }
})();

//askpaymodel的方法
app.askpaymodel = (function() {
    return function(payModel) {

        var token = app.storage.get("userArr").token;
        var ask_type = $$("#askdi").attr("data-ask_type");
        var ask_region = $$("#askdi").attr("data-ask_region") || "";
        var ask_ask_attribute = $$('#ask_ask_attribute').attr("data-id") || "";
        var ask_tax_type = $$('#ask_tax_type').attr("data-id") || "";
        var ask_collection_procedure = $$('#ask_collection_procedure').attr("data-id") || "";
        var ask_business_type = $$('#ask_business_type').attr("data-id") || "";
        var cost = $$("#askdi").attr("data-cost") || 0;
        var expert_id = $$("#askdi").attr("data-expert_id") || "";
        var post_type = $$("#mister_p").attr("data-userType");
        var questions = $$("#questions").val();

        f7app.closeModal();
        //余额支付
        view.main.loadPage('index/askResult.html?ask_type=' + ask_type + '&expert_id=' + expert_id + '&region=' + ask_region + '&propertys=' + ask_ask_attribute + '&types=' + ask_tax_type + '&procedures=' + ask_collection_procedure + '&businesses=' + ask_business_type + '&questions=' + questions + '&cost=' + cost + '&post_type=' + post_type + '&payModel=' + payModel.toString());
    }
})();

//获取储蓄卡余额
app.getUserBalance = (function() {

    return function(token) {
        var param = {
            "token": token
        }
        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            if (data.errorCode == 0) {
                var userInfo = data.data[0];
                $$("#total_money").html(Number(userInfo.balance).toFixed(2));
                if (userInfo.userType == "1") {
                    $$("#mister_p").html(userInfo.userTypeName);
                    $$("#mister_p").attr("data-userType", userInfo.userType);
                }
            } else if (data.errorCode == 100) {
                app.toast(data.errorMessage || "请重新登录！");
            } else {
                app.toast(data.errorMessage || "请求储蓄卡余额出现异常！");
            }
            console.log(data);
        }

        return app.doAjax(root.interFace.getUserBalance, 'post', param, succCallBack);
    }
})();

//提问大咖列表加载
app.askBigKaList = (function(token) {

    return function(token) {
        var param = {
            "token": token,
            "taxproperty_code": "",
            "region_code": "",
            "realName": ""
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            if (data.data.length > 0) {

                var result = data.data;
                for (var i = 0; i < result.length; i++) {
                    var expert = result[i];
                    expert.cpa = false;
                    expert.a_cpa = false;
                    expert.cpv = false;
                    expert.cta = false;
                    expert.bar = false;
                    expert.cpa_g = false;
                    expert.other = false;
                    var major = expert.major;
                    if (major) {
                        var majorArray = major.split(',');
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

                }
                var askList = $$("script#askBigKaList").html();
                var tpl = Template7.compile(askList);
                $$("#askBigKaList").html(tpl(result));

            }

            console.log(data);
        }

        return app.doAjax(root.interFace.askBigKa, 'post', param, succCallBack);
    }
})();

//提问大咖
f7app.onPageInit('services', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    var userArr = app.storage.get("userArr");

    if (userArr == null) {
        return false
    }

    var token = userArr.token;
    app.askBigKaList(token);
    $$("#askBigKaConfirm").on("click", function() {

        var checks = $$("[name=my-checkbox]");
        var checksArr = [];
        var bigKaPrice = 0;
        for (var i = 0; i < checks.length; i++) {
            if (checks[i].checked) {
                checksArr.push(checks[i].value);
                bigKaPrice += Number(checks[i].id);
            }
        }

        if (checksArr.length > 0) {
            view.main.loadPage('index/ask.html?bigKaPrice=' + bigKaPrice + '&expert_id=' + checksArr.toString());
            //view.main.back();
        } else {
            f7app.alert('请至少选择一个大咖！');
        }

    })

});

//回答方法
app.answersj = (function() {
    return function(token, account, cash) {
        var param = {
            "token": token,
            "ask_id": "6",
            "answer": "这个问题不是很好回答",
            // "files": "1.mp3,2.doc,3.xls,4.pdf"
        }
        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            console.log(data);
        }

        return app.doAjax(root.interFace.ask, 'post', param, succCallBack);
    }
})();

//回答
f7app.onPageInit('answersj', function(page) {

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    $$("#answer_click").on("click", function() {
        var token = app.storage.get("userArr").token;
        app.answersj(token);

    })
});

//采纳并申请加入题库方法
app.taxbureau = (function() {
    return function(token, uisi) {
        var param = {
            "token": token,
            "ask_id": "1",
            "ask_belong": "1",
            "answer_id": "1",
            "answer_belong": "1"
        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.adoptJoinBank, 'post', param, succCallBack)
    }
})();

//对回答问题的用户进行评分方法
app.taxbu_score = (function() {
    return function(token, uisi) {
        var param = {
            "token": token,
            "answer_belong": "123456789@qq.com",
            "score": 1
        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.toScore, 'post', param, succCallBack)
    }
})();

//采纳并申请加入题库
f7app.onPageInit('taxbureau', function(page) {
    /*var token = app.storage.get("userArr").token;
    console.log(token);
    app.ticketlist(token);*/

    console.log(page.url);
    //绑定返回键
    window.localStorage["page"] = 'about';

    $$("#taxbu_dsc").on("click", function() {
        var token = app.storage.get("userArr").token;
        console.log(token);
        app.taxbureau(token);
    })
    $$("#Clickalike").on("click", function() {
        var token = app.storage.get("userArr").token;
        console.log(token);
        app.taxbu_score(token);
    })

});
