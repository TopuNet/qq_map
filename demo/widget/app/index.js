
define(['lib/qq_map'], function($qq_map) {
    var index = {
        init : function(){
            var map1 = new $qq_map();

            var _opt = {
                id_map: 'qq_map', //存放qq地图的盒子id，只能用id
                address: [{'address':'北京苹果社区今日美术馆','info':'今日美术馆','index':1}],
                //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填）,index-设置显示图标数字0-9，0不显示数字，1-9显示对应数字（必填）,fn-回调函数，点击标记左侧执行，可以不传
                zoom: 12, //地图等级，默认12，
                ZoomControl: true, //是否显示地图缩放控件，true或false，默认true
                panControl: true, //是否显示平移控件，true或false，默认true
                scaleControl: true, //是否显示比例尺控件，true或false，默认true
                mapTypeControlOptions: true, //是否显示地图类型控件，true或false，默认true
                draggable: true, //设置是否可以拖拽，true或false，默认true
                CenterMe: false, //设置地图是否已我的位置为中心，true-以我的位置为中心，false-不以我的位置为中心,当设置为false时，以地图中传的第一个点为中心，默认-false
                ShowMeMarker: true, //设置地图是否显示我的位置的marker，true-显示，false-不显示,默认-true
                ShowLable: false,  //设置是否显示提示框，true-显示，false-不显示,默认-false
                ChooseMaptypeZindex: 6001,  //设置选择地图类型的z_index，默认6001
                ChooseLater_callback: function(){        //选择地图类型后的回调，默认微信弹层收起
                    $('#qq_map_iosActionsheet').removeClass('weui-actionsheet_toggle');
                    $('#qq_map_iosMask').fadeOut(200);
                }
            };

            map1.init(_opt);
        }
    };
    return index;
});