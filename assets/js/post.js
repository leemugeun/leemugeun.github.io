$(document).ready(function() {
    pageOnload();
});

function pageOnload(){
    $.each($("#p_container img"), function(){
        if ($(this).attr("class") == undefined){
            $(this).addClass("md_img").wrap("<div style='text-align:center'></div>")
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

    $("#ban_catg li").click(function(){
        var type = $(this).attr("data-value");
        var category = [];

        $("#p_container article").hide();
        $("#ban_catg li").removeAttr("class");
        $(this).addClass("on");

        $("#ban_catg li").map(function(idx, item){
            if ($(item).attr("data-value") != ""){
                category.push($(item).attr("data-value"));
            }
        })

        if (type == ""){
            $("#p_container article").show();
        } else if (type == "etc"){
            $.each($("#p_container article"), function(){
                var value = $(this).attr("data-value");
                
                if ($.inArray(value, category) < 0){
                    $("#p_container article[data-value='" + value + "']").show();
                }
            })
        }
        else {
            $("#p_container article[data-value='" + type + "']").show();
        }
    });
}

function openNav() {
    $("#bg_black").show();

    if ($("body").width() > 700 ){
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
    $("#bg_black").hide();
    $("#p_nav_menu [data-navdep='2']").hide();

    if ($("body").width() > 700 ){
        $("#p_nav").animate({ 
            width : "300px",
            right : "-300px"
        });
    }
    else{
        $("#p_nav").animate({ 
            width : "300px",
            right : "-300px"
        });
    }
}