/**
 * @Author : 陈海云
 * @Date   : 2014-06-25
 * @Memo   : 实现一个生成、控制页面遮罩层的对象，在实现弹出层或其他效果是可以遮挡页面
 *           该类控制一个mask可对象，mask对象为Layer（components/layer/0.0.1/layer）
 *           的实例，切该对象为一个单例对象，不管在页面中有多少地方需要显示遮罩，调用
 *           的对象均为同一个对象指针
 * 
 * @Methods:
 *      show:
 *          描述: 显示遮罩层；
 *          参数: 无；
 *          返回值: 当前对象；
 * 
 *      hide:
 *          描述: 隐藏遮罩层；
 *          参数: 无；
 *          返回值: 当前对象；
 * 
 *      setSize:
 *          描述: 根据页面尺寸，设定遮罩层的尺寸；
 *          参数: 无；
 *          返回值: 当前对象；
 * 
 *      setStyle:
 *          描述: 设置遮罩层样式，只支持设置 background(背景，默认为#000——黑色)、opacity(透明度，默认为0.7——70%的透明度)两个样式；
 *          参数: 
 *              propName——样式属性名称；必填；字符串、对象；当为对象时，不会读取value参
 *                        数的值，而是提取该对象的 background、opacity两个属性值，来设
 *                        置对应的样式
 *              value——样式值
 *          返回值: 当前对象；
 * 
 */

define(function(require, exports, module) {
    
    var Layer   = require('common/layer/0.0.1/layer');
    
    var body    = $(document.body),
        mask    = new Layer().render();
    
    var maskEle = mask.getAttr('widgetEle');
    
    maskEle.css({
        height     : body.outerHeight(true),
        width      : body.outerWidth(true),
        background : '#aaa',
        opacity    : '0.7',
        position   : 'absolute',
        left       : 0,
        top        : 0,
        zIndex     : '99999'
    });
    
    var maskObj = {
        show: function() {
            var that = this;
            
            that.setSize();
            mask.show();
            
            return that;
        },
        hide: function() {
            var that = this;
            
            mask.hide();
            
            return that;
        },
        setSize: function() {
            var that = this;
            
            maskEle.css({
                height : body.prop('scrollHeight') || body.outerWidth(),
                width  : body.prop('scrollWidth') || body.outerHeight()
            });
            
            return that;
        },
        setStyle: function(propName, value) {
            var styleObj = {};
            
            if(typeof propName  === 'object' && propName.constructor === Object) {
                
                styleObj.opacity = propName.opacity || '0.1';
                styleObj.background = propName.background || '#000';
                
            } else if(typeof propName === 'string' && value) {
                
                if(propName === 'opacity' || propName === 'background') {
                    styleObj[propName] = value;
                }
            }
            
            maskEle.css(styleObj);
            
            return this;
        }
    };
    
    $(window).on('resize', function() {
        maskObj.setSize();
    });
    
    return maskObj;
});