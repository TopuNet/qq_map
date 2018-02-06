


define(["lib/zepto.min"], function() {
    require(["app/UserControl"], function() {
        var page_name = $("#script_page").attr("page");
        switch (page_name) {
            case "index":
                require(["app/index"], function($obj) {
                    $obj.init();
                });
                break;
            
            case "safari":
                require(['app/safari'], function($obj){
                    $obj.init();
                });
                break;
        }
    });
});
