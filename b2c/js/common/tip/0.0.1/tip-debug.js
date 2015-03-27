/**
 * @Author      : 陈海云
 * @Date        : 2014-11-25
 * @SuperClass  : Layer
 * @Memo        : 提供一个提示
 * @param       : config——配置参数，conf = {
 *                                    tip     : 提示信息；字符串；支持HTML代码
 *                                }
 * 
 * @Methods:
 *      append:
 *          描述: 往对话框的中添加内容；
 *          参数: 
 *              ele——需要添加的内容，可以为DOM、HTML代码以及jQuery DOM
 *          返回值: 当前对象
 * 
 *      setTheme:
 *          描述: 设置tip主题，就是在tip跟节点上添加className=sea1411-tip-theme-themeName；
 *          参数: 
 *              themeName——主题名称；
 *          返回值: 当前对象
 * 
 *      setTip:
 *          描述: 设置tip信息；
 *          参数: 
 *              tip——tip信息内容；
 *          返回值: 当前对象
 * 
 * 
 *      部分方法继承自父类Layer，请参考父类Layer
 *      
 */
define("common/tip/0.0.1/tip-debug", [ "common/createClass/0.0.1/createClass-debug" ], function(require) {
    var createClass = require("common/createClass/0.0.1/createClass-debug"), Layer = require("common/layer/0.0.1/layer-debug");
    var template = [ '<div class="sea1411-tip" style="display:none">', '<div class="sea1411-tip-bd"></div>', '<span class="sea1411-tip-arrow">', "<span>◆</span>", "<i>◆</i>", "</span>", "</div>" ].join("");
    var Tip = createClass({
        superClass: Layer,
        init: function(conf) {
            var that = this;
            conf = $.extend({
                tip: ""
            }, conf || {});
            that.render();
            if (conf.content) {
                that.append(conf.content);
            }
            if (conf.tip) {
                that.setTip(conf.tip);
            }
            that.setAttr(conf);
        },
        methods: {
            renderUI: function() {
                var that = this;
                var widgetEle = $(template);
                that.setAttr("widgetEle", widgetEle);
                return that;
            },
            append: function(content) {
                var that = this, widgetEle = that.getAttr("widgetEle");
                widgetEle.find("div.sea1411-tip-bd").append(content);
                return that;
            },
            setTheme: function(themeName) {
                var that = this, widgetEle = that.getAttr("widgetEle");
                widgetEle.removeClass().addClass("sea1411-tip-theme-" + themeName);
                return that;
            },
            setTip: function(tip) {
                var that = this, widgetEle = that.getAttr("widgetEle");
                widgetEle.find("div.sea1411-tip-bd").empty().append(tip);
                return that;
            }
        }
    });
    require("./tip-debug.css");
    return Tip;
});
