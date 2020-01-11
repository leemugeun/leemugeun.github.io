$(document).ready(function(){
    pageOnload();
    hljs.initHighlightingOnLoad();
});

function pageOnload(){
    $.each($("#p_container img"), function(){
        if ($(this).attr("class") == undefined){
            $(this).addClass("md_img");
        }
    })
}