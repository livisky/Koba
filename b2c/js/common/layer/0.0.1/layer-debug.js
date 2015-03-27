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
 *              width——tip宽度；
 *              height——tip高度；
 *          返回值: 当前对象；
 * 
 *      
 *      部分方法继承自父类 Widget，请参考父类 Widget
 * 
 * 
 * @Events: 
 *      无
 * 
 */
define("common/layer/0.0.1/layer-debug", [ "common/createClass/0.0.1/createClass-debug" ], function(require) {
    var createClass = require("common/createClass/0.0.1/createClass-debug"), Widget = require("common/widget/0.0.1/widget-debug");
    var Layer = createClass({
        superClass: Widget,
        attrs: {
            template: '<div style="display:none"></div>'
        },
        methods: {
            show: function() {
                var that = this, widgetEle = that.getAttr("widgetEle");
                widgetEle.show();
                return that;
            },
            hide: function() {
                var that = this, widgetEle = that.getAttr("widgetEle");
                if (widgetEle.css("display") === "none") {
                    return that;
                }
                widgetEle.hide();
                return that;
            },
            position: function(left, top) {
                var that = this, widgetEle = that.getAttr("widgetEle"), offset;
                if (widgetEle.css("display") === "none") {
                    offset = widgetEle.show().offset();
                    widgetEle.hide();
                } else {
                    offset = widgetEle.offset();
                }
                if (!left && left !== 0) {
                    left = offset.left;
                }
                if (!top && top !== 0) {
                    top = offset.top;
                }
                widgetEle.css({
                    left: left,
                    top: top
                });
                return that;
            },
            setSize: function(width, height) {
                var that = this, widgetEle = that.getAttr("widgetEle");
                width = width || "auto";
                height = height || "auto";
                widgetEle.css({
                    height: height,
                    width: width
                });
                return that;
            }
        }
    });
    return Layer;
});
