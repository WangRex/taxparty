//邀请方法
app.Eject = (function (title, w, h) {
    return function (token) {
        //传给后端
        var param = {
                "token": token

            }
            //
        var succCallBack = function (data, status, response, address) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.errorCode != '0') {
                console.log("到了")


                f7app.prompt('需要填写邀请码，才能实现邀请功能', function (value) {
                    app.againSubmit(token, value);

                });

            } else {
                f7app.confirm('1.实施统计，根据自己邀请的下线好友的资金额计算返还.</br></br>2.下线好友收入10%分成给该用户比如A邀请B，B今天的收入是99元(题库,好友和解答各33元)，那么B要拿出9.9元分给A，给自己生89.1元。</br></br>3.下线好友消费金额的5%，奖给改用户。比如A邀请C，C咨询问题（后买会员卡或者零散支付咨询费，以实际转账金额为准）花费100元那么系统会奖励A5元。',
                    function () {
                        //跳转发送微信好友
                        app.friends();
                    });
            }

        }
        return app.doAjax(root.interFace.shunzi, 'post', param, succCallBack)
    }
})()

//调用分享微信好友接口
app.weixin = (function () {
    return function (invite_code) {
        if (typeof (Wechat) !== 'undefined') {
            Wechat.share({
                message: {
                    title: "税聚邀请",
                    description: "诚挚邀请你加入税聚，开始纳税服务个人站点的运营。注册邀请码：" + invite_code,
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.SESSION // share to SESSION
            }, function () {
                app.toast("分享成功");
                app.queryDetails1();
            }, function (reason) {
                app.toast("分享失败");
            });
        }
    }
})()

//调用分享朋友圈接口
app.Circlefriends = (function () {
    return function (invite_code) {
        if (typeof (Wechat) !== 'undefined') {
            Wechat.share({
                message: {
                    title: "税聚注册邀请码" + invite_code,
                    description: "诚挚邀请你加入税聚，开始纳税服务个人站点的运营。注册邀请码：" + invite_code,
                    thumb: "www/static/images/logo.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: "http://www.seazon.top"
                    }
                },
                scene: Wechat.Scene.Timeline // share to Timeline
            }, function () {
                app.toast("分享成功");
                app.queryDetails1();
            }, function (reason) {
                app.toast("分享失败");
            });
        }
    }
})()

//获取发送好友的邀请码(微信好友)
app.yaoqinma1 = (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            //alert(data);
            var invite_code = data.data[0].invite_code;
            app.weixin(invite_code);

        }

        return app.doAjax(root.interFace.weixinyaoqinma, 'post', param, succCallBack)
    }
})()

//获取发送好友的邀请码(分享朋友圈)
app.yaoqinma2 = (function () {

    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            //alert(data);
            var invite_code = data.data[0].invite_code;
            app.Circlefriends(invite_code);

        }

        return app.doAjax(root.interFace.weixinyaoqinma, 'post', param, succCallBack)
    }
})()


//跳转到微信好友分享朋友圈
app.friends = (function () {
    return function () {
        var buttons = [
            {
                text: '<div><span></span><img src="../static/images/img/weixin.png" alt="微信" onclick="app.yaoqinma1()" height="60"><img src="../static/images/img/pengyou.png" alt="朋友圈" onclick="app.yaoqinma2()" height="60"><img src="../static/images/img/weibo.png" alt="微博" height="60"></div>',
                bold: true,


               },

            {
                text: '取消',
                color: 'gray'
               },
             ];
        f7app.actions(buttons);
    }

})()


//重新提交邀请码方法
app.againSubmit = (function () {
    return function (token, value) {
        var param = {
            "token": token,
            "invite_errorCode": value
        }
        if (param.invite_errorCode == null || param.invite_errorCode == "") {

            app.toast("邀请码不能为空！");
        } else {
            var succCallBack = function (data, status, response, address) {
                var data = JSON.parse(data);

                if (data.errorCode == '0') {

                    f7app.confirm('1.实施统计，根据自己邀请的下线好友的资金额计算返还.</br></br>2.下线好友收入10%分成给该用户比如A邀请B，B今天的收入是99元(题库,好友和解答各33元)，那么B要拿出9.9元分给A，给自己生89.1元。</br></br>3.下线好友消费金额的5%，奖给改用户。比如A邀请C，C咨询问题（后买会员卡或者零散支付咨询费，以实际转账金额为准）花费100元那么系统会奖励A5元。',
                        function () {

                            //跳转发送微信好友
                            app.friends();
                            console.log(data)
                        });
                } else {
                    app.toast("您输入的邀请码错误！");
                }


            }

            return app.doAjax(root.interFace.yaoqinma, 'post', param, succCallBack)
        }
    }
})()

//跳转到下线列表的html
app.queryDetails1 = (function () {
    return function () {
        //跳转到下线列表的html
        view.about.router.loadPage('about/assembly.html');
    }
})()

//下线列表方法
app.assembly = (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.errorCode == '0') {

                if (data.amount != '' || data.amount != null) {
                    data.amount = data.amount.toFixed(2);
                }

                if (!data.data || !data.data[0]) {
                    app.toast('暂无信息');
                } else {

                    $$.each(data.data, function (i, e) {
                        if (e.return_amount !== null && e.return_amount !== '') {
                            console.log(e)
                            e.return_amount = e.return_amount.toFixed(2);
                            if (Number(e.return_amount) < 10) {
                                e.return_amount = '&nbsp;&nbsp;' + e.return_amount;
                            }
                        }
                    });

                    var detailsr_tpl = $$('script#assembly_list_tpl').html();
                    var tpl = Template7.compile(detailsr_tpl);
                    $$("#searchbar_list").html(tpl(data));
                }

            } else {
                app.toast('系统异常！');
            }

        }

        return app.doAjax(root.interFace.xiaxian, 'post', param, succCallBack)
    }
})()

/* ===== 调用下线列表方法，显示下线列表 ===== */
f7app.onPageInit('assembly', function (page) {

    
    //绑定返回键
    window.localStorage["page"] = 'about';
    

    app.assembly();


});

/*
//邀请方法
app.Eject = (function (title,w,h) {
    return function ( token) {
        //传给后端
        var param = {
            "token": token

        }
        //
        var succCallBack = function (data, status, response,address) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.errorCode !='0') {
                console.log("到了")

                    f7app.confirm('1.实施统计，根据自己邀请的下线好友的资金额计算返还.</br></br>2.下线好友收入10%分成给该用户比如A邀请B，B今天的收入是99元(题库,好友和解答各33元)，那么B要拿出9.9元分给A，给自己生89.1元。</br></br>3.下线好友消费金额的5%，奖给改用户。比如A邀请C，C咨询问题（后买会员卡或者零散支付咨询费，以实际转账金额为准）花费100元那么系统会奖励A5元。', 
                    function () {
                    f7app.prompt('需要填写邀请码，才能实现邀请功能', function (value) {

                    app.againSubmit(token,value)

                });
             });

           }else{
              //下线列表
              app.queryDetails1()
   }

  }
        return app.doAjax(root.interFace.shunzi, 'post', param, succCallBack)
}
})()



//重新提交邀请码方法
app.againSubmit = (function () {
    return function ( token,value) {
        var param = {
            "token": token,
            "invite_errorCode":value
        }
        if (param.invite_errorCode==null || param.invite_errorCode=="") {

           app.toast("邀请码不能为空！"); 
         }else
         {
        var succCallBack = function (data, status, response,address) {
            var data = JSON.parse(data);
           if (data.errorCode=='0')
               {
                 //下线列表   
                    app.queryDetails1();
                    console.log(data)
                   
               }else
               {
                app.toast("您输入的邀请码错误！"); 
               }
              
           
        }

        return app.doAjax(root.interFace.yaoqinma, 'post', param, succCallBack)
    }
  }
})()


//下线列表的方法
app.queryDetails1= (function () {
           return function () {
            //跳转到下线列表的html
           view.about.router.loadPage('about/assembly.html');
        }
     })()

*/
