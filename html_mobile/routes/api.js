var express = require('express');

var fs = require('fs');

var router = express.Router();

/* DO GET */
router
    .route('/*')
    .get(function(req, res) {

        var path = req.originalUrl;

        var idx = path.lastIndexOf('/');

        var path1 = path.substr(idx+1);

        var idx2 = path1.indexOf('?');

        var fileName;
        if (idx2 != -1)
            fileName = path1.substring(0,idx2);
        else
            fileName = path1;

        var str = fs.readFileSync('data/'+fileName+'.json', 'utf8');
				console.log("################str:"+str);
        var content = JSON.parse(str);

        var code = req.query._rcode;

        if (typeof code === 'undefined' || code == null)
            code  = '0';

        var message = '';
        switch (code) 
        {
            case '0' :
                message = '';
                break;
            case '400' :
                message = 'TimeOut';
                break;
            case '401' :
                message = 'UserName+SystemPassword Error';
                break;
            case '402' :
                message = 'Certification Error';//认证错误
                break;
            case '403' :
                message = 'System Internal Error';//系统内部错误
                break;
            case '404' :
                message = 'Permission Denial';//没有权限
                break;
            case '405' :
                message = 'Request Parameter Invadid：ItemName：XX Value：YY';//请求参数无效
                break;
            case '406' :
                message = 'Reffer to the ResponseMessage for more detail';
                break;
            case '407' :
                message = 'Master Data Error';
                break;
            case '999' :
                message = 'Unknown Error';//未知错误
                break;
        }

        content.responseCode = code;
        content.responseMessage = message;

        res.json(content);
    })
    .post(function(req, res) {
	
        console.log("Receive Data:"+JSON.stringfry(req.body));

        var path = req.originalUrl;

        var idx = path.lastIndexOf('/');

        var path1 = path.substr(idx+1);

        var idx2 = path1.indexOf('.');

        var fileName;
        if (idx2 != -1)
            fileName = path1.substring(0,path1.indexOf('.'))
        else
            fileName = path1;

        var str = fs.readFileSync('data/'+fileName+'.json', 'utf8');

        var content = JSON.parse(str);

        var code = req.body._rcode;

        if (typeof code === 'undefined' || code == null)
            code  = '0';

        var message = '';
        switch (code) 
        {
            case '0' :
                message = '';
                break;
            case '400' :
                message = 'TimeOut';
                break;
            case '401' :
                message = 'UserName+SystemPassword Error';
                break;
            case '402' :
                message = 'Certification Error';//认证错误
                break;
            case '403' :
                message = 'System Internal Error';//系统内部错误
                break;
            case '404' :
                message = 'Permission Denial';//没有权限
                break;
            case '405' :
                message = 'Request Parameter Invadid：ItemName：XX Value：YY';//请求参数无效
                break;
            case '406' :
                message = 'Reffer to the ResponseMessage for more detail';
                break;
            case '407' :
                message = 'Master Data Error';
                break;
            case '999' :
                message = 'Unknown Error';//未知错误
                break;
        }

        content.responseCode = code;
        content.responseMessage = message;

        res.json(content);
    });

module.exports = router;
