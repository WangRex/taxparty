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
                }
                //console.log(dataUrl);
        }
        reader.readAsDataURL(file);
    })

    var token = app.storage.get("userArr").token;
    var img = file.name;
    app.saveAvatar(token, img);
})

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

        };

        var saveAvatar = root.interFace.saveAvatar;
        return app.doAjax(saveAvatar, 'post', param, succCallBack)

    }

})()


f7app.onPageBeforeAnimation('about', function (page) {
    var token = app.storage.get("userArr").token;
    app.getUserInfo(token);
});

//我的页面个人信息ajax请求
app.getUserInfo = (function () {

    return function (token) {

        var param = {
            "token": token
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var getUserInfo = root.interFace.getUserInfo;
        return app.doAjax(getUserInfo, 'post', param, succCallBack)

    }

})()






//修改昵称 触发事件  - 虚拟
$$(document).on('click', '#user_name', function () {
    var token = app.storage.get("userArr").token;
    var nick_name = "小王";
    var sign = "若水三千非一日之冰";
    app.updateUserInfo(token, nick_name, sign);
});
//修改昵称ajax请求
app.updateUserInfo = (function () {

    return function (token, nick_name, sign) {

        var param = {
            "token": token,
            "nick_name": nick_name,
            "sign": sign
        };

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

        };

        var updateUserInfo = root.interFace.updateUserInfo;
        return app.doAjax(updateUserInfo, 'post', param, succCallBack)

    }

})()



/* ===== 首页-> 我的 支付功能 ===== */

//支付页面初始化
$$('#index-pay-money').val(999);
$$('#index-pay-money').attr('readonly', 'readonly');

//vip选择change事件
$$('#radio_tab input[name="radio"]').change(function () {
    if (this.value == 'SVIP') {
        $$('#index-pay-money').val(999);
        $$('#index-pay-money').attr('readonly', 'readonly');

    }
    if (this.value == 'VIP') {
        $$('#index-pay-money').val(99);
        $$('#index-pay-money').attr('readonly', 'readonly');
    }
    if (this.value == 'card') {
        $$('#index-pay-money').val('');
        $$('#index-pay-money').removeAttr('readonly', 'readonly');
    }
});

//支付金钱校验
$$("#index-pay-btn").on("click", function () {
    var amt = $$("#index-pay-money").val();

    console.log(amt);
    if (!amt) {
        app.toast("不能输入空");
        return false;
    } else if (!/^[1-9]\d*$/.test(amt)) {
        app.toast("请输入大于0的数字");
        return false
    } else {
        var token = app.storage.get("userArr").token
            //var amt = "200";
        var vipType = $$('#radio_tab input[name="radio"]:checked').val();
        var payModel = "WX";
        var payacc = "4333@qq.com";
        app.vipType(token, amt, vipType, payModel, payacc);
    }
});

//用户充值ajax请求
app.vipType = (function () {

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

        };

        var vipType = root.interFace.vipType;
        return app.doAjax(vipType, 'post', param, succCallBack)

    }

})()
