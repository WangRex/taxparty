$$("#news").on("show", function () {
    app.newsList();
});

f7app.onPageInit('newsDetails', function (page) {
    var id = page.query.id;
    console.log(id.trim());
    app.newsDetails(id.trim());
});

f7app.onPageInit('collect', function (page) {
    app.collectList();
});

$$(document).on("click", "#likeBtn", function () {
    var id = $$(this).attr('data-id');
    app.newslikeInform(id);
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