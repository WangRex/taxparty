$$("#news").on("show", function () {
    app.newsList();
});

f7app.onPageInit('newsDetails', function (page) {
    
    //绑定返回键
    window.localStorage["page"] = 'news';
    
    var id = page.query.id;
    console.log(id.trim());
    app.newsDetails(id.trim());

    $$('.ac_1').on('click', function () {
        var buttons = [
            {
                text: '<a onclick="app.weixin1()"><img src="../static/images/img/weixin.png" alt="微信" height="60"></a>' +
                '<a onclick="app.Circlefriends1()"><img src="../static/images/img/pengyou.png" alt="朋友圈" height="60"></a>' +
                '<a><img src="../static/images/img/weibo.png" alt="微博" height="60"></a>',
                bold: true,

            },
            {
                text: '取消',
                color: 'gray'
            },
        ];
        f7app.actions(buttons);
    });

});

f7app.onPageInit('collect', function (page) {
    
    //绑定返回键
    window.localStorage["page"] = 'news';
    
    app.collectList();
});

$$(document).on("click", "#likeBtn", function () {
    var id = $$(this).attr('data-id');
    var like_flag = $$(this).attr('data-like-flag');
    if (like_flag == '1') {
        like_flag = '0';
    } else {
        like_flag = '1';
    }
    app.newslikeInform(id, like_flag);
});

$$(document).on("click", "#collectBtn", function () {
    var id = $$(this).attr('data-id');
    app.newsCollectInform(id);
});

$$(document).on("click", "#commonBtn", function () {
    var id = $$(this).attr('data-id');
    var val = $$("#textarea_val").val();
    app.commentInform(id, val, D.h + ':' + D.mi);
});

//咨询的分享
app.weixin1=(function () {
    return function(){
        if(typeof(Wechat)!=='undefined'){
            Wechat.share({
                message: {
                    title: "税聚资讯",
                    description: "诚挚邀请你加入税聚，了解更多资讯信息！",
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.SESSION   // share to SESSION
            }, function () {
                app.toast("分享成功");
            }, function (reason) {
                app.toast("分享失败");
            });
        }
    }
})()

//调用分享朋友圈接口
app.Circlefriends1=(function () {
    return function () {
        if(typeof(Wechat)!=='undefined'){
            Wechat.share({
                message: {
                    title: "税聚资讯",
                    description: "诚挚邀请你加入税聚，了解更多资讯信息！",
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.Timeline   // share to Timeline
            }, function () {
                app.toast("分享成功");
            }, function (reason) {
                app.toast("分享失败");
            });
        }
    }
})()