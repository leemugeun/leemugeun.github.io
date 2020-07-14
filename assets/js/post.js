$(document).ready(function() {
    pageOnload();

    setCalender();
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

function setCalender() {
    if (location.href.toLowerCase().indexOf("calender") > -1){
        var html = "";
        var dt = new Date();
        var year = dt.getFullYear();
        var now_date = year + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
        var next_year = dt.getFullYear() + 2;
        var opc_day = 1;
        var mg_hday = 0;

        // 연단위
        while (year < next_year){
            var month = 1;

             html += "<div class=\"cldr_year\">" + year + "년</div>";

            // 연간 월수
            while (month < 13){
                var month_date = 1;
                var month_total_date = new Date(year, month, 0).getDate();

                html += "<div class=\"cldr_month\">" + month + "월</div>";
                html += "<table class=\"cldr\">";
                html += "   <tr>";
                html += "       <th style=\"width:15%\">일</th>";
                html += "       <th style=\"width:14%\">월</th>";
                html += "       <th style=\"width:14%\">화</th>";
                html += "       <th style=\"width:14%\">수</th>";
                html += "       <th style=\"width:14%\">목</th>";
                html += "       <th style=\"width:14%\">금</th>";
                html += "       <th style=\"width:15%\">토</th>";
                html += "   </tr>";

                // 월간 일수
                while (month_total_date > 0){
                    // 0 : 일 ~ 6 : 토
                    var month_day = new Date(year + "/" + month + "/" + month_date).getDay();
                    var loop_date = year + "/" + month + "/" + month_date;
                    var innr = "";
                    var day_txt = "";

                    opc_day = opc_day > 5 ? 1 : opc_day;
                    mg_hday = mg_hday > 5 ? 1 : mg_hday;

                    if (month_day == 0){
                        opc_day++;
                        mg_hday++;
                    }

                    // 1주 라인
                    if (month_day == 0){
                        html += "<tr>";    
                    }
                    
                    // 1주 내용
                    if (month_date == 1){
                        for (var wNum = 0; wNum < 7; wNum++){
                            if (wNum == month_day){
                                break;
                            }
                            else{
                                html += "<td></td>";
                            }
                        }
                    }

                    if (month_day != 0 && month_day != 6){
                        if (month_day == opc_day){
                            innr += "<br/><b class=\"cldr_opc\">OPC</b>";
                        }
                        
                        if (month_day == mg_hday){
                            innr += "<br/><b class=\"cldr_mg\">재택</b>";
                        }
                    }
                    
                    if (innr == ""){
                        if (now_date == loop_date){
                            day_txt = "<b>" + month_date + "</b>";
                        }
                        else{
                            day_txt += month_date;
                        }
                    }
                    else{
                        day_txt += (month_date + innr);
                    }

                    html += "<td>" + day_txt + "</td>";

                    // 1주 라인
                    if (month_day == 6){
                        html += "</tr>";
                    }

                    month_date++;
                    month_total_date--;
                }

                html += "</table>";
                month++;
            }

            year++;
        }

        $("#p_container").html(html);
    }
}