/**
 * @Author     : 陈海云
 * @Date       : 2014-11-25
 * @SuperClass : Widget
 * @Memo       : 提供一个实现弹出层的类，提供一些组件常用的接口，实现了“显示”（show()）、
 *               “隐藏”（hide()）、“定位”（position()）方法；该类实现的方法比较简单，主
 *               要为了方便封装和提供一个标准的弹出层接口
 * 
 * @param      : 无
 * 
 * @Methods:
 *      show:
 *          描述: 显示弹出层；
 *          参数: 无；
 *          返回值: 当前对象；
 * 
 *      hide:
 *          描述: 隐藏弹出层；
 *          参数: 无；
 *          返回值: 当前对象；
 * 
 *      position:
 *          描述: 定位弹出层，弹出层根节点是绝对定位，该方法设置其left、top 两个坐标；
 *          参数: 
 *              left——弹出层根节点的水平方向坐标，
 *              top——弹出层跟解答的垂直方向坐标；
 *          返回值: 当前对象；
 * 
 *      setSize:
 *          描述: 设置tip尺寸；
 *          参数: 
 *              width——dialog宽度；
 *              height——dialog高度；
 *          返回值: 当前对象；
 * 
 *      
 *      部分方法继承自父类 Widget，请参考父类 Widget
 * 
 * 
 * @Events: 
 *      hide:
 *          描述：对话框关闭时触发
 * 
 *      show:
 *          描述：对话框显示时触发
 * 
 * 
 */

define(function(require, exports, module) {
    
    var isIE  = !!window.ActiveXObject,
        isIE6 = isIE && !window.XMLHttpRequest;

    
    var createClass = require('common/createClass/0.0.1/createClass'),
        Widget      = require('common/widget/0.0.1/widget'),
        mask        = require('./mask');
        
    var Dialog = createClass({
        superClass: Widget,
        init: function(conf) {
            var that = this;
            
            conf = $.extend({
                template : '<div></div>',
                width    : 400,        // 窗口宽度
                height   : 'auto',     // 窗口宽度
                position : "fixed",    // 窗口定位方式
                mask     : false       // 是否显示遮罩背景
            }, conf);
            
            that.setAttr(conf);
        },
        methods: {
            bindUI: function() {
                var that = this;
                
                function onresize() {
                    that.setPosition();
                }
                
                $(window).on('resize', onresize);
                
                that.on('destroy', function() {
                    var isShowMask = that.getAttr('mask');
                    
                    $(window).off('resize', onresize);
                    
                    if(isShowMask) {
                        mask.hide();
                    }
                });
            },
            renderUI: function() {
                var that      = this,
                    template  = that.getAttr('template'),
                    width     = that.getAttr('width'),
                    height    = that.getAttr('height'),
                    widgetEle = that.getAttr('widgetEle') || $(template);
                
                widgetEle.css({
                    'width'      : width,
                    'height'     : height,
                    'display'    : 'none',
                    'background' : '#000',
                    'z-index'    : '100000'
                });
                
                that.setAttr('widgetEle', widgetEle);
                
                return that;
                
            },
            
            // 显示对话框
            show: function() {
                var that       = this,
                    isShowMask = that.getAttr('mask'),
                    widgetEle  = that.getAttr('widgetEle');
                
                widgetEle.show();
                that.setPosition();
                
                if(isShowMask) {
                    mask.show();
                }
                
                that.on('show');
                
                return that;
            },
            
            // 关闭对话框
            hide: function() {
                var that       = this,
                    isShowMask = that.getAttr('mask'),
                    widgetEle  = that.getAttr('widgetEle');
                
                if(widgetEle.css('display') === 'none') {
                    return that;
                }
                
                widgetEle.hide();
                
                if(isShowMask) {
                    mask.hide();
                }
                
                that.on('hide');
                
                return that;
            },
            
            // 设置尺寸
            setSize: function(width, height) {
                var that      = this,
                    widgetEle = that.getAttr('widgetEle');
                
                widgetEle.css({
                    width  : width || that.getAttr('width'),
                    height : height || that.getAttr('height')
                });
                
                return that;
            },
            
            // 设置窗口位置,参数可选,不设置参数的时候,对话框位置在页面可视区域中央
            setPosition: function(x, y) {
                var that = this,
                    pos  = that.getAttr('position');
                
                var $win = $(window),
                    widgetEle = that.getAttr('widgetEle');
                
                var left, top;

                left = ($win.width() - widgetEle.width()) / 2;
                // top在垂直方向的黄金分割点上（0.618）
                top  = $win.height() * 618 / (1000 + 618) - widgetEle.height() / 2;
    
                if(pos === "absolute") {
                    top = top + $win.scrollTop();
                } else {
                    
                    if(isIE6) {
                        // ie6不支持fixed定位,所以强制设定为absolute定位
                        top = top + $win.scrollTop();
                        pos = 'absolute';
                        that.setAttr('position', pos);
                    }
                }
                
                if(left < 0) {
                    left = 0;
                }
                if(top < 0) {
                    top = 0;
                }
                
                x = x || left;
                y = y || top;
                
                widgetEle.css({left: x, top: y, position: pos});
                
                return that;
            }
        }
    });
    
    return Dialog;
});