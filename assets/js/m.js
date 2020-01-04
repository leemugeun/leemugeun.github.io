$(document).ready(function(){
    $(this).click(function(e){
        if (this.id != "btn_menu"){
            $("#menu_box").hide(50);
        }
    })
});

function openMenu(){
    $("#menu_box").toggle(50);
    event.stopPropagation();
}

function goMenu(url){
    location.href = url;
}