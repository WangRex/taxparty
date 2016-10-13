//同期数据可比
f7app.onPageInit('services', function(page) {

    console.log(page.url);
    var myPhotoBrowserStandalone = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide').on('click', function() {
        myPhotoBrowserStandalone.open();
    });

    $$('#showDataPickers').on('click', function() {
        var dtpicker = new mui.DtPicker({
            type: "datetime", //设置日历初始视图模式
            beginDate: new Date(2015, 04, 25) //设置开始日期
                //     endDate: new Date(2016, 04, 25),//设置结束日期
                //    labels: ['Year', 'Mon', 'Day', 'Hour', 'min'],//设置默认标签区域提示语

        })
        dtpicker.show(function(items) {
            console.log(items.text);
            $$('#showDataPickers').val(items.text);
        })
    });
    $$('#years-show').on('click', function() {
        var dtpicker = new mui.DtPicker({
            type: "month", //设置日历初始视图模式
            beginDate: new Date(2013) //设置开始日期
                //     endDate: new Date(201),//设置结束日期
                //     labels: ['Year', 'Mon', 'Day'],//设置默认标签区域提示语

        });
        /*var iTems = dtpicker.getSelectedItems();
        console.log(iTems)*/
        // var items= dtpicker.getSelectedItems();
        dtpicker.show(function(items) {
            console.log(items.text)
            $$('#years-show').val(items.text);
        })
    })

});

//投诉方法
app.checkboxes = (function() {
        return function(user, id, comp) {
            var param = {
                "username": user,
                "need_id": id,
                "complaint": comp,
            }

            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)


            }

            return app.doAjax(root.interFace.complaintFound, 'post', param, succCallBack)
        }
    })()
    //投诉
f7app.onPageInit('checkboxes', function(page) {

    var id, txt
    $$('#label_radio').on("click", "input", function() {
        console.log(this);
        id = this.getAttribute('data-value');
        txt = this.value;
    })

    $$("#sub_post").on("click", function() {
        console.log("id：" + typeof id);
        console.log("txt：" + typeof txt)
        if (typeof id === 'undefined') {
            app.toast('请选择投诉内容！')
            return false
        } else {
            app.checkboxes('15210044288', id, txt);
        }
    })

});

/*个人最低价*/
app.setmoney = (function() {
    return function(token, cont) {
        var param = {
            "token": token,
            "lowest_amt": cont
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

            /*    if (data.errorCode == '0') {
                app.toast(data.errorMessage);

                setTimeout(function () {
                    //view.main.router.loadPage('index.html');

                }, 2000)
            }*/
        }

        return app.doAjax(root.interFace.saveBestPrice, 'post', param, succCallBack)
    }
})()


//个人最低价
f7app.onPageInit('set-money', function(page) {
    $$("#srt-bu").on("click", function() {
        var duan = $$("#mum").val();
        console.log(duan);
        if (duan == null || duan == '') {
            app.toast("不能输入空");
            return false;
        } else if (!/^[1-9]\d*$/.test(duan)) {
            app.toast("请输入大与0的数字");
            return false
        } else {
            var token = app.storage.get("userArr").token
            app.setmoney(token, duan);
        }
    })

});
/*设置支付密码方法*/
app.setmoney = (function() {
        return function(token, pass) {
            var param = {
                "token": token,
                "pay_pass": pass
            }

            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)

                if (data.errorCode == '0') {
                    app.toast(data.errorMessage);

                    setTimeout(function() {
                        //view.main.router.loadPage('index.html');

                    }, 2000)
                }
            }

            return app.doAjax(root.interFace.saveUserPayPwd, 'post', param, succCallBack)
        }
    })()
    /*重置手机登录密码方法*/
app.resetpas = (function() {
        return function(token, used, newp) {
            var param = {
                "token": token,
                "oldpwd": used,
                "user_password": newp

            }

            var succCallBack = function(data, status, response) {
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
    /*重置手机登录密码*/
f7app.onPageInit('resetpas', function(page) {
    $$("#modify").on("click", function() {
        var used = $$("#usedmi").val();
        var newp = $$("#newmi").val();
        var confirm = $$("#confirm").val();
        var re = /^[0-9]{6}$/;
        console.log(usedmi);
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
            app.toast("请输入6数字1");

            return false;
        } else if (!re.test(newp)) {
            app.toast("请输入6数字2");

            return false;
        } else if (!re.test(confirm)) {
            app.toast("请输入6数字3");

            return false;
        } else if (newp != confirm) {
            app.toast("密码输入不同");

            return false;
        } else {
            var token = app.storage.get("userArr").token
            app.resetpas(token, used, newp)
        }
    })
});
/*设置支付密码*/
f7app.onPageInit('setpassword', function(page) {
    $$("#complete").on("click", function() {
        var pass = $$("#password").val();
        var repeat = $$("#repeat").val();
        var re = /^[0-9]{6}$/;
        console.log(pass, repeat);
        if (pass == null || pass == '') {
            app.toast("不能输入空");

            return false;
        } else if (repeat == null || repeat == '') {
            app.toast("不能输入空");

            return false;
        } else if (!re.test(pass)) {
            app.toast("请输入6数字1");

            return false;
        } else if (!re.test(repeat)) {
            app.toast("请输入6数字2");

            return false;
        } else if (pass != repeat) {
            app.toast("密码输入不同");

            return false;
        } else {
            var token = app.storage.get("userArr").token
            app.setmoney(token, pass);
        }
    })
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
})()

/*资金*/
f7app.onPageInit('capital', function(page) {

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

            console.log(data)
        }

        return app.doAjax(root.interFace.getAllQuestions, 'post', param, succCallBack)
    }
})();

/* nasyer所有待回答的问题*/
f7app.onPageInit('answerplus', function(page) {
    // var token = app.storage.get("userArr").token;
    var token = "1111";
    console.log(token);
    app.checkIdentityAnswer(token);
});

//回答身份验证ajax请求
app.checkIdentityAnswer = (function() {

    return function(token) {

        var param = {
            "token": token
        };

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data[0].identity === 0 || data.data[0].identity === 1) {
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
            $$("#perbox").html(lesu(data.data[1]));

            var perstikl = $$("script#perstikxsa").html();
            var lesul = Template7.compile(perstikl);
            $$("#jshai").html(lesul(data.data[0]));

        }

        return app.doAjax(root.interFace.getAllBank, 'post', param, succCallBack)
    }
})();

/* 题库一览*/
f7app.onPageInit('personaluestions', function(page) {
    var token = app.storage.get("userArr").token;
    console.log(token);
    app.personaluestions(token);
});
//题库添加方法
app.uestionsaddto = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.insertBank, 'post', param, succCallBack)
    }
})();

//题库添加
f7app.onPageInit('uestionsaddto', function(page) {
    var token = app.storage.get("userArr").token;
    console.log(token);
    app.uestionsaddto(token);
});
//个人发票列表方法
app.ticketlist = (function() {
    return function(token) {
        var param = {
            "token": token
        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.getAllInvoice, 'post', param, succCallBack)
    }
})();

//确认发票接受方法
app.list_fang = (function() {
        return function(token, uisi) {
            var param = {
                "token": token,
                "invoice_id": uisi
            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.submitReceipt, 'post', param, succCallBack)
        }
    })()
    //个人发票列表
f7app.onPageInit('ticketlist', function(page) {
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

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInvoiceInfo, 'post', param, succCallBack)
        }
    })()
    //申请发票
f7app.onPageInit('ticket', function(page) {
    var token = app.storage.get("userArr").token;
    console.log(token);
    $$("#tick").on("click", function() {
        var money = $$("#money").val();
        var rise = $$("#rise").val();
        var Distinguish = $$("#Distinguish").val();
        var content = $$("#content").val();
        var address = $$("#address").val();
        var Addressee = $$("#Addressee").val();
        var Telephone = $$("#Telephone").val();
        var kuai = 10;
        console.log(money, rise, Distinguish, content, address, Addressee, Telephone, kuai);
        app.ticket(token, money, rise, Distinguish, content, address, Addressee, Telephone, kuai);

    });
});
//专家一览方法
app.expert = (function() {
    return function(token, region, name, Expertise) {
        var param = {
            "token": token,
            "region": region,
            "realName": name,
            "taxs": Expertise
        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.getAllexpert, 'post', param, succCallBack)
    }
})()

//专家一览
f7app.onPageInit('expert', function(page) {
    var region = "";
    var name = "";
    var Expertise = ""
    var token = app.storage.get("userArr").token;
    app.expert(token, region, name, Expertise);

    $$("#expertcike").on("click", function() {
        var region = $$("#region").val();
        var name = $$("#name").val();
        var Expertise = $$("#Expertise").val();
        console.log(region, name, Expertise)
        var token = app.storage.get("userArr").token;
        console.log(token);
        app.expert(token, region, name, Expertise);
    })
});
//问答-咨询方法
app.Consultation = (function() {
        return function(token) {
            var param = {
                "token": token

            }
            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);


                console.log(data)
                var perstik = $$("script#tationzans").html();
                var lesu = Template7.compile(perstik);
                $$("#problem-bj").html(lesu(data));

                var perstikl = $$("script#tationzans_lsit").html();
                var lesul = Template7.compile(perstikl);
                $$("#tation_chlsit").html(lesul(data.data));

            }

            return app.doAjax(root.interFace.getAllAsks, 'post', param, succCallBack)
        }
    })()
    //问答-解答方法
app.Answer = (function() {
        return function(token) {
            var param = {
                "token": token

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);
                console.log(data)
                var perstik = $$("script#tationzans_2").html();
                var lesu = Template7.compile(perstik);
                $$("#problem-bj_2").html(lesu(data));

                var perstikl = $$("script#tationzans_lsit_2").html();
                var lesul = Template7.compile(perstikl);
                $$("#tation_chlsit_2").html(lesul(data.askList));

            }

            return app.doAjax(root.interFace.getAllAnswers, 'post', param, succCallBack)
        }
    })()
    //问答-求助方法
app.Seekhelp = (function() {
        return function(token) {
            var param = {
                "token": token

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.queryHelpListInfo, 'post', param, succCallBack)
        }
    })()
    //问答-求援方法
app.help = (function() {
        return function(token) {
            var param = {
                "token": token

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.getAllHelps, 'post', param, succCallBack)
        }
    })()
    //问答
f7app.onPageInit('problem', function(page) {

    console.log("咨询")
    var token = app.storage.get("userArr").token;
    app.Consultation(token)

    $$("#tab1").on("show", function() {
        console.log("咨询")
        var token = app.storage.get("userArr").token;
        app.Consultation(token)
    })

    $$("#tab2").on("show", function() {

        console.log("解答")
        var token = app.storage.get("userArr").token;
        app.Answer(token)
    })

    $$("#tab3").on("show", function() {

        var swiper = new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });


        console.log("求助")
        var token = app.storage.get("userArr").token;
        app.Seekhelp(token)
    })


    $$("#tab4").on("show", function() {

        console.log("求援")
        var token = app.storage.get("userArr").token;
        app.help(token)
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
    //同期可比数据方法
app.services = (function() {
    return function(token) {
        var param = {
            "token": token,
            "count_sum": "2210",
            "base_price": "2000",
            "worry_fee": "200",
            "bill_fee": "10",
            "tit_flag": "0",
            "data_year": "2016",
            "contrast_year": "2012-2014",
            "firm_product": "主营业务",
            "tit_email": "longyuzichen@126.com",
            "require_data": "2",
            "contrast_index": "完全成本加成率",
            "contrast_result": "完全成本加成率>= 中位值",
            "expect_date": "3",
            "business_income": "0",
            "contrast_type": "整体数据对比",
            "draw_bill": "0"

        }

        var succCallBack = function(data, status, response, address) {
            var data = JSON.parse(data);

            console.log(data)
        }

        return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
    }
})()

//同期可比数据
f7app.onPageInit('services', function(page) {

    $$("#post_btn").on("click", function() {
        var token = app.storage.get("userArr").token;
        app.services(token)
    })

});
//国际税收-非贸付汇订单提交方法
app.tax_sui = (function() {
        return function(token) {
            var param = {
                "token": token,
                "count_sum": "2210",
                "base_price": "2000",
                "worry_fee": "200",
                "bill_fee": "10",
                "tit_flag": "1",
                "tit_tax": "北京",
                "data_year": "2016",
                "pay_type": "支付方式",
                "tit_email": "longyuzichen@126.com",
                "require_data": "2",
                "tit_state": "中国",
                "expect_date": "3",
                "draw_bill": "0"

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-协定待遇方法
app.agreement = (function() {
        return function(token) {
            var param = {
                "token": token,
                "count_sum": "2210",
                "base_price": "2000",
                "worry_fee": "200",
                "bill_fee": "10",
                "tit_flag": "2",
                "tit_tax": "北京",
                "data_year": "2016",
                "pay_type": "支付类型1",
                "tit_email": "longyuzichen@126.com",
                "require_data": "2",
                "tit_state": "中国",
                "expect_date": "3",
                "draw_bill": "0",
                "whole_flow_service": "0"

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-大额关联支付订单提交
app.Relation = (function() {
        return function(token) {
            var param = {
                "token": token,
                "count_sum": "2210",
                "base_price": "2000",
                "worry_fee": "200",
                "bill_fee": "10",
                "tit_flag": "3",
                "tit_tax": "北京",
                "data_year": "2016",
                "pay_type": "支付类型",
                "tit_email": "longyuzichen@126.com",
                "require_data": "2",
                "tit_state": "中国",
                "expect_date": "3",
                "draw_bill": "0",
                "whole_flow_service": "0"

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-税收情报交换订单提交
app.intelligence = (function() {
        return function(token) {
            var param = {
                "token": token,
                "count_sum": "2210",
                "base_price": "2000",
                "worry_fee": "200",
                "bill_fee": "10",
                "tit_flag": "4",
                "tit_tax": "北京",
                "main_tax": "",
                "data_year": "2016",
                "pay_type": "",
                "tit_email": "longyuzichen@126.com",
                "require_data": "2",
                "tit_state": "中国",
                "expect_date": "3",
                "draw_bill": "0",
                "is_research": "1",
                "whole_flow_service": "0"

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-间接财产转让订单提交
app.propertyzhuan = (function() {
        return function(token) {
            var param = {
                "token": token,
                "count_sum": "2210",
                "base_price": "2000",
                "worry_fee": "200",
                "bill_fee": "10",
                "tit_flag": "5",
                "tit_tax": "北京",
                "data_year": "2016",
                "tit_email": "longyuzichen@126.com",
                "require_data": "1",
                "tit_state": "中国",
                "expect_date": "9",
                "draw_bill": "0",
                "is_research": "1"

            }

            var succCallBack = function(data, status, response, address) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收
f7app.onPageInit('tax_sui', function(page) {
    $$("#post_btn_1").on("click", function() {
        console.log("非贸汇款")
        var token = app.storage.get("userArr").token;
        app.tax_sui(token)
    })
    $$("#post_btn_2").on("click", function() {
        console.log("协定待遇")
        var token = app.storage.get("userArr").token;
        app.agreement(token)
    })
    $$("#post_btn_3").on("click", function() {
        console.log("大额关联支付")
        var token = app.storage.get("userArr").token;
        app.Relation(token)
    })
    $$("#post_btn_4").on("click", function() {
        console.log("税收情报交换")
        var token = app.storage.get("userArr").token;
        app.intelligence(token)
    })
    $$("#post_btn_5").on("click", function() {
        console.log("间接财产转让")
        var token = app.storage.get("userArr").token;
        app.propertyzhuan(token)
    })

});
//提现的初始页面方法
app.withdrawals = (function() {
        return function(token) {
            var param = {
                "token": token
            }

            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.findTotalProfit, 'post', param, succCallBack)
        }
    })()
    //提现申请方法
app.withApply = (function() {
        return function(token, account, cash) {
            var param = {
                "token": token,
                "amt": "101",
                "payModel": "100",
                "rccAcc": "12345678"
            }
            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.drawMoney, 'post', param, succCallBack)
        }
    })()
    //提现的初始页面
f7app.onPageInit('withdrawals', function(page) {
    var token = app.storage.get("userArr").token;
    console.log(token);
    app.withdrawals(token);
    $$("#Applydi").on("click", function() {
        var token = app.storage.get("userArr").token;
        app.withApply(token)

    })
});
//提问方法
app.asklsit = (function() {
        return function(token, account, cash) {
            var param = {
                "token": token,
                "ask_type": "1",
                "asked_id": "[01,02]",
                "region": "北京",
                "propertys": "[财务会计类]",
                "types": "[增值税,消费税,企业所得税]",
                "procedures": "[税务登记,税务认定,发票管理]",
                "businesses": "[税收优惠,非居民税收]",
                "questions": "个税计算方式",
                "cost": 100,
                "post_type": "1"
            }
            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.ask, 'post', param, succCallBack)
        }
    })()
    //提问
f7app.onPageInit('asklsit', function(page) {
    $$("#askdi").on("click", function() {
        var token = app.storage.get("userArr").token;
        app.asklsit(token)

    })
});
//回答方法
app.answersj = (function() {
        return function(token, account, cash) {
            var param = {
                "token": token,
                "ask_id": "1010",
                "answer": "这个问题不是很好回答",
                "files": "1.mp3,2.doc,3.xls,4.pdf"
            }
            var succCallBack = function(data, status, response) {
                var data = JSON.parse(data);

                console.log(data)
            }

            return app.doAjax(root.interFace.ask, 'post', param, succCallBack)
        }
    })()
    //回答
f7app.onPageInit('answersj', function(page) {
    $$("#answer_click").on("click", function() {
        var token = app.storage.get("userArr").token;
        app.answersj(token)

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
    })()
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
    })()
    //采纳并申请加入题库
f7app.onPageInit('taxbureau', function(page) {
    /*var token = app.storage.get("userArr").token;
    console.log(token);
    app.ticketlist(token);*/
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
