/**
 * @Author      : 陈海云
 * @Date        : 2014-11-25
 * @SuperClass  : PubSub
 * @Memo        : 提供一个实现组件的基类，提供一些组件常用的接口（方法、事件），该
 *                类一般不直接生成实例，主要目的是为了提供一个标准化的接口，在开发
 *                具体的组件时继承该类，来扩展功能基类实现更丰富的功能
 * @param       : 无
 * 
 * @Methods:
 *      render:
 *          描述: 渲染组件，将组件对应的DOM根节点加入到文档流中；
 *          参数: 
 *              container——需要将组件DOM根据加入到文档流的直接父容器，可选，默认为document.body；
 *          返回值: 当前对象
 * 
 *      renderUI:
 *          描述: 接口（空方法，需要子类重写覆盖），渲染组件内部的UI，在调用方法render()中调用，开始渲染之前调用；
 *          参数: 无
 *          返回值: 当前对象
 * 
 *      bindUI:
 *          描述: 接口（空方法，需要子类重写覆盖），在组件中的节点绑定某些事件，在调用方法render()中调用，开始渲染之前调用；
 *          参数: 无
 *          返回值: 当前对象
 * 
 *      destroy:
 *          描述: 销毁组件，将组件对应的DOM根节点从文档流中删除，并将解绑所有事件；
 *          参数: 无
 *          返回值: 当前对象
 * 
 *      destruct:
 *          描述: 接口（空方法，需要子类重写覆盖），在destroy()方法中调用，在销毁前做一些准备工作；
 *          参数: 无
 *          返回值: 当前对象
 * 
 *          部分方法继承自父类PubSub，请参考父类PubSub
 * 
 * 
 * @Events: 
 *      render:
 *          描述: 组件渲染时触发该事件；
 * 
 *      destroy:
 *          描述: 组件销毁时触发该事件；
 * 
 */


define(function(require) {
    var createClass = require('common/createClass/0.0.1/createClass'),
        PubSub      = require('common/pubSub/0.0.1/pubSub');
    
    var Widget = createClass({
        superClass: PubSub,
        attrs: {
            template: '<div style="display:none;"></div>'
        },
        methods: {
            
            // 在渲染之前调用，处理一些UI方面的渲染工作
            renderUI: function() {
                
            },
            
            // 在渲染之后调用，在UI上绑定一些事件
            bindUI: function() {
                
            },
            
            // 将组件渲染到文档流中，
            render: function(container) {
                var that      = this,
                    template  = that.getAttr('template'),
                    rendered  = that.getAttr('rendered'),
                    widgetEle;
                
                // 判断组件是否已经渲染过，防止重复渲染
                if(rendered) {
                    return that;
                }
                
                that.renderUI();
                
                widgetEle = that.getAttr('widgetEle');
                
                if(!widgetEle) {
                    widgetEle = $(template);
                    that.setAttr('widgetEle', widgetEle);
                }
                
                if(!container) {
                    // 默认父容器为document.body
                    container = document.body;
                }
                
                // 加入到文档中
                widgetEle.appendTo(container);
                
                that.bindUI();
                
                that.setAttr({
                    'rendered': true
                });
                
                that.on('render');
                
                return that;
            },
            
            // 销毁前调用的方法，空方法，需要子类实现
            destruct: function() {
                
            },
            
            // 销毁组件
            destroy: function() {
                var that      = this,
                    widgetEle = that.getAttr('widgetEle');
                
                that.destruct();
                
                // 将组件根节点从文档流中删除、删除根节点上的所有事件
                widgetEle.remove()
                         .off();
                
                // 触发destroy事件，并卸载组件上所有事件
                that.on('destroy')
                    .unbind()
                    .setAttr('rendered', false)
                    .setAttr('widgetEle', null);
                
                return that;
            }
        }
    });
    
    return Widget;
});
