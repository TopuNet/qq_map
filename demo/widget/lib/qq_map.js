/*
    白梦超
    20170320
    腾讯地图
    v2.0.0
 */

function qq_map() {
    return {
        init: function(opt) {
            var _this = this;
            var _opt = {
                id_map: 'qq_map', //存放qq地图的盒子id，只能用id
                address: [{'address':'北京四惠东站','info':'天安门','index':0}, {'address':'北京王府井','info':'王府井123','index':0,'fn':function(){alert(2);}},{'address':'北京香山','info':'香山','index':0,'fn':function(){alert(3);}}],
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

            _this.opt = $.extend(_opt, opt);

            var judge_mobile_os= function() {
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

                if (isiOS)
                    return "ios";
                else if (isAndroid)
                    return "android";
                else
                    return "others";
            };
            _this.opt.app = judge_mobile_os();
            if (_this.opt.app == "ios")
                _this.opt.app = 1;
            else if (_this.opt.app == "android")
                _this.opt.app = 2;
            else
                _this.opt.app = 0;

            //设置地图属性
            _this.SetMap.apply(_this);

            //添加Dom，选择腾讯地图或者百度地图的dom,并添加监听事件
            _this.AddQqOrBaiduDom();  
        },
        //添加Dom，选择腾讯地图或者百度地图的dom,并添加监听事件
        AddQqOrBaiduDom: function(){
            var _this = this;
            if($('#qq_map_iosMask').length === 0){
                $('body').append('<div class="weui-mask" id="qq_map_iosMask" style="display:none; z-index: '+_this.opt.ChooseMaptypeZindex+';"></div>'+
                    '<div class="weui-actionsheet" id="qq_map_iosActionsheet" style="z-index: '+_this.opt.ChooseMaptypeZindex+';">'+        
                        '<div class="weui-actionsheet__menu">'+
                            '<ul class="p_detail">'+
                                '<a href="" target="_self" id="baidu" coordinate=""><li style="text-align: center; font-size: 16px; border-top: 1px solid #dadada; padding: 10px 0; color:#56575a;" >百度地图</li></a>'+
                                '<a href="" target="_self" id="qq" coordinate=""><li style="text-align: center; font-size: 16px; border-top: 1px solid #dadada; padding: 10px 0;color:#56575a;">腾讯地图</li></a>'+
                                '<a href="" target="_self" id="amap" coordinate=""><li style="text-align: center; font-size: 16px; border-top: 1px solid #dadada; padding: 10px 0;color:#56575a;">高德地图</li></a>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="weui-actionsheet__action">'+
                            '<div class="weui-actionsheet__cell" id="qq_map_iosActionsheetCancel">取消</div>'+
                        '</div>'+
                '</div>'+'<input type="hidden" coordinate="" id="coordinatehide" p="">');

                // $(".p_detail .li_click").unbind("click").on("click",function(){
                //     location.href=encodeURI($(this).attr("url"));
                // });
            }

            $('body').off().on('touchstart click','.lable .goToPage',function(){
                $('#qq_map_iosActionsheet').addClass('weui-actionsheet_toggle');
                $('#qq_map_iosMask').fadeIn(200);

                //将坐标赋值给选项
                $("#baidu").attr("coordinate",$(this).attr("baidu"));
                $("#amap").attr("coordinate",$(this).attr("qq"));
                //取消跳转
                $('#qq_map_iosActionsheet .p_detail a').eq(1).attr('href',$(this).attr('href'));
                $('#qq_map_iosActionsheet .p_detail a').eq(0).attr('href',$(this).attr("baidu"));
                $('#qq_map_iosActionsheet .p_detail a').eq(2).attr('href',$(this).attr("amap"));
            });

            $('#qq_map_iosActionsheet').off().on('click','#qq_map_iosActionsheetCancel',function(){
                $('#qq_map_iosActionsheet').removeClass('weui-actionsheet_toggle');
                $('#qq_map_iosMask').fadeOut(200);
            }); 
            
            //选择地图类型之后执行方法ChooseLater_callback
            $('#qq_map_iosActionsheet .p_detail .li_click').click(function(){
                _this.opt.ChooseLater_callback();
            });
        },
        //定位我的位置，需要传一个参数json形式，success-获取我的精准位置成功的回调，error-ip获取我的位置回调，result-返回我的位置信息
        //result是我的位置返回值，是一个json，其中有lat和lng属性，代表地点经纬度，通过 new qq.maps.LatLng(result.lat, result.lng) 可以创建一个我的位置的点
        PositionMe : function(opt){
            var _this = this;
            var _opt = {
                success : function(result){

                    //创建我的位置marker
                    _this.setMeMarker.apply(_this,[result]);
                },
                error : function(result){

                    //创建我的位置marker
                    // _this.setMeMarker.apply(_this,[result]);
                    console.log("qq_map 204",result);
                }
            };

            _opt = $.extend(_opt,opt);
            if(!_this.GetCookies('MyPosition')){
                //定位我的位置(提示用户是否允许)
                _this.geolocation = new qq.maps.Geolocation("Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB", "baimengchao");

                _this.geolocation.getLocation(function(result) {
                    _this.own = new qq.maps.LatLng(result.lat, result.lng);
                    //设置十分钟的浏览器缓存（我的位置）
                    _this.SetMyPositionCache('MyPosition',result.lat+','+result.lng,'s600');
                    _this.SetMyPositionCache('result',JSON.stringify(result),'s600');

                    _opt.success(result);
                }, function() {
                    _this.geolocation.getIpLocation(function(result) {
                        _this.own = new qq.maps.LatLng(result.lat, result.lng);
                        alert(_this.own)
                        //设置十分钟的浏览器缓存（我的位置）
                        _this.SetMyPositionCache('MyPosition',result.lat+','+result.lng,'s600');
                        _this.SetMyPositionCache('result',JSON.stringify(result),'s600');

                        _opt.error(result);
                    });
                });
            }else{
                _this.own = new qq.maps.LatLng(_this.GetCookies('MyPosition').split(',')[0], _this.GetCookies('MyPosition').split(',')[1]);

                if(_this.GetCookies('result').indexOf('lat') == -1){
                    //定位我的位置(提示用户是否允许)
                    _this.geolocation = new qq.maps.Geolocation("Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB", "baimengchao");

                    _this.geolocation.getLocation(function(result) {
                        _this.own = new qq.maps.LatLng(result.lat, result.lng);
                        //设置十分钟的浏览器缓存（我的位置）
                        _this.SetMyPositionCache('MyPosition',result.lat+','+result.lng,'s600');
                        _this.SetMyPositionCache('result',JSON.stringify(result),'s600');

                        _opt.success(result);
                    }, function() {
                        _this.geolocation.getIpLocation(function(result) {
                            _this.own = new qq.maps.LatLng(result.lat, result.lng);
                            //设置十分钟的浏览器缓存（我的位置）
                            _this.SetMyPositionCache('MyPosition',result.lat+','+result.lng,'s600');
                            _this.SetMyPositionCache('result',JSON.stringify(result),'s600');

                            _opt.error(result);
                        });
                    });
                }else {
                    _opt.success(JSON.parse(_this.GetCookies('result')));
                }
            }

        },
        //设置地图属性
        SetMap: function() {
            var _this = this;
            //创建地图，设置地图中心点
            _this.map = new qq.maps.Map(document.getElementById(_this.opt.id_map), {
                zoom: 1,
                draggable: _this.opt.draggable
            });

            //定位我的位置
            _this.PositionMe();

            //创建提示标签
            _this.lable = new qq.maps.Label({
                map: _this.map,
                offset: new qq.maps.Size(-125, -90),
                style: {
                    'border-radius': '5px',
                    'border': '1px solid #ccc'
                },
                zIndex: 100
            });
            //添加点击地图隐藏提示框事件
            qq.maps.event.addListener(_this.map, 'click', function() {
                _this.lable.setVisible(false);
            });

            //添加地图标记
            for (var i = 0; i < _this.opt.address.length; i++) {
                if (i === 0 && !_this.opt.CenterMe)
                    _this.map.setZoom(_this.opt.zoom);
                _this.geocoder(_this.opt.address[i], i === 0 && !_this.opt.CenterMe);
            }

            //判断是否显示缩放控件
            _this.map.zoomControl = _this.opt.ZoomControl;

            //判断是否显示平移控件
            _this.map.panControl = _this.opt.panControl;

            //判断是否显示比例尺控件
            _this.map.scaleControl = _this.opt.scaleControl;

            //判断是否显示地图类型控件
            if (_this.opt.mapTypeControlOptions) {
                _this.map.mapTypeControlOptions = {
                    //设置控件的地图类型ID，ROADMAP显示普通街道地图，SATELLITE显示卫星图像，HYBRID显示卫星图像上的主要街道透明层
                    mapTypeIds: [
                        qq.maps.MapTypeId.ROADMAP,
                        qq.maps.MapTypeId.SATELLITE,
                        qq.maps.MapTypeId.HYBRID
                    ],
                    //设置控件位置相对上方中间位置对齐
                    position: qq.maps.ControlPosition.TOP_RIGHT
                };
            } else {
                _this.map.mapTypeControlOptions = {
                    mapTypeIds: []
                };
            }
        },
        // 以我的位置为中心移动地图，并创建蓝色marker
        setMeMarker: function(result) {
            var _this = this;
            //地图以我的位置为中心
            if (_this.opt.CenterMe) {
                _this.map.setCenter(new qq.maps.LatLng(_this.own.lat, _this.own.lng));
                _this.map.setZoom(_this.opt.zoom);
            }
            //地图上显示我的位置的marker
            if (_this.opt.ShowMeMarker) {
                _this.MarkerMine = new qq.maps.Marker({
                    map: _this.map,
                    position: _this.own,
                    icon: new qq.maps.MarkerImage("/inc/qq_map_me.png"),
                    animation: qq.maps.MarkerAnimation.DOWN
                });
                //_this.setMarkerListener.apply(_this,[_this.MarkerMine,'我的位置',result.city+result.addr,result.lat,result.lng]);
            }
        },
        // 监听所有marker的click
        setMarkerListener: function(marker,info,address,lat,lng,fn) {
            //return function(marker,info,address,lat,lng){
                var _this = this;
                var amap={
                    origin:{
                        lat:_this.own.lat,
                        lng:_this.own.lng
                    },
                    destination:{
                        lat:lat,
                        lng:lng
                    }
                };
                var baidu={
                    origin:txToBd(_this.own.lat,_this.own.lng),
                    destination:txToBd(lat,lng)
                };
                baidu={
                    origin:{
                        lat:baidu.origin.lat,
                        lng:baidu.origin.lng
                    },
                    destination:{
                        lat:baidu.destination.lat,
                        lng:baidu.destination.lng
                    }
                };
                
                var baidu_url="/f/safari.html?app=" +_this.opt.app + 
                "&origin_pos_lat=" + baidu.origin.lat + "&origin_pos_lng=" + baidu.origin.lng +
                "&destination_pos_lat=" + baidu.destination.lat + "&destination_pos_lng=" + baidu.destination.lng +
                "&destination_title=" + info;

                var amap_url="/f/safari.html?app=" +(_this.opt.app+2).toString() + 
                "&origin_pos_lat=" + amap.origin.lat + "&origin_pos_lng=" + amap.origin.lng +
                "&destination_pos_lat=" + amap.destination.lat + "&destination_pos_lng=" + amap.destination.lng +
                "&destination_title=" + info;

                qq.maps.event.addListener(marker, 'click', function() {

                    qq_lable_click = fn;
                    _this.lable.setVisible(true);
                    //_this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><a href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" target="_self" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></a><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                    //_this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><div class="goToPage" baidu="[{lat:'+txToBd(_this.own.lat,_this.own.lng).lat+',lng:'+txToBd(_this.own.lat,_this.own.lng).lng+'},{lat:'+txToBd(lat,lng).lat+',lng:'+txToBd(lat,lng).lng+'}]" qq="" url="http://api.map.baidu.com/direction?origin=' + txToBd(_this.own.lat,_this.own.lng).lat + ',' + txToBd(_this.own.lat,_this.own.lng).lng + '&destination=' + txToBd(lat,lng).lat + ',' + txToBd(lat,lng).lng + '&mode=driving&region=北京&output=html" href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" target="_self" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></div><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                    _this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><div class="goToPage" baidu="' + baidu_url + '" amap="' + amap_url + '"  href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></div><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');

                    _this.lable.setPosition(new qq.maps.LatLng(lat, lng));
                    
                });
                setTimeout(function(){
                    if(_this.opt.ShowLable){
                        qq_lable_click = fn;
                        //_this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><a href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" target="_self" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></a><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                        //_this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><div class="goToPage" url="http://api.map.baidu.com/direction?origin=' + txToBd(_this.own.lat,_this.own.lng).lat + ',' + txToBd(_this.own.lat,_this.own.lng).lng + '&destination=' + txToBd(lat,lng).lat + ',' + txToBd(lat,lng).lng + '&mode=driving&region=北京&output=html" href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" target="_self" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></div><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                        _this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" onclick="qq_lable_click()" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><div class="goToPage" baidu="' + baidu_url + '" amap="' + amap_url + '"  href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" style="width: 49px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:49px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></div><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                        _this.lable.setPosition(new qq.maps.LatLng(lat, lng));
                        _this.lable.setVisible(true);
                    }
                },1000);

                //腾讯坐标转换成百度坐标
                function txToBd(lat,lng){
                    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
                    var x = lng, y = lat;
                    var z =Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                    return {lat:z * Math.sin(theta) + 0.006,lng: z * Math.cos(theta) + 0.0065};
                }
                
            //}
        },
        //调用地址解析
        geocoder: function(obj, judge) {
            var _this = this;
            var geocoder = new qq.maps.Geocoder({
                complete: function(result) {
                    if (judge) {
                        _this.map.setCenter(result.detail.location);
                    }
                    //设置标记动画
                    var marker = null;
                    marker = new qq.maps.Marker({
                        map: _this.map,
                        position: result.detail.location,
                        icon: new qq.maps.MarkerImage(
                            "/inc/qq_map_" + obj.index + ".png"),
                        animation: qq.maps.MarkerAnimation.DOWN
                    });

                    _this.MarkerArray.push(marker);

                    //我的位置没有存cookie时，先获取我的位置，再添加事件
                    if (_this.own === undefined){
                        var timer = setInterval(function(){
                            if (_this.own !== undefined){
                                //标记添加点击事件
                                _this.setMarkerListener(marker,obj.info,result.detail.address,result.detail.location.lat,result.detail.location.lng,obj.fn || function(){});
                                clearInterval(timer);
                            }
                        },100);
                    }else {
                        //标记添加点击事件
                        _this.setMarkerListener(marker,obj.info,result.detail.address,result.detail.location.lat,result.detail.location.lng,obj.fn || function(){});
                                
                    }
                }
            });
            return geocoder.getLocation(obj.address);
        },
        //存放标记
        MarkerArray: [],
        //地图中添加标记
        AddMarker: function(opt) {
            var _opt = {
                zoom: 12, //重设地图级别
                judge: false, //添加标记前是否删除原标记，true或false，默认false
                address: [{ 'address': '北京天安门', 'info': '天安门', 'index': 4 }, { 'address': '北京王府井', 'info': '王府井', 'index': 5 }]
                    //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填），index-设置显示图标数字0-9，0不显示数字，1-9显示对应数字（必填）
            };
            _opt = $.extend(_opt, opt);
            var _this = this;
            _this.map.setZoom(opt.zoom);
            if (opt.judge) {
                //清除标记
                var timer = setInterval(function() {
                    if (_this.MarkerArray.length == _this.opt.address.length) {

                        for (var name in _this.MarkerArray) {
                            _this.MarkerArray[name].setMap(null);
                        }
                        _this.MarkerArray.length = 0;

                        for (var i = 0; i < _opt.address.length; i++) {
                            if (i === 0) {
                                _this.geocoder(_opt.address[0], true);
                            } else {
                                _this.geocoder(_opt.address[i]);
                            }
                        }

                        clearInterval(timer);
                    }
                }, 30);
            } else {
                for (var i = 0; i < _opt.address.length; i++) {
                    _this.geocoder(_opt.address[i]);
                }
            }
        },
        //检索功能
        search: function(opt) {
            var _opt = {
                keywords: '廊坊', //搜索关键字
                page: 1, //显示返回来的marker页数
                pageNum: 9 //每页显示marker数量
            };
            _opt = $.extend(_opt, opt);

            $('#qq_map_1').html('');
            var _this = this;
            //隐藏提示框
            _this.lable.setVisible(false);
            var latlngBounds = new qq.maps.LatLngBounds();
            //设置Poi检索服务，用于本地检索、周边检索
            _this.searchService = new qq.maps.SearchService({
                //设置搜索页码为1
                pageIndex: _opt.page,
                //设置每页的结果数为9
                pageCapacity: _opt.pageNum,
                //设置展现查询结构到infoDIV上
                //panel: document.getElementById('qq_map_1'),
                //设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
                autoExtend: true,
                //检索成功的回调函数
                complete: function(results) {
                        var ownImplement = function(i) {
                            (function(i) {
                                var poi = pois[i];
                                //扩展边界范围，用来包含搜索到的Poi点
                                latlngBounds.extend(poi.latLng);
                                var marker = null;
                                if (i > 9) {
                                    marker = new qq.maps.Marker({
                                        map: _this.map,
                                        icon: new qq.maps.MarkerImage(
                                            "/inc/qq_map_" + 0 + ".png"),
                                        position: poi.latLng
                                    });
                                } else {
                                    marker = new qq.maps.Marker({
                                        map: _this.map,
                                        icon: new qq.maps.MarkerImage(
                                            "/inc/qq_map_" + (i + 1) + ".png"),
                                        position: poi.latLng
                                    });
                                }
                                //为maker添加点击事件
                                if (poi.address)
                                    _this.setMarkerListener.apply(_this,[marker,poi.name,poi.address,poi.latLng.lat,poi.latLng.lng]);
                                else
                                     _this.setMarkerListener.apply(_this,[marker,poi.name,poi.name,poi.latLng.lat,poi.latLng.lng]);
                                //marker.setTitle(i + 1);

                                _this.MarkerArray.push(marker);
                            })(i);
                        };

                        //设置回调函数参数
                        var pois = results.detail.pois;
                        for (var i = 0, l = pois.length; i < l; i++) {
                            ownImplement(i);
                        }
                        //调整地图视野
                        _this.map.fitBounds(latlngBounds);
                    },
                    //若服务请求失败，则运行以下函数
                    error: function() {
                        console.log(267);
                        console.log('检索失败，您输入的地址未找到结果');
                    }
            });

            //清除地图上的marker
            function clearOverlays(overlays) {
                var overlay;
                while (overlays.length > 0) {
                    overlay = overlays.pop();
                    overlay.setMap(null);
                }
            }

            //设置搜索的范围和关键字等属性
            function searchKeyword() {
                clearOverlays(_this.MarkerArray);
                //根据输入的城市设置搜索范围
                //_this.searchService.setLocation("北京");
                //根据输入的关键字在搜索范围内检索
                _this.searchService.search(_opt.keywords);

                //_this.searchService.searchInBounds(keyword, _this.map.getBounds());
            }
            searchKeyword();
        },
        //创建位置展示url，此方法需要传一个数组，数组长度不得大于4（即最多显示四个位置），参数要求如下
        CreatePositionUrl: function(opt) {
            var _this = this;
            var _opt = [/*{
                    address: '北京天安门', //设置标记位置，尽可能写的具体些，如果找不到所写的位置，方法不会继续执行（不会跳页）(必填)
                    title: '成都', //设置提示框标题，长度不能超过10个汉字(必填)
                    addr: '北京市海淀区复兴路32号院' //设置提示框内容，长度不能超过10个汉字(必填)
                },
                {
                    address: '北京东单',
                    title: '成都园',
                    addr: '北京市丰台区射'
                }*/
            ];

            _opt = $.extend(_opt, opt);
            var geocoder = new qq.maps.Geocoder();

            var url = 'http://apis.map.qq.com/tools/poimarker?type=0&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&marker=';

            function CreateUrl() {
                if (_opt.length === 0) {
                    window.location.href = url;
                }
                var _opt1 = _opt.shift();
                geocoder.getLocation(_opt1.address);
                //设置服务请求成功的回调函数
                geocoder.setComplete(function(result) {
                    if (_opt.length === 0) {
                        url += 'coord:' + result.detail.location.lat + ',' + result.detail.location.lng + ';title:' + _opt1.title + ';addr:' + _opt1.addr;
                    } else {
                        url += 'coord:' + result.detail.location.lat + ',' + result.detail.location.lng + ';title:' + _opt1.title + ';addr:' + _opt1.addr + '|';
                    }
                    CreateUrl();
                });

                geocoder.setError(function() {
                    console.log(330);
                    console.log('地址解析失败，请重新输入地址');
                });
            }
            CreateUrl();
        },
        //创建地图检索url，此方法需要传一个数组，且数组只有一个元素，参数要求如下
        CreateSearchUrl: function(opt) {
            var _opt = [{
                keyword: '酒店', //搜索关键字  (必填)
                address: '北京东单', //设置搜索的中心位置，尽可能写的具体些，如果找不到所写的位置，方法不会继续执行（不会跳页）(必填)
                radius: '1000' //设置搜索半径，单位米(必填)
            }];
            _opt = $.extend(_opt, opt);
            var geocoder = new qq.maps.Geocoder();
            var url = 'http://apis.map.qq.com/tools/poimarker?type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&keyword=';

            function CreateUrl() {
                if (_opt.length === 0) {
                    window.location.href = url;
                }
                var _opt1 = _opt.shift();
                geocoder.getLocation(_opt1.address);
                //设置服务请求成功的回调函数
                geocoder.setComplete(function(result) {
                    url += _opt1.keyword + '&center=' + result.detail.location.lat + ',' + result.detail.location.lng + '&radius=' + _opt1.radius;
                    CreateUrl();
                });

                geocoder.setError(function() {
                    console.log(360);
                    console.log('地址解析失败，请重新输入地址');
                });
            }
            CreateUrl();
        },
        //获取两点间距离,需要传一个参数json形式，address_1和address_2是两个点的位置信息，address_1-不传默认为我的位置，address_2-必传参数，success-获取两点距离成功的回调，dis-两点的距离，单位-米
        GetDistance : function(opt){
            var _this = this;

            var _opt ={
                address_1 : 1,
                address_2 : '北京西单',
                success : function(dis){
                    console.log(dis);
                },
                error : function(dis){
                    console.log(dis);
                }
            };
            var _opt_address = {
                address_1 : null,
                address_2 : null
            };
            _opt = $.extend(_opt,opt);

            //解析地址
            var getAddress = function(num){
                var start = '', end = '',count = 0;
                var geocoder_1 = new qq.maps.Geocoder();
                var geocoder_2 = new qq.maps.Geocoder();
                    geocoder_1.getLocation(_opt.address_1);
                    //设置服务请求成功的回调函数
                    geocoder_1.setComplete(function(result) {
                        start = result.detail.location;
                        count ++;
                        if (count == 2){
                            CalculationDis(start,end);
                        }
                    });

                    geocoder_2.getLocation(_opt.address_2);
                    //设置服务请求成功的回调函数
                    geocoder_2.setComplete(function(result) {
                        end = result.detail.location;
                        count++;
                        if (count == 2){
                            CalculationDis(start,end);
                        }
                    });
                    //设置获取获取位置失败的回调
                    geocoder_2.setError(function(result){
                        end = 0;
                        count++;
                        if (count == 2){
                            CalculationDis(start,end);
                        }
                    });

            };


            if (_opt.address_1 == 1){
                if (!_this.own){
                    if(!_this.GetCookies('MyPosition')){
                        _this.PositionMe({
                            success : function(result){
                                _this.own = new qq.maps.LatLng(result.lat, result.lng);
                            },
                            error : function(result){
                                _this.own = new qq.maps.LatLng(result.lat, result.lng);
                            }
                        });
                    }else {
                        _this.own = new qq.maps.LatLng(_this.GetCookies('MyPosition').split(',')[0], _this.GetCookies('MyPosition').split(',')[1]);
                    }
                    _this.GetDistanceTimer = setInterval(function(){
                        if (_this.own){
                            clearInterval(_this.GetDistanceTimer);

                            var geocoder = new qq.maps.Geocoder();
                            geocoder.getLocation(_opt.address_2);
                            //设置服务请求成功的回调函数
                            geocoder.setComplete(function(result) {
                                _opt_address.address_2 = result.detail.location;
                                CalculationDis(_this.own,_opt_address.address_2);
                            });
                            //设置获取获取位置失败的回调
                            geocoder_2.setError(function(result){
                                _opt_address.address_2 = 0;
                                CalculationDis(_this.own,_opt_address.address_2);
                            });
                        }
                    },100);
                }else {
                    var geocoder = new qq.maps.Geocoder();
                    geocoder.getLocation(_opt.address_2);
                    //设置服务请求成功的回调函数
                    geocoder.setComplete(function(result) {
                        _opt_address.address_2 = result.detail.location;
                        CalculationDis(_this.own,_opt_address.address_2);
                    });
                    //设置获取获取位置失败的回调
                    geocoder.setError(function(result){
                        _opt_address.address_2 = 0;
                        CalculationDis(_this.own,_opt_address.address_2);
                    });
                }
            }else{
                getAddress();
            }
            
            

            //计算距离
            var CalculationDis =function(start,end){
                if (start && end){
                    clearInterval(_this.timerSet);
                    var dis = parseInt(qq.maps.geometry.spherical.computeDistanceBetween(start,end));
                    _opt.success(dis);
                }else {
                    _opt.error(0);
                }
            };

        },
        //设置我的位置缓存cookie
        SetMyPositionCache : function(name,value,time){
            function setCookie(name,value,time)
            {
                var strsec = getsec(time);
                var exp = new Date();
                exp.setTime(exp.getTime() + strsec*1);
                document.cookie = name + "="+  value + ";expires=" + exp.toGMTString();
            }
            function getsec(str)
            {
               var str1=str.substring(1,str.length)*1;
               var str2=str.substring(0,1);
               if (str2=="s")
               {
                    return str1*1000;
               }
               else if (str2=="h")
               {
                   return str1*60*60*1000;
               }
               else if (str2=="d")
               {
                   return str1*24*60*60*1000;
               }
            }

            setCookie(name,value,time);
        },
        //获取浏览器cookie
        GetCookies : function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if (arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
    };
}


if (typeof define === "function" && define.amd) {
    define(function() {
        return qq_map;
    });
}
