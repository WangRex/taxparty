//同期可比数据方法
app.services = (function () {
    return function (token, draw_bill, business_income) {
        var contrast_type = $$('#contrast_type').val()
        if (business_income == '1') {
            contrast_type = '';
        }

        var param = {
            "token": token,
            "count_sum": $$('#count_sum').text().trim(),
            "base_price": $$('#base_price').text().trim(),
            "worry_fee": $$('#worry_fee').text().trim(),
            "bill_fee": $$('#bill_fee').text().trim(),
            "tit_flag": "0",
            "data_year": $$('#baseYear').val(),
            "contrast_year": $$('#changeYear1').val() + '-' + $$('#changeYear2').val(),
            "firm_product": $$('#firm_product').val(),
            "tit_email": $$('#data-briebly').val(),
            "require_data": $$('#require_data').text().trim(),
            "contrast_index": $$('#contrast_index').text().trim(),
            "contrast_result": $$('#compareResult').val(),
            "expect_date": $$('#expect_date').val(),
            "business_income": business_income,
            "contrast_type": contrast_type,
            "draw_bill": draw_bill

        }


        var succCallBack = function (data, status, response, address) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode === '0') {
                app.toast("提交成功！");
                if (draw_bill == '0') {

                    f7app.confirm('是否要现在填写发票？', '', function () {
                        view.main.router.loadPage('about/ticket.html?token=' + token);
                    });
                }


            } else {
                app.toast("提交失败！");
            }

        }


        return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
    }
})()

//同期可比数据
f7app.onPageInit('services', function (page) {

    //绑定返回键
    window.localStorage["page"] = 'main';

    app.checkTaxForm = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#firm_product').val()) {
            app.toast('公司行业及产品不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#data-briebly').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        }

        return true;

    }

    //初始化范例图片
    var myPhotoBrowserStandalone = f7app.photoBrowser({
        photos: [
            '../static/images/data/tqzl/tqzl1.png',
            '../static/images/data/tqzl/tqzl2.png',
            '../static/images/data/tqzl/tqzl3.jpg',
            '../static/images/data/tqzl/tqzl4.jpg',
            '../static/images/data/tqzl/tqzl5.png',
            '../static/images/data/tqzl/tqzl6.png',
            '../static/images/data/tqzl/tqzl7.png',
            '../static/images/data/tqzl/tqzl8.png',
        ]
    });
    //Open photo browser on click
    $$('#img-slide').on('click', function () {
        myPhotoBrowserStandalone.open();
    });

    var requiredData = f7app.photoBrowser({
        photos: [
            '../static/images/data/requiredData.png',
        ]
    });
    //Open photo browser on click
    $$('#require_data').on('click', function () {
        requiredData.open();
    });

    //初始化下拉框的初始值
    var year = new Date().getFullYear();
    $$('#baseYear').val(year - 1);
    $$('#changeYear1').val(year - 4);
    $$('#changeYear2').val(year - 2);
    $$('#compareResult').val('中位值≤完全成本加成率≤上四分位值');

    var yearArr = [];
    var changeYear1Arr = [];
    var changeYear2Arr = [];
    for (var i = 0; i < 10; i++) {
        yearArr.push(year - 5 + i);
    }

    if ($$('#baseYear').val() == (year - 1)) {
        $$('#changeYear1').attr('disabled', 'disabled');
        $$('#changeYear2').attr('disabled', 'disabled');

    }
    f7app.picker({
        input: '#baseYear',
        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
        onOpen: function (picker, values, displayValues) {
            $$('#changeYear1').css('color', '#ccc')
            $$('#changeYear2').css('color', '#ccc')
        },
        onChange: function (picker, values, displayValues) {
            $$('#changeYear1').css('color', '#ccc')
            $$('#changeYear2').css('color', '#ccc')

        },
        onClose: function (picker, values, displayValues) {
            //                    picker.cols[2].setValue(picker.cols[0] - 3);
            var num = Number($$('#changeYear1').val()) + 2;
            console.log(num);
            $$('#changeYear1').css('color', '#000')
            $$('#changeYear2').css('color', '#000')
            $$('#changeYear1').val(Number($$('#baseYear').val()) - 3)
            $$('#changeYear2').val(Number($$('#baseYear').val()) - 1)
            changeYear1Arr.length = 0;
            changeYear2Arr.length = 0;
            for (var i = 0; i < 10; i++) {
                changeYear1Arr.push($$('#baseYear').val() - i - 3);
                changeYear2Arr.push($$('#baseYear').val() - i - 1);
            }
            if ($$('#baseYear').val() != (year - 1)) {
                $$('#changeYear1').removeAttr('disabled');
                $$('#changeYear2').removeAttr('disabled');

            }
            if ($$('#baseYear').val() == (year - 1)) {
                $$('#changeYear1').attr('disabled', 'disabled');
                $$('#changeYear2').attr('disabled', 'disabled');

            }


        }

    });
    var sign1 = false;
    var sign2 = false;
    f7app.picker({
        input: '#changeYear1',
        cols: [
            {
                textAlign: 'center',
                values: changeYear1Arr,

        }
    ],
        toolbarCloseText: '确定',
        onOpen: function (picker, values, displayValues) {
            $$('#changeYear2').css('color', '#ccc')
            if (sign1) {
                picker.cols[0].setValue($$('#changeYearNew1').val());
                sign = false
            }
        },
        onChange: function (picker, values, displayValues) {
            $$('#changeYear2').css('color', '#ccc')
        },
        onClose: function (picker, values, displayValues) {
            console.log(Number($$('#changeYear1').val()));
            var num = Number($$('#changeYear1').val()) + 2;
            console.log(num);
            $$('#changeYear2').css('color', '#000')
            $$('#changeYear2').val(num)
            $$('#changeYearNew2').val(num)
            sign2 = true;
        }
    });
    f7app.picker({
        input: '#changeYear2',
        cols: [
            {
                textAlign: 'center',
                values: changeYear2Arr,

        }
    ],
        toolbarCloseText: '确定',
        onOpen: function (picker, values, displayValues) {
            $$('#changeYear1').css('color', '#ccc')
            if (sign2) {
                picker.cols[0].setValue($$('#changeYearNew2').val());
                sign2 = false;
            }
        },
        onChange: function (picker, values, displayValues) {
            $$('#changeYear1').css('color', '#ccc')
        },
        onClose: function (picker, values, displayValues) {
            //                    picker.cols[2].setValue(picker.cols[0] - 2);
            console.log(Number($$('#changeYear2').val()));
            var num = Number($$('#changeYear2').val()) - 2;
            console.log(num);
            $$('#changeYear1').css('color', '#000')
            $$('#changeYear1').val(num)
            $$('#changeYearNew1').val(num)
            sign1 = true;
        }
    });


    f7app.picker({
        input: '#compareResult',
        cols: [
            {
                textAlign: 'center',
                values: ['完全成本加成率≤下四分位值', '下四分位值≤完全成本加成率≤中位值', '中位值≤完全成本加成率≤上四分位值', '完全成本加成率≥上四分位值'],
                cssClass: 'compareResult'
        }
    ],
        toolbarCloseText: '确定',
    });

    f7app.picker({
        input: '#contrast_type',
        cols: [
            {
                textAlign: 'center',
                values: ['以关联交易数据进行对比', '以整体数据进行对比'],
                //                cssClass: 'compareResult'
        }
    ],
        toolbarCloseText: '确定',
    });

    //初始化报告书时间
    f7app.picker({
        input: '#expect_date',
        cols: [
            {
                textAlign: 'center',
                values: [4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });

    //初始化报价数据
    Number($$('#base_price').text('5000.00'));
    var worry_fee = Number(200 * (4 - Number($$('#expect_date').val()))).toFixed(2);
    $$('#worry_fee').text(worry_fee);

    //报告书时间改变，报价随之变动
    $$('#expect_date').change(function () {
        worry_fee = Number(200 * (4 - Number($$('#expect_date').val()))).toFixed(2);
        $$('#worry_fee').text(worry_fee);

        bill_fee = ((Number($$('#base_price').text()) + 200 * (4 - Number($$('#expect_date').val()))) * 0.06).toFixed(2);
        $$('#bill_fee').text(bill_fee);

        count_sum = ((Number($$('#base_price').text()) + 200 * (4 - Number($$('#expect_date').val()))) * 1.06).toFixed(2);
        $$('#count_sum').text(count_sum);

    })

    //初始化贵公司是否存在非关联主营业务收入
    var noRelatedIncome = '1';
    $$('#noRelatedIncomey').click(function () {
        $$('#noRelatedIncomey').addClass('active');
        $$('#noRelatedIncomen').removeClass('active');
        $$('#contrast_type').removeAttr("disabled");
        noRelatedIncome = '0';
    });
    $$('#noRelatedIncomen').click(function () {
        $$('#noRelatedIncomen').addClass('active');
        $$('#noRelatedIncomey').removeClass('active');
        $$('#contrast_type').attr('disabled', 'disabled')
        noRelatedIncome = '1';
    });

    //初始化发票选择
    var draw_bill = '0';
    $$('#draw_billy').click(function () {
        $$('#draw_billy').addClass('active');
        $$('#draw_billn').removeClass('active');
        draw_bill = '0';
    });
    $$('#draw_billn').click(function () {
        console.log('sds');
        $$('#draw_billn').addClass('active');
        $$('#draw_billy').removeClass('active');
        draw_bill = '1';
    });

    //提交数据
    $$("#post_btn").on("click", function () {
        var token = app.storage.get("userArr").token;
        console.log(token)
        if (app.checkTaxForm()) {
            app.services(token, draw_bill, noRelatedIncome)

        }
    })

    //qq客服
    $$(".QQ").on("click", function () {
        window.localStorage["backStatus"] = false;
        YCQQ.checkClientInstalled(function () {
            InvokeApp.QQChat(function (success) {}, function (error) {}, {});
        }, function () {
            f7app.alert("您未安装QQ");
        });

    })

});
//国际税收-非贸付汇订单提交方法
app.tax_sui = (function () {
        return function (token, draw_bill1) {
            var param = {
                "token": token,
                "count_sum": $$('#count_sum1').text().trim(),
                "base_price": $$('#base_price1').text().trim(),
                "worry_fee": $$('#worry_fee1').text().trim(),
                "bill_fee": $$('#bill_fee1').text().trim(),
                "tit_flag": "1",
                "tit_tax": $$('#tit_tax1').attr('data-id'),
                "data_year": $$('#data_year1').val(),
                "pay_type": $$('#pay_type1').val(),
                "tit_email": $$('#tit_email1').val(),
                "require_data": $$('#require_data1').text().trim(),
                "tit_state": $$('#tit_state1').val(),
                "expect_date": $$('#expect_date1').val(),
                "draw_bill": draw_bill1

            }


            var succCallBack = function (data, status, response, address) {
                var data = JSON.parse(data);
                console.log(data);
                if (data.errorCode === '0') {
                    app.toast("提交成功！");
                    if (draw_bill1 == '0') {

                        f7app.confirm('是否要现在填写发票？', '', function () {
                            view.main.router.loadPage('about/ticket.html?token=' + token);
                        });
                    }
                } else {
                    app.toast("提交失败！");
                }

            }
            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-协定待遇方法
app.agreement = (function () {
        return function (token, draw_bill2, whole_flow_service2) {
            var param = {
                "token": token,
                "count_sum": $$('#count_sum2').text().trim(),
                "base_price": $$('#base_price2').text().trim(),
                "worry_fee": $$('#worry_fee2').text().trim(),
                "bill_fee": $$('#bill_fee2').text().trim(),
                "tit_flag": "2",
                "tit_tax": $$('#tit_tax2').attr('data-id'),
                "data_year": $$('#data_year2').val(),
                "pay_type": $$('#pay_type2').val(),
                "tit_email": $$('#tit_email2').val(),
                "require_data": $$('#require_data2').text().trim(),
                "tit_state": $$('#tit_state2').val(),
                "expect_date": $$('#expect_date2').val(),
                "draw_bill": draw_bill2,
                "whole_flow_service": whole_flow_service2

            }
            var succCallBack = function (data, status, response, address) {
                var data = JSON.parse(data);
                console.log(data);
                if (data.errorCode === '0') {
                    app.toast("提交成功！");
                    if (draw_bill2 == '0') {

                        f7app.confirm('是否要现在填写发票？', '', function () {
                            view.main.router.loadPage('about/ticket.html?token=' + token);
                        });
                    }
                } else {
                    app.toast("提交失败！");
                }

            }


            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-大额关联支付订单提交
app.Relation = (function () {
        return function (token, draw_bill3, whole_flow_service3) {
            var param = {
                "token": token,
                "count_sum": $$('#count_sum3').text().trim(),
                "base_price": $$('#base_price3').text().trim(),
                "worry_fee": $$('#worry_fee3').text().trim(),
                "bill_fee": $$('#bill_fee3').text().trim(),
                "tit_flag": "3",
                "tit_tax": $$('#tit_tax3').attr('data-id'),
                "data_year": $$('#data_year3').val(),
                "pay_type": $$('#pay_type3').val(),
                "tit_email": $$('#tit_email3').val(),
                "require_data": $$('#require_data3').text().trim(),
                "tit_state": $$('#tit_state3').val(),
                "expect_date": $$('#expect_date3').val(),
                "draw_bill": draw_bill3,
                "whole_flow_service": whole_flow_service3


            }

            var succCallBack = function (data, status, response, address) {
                var data = JSON.parse(data);
                console.log(data);
                if (data.errorCode === '0') {
                    app.toast("提交成功！");
                    if (draw_bill3 == '0') {

                        f7app.confirm('是否要现在填写发票？', '', function () {
                            view.main.router.loadPage('about/ticket.html?token=' + token);
                        });
                    }
                } else {
                    app.toast("提交失败！");
                }

            }


            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-税收情报交换订单提交
app.intelligence = (function () {
        return function (token, draw_bill4, is_research4, whole_flow_service4) {
            var param = {
                "token": token,
                "count_sum": $$('#count_sum4').text().trim(),
                "base_price": $$('#base_price4').text().trim(),
                "worry_fee": $$('#worry_fee4').text().trim(),
                "bill_fee": $$('#bill_fee4').text().trim(),
                "tit_flag": "4",
                "tit_tax": $$('#tit_tax4').attr('data-id'),
                "main_tax": $$('#main_tax4').val(),
                "tit_email": $$('#tit_email4').val(),
                "require_data": $$('#require_data4').text().trim(),
                "tit_state": $$('#tit_state4').val(),
                "expect_date": $$('#expect_date4').val(),
                "draw_bill": draw_bill4,
                "is_research": is_research4,
                "whole_flow_service": whole_flow_service4


            }

            var succCallBack = function (data, status, response, address) {
                var data = JSON.parse(data);
                console.log(data);
                if (data.errorCode === '0') {
                    app.toast("提交成功！");
                    if (draw_bill4 == '0') {

                        f7app.confirm('是否要现在填写发票？', '', function () {
                            view.main.router.loadPage('about/ticket.html?token=' + token);
                        });
                    }
                } else {
                    app.toast("提交失败！");
                }

            }


            return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
        }
    })()
    //国际税收-间接财产转让订单提交
app.propertyzhuan = (function () {
    return function (token, draw_bill5, is_research5) {
        var param = {
            "token": token,
            "count_sum": $$('#count_sum5').text().trim(),
            "base_price": $$('#base_price5').text().trim(),
            "worry_fee": $$('#worry_fee5').text().trim(),
            "bill_fee": $$('#bill_fee5').text().trim(),
            "tit_flag": "5",
            "tit_tax": $$('#tit_tax5').attr('data-id'),
            "data_year": $$('#data_year5').val(),
            "pay_type": $$('#pay_type5').val(),
            "tit_email": $$('#tit_email5').val(),
            "require_data": $$('#require_data5').text().trim(),
            "tit_state": $$('#tit_state5').val(),
            "expect_date": $$('#expect_date5').val(),
            "draw_bill": draw_bill5,
            "is_research": is_research5,

        }


        var succCallBack = function (data, status, response, address) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.errorCode === '0') {
                app.toast("提交成功！");
                if (draw_bill5 == '0') {

                    f7app.confirm('是否要现在填写发票？', '', function () {
                        view.main.router.loadPage('about/ticket.html?token=' + token);
                    });
                }
            } else {
                app.toast("提交失败！");
            }

        }


        return app.doAjax(root.interFace.saveInternationalInfo, 'post', param, succCallBack)
    }
})()

//国际税收
f7app.onPageInit('tax_sui', function (page) {

    //绑定返回键
    window.localStorage["page"] = 'main';
    
    var swiper = new Swiper('.swiper-container', {
        scrollbarHide: true,
        slidesPerView: 'auto'
    });

    app.checkTaxForm1 = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#tit_tax1').val()) {
            app.toast('主管税局不可以为空！');
            return false;
        } else if (!$$('#data_year1').val()) {
            app.toast('所在年度不可以为空！');
            return false;
        } else if (!$$('#pay_type1').val()) {
            app.toast('支付类型不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#tit_email1').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        } else if (!$$('#tit_state1').val()) {
            app.toast('收汇方所在国不可以为空！');
            return false;
        }

        return true;

    }
    app.checkTaxForm2 = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#tit_tax2').val()) {
            app.toast('主管税局不可以为空！');
            return false;
        } else if (!$$('#data_year2').val()) {
            app.toast('所在年度不可以为空！');
            return false;
        } else if (!$$('#pay_type2').val()) {
            app.toast('支付类型不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#tit_email2').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        } else if (!$$('#tit_state2').val()) {
            app.toast('收汇方所在国不可以为空！');
            return false;
        }

        return true;

    }
    app.checkTaxForm3 = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#tit_tax3').val()) {
            app.toast('主管税局不可以为空！');
            return false;
        } else if (!$$('#data_year3').val()) {
            app.toast('所在年度不可以为空！');
            return false;
        } else if (!$$('#pay_type3').val()) {
            app.toast('支付类型不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#tit_email3').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        } else if (!$$('#tit_state3').val()) {
            app.toast('收汇方所在国不可以为空！');
            return false;
        }

        return true;

    }
    app.checkTaxForm4 = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#tit_tax4').val()) {
            app.toast('主管税局不可以为空！');
            return false;
        } else if (!$$('#main_tax4').val()) {
            app.toast('涉税主体不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#tit_email4').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        } else if (!$$('#tit_state4').val()) {
            app.toast('海外投资国不可以为空！');
            return false;
        }

        return true;

    }
    app.checkTaxForm5 = function () {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!$$('#tit_tax5').val()) {
            app.toast('主管税局不可以为空！');
            return false;
        } else if (!$$('#data_year5').val()) {
            app.toast('交易年度不可以为空！');
            return false;
        } else if (!emailFilter.test($$('#tit_email5').val())) {
            app.toast("邮箱格式不正确，请核对！");
            return false;
        } else if (!$$('#tit_state5').val()) {
            app.toast('转让方所在国不可以为空！');
            return false;
        }

        return true;

    }

    /* ===== Mui PopPicker ===== */
    mui.init();
    (function ($, window) {

        $.ready(function () {

            //选择服务地点
            (function () {
                var cityPicker3 = new $.PopPicker({
                    layer: 3
                });

                cityPicker3.setData(cityData3);
                $$("#tit_tax1").on('click', function (event) {
                    console.log(this)
                    var self = this;
                    cityPicker3.show(function (items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                        console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
                    });
                }, false);
                $$("#tit_tax2").on('click', function (event) {
                    console.log(this)
                    var self = this;
                    cityPicker3.show(function (items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                        console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
                    });
                }, false);
                $$("#tit_tax3").on('click', function (event) {
                    console.log(this)
                    var self = this;
                    cityPicker3.show(function (items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                        console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
                    });
                }, false);
                $$("#tit_tax4").on('click', function (event) {
                    console.log(this)
                    var self = this;
                    cityPicker3.show(function (items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                        console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
                    });
                }, false);
                $$("#tit_tax5").on('click', function (event) {
                    console.log(this)
                    var self = this;
                    cityPicker3.show(function (items) {
                        var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        self.value = t;
                        self.setAttribute("data-id", items[2].value);
                        console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
                    });
                }, false);



            })();

        })
    })(mui, window)

    //初始化范例图片
    var myPhotoBrowserStandalone1 = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide1').on('click', function () {
        myPhotoBrowserStandalone1.open();
    });
    var myPhotoBrowserStandalone2 = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide2').on('click', function () {
        myPhotoBrowserStandalone2.open();
    });
    var myPhotoBrowserStandalone3 = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide3').on('click', function () {
        myPhotoBrowserStandalone3.open();
    });
    var myPhotoBrowserStandalone4 = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide4').on('click', function () {
        myPhotoBrowserStandalone4.open();
    });
    var myPhotoBrowserStandalone5 = f7app.photoBrowser({
        photos: [
            'http://lorempixel.com/1024/1024/sports/1/',
            'http://lorempixel.com/1024/1024/sports/2/',
            'http://lorempixel.com/1024/1024/sports/3/',
        ]
    });
    //Open photo browser on click
    $$('#img-slide5').on('click', function () {
        myPhotoBrowserStandalone5.open();
    });


    var requiredData = f7app.photoBrowser({
        photos: [
            '../static/images/data/requiredData.png',
        ]
    });
    //Open photo browser on click
    $$('#require_data1').on('click', function () {
        requiredData.open();
    });
    $$('#require_data2').on('click', function () {
        requiredData.open();
    });
    $$('#require_data3').on('click', function () {
        requiredData.open();
    });
    $$('#require_data4').on('click', function () {
        requiredData.open();
    });
    $$('#require_data5').on('click', function () {
        requiredData.open();
    });


    //初始化所在年度
    var year = new Date().getFullYear();
    var yearArr = [];
    for (var i = 0; i < 10; i++) {
        yearArr.push(year - 5 + i);
    }


    f7app.picker({
        input: '#data_year1',
        //        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
    })

    f7app.picker({
        input: '#data_year2',
        //        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
    })

    f7app.picker({
        input: '#data_year3',
        //        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
    })

    f7app.picker({
        input: '#data_year4',
        //        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
    })

    f7app.picker({
        input: '#data_year5',
        //        value: [year - 1],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',
    })


    //初始化支付类型
    f7app.picker({
        input: '#pay_type1',
        cols: [
            {
                textAlign: 'center',
                values: ['股息', '红利', '特许权使用费', '服务转让', '租金', '劳务', '服务', '其它']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#pay_type2',
        cols: [
            {
                textAlign: 'center',
                values: ['股息', '红利', '特许权使用费', '服务转让', '租金', '劳务', '服务', '其它']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#pay_type3',
        cols: [
            {
                textAlign: 'center',
                values: ['股息', '红利', '特许权使用费', '服务转让', '租金', '劳务', '服务', '其它']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#pay_type4',
        cols: [
            {
                textAlign: 'center',
                values: ['股息', '红利', '特许权使用费', '服务转让', '租金', '劳务', '服务', '其它']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#pay_type5',
        cols: [
            {
                textAlign: 'center',
                values: ['股息', '红利', '特许权使用费', '服务转让', '租金', '劳务', '服务', '其它']
        }
    ],
        toolbarCloseText: '确定',
    });

    //初始化国家
    f7app.picker({
        input: '#tit_state1',
        cols: [
            {
                textAlign: 'center',
                values: ['中国', '美国', '日本', '意大利', '德国', '新加坡']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#tit_state2',
        cols: [
            {
                textAlign: 'center',
                values: ['中国', '美国', '日本', '意大利', '德国', '新加坡']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#tit_state3',
        cols: [
            {
                textAlign: 'center',
                values: ['中国', '美国', '日本', '意大利', '德国', '新加坡']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#tit_state4',
        cols: [
            {
                textAlign: 'center',
                values: ['美国', '日本', '意大利', '德国', '新加坡', '英国']
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#tit_state5',
        cols: [
            {
                textAlign: 'center',
                values: ['中国', '美国', '日本', '意大利', '德国', '新加坡']
        }
    ],
        toolbarCloseText: '确定',
    });

    //初始化报告书时间
    f7app.picker({
        input: '#expect_date1',
        cols: [
            {
                textAlign: 'center',
                values: [4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#expect_date2',
        cols: [
            {
                textAlign: 'center',
                values: [4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#expect_date3',
        cols: [
            {
                textAlign: 'center',
                values: [4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#expect_date4',
        cols: [
            {
                textAlign: 'center',
                values: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });
    f7app.picker({
        input: '#expect_date5',
        cols: [
            {
                textAlign: 'center',
                values: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        }
    ],
        toolbarCloseText: '确定',
    });




    //初始化报价数据
    Number($$('#base_price1').text('5000.00'));
    var worry_fee1 = Number(200 * (4 - Number($$('#expect_date1').val()))).toFixed(2);
    $$('#worry_fee1').text(worry_fee1);

    var bill_fee1 = ((Number($$('#base_price1').text()) + 200 * (4 - Number($$('#expect_date1').val()))) * 0.06).toFixed(2);
    $$('#bill_fee1').text(bill_fee1);

    var count_sum1 = ((Number($$('#base_price1').text()) + 200 * (4 - Number($$('#expect_date1').val()))) * 1.06).toFixed(2);
    $$('#count_sum1').text(count_sum1);
    //tab2
    Number($$('#base_price2').text('5000.00'));
    var worry_fee2 = Number(200 * (4 - Number($$('#expect_date2').val()))).toFixed(2);
    $$('#worry_fee2').text(worry_fee2);

    var bill_fee2 = ((Number($$('#base_price2').text()) + 200 * (4 - Number($$('#expect_date2').val()))) * 0.06).toFixed(2);
    $$('#bill_fee2').text(bill_fee2);

    var count_sum2 = ((Number($$('#base_price2').text()) + 200 * (4 - Number($$('#expect_date2').val()))) * 1.06).toFixed(2);
    $$('#count_sum2').text(count_sum2);

    //tab3
    Number($$('#base_price3').text('5000.00'));
    var worry_fee3 = Number(200 * (4 - Number($$('#expect_date3').val()))).toFixed(2);
    $$('#worry_fee3').text(worry_fee3);

    var bill_fee3 = ((Number($$('#base_price3').text()) + 200 * (4 - Number($$('#expect_date3').val()))) * 0.06).toFixed(2);
    $$('#bill_fee3').text(bill_fee3);

    var count_sum3 = ((Number($$('#base_price3').text()) + 200 * (4 - Number($$('#expect_date3').val()))) * 1.06).toFixed(2);
    $$('#count_sum3').text(count_sum3);

    //tab4
    Number($$('#base_price4').text('5000.00'));
    var worry_fee4 = Number(200 * (10 - Number($$('#expect_date4').val()))).toFixed(2);
    $$('#worry_fee4').text(worry_fee4);

    var bill_fee4 = ((Number($$('#base_price4').text()) + 200 * (10 - Number($$('#expect_date4').val()))) * 0.06).toFixed(2);
    $$('#bill_fee4').text(bill_fee4);

    var count_sum4 = ((Number($$('#base_price4').text()) + 200 * (10 - Number($$('#expect_date4').val()))) * 1.06).toFixed(2);
    $$('#count_sum4').text(count_sum4);

    //tab5
    Number($$('#base_price5').text('5000.00'));
    var worry_fee5 = Number(200 * (10 - Number($$('#expect_date5').val()))).toFixed(2);
    $$('#worry_fee5').text(worry_fee5);

    var bill_fee5 = ((Number($$('#base_price5').text()) + 200 * (10 - Number($$('#expect_date5').val()))) * 0.06).toFixed(2);
    $$('#bill_fee5').text(bill_fee5);

    var count_sum5 = ((Number($$('#base_price5').text()) + 200 * (10 - Number($$('#expect_date5').val()))) * 1.06).toFixed(2);
    $$('#count_sum5').text(count_sum5);

    //报告书时间改变，报价随之变动
    $$('#expect_date1').change(function () {
        worry_fee1 = Number(200 * (4 - Number($$('#expect_date1').val()))).toFixed(2);
        $$('#worry_fee1').text(worry_fee1);

        bill_fee1 = ((Number($$('#base_price1').text()) + 200 * (4 - Number($$('#expect_date1').val()))) * 0.06).toFixed(2);
        $$('#bill_fee1').text(bill_fee1);

        count_sum1 = ((Number($$('#base_price1').text()) + 200 * (4 - Number($$('#expect_date1').val()))) * 1.06).toFixed(2);
        $$('#count_sum1').text(count_sum1);

    })
    $$('#expect_date2').change(function () {
        worry_fee2 = Number(200 * (4 - Number($$('#expect_date2').val()))).toFixed(2);
        $$('#worry_fee2').text(worry_fee2);

        bill_fee2 = ((Number($$('#base_price2').text()) + 200 * (4 - Number($$('#expect_date2').val()))) * 0.06).toFixed(2);
        $$('#bill_fee2').text(bill_fee2);

        count_sum2 = ((Number($$('#base_price2').text()) + 200 * (4 - Number($$('#expect_date2').val()))) * 1.06).toFixed(2);
        $$('#count_sum2').text(count_sum2);

    })
    $$('#expect_date3').change(function () {
        worry_fee3 = Number(200 * (4 - Number($$('#expect_date3').val()))).toFixed(2);
        $$('#worry_fee3').text(worry_fee3);

        bill_fee3 = ((Number($$('#base_price3').text()) + 200 * (4 - Number($$('#expect_date3').val()))) * 0.06).toFixed(2);
        $$('#bill_fee3').text(bill_fee3);

        count_sum3 = ((Number($$('#base_price3').text()) + 200 * (4 - Number($$('#expect_date3').val()))) * 1.06).toFixed(2);
        $$('#count_sum3').text(count_sum3);

    })
    $$('#expect_date4').change(function () {
        worry_fee4 = Number(200 * (10 - Number($$('#expect_date4').val()))).toFixed(2);
        $$('#worry_fee4').text(worry_fee4);

        bill_fee4 = ((Number($$('#base_price4').text()) + 200 * (10 - Number($$('#expect_date4').val()))) * 0.06).toFixed(2);
        $$('#bill_fee4').text(bill_fee4);

        count_sum4 = ((Number($$('#base_price4').text()) + 200 * (10 - Number($$('#expect_date4').val()))) * 1.06).toFixed(2);
        $$('#count_sum4').text(count_sum4);

    })
    $$('#expect_date5').change(function () {
        worry_fee5 = Number(200 * (10 - Number($$('#expect_date5').val()))).toFixed(2);
        $$('#worry_fee5').text(worry_fee5);

        bill_fee5 = ((Number($$('#base_price5').text()) + 200 * (10 - Number($$('#expect_date5').val()))) * 0.06).toFixed(2);
        $$('#bill_fee5').text(bill_fee5);

        count_sum5 = ((Number($$('#base_price5').text()) + 200 * (10 - Number($$('#expect_date5').val()))) * 1.06).toFixed(2);
        $$('#count_sum5').text(count_sum5);

    })

    //初始化发票选择
    var draw_bill1 = '0';
    $$('#draw_billy1').click(function () {
        $$('#draw_billy1').addClass('active');
        $$('#draw_billn1').removeClass('active');
        draw_bill1 = '0';
    });
    $$('#draw_billn1').click(function () {
        console.log('sds');
        $$('#draw_billn1').addClass('active');
        $$('#draw_billy1').removeClass('active');
        draw_bill1 = '1';
    });

    var draw_bill2 = '0';
    $$('#draw_billy2').click(function () {
        $$('#draw_billy2').addClass('active');
        $$('#draw_billn2').removeClass('active');
        draw_bill2 = '0';
    });
    $$('#draw_billn2').click(function () {
        console.log('sds');
        $$('#draw_billn2').addClass('active');
        $$('#draw_billy2').removeClass('active');
        draw_bill2 = '1';
    });

    var draw_bill3 = '0';
    $$('#draw_billy3').click(function () {
        $$('#draw_billy3').addClass('active');
        $$('#draw_billn3').removeClass('active');
        draw_bill3 = '0';
    });
    $$('#draw_billn3').click(function () {
        console.log('sds');
        $$('#draw_billn3').addClass('active');
        $$('#draw_billy3').removeClass('active');
        draw_bill3 = '1';
    });

    var draw_bill4 = '0';
    $$('#draw_billy4').click(function () {
        $$('#draw_billy4').addClass('active');
        $$('#draw_billn4').removeClass('active');
        draw_bill4 = '0';
    });
    $$('#draw_billn4').click(function () {
        console.log('sds');
        $$('#draw_billn4').addClass('active');
        $$('#draw_billy4').removeClass('active');
        draw_bill4 = '1';
    });

    var draw_bill5 = '0';
    $$('#draw_billy5').click(function () {
        $$('#draw_billy5').addClass('active');
        $$('#draw_billn5').removeClass('active');
        draw_bill5 = '0';
    });
    $$('#draw_billn5').click(function () {
        console.log('sds');
        $$('#draw_billn5').addClass('active');
        $$('#draw_billy5').removeClass('active');
        draw_bill5 = '1';
    });

    //协定待遇
    var whole_flow_service2 = '0';
    $$('#whole_flow_servicey2').click(function () {
        $$('#whole_flow_servicey2').addClass('active');
        $$('#whole_flow_servicen2').removeClass('active');
        whole_flow_service2 = '0';
    });
    $$('#whole_flow_servicen2').click(function () {
        $$('#whole_flow_servicen2').addClass('active');
        $$('#whole_flow_servicey2').removeClass('active');
        whole_flow_service2 = '1';
    });

    //失联大额支付
    var whole_flow_service3 = '0';
    $$('#whole_flow_servicey3').click(function () {
        $$('#whole_flow_servicey3').addClass('active');
        $$('#whole_flow_servicen3').removeClass('active');
        whole_flow_service3 = '0';
    });
    $$('#whole_flow_servicen3').click(function () {
        $$('#whole_flow_servicen3').addClass('active');
        $$('#whole_flow_servicey3').removeClass('active');
        whole_flow_service3 = '1';
    });

    //税收情报
    var whole_flow_service4 = '0';
    $$('#whole_flow_servicey4').click(function () {
        $$('#whole_flow_servicey4').addClass('active');
        $$('#whole_flow_servicen4').removeClass('active');
        whole_flow_service4 = '0';
    });
    $$('#whole_flow_servicen4').click(function () {
        $$('#whole_flow_servicen4').addClass('active');
        $$('#whole_flow_servicey4').removeClass('active');
        whole_flow_service4 = '1';
    });

    var is_research4 = '0';
    $$('#is_researchy4').click(function () {
        $$('#is_researchy4').addClass('active');
        $$('#is_researchn4').removeClass('active');
        is_research4 = '0';
    });
    $$('#is_researchn4').click(function () {
        $$('#is_researchn4').addClass('active');
        $$('#is_researchy4').removeClass('active');
        is_research4 = '1';
    });

    //间接转让
    var is_research5 = '0';
    $$('#is_researchy5').click(function () {
        $$('#is_researchy5').addClass('active');
        $$('#is_researchn5').removeClass('active');
        is_research5 = '0';
    });
    $$('#is_researchn5').click(function () {
        $$('#is_researchn5').addClass('active');
        $$('#is_researchy5').removeClass('active');
        is_research5 = '1';
    });

    f7app.picker({
        input: '#main_tax4',
        cols: [
            {
                textAlign: 'center',
                values: ['企业', '个人']
        }
    ],
        toolbarCloseText: '确定',
    });

    //初始化确认提交事件
    $$("#post_btn_1").on("click", function () {
        console.log("非贸汇款")
        var token = app.storage.get("userArr").token;
        if (app.checkTaxForm1()) {

            app.tax_sui(token, draw_bill1)
        }
    })
    $$("#post_btn_2").on("click", function () {
        console.log("协定待遇")
        var token = app.storage.get("userArr").token;
        if (app.checkTaxForm2()) {
            app.agreement(token, draw_bill2, whole_flow_service2)
        }
    })
    $$("#post_btn_3").on("click", function () {
        console.log("大额关联支付")
        var token = app.storage.get("userArr").token;
        if (app.checkTaxForm3()) {
            app.Relation(token, draw_bill3, whole_flow_service3)
        }
    })
    $$("#post_btn_4").on("click", function () {
        console.log("税收情报交换")
        var token = app.storage.get("userArr").token;
        if (app.checkTaxForm4()) {
            app.intelligence(token, draw_bill4, is_research4, whole_flow_service4)
        }
    })
    $$("#post_btn_5").on("click", function () {
            console.log("间接财产转让")
            var token = app.storage.get("userArr").token;
            if (app.checkTaxForm5()) {
                app.propertyzhuan(token, draw_bill5, is_research5)
            }
        })
        //qq客服
    $$(".QQ").on("click", function () {
        window.localStorage["backStatus"] = false;
        YCQQ.checkClientInstalled(function () {
            InvokeApp.QQChat(function (success) {}, function (error) {}, {});
        }, function () {
            f7app.alert("您未安装QQ");
        });

    })

});
