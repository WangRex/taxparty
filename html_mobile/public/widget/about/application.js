var idCardImgList = [];
var majorImgList = [];
var idCounter = 0;
var majorCounter = 0;
f7app.onPageInit('application', function (page) {
    $$('#applicationGoBack').click(function () {
        //我的页面个人信息ajax请求
        app.getUserInfo = (function () {
            return function () {

                var token = app.storage.get("userArr").token;
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

        app.getUserInfo();
    });
    console.log(page.url);

    //绑定返回键
    window.localStorage["page"] = 'about';
    //初始化上传
    var iduploader = WebUploader.create({
        //auto: true,
        // swf文件路径
        swf: '../static/lib/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: root.interFace.saveAvatar,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#idCardPicker',

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });
    // 当有文件添加进来的时候
    iduploader.on('fileQueued', function (file) {
        console.log(file);
        var $li = $(
                '<div class="swiper-slide">' +
                '<div class="list-block media-list">' +
                '<div class="item-content">' +
                '<div class="item-media">' +
                '<div id="' + file.id + '" >' +
                '<img>' +
                //       file-item thumbnail          '<div class="info">' + file.name + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $('#idCardImageBox').append($li);

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        iduploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            idCounter++;
            console.log(idCounter);
            if (idCounter == 1) {
                $('.oraginIdCardImg').hide();
                $('.oraginIdCardImg').remove();
                idCardImgList.length = 0;
            }
            $img.attr('src', src);
            idCardImgList.push(src);
            var swiper = new Swiper('.swiper-container', {
                scrollbarHide: true,
                slidesPerView: 'auto'
            });

        }, 100, 100);
    });

    //初始化上传
    var majoruploader = WebUploader.create({
        swf: '../static/lib/webuploader/Uploader.swf',
        server: root.interFace.saveAvatar,
        pick: '#majorPicker',
        resize: false
    });
    // 当有文件添加进来的时候
    majoruploader.on('fileQueued', function (file) {
        console.log(file)
        var $li = $(
                '<div class="swiper-slide">' +
                '<div class="list-block media-list">' +
                '<div class="item-content">' +
                '<div class="item-media">' +
                '<div id="' + file.id + '">' +
                '<img>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            ),
            $img = $li.find('img');

        $('#majorImageBox').append($li);

        majoruploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            majorCounter++;
            console.log(majorCounter);
            if (majorCounter == 1) {
                $('.oraginMajorImg').hide();
                $('.oraginMajorImg').remove();
                majorImgList.length = 0;
            }
            $img.attr('src', src);
            majorImgList.push(src);
            var swiper = new Swiper('.swiper-container', {
                scrollbarHide: true,
                slidesPerView: 'auto'
            });
        }, 100, 100);
    });

    //初始化工作地点
    var region_code_picker = new mui.PopPicker({
        layer: 3
    });

    region_code_picker.setData(cityData3);
    $$("#region_code").on('click', function (event) {
        console.log(this);
        var self = this;
        region_code_picker.show(function (items) {
            var t = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
            self.value = t;
            if (items[2].value) {
                self.setAttribute("data_id", items[2].value);
            } else if (items[1].value) {
                self.setAttribute("data_id", items[1].value);
            }
            console.log(items[0].value + '---' + items[1].value + '----' + items[2].value)
        });
    }, false);

    $$('#agreementBox').click(function () {
        if ($$("#agreementBox").css('background-image') == 'none') {
            $$('#agreementBox').css('background-image', 'url("../static/images/img/checked-sign.png")')
//            $$('#agreementBox').css('border-width', '0px')
//            $$('#agreementBox').css('margin-right', '4px')
        } else {
            $$('#agreementBox').css('background-image', 'none')
            $$('#agreementBox').css('border-width', '1px')
        }
    });

    //页面初始化数据请求
    app.applicationInit();
});


//申请解答者页面数据初始化
app.applicationInit = (function () {
    return function () {

        var token = app.storage.get("userArr").token;
        var param = {
            "token": token
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            //data.data != null
            console.info(data.data);
            if (data.data == true) {
                //data.data.state === '1'
                if (data.data.state == '1') {
                    app.toast('您的申请正在审核中，请耐心的等待。');
                    /*view.router.goBack();
                    $$('#aboutPage').removeClass('page-on-center')
                    $$('#aboutPage').addClass('page-on-center')*/
                    $$('#submit').attr('disabled', 'disabled')
                } else {

                    var idCardImgList = data.data.idCardImgList;
                    for (var i = 0; i < idCardImgList.length; i++) {

                        var $li = $(
                                '<div class="swiper-slide oraginIdCardImg">' +
                                '<div class="list-block media-list">' +
                                '<div class="item-content">' +
                                '<div class="item-media">' +
                                '<div >' +
                                '<img src="' + idCardImgList[i] + '">' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            ),
                            $img = $li.find('img');

                        $('#idCardImageBox').append($li);
                    }

                    var majorImgList = data.data.majorImgList;
                    for (var i = 0; i < majorImgList.length; i++) {

                        var $li = $(
                                '<div class="swiper-slide oraginMajorImg">' +
                                '<div class="list-block media-list">' +
                                '<div class="item-content">' +
                                '<div class="item-media">' +
                                '<div >' +
                                '<img src="' + majorImgList[i] + '">' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            ),
                            $img = $li.find('img');

                        $('#majorImageBox').append($li);
                    }

                    /* var application_tpl = $$('script#application_tpl').html();
                     var tpl = Template7.compile(application_tpl);
                     $$("#application_list").html(tpl(data.data));*/
                    var real_name = $$("#real_name").val(data.data.real_name);
                    var phone_number = $$("#phone_number").val(data.data.phone_number);
                    var region_code = $$("#region_code").val(data.data.region_name);
                    var region_code_code = $$("#region_code").attr("data_id", data.data.region_code);
                    var company_post = $$("#company_post").val(data.data.company_post);
                    var majorList = data.data.majorList;
                    $$('#majorSummary').html(majorList);
                    if (majorList.length == 0) {

                        $$('#majorSummary').html('可多选');
                    }
                    $('#majorList option').each(function () {
                        for (var i = 0; i < majorList.length; i++) {
                            if (majorList[i] == $$(this).val()) {
                                console.log($$(this));
                                $$(this)[0].selected = true;
                                break;
                            }
                        }
                    });

                    var taxpropertyList = data.data.taxpropertyList;
                    if (taxpropertyList.length == 0) {
                        $$('#taxpropertySummary').html('可多选');
                    }
                    var list = [];
                    $('#taxpropertyList option').each(function () {
                        for (var i = 0; i < taxpropertyList.length; i++) {
                            if (taxpropertyList[i] == $$(this).val()) {
                                $$(this)[0].selected = true;
                                list.push($$(this).text());
                                break;
                            }
                        }
                    });
                    $$('#taxpropertySummary').html(list);
                }
            } else {
                console.info(data.data);

            }
                    app.application()


        };

        app.doAjax(root.interFace.getUserLevel, 'post', param, succCallBack);
    }

})();


//申请解答者提交数据
app.application = (function () {
    return function () {

        //提交按钮点击事件
        $$("#submit").on("click", function () {
            //收集选中的数据(checkbox)
            var majorList = [];
            $('#majorList :selected').each(function () {
                majorList.push($$(this).val())
            });

            var taxpropertyList = [];
            $('#taxpropertyList :selected').each(function () {
                taxpropertyList.push($$(this).val())
            });


            var real_name = $$("#real_name").val();
            var phone_number = $$("#phone_number").val();
            var region_code = $$("#region_code").attr("data_id");
            var company_post = $$("#company_post").val();
            var level = "1";
            console.log(token, real_name, idCardImgList, phone_number, region_code, majorList, majorImgList, company_post, taxpropertyList, level);

            //提交前验证
            if (!app.empty.tel.test(phone_number)) {
                app.toast("请输入正确格式的手机号！");
                return false;
            } else if (!region_code) {
                app.toast("工作地点不能为空！");
                return false;
            } else if (majorList.length === 0) {
                app.toast("专业资格不能为空！");
                return false;
            } else if (majorImgList.length === 0) {
                app.toast("请上传专业资格相关的证件图片！");
                return false;
            } else if (taxpropertyList.length === 0) {
                app.toast("擅长税务领域不能为空！");
                return false;
            } else if ($$("#agreementBox").css('background-image') == 'none') {
                app.toast("请同意《税务在线服务协议》！");
                return false;
            } else {
                var token = app.storage.get("userArr").token;

                var param = {
                    "token": token,
                    "real_name": real_name,
                    "idCardImgList": idCardImgList,
                    "phone_number": phone_number,
                    "region_code": region_code,
                    "majorList": majorList,
                    "majorImgList": majorImgList,
                    "company_post": company_post,
                    "taxpropertyList": taxpropertyList,
                    "level": level
                };
                console.log(param);
                var succCallBack = function (data, status, response) {
                    var data = JSON.parse(data);
                    console.log(data);
                    app.toast("解答者申请成功");
                    view.about.router.load({
                        'pageName': 'about'
                    });

                };

                return app.doAjax(root.interFace.updateUserLevel, 'post', param, succCallBack);

            }

        })
    }

})();
