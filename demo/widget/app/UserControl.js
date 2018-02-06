/*
    白梦超
    20170515
    公共 js 控件
 */

require(['lib/landscape_mask','lib/mobile_stop_moved','lib/functions','lib/zepto.min'],function(landscape_mask,mobile_stop_moved,$func){
    var UserControl = {
        init : function(){
            //横屏遮罩
            landscape_mask.init();

            //ios/微信 滑屏时 阻止浏览器上下灰条
            var opt = {
                selector: "section.wrapper", // 容器盒选择器（resize_toWindow为false时，需要在样式表中将此盒定高），无默认值
                scroll: true, // 盒内可滚动，默认true
                resize_toWindow: true // 将容器盒自动设置为有效窗口高度(window.innerHeight)，并监听窗口大小改变——解决ios safari浏览器底部工具栏遮挡页面的问题，默认true
            };
            mobile_stop_moved.init(opt);

            //兼容 iphoneX
            this.JudgeBottomFixedBox();
        },
        //判断页面中是否存在底部fixed盒
        JudgeBottomFixedBox:function(){
            //获取当前页面最外层的body
            var thisBody=$("body");
            //获取页面底部的fixed盒
            var bottomFixed=thisBody.find(".bottomFixedBoxInPage");
            //获取文档路中的占位盒
            //var bottomHolder=thisBody.find(".bottomFixedBoxInPageHolder");
            if(bottomFixed){
                $func.judge_iphoneX_MicroMessenger_changeStyle({
                    bottom_fixed_selector: ".bottomFixedBoxInPage", // 底部fixed盒的选择器，此盒将被修改bottom，无默认值
                    document_fixed_space_selector: ".bottomFixedBoxInPageHolder", // 文档流内的占位盒选择器，此盒将被增加高度，无默认值
                    fixed_space_div_bgColor: "#f5f5f5", // 底部新建占位遮罩盒的背景色，建议和页面背景色一致，以免穿帮
                    callback: function() { // 回调(新建的底部占位遮罩层||undefined)，无论是否为iphoneX+微信浏览器都会执行
                        bottomFixed.css("display","block");

                        if($func.judge_iphoneX()){
                            $(".givemeheight").css("top",$func.iphoneX_bottom_space_px*-1+"px");
                        }
                    }
                });
            }else{
                bottomFixed.css("display","block");
            }

        }
    };
    UserControl.init();
});