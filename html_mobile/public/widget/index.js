/* ===== 注册 ===== */
f7app.onPageAfterAnimation('register', function (page) {

    console.log(page.url);

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
            time(slef);
            app.verifyCode('0', users)
        } else if (app.empty.emi.test(users)) {
            time(slef);
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
})


/* ===== 登陆 ===== */
f7app.onPageInit('login', function (page) {

    console.log(page.url);

    $$(document).on("click", "#dologin", function () {
        app.isLR.l()
    })

    $$(window).on("keyup", function (event) {
        if (event.keyCode == 13) {
            app.isLR.l()
        }
    });
})


/* ===== 首页 ===== */
f7app.onPageBeforeAnimation('home', function (page) {

    var data = app.storage.get("userArr");
    console.log(page.url);
    console.log(data)

    var home_tpl = $$('script#home_tpl').html();
    var tpl = Template7.compile(home_tpl);
    $$("#home_pnel").html(tpl(data.profit))

    if (data.askList.length != 0) {
        var ask_list_tpl = $$('script#ask_list_tpl').html();
        var tpl = Template7.compile(ask_list_tpl)
        $$("#ask_list").html(tpl(data.askList[0]))

    }

    if (data.answerList.length != 0) {
        var answer_list_tpl = $$('script#answer_list_tpl').html();
        var tpl = Template7.compile(answer_list_tpl)
        $$("#answer_list").html(tpl(data.answerList[0]))
    }
})

/* ===== 寻Ta ===== */
f7app.onPageBeforeAnimation('seek', function (page) {

    console.log(page.url);
})

/* ===== 寻Ta - 订单 ===== */
f7app.onPageBeforeAnimation('order', function (page) {

    console.log(page.url);

    var swiper = new Swiper('.swiper-container', {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: true,
        slidesPerView: 'auto'
    });
});


f7app.onPageBeforeAnimation('queryDetails', function (page) {


    function encode(s) {
        return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/([\\\.\*\[\]\(\)\$\^])/g, "\\$1");
    }

    function decode(s) {
        return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g, "$1").replace(/>/g, ">").replace(/</g, "<").replace(/&/g, "&");
    }

    function highlight(s) {
        if (s.length == 0) {
            app.toast('搜索关键词未填写！');
            return false;
        }
        s = encode(s);
        var obj = document.getElementsByTagName("body")[0];
        var t = obj.innerHTML.replace(/<span\s+class=.?highlight.?>([^<>]*)<\/span>/gi, "$1");
        obj.innerHTML = t;
        var cnt = loopSearch(s, obj);
        t = obj.innerHTML
        var r = /{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g
        t = t.replace(r, "<span class='highlight'>$1</span>");
        obj.innerHTML = t;
        app.toast("搜索到关键词" + cnt + "处")
    }

    function loopSearch(s, obj) {
        var cnt = 0;
        if (obj.nodeType == 3) {
            cnt = replace(s, obj);
            return cnt;
        }
        for (var i = 0, c; c = obj.childNodes[i]; i++) {
            if (!c.className || c.className != "highlight")
                cnt += loopSearch(s, c);
        }
        return cnt;
    }

    function replace(s, dest) {
        var r = new RegExp(s, "g");
        var tm = null;
        var t = dest.nodeValue;
        var cnt = 0;
        if (tm = t.match(r)) {
            cnt = tm.length;
            t = t.replace(r, "{searchHL}" + decode(s) + "{/searchHL}")
            dest.nodeValue = t;
        }
        return cnt;
    }
    
    //法规查询
    $$(document).on("click", "#queryBtn", function () {
        var s = $$("input#s").val();
        console.log(s)
        highlight(s);

        return false;
    })
})