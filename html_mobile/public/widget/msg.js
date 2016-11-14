/* ===== 寻Ta - 订单 ===== */

//订单初始化
f7app.onPageInit('msg', function (page) {

    console.log(page.url)
        //绑定返回键
    window.localStorage["page"] = 'main';
    $$("#message-count").hide();
    var json = {"key":"username"};
    InvokeApp.getItem(function(result){
		  var username = result;
	      var data = window.localStorage[username];
	      if(data){
			var msgList = JSON.parse(data);
			var msg_list_tpl = $$('script#msgTemplate').html();
			var tpl = Template7.compile(msg_list_tpl);
			$$("#msg_list").html(tpl(msgList));
	      }else{
	      	app.toast("暂时没有消息");
	      }
    },function(){},json);

    $$(document).on("delete", "#msgList li", function(e){
    	var index = $$(this).index();
    	var json = {"key":"username"};
        InvokeApp.getItem(
        	function(result){
    		  var username = result;
    	      var oldMsgList = JSON.parse(window.localStorage[username]);
    	      oldMsgList.splice(index,1);
    	      window.localStorage[username] = JSON.stringify(oldMsgList);
    	    },
    	    function(){},json);
        	
        });
});
