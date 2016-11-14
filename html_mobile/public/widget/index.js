window.onbeforeunload = function() {
    var n = window.event.screenX - window.screenLeft;
    var b = n > document.documentElement.scrollWidth - 20;
    if (!(b && window.event.clientY < 0 || window.event.altKey)) {
        app.storage.clr()
    }
}  

//自适应高度
var loadResize = {
    init: function () {
        this.size();

        var userArr = app.storage.get("userArr");

        if (userArr == null) {
            $$("#user_list").html('')
            $$("div.home_main_mod a").attr("href", "#");
        }
    },
    size: function () {
        var win = $$(window).height();
        var hdH = $$("div.navbar").height();
        var bdH = ($$("div.home_pnel").height() + $$("div.home_matter").height()) + 20;
        var ftH = $$("div.tabsbar").height();
        var rowH = win - (hdH + bdH + ftH);
        $$("div.home_main_mod").css("height", rowH / 3 + "px")
    }
}
loadResize.init();
window.onresize = function () {
    loadResize.init();
}

$$(document).on("click", "div.home_main_mod a.btn",function (event) {
    var userArr = app.storage.get("userArr");
    if (userArr == null) {
        app.toast("您还没有登录!");

        return false
    }
    return false;
    event.preventDefault();
    event.stopPropagation();
})

$$(document).on("click", "#msg-btn",function (event) {

    var userArr = app.storage.get("userArr");
    if (userArr == null) {
        app.toast("您还没有登录!");

        return false
    }
    view.main.router.loadPage('index/msg.html');
    return false;
    event.preventDefault();
    event.stopPropagation();
})

/* ===== 注册 ===== */
f7app.onPageAfterAnimation('register', function (page) {


})

$$(document).on("click", "#register", function () {
    app.isLR.r()
})

$$(document).on("click", "#verifyCode", function () {

    var slef = $$(this);
    var users = $$("#users").val();

    var num = 59;
    var txt = $$(this).text();

    if (!users) {
        app.toast('用户名不能为空!');
        return false
    } else if (app.empty.tel.test(users)) {
        app.verifyCode('0', users)
    } else if (app.empty.emi.test(users)) {
        app.verifyCode('1', users)
    } else {
        app.toast('请输入正确的邮箱和手机号码!')
    }

    function time(index) {
        if (num == 0) {
            index.removeClass("disabled");
            index.html(txt);
            num = 59;
        } else {
            index.addClass("disabled");
            index.html(num + 'S');
            num--;
            setTimeout(function () {
                time(index)
            }, 1000)
        }
    }
})

/* ===== 登陆 ===== */
f7app.onPageInit('login', function (page) {

    // f7app.hideToolbar($$(".toolbar"));


})

$$(document).on("click", "#dologin", function () {
    app.isLR.l()
})

$$("#user").on("keyup", function (event) {
    if (event.keyCode == 13) {
        app.isLR.l()
    }
});


/* ===== 首页 ===== */
f7app.onPageBeforeAnimation('home', function (page) {

    //绑定返回键
    window.localStorage["page"] = 'main';
    
    // f7app.showToolbar($$(".toolbar"));
    var data = app.storage.get("userArr");
    console.log(data);

    if (data == null) {
        
        var home_tpl = $$('script#home_head_tpl').html();
        $$("#home_pnel").html(home_tpl)
        
        $$("#ask_list").html('<div class="not">等待解答中...</div>');
        $$("#answer_list").html('<div class="not">无解决的问题</div>');
        loadResize.init();
        return false
    }

    if (data.errCode == '0') {

        if (data.amount != '' || data.amount != null) {
            data.profit.gross_income = data.profit.gross_income.toFixed(2);
        }
        
        var home_tpl = $$('script#home_tpl').html();
        var tpl = Template7.compile(home_tpl);
        $$("#home_pnel").html(tpl(data.profit));
        
        var tobarBtn_tpl = $$("script#tobarBtn_tpl").html();
        $$("#tobarBtn").html(tobarBtn_tpl)

        loadResize.init();
        
        var askListData = data.askList;
        
        if (askListData.length != 0) {
            
            for(key in askListData){
                askListData[key]["answer_context"] = askListData[key].answers[0].answer_context
            }
            
            console.log(askListData)
            
            var ask_list_tpl = $$('script#ask_list_tpl').html();
            var tpl = Template7.compile(ask_list_tpl)
            $$("#ask_list").html(tpl(askListData))
            
            var answer_list_tpl = $$('script#answer_list_tpl').html();
            var tpl = Template7.compile(answer_list_tpl)
            $$("#answer_list").html(tpl(askListData))

        }

            

    } else {
        app.toast('系统异常！');
    }


})

/* ===== 寻Ta ===== */
f7app.onPageBeforeAnimation('seek', function (page) {

})

/* ===== 寻Ta - 订单 ===== */
f7app.onPageBeforeAnimation('order', function (page) {


    var swiper = new Swiper('.swiper-container', {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: true,
        slidesPerView: 'auto'
    });
});

//
// f7app.onPageBeforeAnimation('queryDetails', function (page) {
//
//
//     function encode(s) {
//         return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/([\\\.\*\[\]\(\)\$\^])/g, "\\$1");
//     }
//
//     function decode(s) {
//         return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g, "$1").replace(/>/g, ">").replace(/</g, "<").replace(/&/g, "&");
//     }
//
//     function highlight(s) {
//         if (s.length == 0) {
//             app.toast('搜索关键词未填写！');
//             return false;
//         }
//         s = encode(s);
//         var obj = document.getElementsByTagName("body")[0];
//         var t = obj.innerHTML.replace(/<span\s+class=.?highlight.?>([^<>]*)<\/span>/gi, "$1");
//         obj.innerHTML = t;
//         var cnt = loopSearch(s, obj);
//         t = obj.innerHTML
//         var r = /{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g
//         t = t.replace(r, "<span class='highlight'>$1</span>");
//         obj.innerHTML = t;
//         app.toast("搜索到关键词" + cnt + "处")
//     }
//
//     function loopSearch(s, obj) {
//         var cnt = 0;
//         if (obj.nodeType == 3) {
//             cnt = replace(s, obj);
//             return cnt;
//         }
//         for (var i = 0, c; c = obj.childNodes[i]; i++) {
//             if (!c.className || c.className != "highlight")
//                 cnt += loopSearch(s, c);
//         }
//         return cnt;
//     }
//
//     function replace(s, dest) {
//         var r = new RegExp(s, "g");
//         var tm = null;
//         var t = dest.nodeValue;
//         var cnt = 0;
//         if (tm = t.match(r)) {
//             cnt = tm.length;
//             t = t.replace(r, "{searchHL}" + decode(s) + "{/searchHL}")
//             dest.nodeValue = t;
//         }
//         return cnt;
//     }
//
//     //法规查询
//     $$(document).on("click", "#queryBtn", function () {
//         var s = $$("input#s").val();
//         console.log(s)
//         highlight(s);
//
//         return false;
//     })
// })
//计算器
$$(document).on("click", "#calculator", function () {
    var json = {
        "PackageName": "com.taxtogether",
        "ActionName": "com.taxtogether.activity.CalculatorActivity",
        "parameter": ""
    };
    InvokeApp.getExtra(function (success) {}, function (error) {}, json)
})
