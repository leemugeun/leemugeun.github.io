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

    $("#p_nav_menu [data-navdep='1']").click(function(){
        if ($(this).siblings("ul").is(":visible")){
            return;
        }

        $("#p_nav_menu [data-navdep='2']").hide(300);
        $(this).siblings().show(300);
    })
}

function openNav() {
    $("#p_bg_black").show();

    if ($("body").width() > 700 ){
        $("#p_wrap").animate({
            width : ($("body").width() - 350) + "px"
        });
        
        $("#p_nav").animate({ 
            right : "0px"
        });
    }
    else{
        $("#p_nav").animate({ 
            width : "100%",
            right : "0px"
        });
    }
}

function closeNav(){
    $("#p_bg_black").hide();
    $("#p_nav_menu dd").hide();

    if ($("body").width() > 700 ){
        $("#p_wrap").animate({
            width : "100%"
        });
        
        $("#p_nav").animate({ 
            right : "-350px"
        });
    }
    else{
        $("#p_nav").animate({ 
            width : "350px",
            right : "-350px"
        });
    }
}