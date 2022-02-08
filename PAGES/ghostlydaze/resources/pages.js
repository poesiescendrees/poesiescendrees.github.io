$(function() {
});



/*
    gets $(infoCSS) from the url page
*/
function gip(url, infoCSS) {
    var toreturn;
    $.ajax({
        url : url,
        success : function(data) {
            toreturn = $(infoCSS, $(data))
        },
        async: false
    });
    return toreturn;
}
