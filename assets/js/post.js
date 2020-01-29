$(document).ready(function(){
    pageOnload();
    hljs.initHighlightingOnLoad();

    $("html").on("mousewheel DOMMouseScroll", function(e){
        var wheel = e.originalEvent.wheelDelta;
        var scroll = $(window).scrollTop();
        if (scroll > 80 && wheel < 0){
            $("#p_header").hide();
        }
        else if (wheel > 0){
            $("#p_header").show();
        }
    });
});

function pageOnload(){
    $.each($("#p_container img"), function(){
        if ($(this).attr("class") == undefined){
            $(this).addClass("md_img");
        }
    })

    $("#p_nav_menu [data-navdep='1']").click(function(){
        if ($(this).siblings("ul").is(":visible")){
            $(this).siblings("ul").hide(300)
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
            right : "0"
        });
    }
}

function closeNav(){
    $("#p_bg_black").hide();
    $("#p_nav_menu [data-navdep='2']").hide(300);

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