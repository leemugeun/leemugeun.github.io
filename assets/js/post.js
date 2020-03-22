window.onload = () => {
    pageOnload();

    document.querySelector("#p_wrap").addEventListener("mousewheel", () => {
        let wheel = event.wheelDelta;
        let scroll = $(window).scrollTop();
        if (scroll > 80 && wheel < 0){
            $("#p_header").hide();
        }
        else if (wheel > 0){
            $("#p_header").show();
        }
    });
}

function pageOnload(){
    $.each($("#p_container img"), function(){
        if ($(this).attr("class") == undefined){
            $(this).addClass("md_img");
        }
    })

    $("#p_nav_menu [data-navdep='1']").click(function(){
        if ($(this).siblings("ul").is(":visible")){
            $(this).siblings("ul").hide()
            return;
        }

        $("#p_nav_menu [data-navdep='2']").hide();
        $(this).siblings().show();
    });

    if ($("#banner").is(":visible")){
        $("#cont_title").css("margin-top", "");
    }
    else{
        $("#cont_title").css("margin-top", "70px");
    }
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
    $("#p_nav_menu [data-navdep='2']").hide();

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