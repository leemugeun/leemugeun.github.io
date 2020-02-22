$(document).ready(function(){
    SetCodehighlight();
});

let SetCodehighlight = () => {

    // SQL
    let sql_cnt = document.querySelectorAll("#p_container .language-sql").length;
    let timer = 300;

    if (sql_cnt > 0){
        setTimeout(() => {
                let keyword = document.querySelectorAll("#p_container .language-sql .hljs-keyword");
                let builtin = document.querySelectorAll("#p_container .language-sql .hljs-built_in");
                let str = document.querySelectorAll("#p_container .language-sql .hljs-string");
                let comment = document.querySelectorAll("#p_container .language-sql .hljs-comment");

                keyword.forEach((elem, idx, arr) => {
                    let blue = ["declare", "begin", "end", "commit", "select", "from", "where", "set", "and", "int", "nvarchar", "char", "group", "order", "by", "for", "xml", "with", "as"];
                    let pink = ["update", "max", "convert"];
                    let txt = arr[idx].innerText;
                    
                    if (blue.filter(e => e == txt).length > 0){
                        arr[idx].setAttribute("style", "color:blue");
                    }

                    if (pink.filter(e => e == txt).length > 0){
                        arr[idx].setAttribute("style", "color:deeppink");
                    }
                })

                builtin.forEach((elem, idx, arr) => {
                    let blue = ["char", "varchar", "nvarchar", "int", "tinyint"];
                    let txt = arr[idx].innerText;

                    if (blue.filter(e => e == txt).length > 0){
                        arr[idx].setAttribute("style", "color:blue");
                    }
                })
                
                str.forEach((elem, idx, arr) => {
                    elem.setAttribute("style", "color:red");
                })

                comment.forEach((elem, idx, arr) => {
                    elem.setAttribute("style", "color:#006600");
                })

            }, timer
        )
    }

    // Xml
    let xml_cnt = document.querySelectorAll("#p_container .language-xml").length;

    if (xml_cnt > 0){
        setTimeout(() => {
                let name = document.querySelectorAll("#p_container .language-xml .hljs-name");
                let attr = document.querySelectorAll("#p_container .language-xml .hljs-attr");

                name.forEach((elem, idx, arr) => {
                    elem.setAttribute("style", "color:blue");
                })

                attr.forEach((elem, idx, arr) => {
                    elem.setAttribute("style", "color:brown");
                })

            }, timer
        )
    }
}
