$(function() {
  var nw = $('#NEWESTUSER a').eq(0);
  var toput = $('#AVATARUSER');
  // $(function(){
   //  $.get($("#NEWESTUSER a[href^='/u']")[0].href,function(response){
   //    (a=$("#MEMBER_AVATAR img",$(response))).length&&$("#AVATARUSER").html(a);}
   //   )
   // });
   //
   // $.get('./templates/general/topic_list_box.html'), function(response) {
   //
   // }

   var xxx = gip('./templates/general/topics_list_box.html', 'body');
   console.log(xxx);
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
