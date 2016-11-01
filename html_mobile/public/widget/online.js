//调用微信接口
/*app.weixin=(function () {
     return function (invite_code) {
    if(typeof(Wechat)!=='undefined'){
        Wechat.share({
        text: "请输入邀请码"+invite_code,
        scene: Wechat.Scene.SESSION   // share to Timeline
    }, function () {
       alert("Success");
    }, function (reason) {
        alert("Failed: " + reason);
    });

    }
}
})()

//调用分享朋友圈接口
app.Circlefriends=(function () {
     return function (invite_code) {
    if(typeof(Wechat)!=='undefined'){
        Wechat.share({
        text: "看到邀请码:"+invite_code+"之后赶快下载税聚APP吧！",
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
       alert("Success");
    }, function (reason) {
        alert("Failed: " + reason);
    });

    }
}
})()

//获取发送好友的邀请码(微信好友)
app.yaoqinma1= (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
             console.log(data);
             //alert(data);
             var invite_code=data.data[0].invite_code;
             app.weixin(invite_code);
                
        }

        return app.doAjax(root.interFace.weixinyaoqinma, 'post', param, succCallBack)
    }
})()

//获取发送好友的邀请码(分享朋友圈)
app.yaoqinma2= (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
             console.log(data);
             //alert(data);
             var invite_code=data.data[0].invite_code;
             app.Circlefriends(invite_code);
                
        }

        return app.doAjax(root.interFace.weixinyaoqinma, 'post', param, succCallBack)
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

            var detailsr_tpl = $$('script#assembly_list_tpl').html();
            
            var tpl = Template7.compile(detailsr_tpl);
            $$("#searchbar_list").html(tpl(data))
            
            //邀请好友点击事件
            $$('.ac-1').on('click', function () {
             //app.yaoqinma1();   
              var buttons = [
               {
                 text: '<img src="../static/images/img/weixin.png" alt="微信" height="60">',
                 bold: true,
                 onClick:function (){
                   app.yaoqinma1(); 

                 }

               },
               {
                 text: '<img src="../static/images/img/pengyou.png" alt="朋友圈" height="60">',
                 bold: true,
                 onClick:function (){
                app.yaoqinma2(); 

                 }

               },
                {
                 text: '<img src="../static/images/img/weibo.png" alt="微博" height="60">',
                 bold: true
                /* onClick:function (){
                 
                 }*/

             /*  },
               {
                text: '取消',
                color: 'red'
               },
             ];
             f7app.actions(buttons);
          });


        }

        return app.doAjax(root.interFace.xiaxian, 'post', param, succCallBack)
    }
})()

/* ===== 调用下线列表方法，显示下线列表 ===== */
/*f7app.onPageBeforeAnimation('assembly', function (page) {

    console.log(page);

    app.assembly();
    

});*/
 




