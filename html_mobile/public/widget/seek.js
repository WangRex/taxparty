/* ===== 获取用户本地求助列表 - 寻我订单列表 ===== */



//寻我tab触发事件
$$("#tab2_find").on("show", function () {
    //获取token
    var token = app.storage.get("userArr").token;
    app.findMe(token);
});


//寻我列表ajax请求
app.findMe = (function () {

    return function (token) {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            data.data = [{
                "username": "15210044288",
                "phone_number": "15210044288",
                "help_id": 1,
                "marker": "2",
                "name": "北京市",
                "help_user_id": 1,
                "offer": 100.00,
                "tof_stt": "1",
                "service_date": "2016-09-06 03:23:03",
                "avatar": "/C:/touxiang.jpg",
                "problem_des": "测试描述",
                "major": ["律师", "公务员", "税务师"]
    }, {
                "username": "username",
                "phone_number": "phone_number",
                "help_id": 33,
                "marker": "2",
                "name": "name",
                "help_user_id": 1,
                "offer": 'offer',
                "tof_stt": "1",
                "service_date": "2016-09-06 03:23:03",
                "avatar": "/C:/touxiang.jpg",
                "problem_des": "测试描述",
                "major": ["律师", "公务员", "税务师"]
    }];
            $$.each(data.data, function (i, e) {

                if (e.tof_stt == '0') {
                    e["status"] = '已完成'
                    e["_before"] = 'aft'
                } else if (e.tof_stt == '1') {
                    e["status"] = '抢单中'
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

            //console.log(data.data)
        }

        var getHelpListByArea = root.interFace.getHelpListByArea;

        return app.doAjax(getHelpListByArea, 'post', param, succCallBack);
    }
})();




//抢单按钮触发事件
//$$(document).on('click', '#grabOrder'+id, function () {
app.grabOrderBtn = function (helpId) {
    var token = app.storage.get("userArr").token;
    app.grabOrder(token, helpId)
}


//抢单ajax请求
app.grabOrder = (function () {

    return function (token, helpId) {

        var param = {
            "token": token,
            "help_id": helpId,
            "rem": "备注"
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            //$$(this).parents('.card').removeClass('before');
            //var id = $$(this).parents('.card').attr('data-id');

            app.toast("抢单成功！");
            $$('#grabOrder' + helpId).css("display", "none");
            $$('#card' + helpId).addClass("bef");
            $$('#status' + helpId).html("进行中");


        };

        var grabOrder = root.interFace.grabOrder;
        return app.doAjax(grabOrder, 'post', param, succCallBack)

    }

})()


/* ===== 获取用户本地求助列表 - 寻他列表 ===== */

//寻他首页初始化
$$("#seek").on("show", function () {

    var token = app.storage.get("userArr").token;
    var area = '北京市';
    app.selectSearchInfo(token, area);
});

//寻他首页初始化GPS
$$("[href='#seek']").on("click", function () {
    f7app.confirm('是否开启GPS定位功能?', function () {
        //myApp.alert('You clicked Ok button');
        app.queryServicesByArea(token);
    });
});


//寻他首页ajax请求
app.selectSearchInfo = (function () {

    return function (token, area) {

        var param = {
            "token": token,
            "area": area
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data != null) {
                $$(".tips").html('您的储值卡余额为 ' + data.data[0].balance + ' 元');
                $$("#total").html(data.data[0].total);
            }

        };

        var selectSearchInfo = root.interFace.selectSearchInfo;
        return app.doAjax(selectSearchInfo, 'post', param, succCallBack)

    }

})()


//GPS定位ajax请求
app.queryServicesByArea = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var queryServicesByArea = root.interFace.queryServicesByArea;
        return app.doAjax(queryServicesByArea, 'post', param, succCallBack)

    }

})()

//点击寻我验证身份
$$('#findme').click(function () {
    var token = app.storage.get("userArr").token;
    app.checkIdentity(token);
});

//点击寻我验证身份
$$('#findme').mousedown(function () {
    var token = app.storage.get("userArr").token;
    app.checkIdentity1(token);
});

//寻我权限ajax请求
app.checkIdentity = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.data[0] === 0 || data.data[0] === 1) {

                f7app.modal({
                    //title: 'Vertical Buttons Layout',
                    text: '<img src="/static/images/img/del.png" style="position:absolute;right:-20px;top:-20px;background:black;"><p>抱歉，您尚未申请成为线下服务者，我们无法向您推送问题。</p><br/><center><button class="button button-big button-fill color-main">马上申请</button></center>',
                    verticalButtons: true,

                })
            } else {

                app.findMe(token);
            }
        };

        var checkIdentity = root.interFace.checkIdentity;
        return app.doAjax(checkIdentity, 'post', param, succCallBack)

    }

})();

//寻我权限ajax请求
app.checkIdentity1 = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
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
$$(document).on('click', '#submitFounds', function () {
    var token = app.storage.get("userArr").token;
    var problem_des = $$('#problem_des').val();;
    var tof_gps = 'gps';
    var offer = $$("#offer").val();
    var region_id = $$('#showCityPicker3').val();
    var service_date = $$('#showDataPicker').val();

    app.submitFounds(token, problem_des, tof_gps, offer, region_id, service_date);

});

//提交寻他首页ajax请求
app.submitFounds = (function () {

    return function (token, problem_des, tof_gps, offer, region_id, service_date) {

        var param = {
            "token": token,
            "tof_gps": tof_gps,
            "problem_des": problem_des,
            "offer": offer,
            "service_date": service_date,
            "region_id": region_id

        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var submitFounds = root.interFace.submitFounds;
        return app.doAjax(submitFounds, 'post', param, succCallBack);

    }

})();

/* ===== 寻Ta - 订单 ===== */

//订单初始化
f7app.onPageBeforeAnimation('order', function (page) {

    console.log(page.url);

    var swiper = new Swiper('.swiper-container', {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: true,
        slidesPerView: 'auto'
    });



    //获取token
    var token = app.storage.get("userArr").token;
    app.getAllFounds(token);


});

//寻他订单ajax请求
app.getAllFounds = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            $$.each(data.data, function (i, e) {

                if (e.helpInfo.tof_stt == '0') {
                    e["status"] = '已完成'
                    e["_before"] = 'aft'
                } else if (e.helpInfo.tof_stt == '1') {
                    e["status"] = '抢单中'
                    e["_before"] = 'before'
                } else if (e.helpInfo.tof_stt == '2') {
                    e["status"] = '进行中'
                    e["_before"] = 'bef'
                } else if (e.helpInfo.tof_stt == '7') {
                    e["status"] = '忽略'
                }

            })


            var unselectedOrder = [];
            var selectedOrder = [];
            $$.each(data.data, function (i, e) {
                if (e.service.constructor == Array) {
                    $$.each(e.service, function (i, s) {
                        s["help_id"] = e.helpInfo.help_id;
                    })
                    unselectedOrder.push(e);
                } else {
                    selectedOrder.push(e);
                }
            })

            $$.each(unselectedOrder, function (i, e) {
                e.helpInfo["service"] = e.service;
            })
            $$.each(selectedOrder, function (i, e) {
                e.helpInfo["answer_count"] = e.service.answer_count
                e.helpInfo["apply_date"] = e.service.apply_date
                e.helpInfo["card_id"] = e.service.card_id
                e.helpInfo["company_post"] = e.service.company_post
                e.helpInfo["integrals"] = e.service.integrals
                e.helpInfo["level"] = e.service.level
                e.helpInfo["line_service_slogan"] = e.service.line_service_slogan
                e.helpInfo["lowest_amt"] = e.service.lowest_amt
                e.helpInfo["major_id"] = e.service.major_id
                e.helpInfo["path_url"] = e.service.path_url
                e.helpInfo["phone_number"] = e.service.phone_number
                e.helpInfo["real_name"] = e.service.real_name
                e.helpInfo["remarks"] = e.service.remarks
                e.helpInfo["service_region_id"] = e.service.service_region_id
                e.helpInfo["services_id"] = e.service.services_id
                e.helpInfo["state"] = e.service.state
                e.helpInfo["tax_id"] = e.service.tax_id
                e.helpInfo["token"] = e.service.token
                e.helpInfo["top"] = e.service.top
                e.helpInfo["user_id"] = e.service.user_id
                e.helpInfo["verify_time"] = e.service.verify_time
                e.helpInfo["work_region_id"] = e.service.work_region_id
            })
            console.log(selectedOrder);
            console.log(unselectedOrder);



            if (unselectedOrder.length > 0) {
                console.log(111241412);
                var order_tpl = $$('script#all_order_list_tpl').html();
                var tpl = Template7.compile(order_tpl);
                $$("#all_card_container_unselected").html(tpl(unselectedOrder))
            }
            if (selectedOrder.length > 0) {
                var order_tpl = $$('script#all_order_list_tpl_selected').html();
                var tpl = Template7.compile(order_tpl);
                $$("#all_card_container_selected").html(tpl(selectedOrder))
            }
        };


        var getAllFounds = root.interFace.getAllFounds;
        return app.doAjax(getAllFounds, 'post', param, succCallBack)

    }

})()


/* ===== 首页  我的 ===== */

//我的按钮触发事件
$$(document).on('click', '#expertDetail', function () {
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



app.showExpert = function (help_id, avatar, username, major) {
    console.log(help_id, avatar, username, major);
    f7app.modal({
        //title: 'Vertical Buttons Layout',
        text: '<img src="/static/images/img/del.png" style="position:absolute;right:-18px;top:-18px;"><center><img src="' + '/static/images/jpg.jpg' + '" width="44" style="border-radius:30px;"><br/><b>' + username + '</b><br/><a href="" class="tags">' + major + '</a><br/><br/><br/><br/><button class="button button-big button-fill color-main" onclick="app.adoptExpert(' + help_id + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;采 纳&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></center><span style="font-size:8px;color:gray;">采纳后查阅抢单人的联系方式</span>',
        verticalButtons: true,
        buttons: [
            {
                text: '关闭',
                onClick: function () {
                    //myApp.alert('You clicked first button!')
                }
      }
    ]
    })

}

app.adoptExpert = function (id) {

    //app.toast("采纳成功！");
    $$('#finishOrder' + id).css("display", "block");
    $$('#finishOrder' + id).html("完成1");
    $$('#card' + id).addClass("bef");
    $$('#status' + id).html("进行中");

};





//专家详情ajax请求
app.getServiceInfoByUID = (function () {

    return function (token, serviceId) {

        var param = {
            "token": token,
            "serviceId": serviceId
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var getServiceInfoByUID = root.interFace.getServiceInfoByUID;
        return app.doAjax(getServiceInfoByUID, 'post', param, succCallBack)

    }

})()


//确认由他帮助我ajax请求
app.chooseServiceUser = (function () {

    return function (token, service_uid, help_id) {

        var param = {
            "token": token,
            "service_uid": service_uid,
            "help_id": help_id
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var chooseServiceUser = root.interFace.chooseServiceUser;
        return app.doAjax(chooseServiceUser, 'post', param, succCallBack)

    }

})()


//完成订单ajax请求
app.completeFound = (function () {

    return function (token, need_id) {

        var param = {
            "token": token,
            "need_id": need_id
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var completeFound = root.interFace.completeFound;
        return app.doAjax(completeFound, 'post', param, succCallBack)

    }

})()


//订单投诉ajax请求
app.complaintFound = (function () {

    return function (token, need_id, complaint) {

        var param = {
            "token": token,
            "need_id": need_id,
            "complaint": complaint
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var complaintFound = root.interFace.complaintFound;
        return app.doAjax(complaintFound, 'post', param, succCallBack)

    }

})()






//我的 用户申请升级按钮触发事件
$$(document).on('click', '#saveUserLevel', function () {
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
app.saveUserService = (function () {

    return function (token, real_name, major_id, tax_id, company_post, line_service_slogan, service_region_id, remarks, phone_number, level) {

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

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var saveUserService = root.interFace.saveUserService;
        return app.doAjax(saveUserService, 'post', param, succCallBack)

    }

})()
