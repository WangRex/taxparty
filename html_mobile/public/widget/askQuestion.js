/**
 * Created by david.chen on 2016/10/14.
 */
//解答列表的显示
app.question= (function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token,
            "ask_id":"1"
        }

        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data);
            console.log(data.data.askInfo);
            var detailsr_tpl = $$('script#question_solve').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#question_solve_1").html(tpl(data.data.askInfo));

            var detailsr_tpl = $$('script#question_solve_list').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#question_solve_2").html(tpl(data.data.bankInfo));

            var detailsr_tpl = $$('script#question_solve_item').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#question_solve_3").html(tpl(data.data.ansInfo));


            // $$(".taxbu_dsc").on("click", function () {
            //         app.toast("收藏成功");
            //         app.adopt(token,answer_belong,answer_id,ask_belong,ask_id)
            //         app.adopt1()
            //
            // })
            // $$(".pump").on("click",function () {
            //     app.pump1()
            //     app.balance()
            //
            // })
        }
        return app.doAjax(root.interFace.getQuestionInfo, 'post', param, succCallBack)
    }
})()

//点赞方法
app.agree=(function () {
    return function (id) {
        $$("#starLaw1"+id).attr("disabled","true");
        $$("#starLaw2"+id).attr("disabled","true");
        app.toast("点赞人气+1！")
        var param = {
            "token": app.storage.get("userArr").token,
            "score":1,
            "answer_belong":"15210044288"
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
        }
        return app.doAjax(root.interFace.toScore, 'post', param, succCallBack)

    }
})()

//取消点赞方法
app.disagree=(function () {
    return function (id) {
        var param = {
            "token": app.storage.get("userArr").token,
            "score":-1,
            "answer_belong":"15210044288"
        };
        $$("#starLaw1"+id).attr("disabled","true");
        $$("#starLaw2"+id).attr("disabled","true");
        app.toast("差评人气-1！")
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
        }
        return app.doAjax(root.interFace.toScore, 'post', param, succCallBack)

    }
})()

//采用加入题库方法一
app.adopt=(function () {
    return function (answer_id,answer_belong,ask_id,ask_belong) {
        var param = {
            "token": app.storage.get("userArr").token,
            "answer_belong":""+answer_belong,
            "answer_id":""+answer_id,
            "ask_belong":""+ask_belong,
            "ask_id":""+ask_id
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            if(data.errorCode=="0"){
                app.toast("收藏成功")
            }else {
                app.toast("收藏失败")
            }

        }
        return app.doAjax(root.interFace.adoptJoinBank, 'post', param, succCallBack)

    }
})()

//采用加入题库方法二
app.adopt1=(function () {
    return function (score) {
        var param = {
            "token": app.storage.get("userArr").token,
            "score":2
        };
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
        }
        return app.doAjax(root.interFace.toScore, 'post', param, succCallBack)
    }
})()

//取消采用加入题库方法一
// app.disadopt=(function () {
//     return function (score) {
//         var param = {
//             "token": app.storage.get("userArr").token,
//
//             "answer_belong":"4",
//             "answer_id":"1",
//             "ask_belong":"7",
//             "ask_id":"1"
//         };
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//         }
//         return app.doAjax(root.interFace.adoptJoinBank, 'post', param, succCallBack)
//
//     }
// })()

//取消采用加入题库方法二
// app.disadopt1=(function () {
//     return function (score) {
//         var param = {
//             "token": app.storage.get("userArr").token,
//             "score":-2
//         };
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//         }
//         return app.doAjax(root.interFace.toScore, 'post', param, succCallBack)
//
//     }
// })()

//追问方法
app.pump1 = (function () {
    return function (expert_id) {
        var param = {
            "token": app.storage.get("userArr").token,
            "ask_id":"1",
            "expert_id":""+expert_id
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            console.log(data)
            var detailsr_tpl = $$('script#more_question').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#more").html(tpl(data.data.bankInfo));
            // console.log(data.data.bankInfo[0].ask_attribute)
            $$("#askdi").on("click", function () {
                var que = $$("#question1").val();
                app.askSubmit(data.data.bankInfo[0].ask_attribute,data.data.bankInfo[0].tax_type,data.data.bankInfo[0].collection_procedure,
                    data.data.bankInfo[0].business_type,data.data.bankInfo[0].area,que,expert_id)
            });

        }
        view.main.router.loadPage('index/ask1.html');
        return app.doAjax(root.interFace.getQuestionInfo, 'post', param, succCallBack)

    }
})()

// //追问方法
// app.pump=(function () {
//     return function () {
//         var param = {
//             "token": app.storage.get("userArr").token,
//             "ask_id":"1"
//         }
//         var succCallBack = function (data, status, response) {
//             var data = JSON.parse(data);
//             // console.log(data)
//         }
//         view.main.router.loadPage('index/ask1.html');
//         return app.doAjax(root.interFace.getQuestionInfo, 'post', param, succCallBack)
//     }
// })()

app.balance=(function () {
    return function () {
        var param = {
            "token": app.storage.get("userArr").token
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            var detailsr_tpl = $$('script#more_question').html();
            var tpl = Template7.compile(detailsr_tpl);
            $$("#more").html(tpl(data.data));
        }
        return app.doAjax(root.interFace.getUserBalance, 'post', param, succCallBack)
    }
})()

//追问提交方法
app.askSubmit=(function () {
    return function (ask_attribute,tax_type,collection_procedure,business_type,area,que,expert_id) {
        var param = {
            "token": app.storage.get("userArr").token,
            "ask_type": "0",
            "region_id": area,
            "propertys":ask_attribute,
            "types": tax_type,
            "procedures": collection_procedure,
            "businesses":business_type,
            "attachment":"",
            "questions": que,
            "cost": 35,
            "expert_id":""+expert_id
            // "expert_id":answerId
        }
        var succCallBack = function (data, status, response) {
            var data = JSON.parse(data);
            if(data.errorCode=="0"){
                app.toast("提交成功")
            }else {
                app.toast("提交失败")
            }

        }
        return app.doAjax(root.interFace.ask, 'post', param, succCallBack)
    }
})()


f7app.onPageBeforeAnimation('question', function (page) {
  
    //绑定返回键
    window.localStorage["page"] = 'main';
    
    app.question()


});
// f7app.onPageBeforeAnimation('ask_more', function (page) {
//
//     app.pump1()
// });

