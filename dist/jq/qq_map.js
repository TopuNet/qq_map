/*
    白梦超
    20170320
    腾讯地图
 */

function qq_map() {
    return {
        init: function(opt) {
            var _this = this;
            var _opt = {
                id_map: 'qq_map', //存放qq地图的盒子id，只能用id
                address: [{ 'address': '北京四惠东站', 'info': '天安门', 'index': 1 }, { 'address': '北京王府井', 'info': '王府井123', 'index': 2 }, { 'address': '北京香山', 'info': '香山', 'index': 3 }],
                //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填）,index-设置显示图标数字0-9，0不显示数字，1-9显示对应数字（必填） 
                zoom: 12, //地图等级，默认12，
                ZoomControl: true, //是否显示地图缩放控件，true或false，默认true
                panControl: true, //是否显示平移控件，true或false，默认true
                scaleControl: true, //是否显示比例尺控件，true或false，默认true
                mapTypeControlOptions: true, //是否显示地图类型控件，true或false，默认true
                draggable: true, //设置是否可以拖拽，true或false，默认true
                CenterMe: false, //设置地图是否已我的位置为中心，true-以我的位置为中心，false-不以我的位置为中心,当设置为false时，以地图中传的第一个点为中心，默认-false
                ShowMeMarker: true //设置地图是否显示我的位置的marker，true-显示，false-不显示,默认-true
            };

            _this.opt = $.extend(_opt, opt);

            //设置地图属性
            _this.SetMap.apply(_this);

        },
        //设置地图属性
        SetMap: function() {
            var _this = this;
            //创建地图，设置地图中心点
            _this.map = new qq.maps.Map(document.getElementById(_this.opt.id_map), {
                zoom: 1,
                draggable: _this.opt.draggable
            });

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

            //定位我的位置
            _this.geolocation = new qq.maps.Geolocation("Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB", "baimengchao");
            _this.geolocation.getLocation(function(result) {
                _this.own = new qq.maps.LatLng(result.lat, result.lng);
                _this.setMeMarker.apply(_this,[result]);
            }, function() {
                _this.geolocation.getIpLocation(function(result) {
                    // console.log("success ip", result);
                    _this.own = new qq.maps.LatLng(result.lat, result.lng);
                    _this.setMeMarker.apply(_this,[result]);
                });
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
                _this.setMarkerListener.apply(_this,[_this.MarkerMine,'我的位置',result.city+result.addr,result.lat,result.lng]);
            }
        },
        // 监听所有marker的click
        setMarkerListener: function(marker,info,address,lat,lng) {
            //return function(marker,info,address,lat,lng){
                var _this = this;
                qq.maps.event.addListener(marker, 'click', function() {
                    _this.lable.setVisible(true);
                    _this.lable.setContent('<div class="lable" style="width: 250px; height: 60px;"><div class="left" style="float:left; width:200px; padding: 8px 10px; padding-right: 0;"><div class="title" style="height:26px; line-height: 26px; font-size:16px; color: #0079ff; font-weight: 700; overflow:hidden;">' + info + '</div><div class="content" style="font-size:11px; line-height: 18px; height:18px; overflow:hidden; color:#8a8d8f">' + address + '</div></div><a href="http://apis.map.qq.com/tools/routeplan/eword=' + info + '&epointx=' + lat + '&epointy=' + lng + '?referer=myapp&key=Y2ABZ-4VZR4-UVCUA-XM5BF-QSWPF-GFFSB" target="_self" style="width: 50px; height: 44px; border-left: 1px solid #ccc; margin: 8px 0; float: left;"><span style="width:20px; height:20px; float:left; background:url(/inc/qq_map_bg.png) 0 0 no-repeat; background-size: cover; margin: 4px 15px;"></span><span style="width:50px; height: 18px; font-size: 12px; color: #0079ff; float:left; text-align: center;">路线</span></a><i style="display:block; width:0; height:0; border-top: 10px solid #fff; border-left: 10px solid transparent; border-right: 10px solid transparent; position: absolute; bottom:-9px; left:114px;"></i><div>');
                    _this.lable.setPosition(new qq.maps.LatLng(lat, lng));
                });
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

                    //标记添加点击事件
                    _this.setMarkerListener(marker,obj.info,result.detail.address,result.detail.location.lat,result.detail.location.lng);
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
            var _opt = [{
                    address: '北京天安门', //设置标记位置，尽可能写的具体些，如果找不到所写的位置，方法不会继续执行（不会跳页）(必填)
                    title: '成都', //设置提示框标题，长度不能超过10个汉字(必填)
                    addr: '北京市海淀区复兴路32号院' //设置提示框内容，长度不能超过10个汉字(必填)
                },
                {
                    address: '北京东单',
                    title: '成都园',
                    addr: '北京市丰台区射'
                }
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
        }
    };
}


if (typeof define === "function" && define.amd) {
    define(function() {
        return qq_map;
    });
}
