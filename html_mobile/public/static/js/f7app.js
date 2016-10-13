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