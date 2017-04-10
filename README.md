腾讯地图插件v1.1.1
====

### 安装：

## 文件结构


    1.jq/qq_map.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中
    2.demo中的demo.html为功能展现最全面的页面；demo_requireJs.html是amd规范的测试
    
## 页面引用


原生引用

    1. 页面底端引用 http://map.qq.com/api/js?v=2.exp&key=d84d6d83e0e51e481e50454ccbe8986b&libraries=geometry   key是申请的腾讯地图秘钥，不加秘钥的话有些功能会用不了  libraries=geometry开启获取我的位置服务
    2. 后引用  https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js
    3. 后引用  zepto.min.js
    4. 再引用  /jq/qq_map.js
    
requireJs引用

    1. 页面底端引用require.js前，引用 http://map.qq.com/api/js?v=2.exp&key=d84d6d83e0e51e481e50454ccbe8986b&libraries=geometry   key是申请的腾讯地图秘钥，不加秘钥的话有些功能会用不了  libraries=geometry开启获取我的位置服务
    2. 后引用 https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js
    3. 依赖qq_map.js和 zepto.min.js，成功后返回对象baidu_map
    
## 功能配置及启用方法


调用方法

    //创建对象
    var map1 = new qq_map();
    
    //初始化地图
    map1.init({
        id_map: 'qq_map', //存放qq地图的盒子id，只能用id
        address: [{ 'address': '北京四惠东站', 'info': '天安门', 'index': 1 }, { 'address': '北京王府井', 'info': '王府井123', 'index': 2 }, { 'address': '北京香山', 'info': '香山', 'index': 3 }],
        //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填）,index-设置显示图标数字0-9，0-marker图标不显示数字，1-9marker图标显示对应数字（必填） 
        zoom: 12, //地图等级，默认12，
        ZoomControl: true, //是否显示地图缩放控件，true或false，默认true
        panControl: true, //是否显示平移控件，true或false，默认true
        scaleControl: true, //是否显示比例尺控件，true或false，默认true
        mapTypeControlOptions: true, //是否显示地图类型控件，true或false，默认true
        draggable: true, //设置是否可以拖拽，true或false，默认true
        CenterMe: false, //设置地图是否已我的位置为中心，true-以我的位置为中心，false-不以我的位置为中心,当设置为false时，以地图中传的第一个点为中心，默认-false
        ShowMeMarker: true //设置地图是否显示我的位置的marker，true-显示，false-不显示,默认-true
     });
     
     
     //地图添加marker方法
     var opt = {
          zoom : 11,      //重设地图级别
          judge : false,  //添加标记前是否删除原标记，true或false，默认false
          address : [{'address':'北京南站','info':'北京南站','index':4},{'address':'北京站','info':'北京站','index':5}]   
          //此处为一个数组，address-添加到地图中的标记名称，info-点击标记时的提示信息（必填），index-设置显示图标数字0-9，0不显示数字，1-9显示对应数字（必填） 
      }
      map1.AddMarker(opt);
      
      
      //地图添加搜索气泡点，可以设置显示气泡个数，不得超过9个，默认显示9个，气泡返回数据按每页几个的方式返回，可以设置显示哪一页的气泡，默认显示第一页
      var opt = {
            keywords : keywords,          //搜索关键字
            page : 1,               //显示返回来的marker页数
            pageNum : 9             //每页显示marker数量
       }
       map1.search(opt)
       当关键字搜索不到结果时，控制台输出 检索失败，您输入的地址未找到结果
       
       
       //创建位置展示url，此方法需要传一个数组，数组长度不得大于4（即最多显示四个位置），调用方法如下：
       map1.CreatePositionUrl([{
            address: '北京天安门',             //设置标记位置，尽可能写的具体些，如果找不到所写的位置，方法不会继续执行（不会跳页）(必填)
            title:'成都',                     //设置提示框标题，长度不能超过10个汉字(必填)
            addr:'北京市海淀区复兴路32号院'      //设置提示框内容，长度不能超过10个汉字(必填)
        },
        {
            address:'北京东单',
            title:'成都园',
            addr:'北京市丰台区射'
        },
        {
            address:'北京南站',
            title:'成都园',
            addr:'北京市丰台区射'
        },
        {
            address:'北京香山',
            title:'成都园',
            addr:'北京市丰台区射'
        }])
        当未找到填写地址的位置时，控制台会输出： 地址解析失败，请重新输入地址
        
        //创建地图检索url，（设置中心点，和半径，在此范围内查找关键字位置）此方法需要传一个数组，且数组只有一个元素，调用方法如下
        var _opt = [{
                keyword: '酒店',           //搜索关键字  (必填)
                address: '北京东单',       //设置搜索的中心位置，尽可能写的具体些，如果找不到所写的位置，方法不会继续执行（不会跳页）(必填)
                radius: '1000'            //设置搜索半径，单位米(必填)
            }]
       map1.CreateSearchUrl(_opt);
       当未找到填写地址的位置时，控制台输出: 地址解析失败，请重新输入地址
       
 更新日志
 ====
 
 v1.1.1
    
      创建地图插件
       
       
       
       
       
