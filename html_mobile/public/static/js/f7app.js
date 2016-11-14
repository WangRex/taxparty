// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});


// Initialize your app
var f7app = new Framework7({
    // 开启URL地址
    pushState: true,
    pushStateSeparator: '#',
    // 开启滑动返回上一页面
    swipeBackPage: true,
    // 开启图标的动画会更接近iOS的风格
    animateNavBackIcon: true,
    // 开启 fastClicks
    fastClicks: true,
    // 长按事件800毫秒
    tapHoldDelay: 800,
    // ajaxStart回调
    onAjaxStart: function (xhr) {
        f7app.showIndicator()
    },
    // ajaxComplete回调
    onAjaxComplete: function (xhr) {
        f7app.hideIndicator()
    },
    // ajaxError回调
    onAjaxError: function (xhr, status) {
        f7app.alert('加载出错请重试!');
        console.log(xhr);
        f7app.hideIndicator();
    },
    // 默认消息框标题
    modalTitle: '消息提示',
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    modalPreloaderTitle: '加载中...',
    // 开启 Template7 模板
    template7Pages: true,
    // 开启自动编译所有的 Template7 模板
    precompileTemplates: true,
    // Specify Template7 data for pages
    //template7Data: tplData,

});

//  初始化视图
var view = {
    main: f7app.addView('#home', {
        dynamicNavbar: true,
        //animatePages: false,
        //swipeBackPage: false,
        //reloadPages: true,
        //preloadPreviousPage: false
    }),
    seek: f7app.addView('#seek', {
        dynamicNavbar: true,

    }),
    news: f7app.addView('#news', {
        dynamicNavbar: true,

    }),
    about: f7app.addView('#about', {
        dynamicNavbar: true,
    })
}

// Export selectors engine
var $$ = Dom7;

/*Dom7.ajax({
    url: 'http://shsj.clpsgroup.com.cn/tz-core/novalidate/queryAdList.do',
    type: 'get',
    async: true,
    data: '',
    contentType: "application/json;charset=UTF-8",
    timeout: 1000000,
    beforeSend: function (request) {},
    success: function (data, status, response) {
        var data = JSON.parse(data);
        var options = {
            'bgcolor': '#0da6ec',
            'fontcolor': '#fff',
            'closeButtonText': '跳过'
        };
        var welcomescreen_slides = new Array();
        if (data.data.length > 0) {
            for (var item in data.data) {

                var item = {
                    id: 'slide0',
                    picture: '<div class="tutorialicon" style="position:absolute; width:100%;height:100%; background:url(' + data.data[item] + ') no-repeat;background-size:cover;"></div>',
                    text: ''
                };

                welcomescreen_slides.push(item);
            }

            welcomescreen = f7app.welcomescreen(welcomescreen_slides, options);
        }
    },
    complete: function () {},
    error: function (xhr, type, errorThrown) {
        console.log(xhr);
    }
});*/

window.localStorage["backStatus"] = true;//初始化返回键状态 
window.localStorage["page"] = 'main';
document.addEventListener("backbutton", function () {
	var backStatus = window.localStorage["backStatus"];
    if(backStatus == "true"){
        if(window.localStorage["page"] == 'main')
        view.main.router.back();
        if(window.localStorage["page"] == 'seek')
        view.seek.router.back();
        if(window.localStorage["page"] == 'news')
        view.news.router.back();
        if(window.localStorage["page"] == 'about')
        view.about.router.back();
        
    }else{
    	window.localStorage["backStatus"] = true;
    }
}, false); // 返回键
//接收推送消息||缓存推送过来的消息
function getNewMessage(msg){
	$$("#message-count").show();
	var msg = JSON.parse(msg);
	var json = {"key":"username"};
	var username = "";
	InvokeApp.getItem(function(result){
		username = result;
		var msgList = window.localStorage[username];//区分不同账号缓存
		if(msgList){
			var oldMsgList = JSON.parse(window.localStorage[username]);
			oldMsgList.unshift(msg);
			window.localStorage[username] = JSON.stringify(oldMsgList);
		}else{
			var msgList=new Array();
			msgList.unshift(msg);
			window.localStorage[username] = JSON.stringify(msgList);
		}
	},function(){},json);//调用原生插件获取登录成功时缓存的用户名
	
}