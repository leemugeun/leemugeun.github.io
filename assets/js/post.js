$(document).ready(function(){
    pageOnload();
});

function pageOnload(){
    $.each($("img"), function(){
        if ($(this).attr("class") == undefined){
            $(this).addClass("md_img");
        }
    })
}