function openMenuList(){
    // 메뉴 열기(PC)
    if ($("body").width() > 700 )
    if ($("#open_meu").val() == "N"){
        $("#btn_basic").css("filter", "invert(100%)");
        $("#main_banner").animate({
            width : ($("body").width() - 350) + "px"
        });
        
        $("#sub_banner").animate({ 
            right : "0px"
        });
    }
    // 메뉴 닫기(PC)
    else{
        $("#btn_basic").css("filter", "invert(0%)");
        $("#sub_banner").animate({
            right : "350px"
        });
        $("#menu").hide();
    }
}

function goMenu(url){
    location.href = url;
}