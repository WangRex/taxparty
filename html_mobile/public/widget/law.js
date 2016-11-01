/**
 * Created by jack.zuo on 2016/10/13.
 */

    //法规正文搜索并高亮
$$(document).on("click", "#queryBtn", function () {
    var s = $$("input#s").val();
    console.log(s);
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
       // var obj = document.getElementsByTagName("body")[0];

        var obj = document.getElementById("detailsInfo");
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
    highlight(s);
    return false;
})


//法规6大部法收藏列表方法
app.query = (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var detailsr_tpl = $$('script#detailsr_list_tpl1').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#searchbar_list").html(tpl(data.data));



        }

        return app.doAjax(root.interFace.getCollecLaw, 'post', param, succCallBack)
    }
})()

//法规搜索方法
app.queryList = (function () {
    return function (law_name, law_number,release_date,law_att) {
        var param = {
            "token": app.storage.get("userArr").token,
            "law_name": law_name,
            "law_number": law_number,
            "release_date":release_date,
            "law_att":law_att

        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var detailsr_tpl = $$('script#law_search_tpl').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#searchbar_list").html(tpl(data.data))

        }

        return app.doAjax(root.interFace.searchLaw, 'post', param, succCallBack)
    }
})()



/* ===== 法规搜索 ===== */
f7app.onPageBeforeAnimation('query', function (page) {

    //绑定返回键
    window.localStorage["page"] = 'main';
    

    app.query();
     //初始化下拉框的初始值
    var year = new Date().getFullYear();

    var yearArr = [];
    for (var i = 0; i < 70; i++) {
        yearArr.push(year - i);
    }

    f7app.picker({
        input: '#release_date',
//        value: [year],
        cols: [
            {
                textAlign: 'center',
                values: yearArr,

        }
    ],
        toolbarCloseText: '确定',

    });
    $$("#queryfile").on("click", function () {

        var law_name = $$("#law_name").val(); //文件字号
        var law_number = $$("#law_number").val(); //文件名
        var release_date = $$("#release_date").val(); //文件名
        var law_att = $$("#law_att").val(); //文件名

        if (!law_name && !law_number&&!release_date&&!law_att) {
            // app.toast("请输入文件字号或者文件名");
        }
        app.queryList(law_name,law_number,release_date,law_att);


    })




});

/* ===== 法规搜索列表 ===== */
f7app.onPageBeforeAnimation('queryList', function (page) {
    //绑定返回键
    window.localStorage["page"] = 'main';
    
    console.log(page.query);
    $$("#queryfile").on("click", function () {

        var law_name = $$("#law_name").val(); //文件字号
        var law_number = $$("#law_number").val(); //文件名
        var release_date = $$("#release_date").val(); //文件名
        var law_att = $$("#law_att").val(); //文件名

        if (!law_name && !law_number&&!release_date&&!law_att) {
            // app.toast("请输入文件字号或者文件名");
        }
        app.queryList(law_name,law_number,release_date,law_att);


    })


});


//法规详情方法
app.queryDetails = (function () {
    return function (statueid) {
        var param = {
            "token": app.storage.get("userArr").token,
            "law_id":statueid
    }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);

            console.log(data)

            var detailsr_tpl = $$('script#law_detail_tpl').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#detailsInfo").html(tpl(data.data));
            if(data.collection_statu == 1){
                $$("#starSpan").attr("class","star-filled");
            }
            $$("#starLaw").on("click", function () {
                if(data.collection_statu == 0)
                {$$("#starSpan").attr("class","star-filled");
                    app.toast("收藏成功！");
                    app.collect(statueid);
                }
                else
                    // if (data.collection_statu == 1)
                    {
                        $$("#starSpan").attr("class","star-filled");
                    app.toast("你已收藏过该内容");
                }
                // else {
                //     $$("#starSpan").attr("class","m-icon m-icon-star-filled");
                //     app.toast("取消收藏成功");
                //     app.discollect()
                // }
            })
        }

        view.main.router.loadPage('index/queryDetails.html');

        return app.doAjax(root.interFace.getStatuteInfo, 'post', param, succCallBack)
    }
})()

//法规取消收藏方法
app.discollect=(function () {
    return function (law_id ) {
        var param = {
            "token": app.storage.get("userArr").token,
            "flag":"0",
            "tuc_id":law_id
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
        }
        return app.doAjax(root.interFace.updateCollectionByCID, 'post', param, succCallBack)

    }
})()

//法规收藏方法
app.collect=(function () {
    return function (law_id) {
        var param = {
            "token": app.storage.get("userArr").token,
            "info_id":law_id,
            "tuc_flag":"0"
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
        }
        return app.doAjax(root.interFace.saveCollectionInfo, 'post', param, succCallBack)

    }
})()
//
// //删除法规的方法
// app.queryDelte=(function () {
//     return function () {
//         var param = {
//             "token": app.storage.get("userArr").token,
//         };
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//         }
//         return app.doAjax(root.interFace.CollectionInfo, 'post', param, succCallBack)
//
//     }
//
// })()



