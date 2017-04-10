require(["qq_map", "/inc/zepto.min.js"], function($qq_map) {

    $(function() {
        var map1 = new $qq_map();
        var opt = {
            id_map : 'qq_map',                  //存放qq地图的盒子id，只能用id
            address : [{'address':'北京天安门','info':'天安门','index':3},{'address':'北京王府井','info':'王府井123','index':2},{'address':'北京香山','info':'香山','index':1}], 
            //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填）,index-设置显示图标数字0-9，0不显示数字，1-9显示对应数字（必填） 
            zoom : 12,                          //地图等级，默认12，
            ZoomControl : true,                 //是否显示地图缩放控件，true或false，默认true
            panControl : true,                  //是否显示平移控件，true或false，默认true
            scaleControl : true,                //是否显示比例尺控件，true或false，默认true
            mapTypeControlOptions : true,       //是否显示地图类型控件，true或false，默认true
            draggable: true,                    //设置是否可以拖拽，true或false，默认true
            CenterMe : false,                   //设置地图是否已我的位置为中心，true-以我的位置为中心，false-不以我的位置为中心,当设置为false时，以地图中传的第一个点为中心
            ShowMeMarker : true                //设置地图是否显示我的位置的marker，true-显示，false-不显示
        };
        map1.init(opt);

        $('input.button').click(function(){
            var keywords = $('input#keyword').val();
            var _opt = {
                keywords : keywords,          //搜索关键字
                page : 1,               //显示返回来的marker页数
                pageNum : 9             //每页显示marker数量
            };
            map1.search(_opt);
        });
    });
});