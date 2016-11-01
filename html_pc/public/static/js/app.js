var INTERFACE_URL = "http://192.168.1.126:8080/tz-core";

var root = {
    interFace: {
        login: INTERFACE_URL + '/rest/login.do', //登陆接口
        register: INTERFACE_URL + '/rest/register.do', //注册接口
        getUserPhoneVerifyCode: INTERFACE_URL + '/rest/getUserPhoneVerifyCode.do', //发送手机验证码
        updateUserPassword: INTERFACE_URL + '/rest/updateUserPassword.do', //更新用户手机登录账号密码
        updateUserInfo: INTERFACE_URL + '/rest/updateUserInfo.do', //更新用户个人信息
        sendUserPsdMail: INTERFACE_URL + '/rest/sendUserPsdMail.do', //发送密码到用户邮箱
        getBackPass: INTERFACE_URL + 'getBackPass', //找回密码
        getHomeData: 'getHomeData', //当下收益(统计本日)
        getCollecStatutes: 'getCollecStatutes', //首页点击法规进入法规的页面，默认显示6部法规和收藏的法规
        searchStatute: 'searchStatute', //法规检索
        getStatuteInfo: 'getStatuteInfo', //法规详情
        collecStatute: 'collecStatute', //法规收藏
        getAllInform: 'getAllInform', //资讯一览
        getInform: 'getInform', //资讯详情
        commentInform: 'commentInform', //资讯评论
        collectInform: 'collectInform', //资讯收藏
        likeInform: INTERFACE_URL + '/rest/news/likeInform.do', //资讯点赞
        getNearbyServer: 'getNearbyServer', //寻他订单时，根据选择的服务地点或者GPS定位，查询所在注册的线下服务人员
        submitFounds: 'submitFounds', //寻他订单提交
        getAllFounds: 'getAllFounds', //其他订单一览
        getExpertInfo: 'getExpertInfo', //专家详情
        confirmHelp: 'confirmHelp', //确认由他帮助我
        completeFound: INTERFACE_URL + '/rest/search/completeFound.do', //订单结束时
        complaintFound: INTERFACE_URL + '/rest/search/complaintFound.do', //订单投诉
        checkIdentity: INTERFACE_URL + '/answer/checkIdentity.do', //用户身份的验证0：普通用户，1：解答者，2：线下求助者
        getAllOrder: 'getAllOrder', //线下服务订单一览
        grabOrder: 'grabOrder', //抢单
        submitLargePay: 'submitLargePay', //国际税收-大额关联支付
        submitTradePay: 'submitTradePay', //国际税收-非贸付汇
        submitPropeTrans: 'submitPropeTrans', //国际税收-间接财产转让
        submitTaxInfoExchange: 'submitTaxInfoExchange', //国际税收-税收情报交换
        submitAgreeTreatment: 'submitAgreeTreatment', //国际税收-协定待遇
        submitCompareData: 'submitCompareData', //同期资料对比
        getAllexpert: 'getAllexpert', //专家一览
        getAllTaxBureau: 'getAllTaxBureau', //税局一览
        ask: INTERFACE_URL + '/ask/ask.do', //提问
        getBankDetails: INTERFACE_URL + '/ask/getBankDetails.do', //题库详情
        adoptJoinBank: INTERFACE_URL + '/ask/adoptJoinBank.do', //采纳申请并加入题库
        toScore: INTERFACE_URL + '/ask/toScore.do', //评分
        getAllQuestions: INTERFACE_URL + '/answer/getAllQuestions.do', //全部问题一览
        getQuestionInfo: INTERFACE_URL + '/ask/getQuestionInfo.do', //问题详情
        answer: INTERFACE_URL + '/answer/answer.do', //回答
        getUserInfo: 'getUserInfo', //个人信息的展示，用于在我的页面显示
        getAllInvoice: 'getAllInvoice', //发票一览
        saveInvoiceInfo: INTERFACE_URL + '/rest/myApp/saveInvoiceInfo.do', //申请发票
        getInvoiceHistory: 'getInvoiceHistory', //取得可开票的金额和历史信息
        submitReceipt: INTERFACE_URL + '/rest/myApp/submitReceipt.do', //确认发票收货
        checkInvitation: 'checkInvitation', //邀请验证
        submitInvierrorCode: 'submitInvierrorCode', //重新提交邀请码
        getAllFriends: INTERFACE_URL + '/rest/myApp/getAllFriends.do', //下线列表
        getAllAsks: 'getAllAsks', //问答咨询一览
        getAllAnswers: 'getAllAnswers', //问答解答一览
        getAskInfo: INTERFACE_URL + '/answer/getAskInfo.do', //提问详情
        getAllHelps: 'getAllHelps', //问答援助一览
        getAllBank: 'getAllBank', //题库一览
        insertBank: INTERFACE_URL + '/rest/myApp/insertBank.do', //题库添加
        getProfit: 'getProfit', //提现初始化
        submitProfit: 'submitProfit', //提现提交
        getCapitalRecord: 'getCapitalRecord', //资金一览
        buy: 'buy', //通过支付宝和微信购买服务
        saveUserInfo: 'saveUserInfo', //签名和昵称信息修改==》更新用户个人信息=updateUserInfo.do==65
        saveAvatar: INTERFACE_URL + '/rest/myApp/saveAvatar.do', //头像修改
        saveBestPrice: INTERFACE_URL + '/rest/myApp/saveBestPrice.do', //设置个人最低价
        saveUserPayPwd: INTERFACE_URL + '/rest/myApp/saveUserPayPwd.do', //设置支付密码
        updateUserPayPwd: INTERFACE_URL + '/rest/myApp/updateUserPayPwd.do', //重设密码
        payment: 'payment', //支付
        updateUserPassword: INTERFACE_URL + '/rest/updateUserPassword.do', //更新用户手机登录账号密码
        updateUserInfo: INTERFACE_URL + '/rest/updateUserInfo.do', //更新用户个人信息
        queryCollectionListByUID: INTERFACE_URL + '/rest/news/queryCollectionListByUID.do', //查询个人收藏列表
        updateCollectionByCID: INTERFACE_URL + '/rest/news/updateCollectionByCID.do', //用户取消收藏的信息
        sendUserPsdMail: INTERFACE_URL + '/rest/sendUserPsdMail.do', //发送密码到用户邮箱
        getHelpListByArea: INTERFACE_URL + '/search/getHelpListByArea.do', //获取用户本地求助列表-寻我订单列表
        getServiceInfoByUID: INTERFACE_URL + '/search/getServiceInfoByUID.do', //获取服务者信息
        selectSearchInfo: INTERFACE_URL + '/search/selectSearchInfo.do', //获取寻他的显示信息
        saveHelpInfo: INTERFACE_URL + '/rest/search/saveHelpInfo.do', //保存求助信息
        queryHelpListByHUID: INTERFACE_URL + '/rest/search//queryHelpListByHUID.do', //查询用户求助信息列表--寻他目录
        buildInfoSign: INTERFACE_URL + '/rest/pay/alipay/buildInfoSign.do', // 获取签名后的订单信息
        getAliPayVerifyResult: INTERFACE_URL + '/rest/pay/getAliPayVerifyResult.do', //验签，解析支付结果
        AlipayNotifyUrl: INTERFACE_URL + '/rest/pay/alipay/AlipayNotifyUrl.do', //支付宝异步返回结果
        findWeXinOrderSign: INTERFACE_URL + '/rest/pay/findWeXinOrderSign.do', //获取微信支付调用支付签名信息
        WeXinNotifyUrl: INTERFACE_URL + '/rest/pay/WeXinNotifyUrl.do', //微信异步通知
        WeXinApplyRefund: INTERFACE_URL + '/rest/pay/WeXinApplyRefund.do', //微信申请退款
        findWeXinPayResult: INTERFACE_URL + '/rest/pay/findWeXinPayResult.do', //查询微信支付结果状态
        getCollectionInfoByID: INTERFACE_URL + '/rest/news/getCollectionInfoByID.do', //查询个人收藏的详细信息
        queryUserInvoiceList: INTERFACE_URL + '/rest/myApp/queryUserInvoiceList.do', //获取用户发票列表
        saveUserService: INTERFACE_URL + '/rest/myApp/saveUserService.do', //保存用户申请解答者/线下服务者 信息
        queryAskBankByUID: INTERFACE_URL + '/rest/myApp/queryAskBankByUID.do', //查询用户题库信息列表
        getAskBankByBID: INTERFACE_URL + '/rest/myApp/getAskBankByBID.do', //根据题库id查询题库详细信息
        queryAllAnswer: INTERFACE_URL + '/rest/myApp/queryAllAnswer.do', //查询问答栏目解答列表
        queryAllAsk: INTERFACE_URL + '/rest/myApp/queryAllAsk.do', //获取问答栏目咨询列表
        queryHelpListInfo: INTERFACE_URL + '/rest/myApp/queryHelpListInfo.do', //查询问答栏目 求助信息列表
        queryServiceList: INTERFACE_URL + '/rest/myApp/queryServiceList.do', //查询问答栏目 援助列表信息
        queryServicesByArea: INTERFACE_URL + '/rest/myApp/queryServicesByArea.do', //获取用户所在地专家列表
        queryServiceFee: INTERFACE_URL + '/rest/myApp/queryServiceFee.do', //查询用户收入信息列表
        queryServiceByExist: INTERFACE_URL + '/rest/myApp/queryServiceByExist.do', //根据条件查询专家列表
        updateUserLevel: INTERFACE_URL + '/rest/myApp/updateUserLevel.do', //用户申请等级-解答者或线下服务者
        saveInternationalInfo: INTERFACE_URL + '/home/saveInternationalInfo.do', //保存国际税收信息
        saveCollectionInfo: INTERFACE_URL + '/home/saveCollectionInfo.do', //保存收藏信息
        updateCollectionInfoSttByCID: INTERFACE_URL + '/home/updateCollectionInfoSttByCID.do', //更新用户收藏信息
    },
    error: {
        e: '错误',
    },
    timeout: 10000
}

window.app = {};


app.init = (function () {

    return '';
})();

/*
 *   loader
 */

app.loader = (function () {
    function show() {
        f7app.showIndicator()
    }

    function hide() {
        f7app.hideIndicator();
    }

    return {
        show: show,
        hide: hide
    }
})()
/*
 *    弹出提示框组件
 */
app.toast = (function () {
    return function (tit, txt) {
        var params = {};

        if (arguments.length === 1) {
            params.text = tit
        } else if (arguments.length === 2) {
            params.title = tit;
            params.text = txt
        }

        f7app.modal(params);

        setTimeout(function () {
            f7app.closeModal('.modal.modal-in');
        }, 2000)
    }
})();
/*
 *    本地存储
 */
app.storage = (function () {
    function setParams(key, jsonObj) {
        localStorage.setItem(key, JSON.stringify(jsonObj));
    }

    function getParams(key) {
        var strObj = localStorage.getItem(key);
        return JSON.parse(strObj);
    }

    return {
        set: setParams,
        get: getParams
    }
})()


/*
 *  邮箱&手机号
 */

app.empty = (function () {
    return {
        tel: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
        emi: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    }
})()
/*
 *   ajax
 */

app.doAjax = (function () {
    return function (interFace, type, param, succCallBack) {
        console.log('接口:' + interFace);
        console.log('类型:' + type);
        console.log('输入:' + JSON.stringify(param));
        //console.log('函数:' + succCallBack);

        Dom7.ajax({
            url: interFace,
            type: type,
            data: JSON.stringify(param),
            contentType: "application/json;charset=UTF-8",
            timeout: root.timeout,
            beforeSend: function (request) {
                app.loader.show();
            },
            success: function (data, status, response) {
                succCallBack(data, status, response)
            },
            complete: function () {
                app.loader.hide();
            },
            error: function (xhr, type, errorThrown) {
                console.log(xhr);
                app.toast('通讯错误，请重试。');
            }
        });
    }
})()


/*
 *   获取当前时间
 */
var D = (function () {

    var oDate = new Date(); //实例一个时间对象；
    var oYear = oDate.getFullYear(); //获取系统的年；
    var oMonth = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    var oDay = oDate.getDate(); // 获取系统日，
    var oHours = oDate.getHours(); //获取系统时，
    var oMinutes = oDate.getMinutes(); //分
    var oSeconds = oDate.getSeconds(); //秒

    oMonth = oMonth.length > 1 ? "" + oMonth : "0" + oMonth;
    oDay = oDay.length > 2 ? "0" + oDay : "" + oDay;

    return {
        y: oYear,
        m: oMonth,
        d: oDay,
        h: oHours,
        mi: oMinutes,
        s: oSeconds
    }
})()