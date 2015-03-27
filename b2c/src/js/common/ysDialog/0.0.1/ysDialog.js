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
 *      append:
 *          描述: 往对话框的中添加内容；
 *          参数:
 *              ele——需要添加的内容，可以为DOM、HTML代码以及jQuery DOM
 *          返回值: 当前对象
 *
 *
 *          部分方法继承自父类Dialog，请参考父类Dialog
 *
 *
 *      setTitle:
 *          描述: 往对话框的中添加内容；
 *          参数:
 *              title——标题栏文本，支持HTML代码
 *          返回值: 当前对象
 *
 *
 *      alert:
 *          描述: 模拟系统alert()警告框，静态方法——直接通过ComDialog.alert()的形式来调用；
 *          参数:
 *              conf——配置参数，对象
 *                  conf = {
 *                      titleText: 弹出框标题栏内容，字符串
 *                      tipText  : 警告框内容，字符串，支持HTML代码
 *                      timeout  : 定时关闭，正整数，单位：毫秒
 *                      mask     : 是否显示遮罩，默认显示，Boolean
 *                  }
 *          返回值: 无
 *
 *
 *      confirm:
 *          描述: 模拟系统confirm()确认框，静态方法——直接通过ComDialog.confirm()的形式来调用；
 *          参数:
 *              tipText——提示内容，字符串，支持HTML代码
 *              titleText——标题栏内容，字符串，支持HTML代码，默认显示：“提示”二字
 *              callback——确认回调函数，类型：function，点击确定是，向callback传递true，否则传递false
 *
 *          返回值: 无
 *
 *
 *          部分方法继承自父类Dialog，请参考父类Dialog
 *
 */


define(function(require) {

    var createClass = require('common/createClass/0.0.1/createClass'),
        Dialog      = require('common/dialog/0.0.1/dialog');

    var template = [
        '<div class="sea-ysdialog">',
            '<h4 class="sea-ysdialog-title"></h4>',

            '<div class="sea-ysdialog-bd"></div>',
            '<a class="sea-ysdialog-close" href="javascript:;" title="点击关闭窗口">╳</a>',
        '</div>'
    ].join('');

    var YsDialog = createClass({
        superClass: Dialog,
        attrs: {
        },
        init: function(conf) {
            var that = this;

            conf = $.extend({
                titleText: '对话框',
                mask: true
            }, conf);

            that.render();

            that.setSize(400, 'auto')
                .setTitle(conf.titleText);

            if(conf.content) {
                that.append(conf.content);
            }

            that.setAttr(conf);
        },
        methods: {
            bindUI: function() {
                var that      = this,
                    widgetEle = that.getAttr('widgetEle');

                that.superClass.prototype.bindUI.apply(that);

                widgetEle.on('click', 'a.sea-ysdialog-close', function() {
                    that.hide();
                });

                that.on('render', function() {

                    // 触发渲染事件后将模板代码填充进去
                    widgetEle.html(template);
                    widgetEle.css({
                        background: 'none'
                    });
                });
            },
            setTitle: function(titleText) {
                var that      = this,
                    widgetEle = that.getAttr('widgetEle'),
                    titleEle  = that.getAttr('titleEle');

                titleText = titleText || that.getAttr('titleText');

                if(!titleEle) {
                    titleEle = widgetEle.find('.sea-ysdialog-title');
                    that.setAttr(titleEle);
                }

                that.setAttr('titleText', titleText);

                titleEle.html(titleText);

                return that;
            },
            append: function(ele) {
                var that        = this,
                    widgetEle   = that.getAttr('widgetEle'),
                    dialogBdEle = that.getAttr('dialogBdEle');

                if(!dialogBdEle) {
                    dialogBdEle = widgetEle.find('div.sea-ysdialog-bd');
                    that.setAttr('dialogBdEle', dialogBdEle);
                }

                dialogBdEle.append(ele);

                return that;
            }
        }
    });

    YsDialog.confirm = function(tipText, titleText, callback) {

        var dialog = YsDialog.confirm._dialog,
            dialogEle,
            confirmTip,
            closeBtn,
            confirmBtn,
            cancelBtn;

        if(!dialog) {
            dialog = new YsDialog({
                mask: true,
                titleText: '&nbsp;'
            });

            dialog.setSize(290);

            YsDialog.confirm._dialog = dialog;

            dialog.append([
                '<div style="padding: 10px 20px">',
                    '<div class="J-confirmTip" style="padding:10px 0;line-height:1.5;text-align:center;"></div>',
                    '<div style="height:28px;padding: 20px 0 10px">',
                        '<div style="margin:0 auto;width: 145px;height: 28px;">',
                            '<a class="sea-ysdialog-btn sea-ysdialog-btn-grey" href="javascript:;" style="margin-left:15px;float:right">取消</a>',
                            '<a class="sea-ysdialog-btn sea-ysdialog-btn-orange" href="javascript:;" style="float:right;">确定</a>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));
        }

        dialogEle = dialog.getAttr('widgetEle');
        closeBtn  = dialogEle.find('a.sea-ysdialog-close');
        confirmTip= dialogEle.find('div.J-confirmTip');
        confirmBtn= dialogEle.find('a.sea-ysdialog-btn-orange');
        cancelBtn= dialogEle.find('a.sea-ysdialog-btn-grey');

        if(arguments.length === 2) {
            callback = arguments[1];
            titleText = '';
        }
        titleText = titleText || '';

        dialog.setTitle(titleText);


        confirmTip.html(tipText);

        function onCancel() {

            if(typeof callback === 'function') {
                callback(false);
            }
            dialog.hide();
        }
        function onConfirm() {

            if(typeof callback === 'function') {
                callback(true);
            }
            dialog.hide();
        }

        closeBtn.on('click', onCancel);
        cancelBtn.on('click', onCancel);
        confirmBtn.on('click', onConfirm);

        dialog.bind('hide', function() {

            closeBtn.off('click', onCancel);
            cancelBtn.off('click', onCancel);
            confirmBtn.off('click', onConfirm);

            dialog.unbind('hide', arguments.callee);
        });

        dialog.show().setPosition();

        return dialog;
    };


//弹出层、自定义html @chenlihua
//width: 600px;
//height: 400px;
    YsDialog.popup = function(titleText,config,callback,initFn,standBy) {
        config.ok=config.ok||'确定';
        config.cancel=config.cancel||'取消';
        config.width=config.width||'500';
        config.html=[config.html].join('')||'';
        config.temp=[
                '<div style="padding: 10px 10px;">',
                    '<div class="confirmTip" id="content" style="padding:10px 0;line-height:1.5;text-align:center;"></div>',
                    '<div style="height:28px;padding: 20px 0 10px;clear:both;">',
                        '<div style="margin:0 auto;width: 145px;height: 28px;">',
                            '<a class="sea-ysdialog-btn sea-ysdialog-btn-grey" href="javascript:;" style="margin-left:15px;float:right">'+config.cancel+'</a>',
                            '<a class="sea-ysdialog-btn sea-ysdialog-btn-orange" href="javascript:;" style="float:right;">'+config.ok+'</a>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');

        var dialog = YsDialog.popup._dialog,
            dialogEle,
            confirmTip,
            closeBtn,
            confirmBtn,
            cancelBtn;

        if(!dialog) {
            dialog = new YsDialog({
                mask: true,
                titleText: ''
            });

            dialog.setSize(config.width);

            YsDialog.popup._dialog = dialog;

            dialog.append(config.temp);
        }

        dialogEle = dialog.getAttr('widgetEle');
        closeBtn  = dialogEle.find('a.sea-ysdialog-close');
        confirmTip= dialogEle.find('#content');
        confirmBtn= dialogEle.find('a.sea-ysdialog-btn-orange');
        cancelBtn= dialogEle.find('a.sea-ysdialog-btn-grey');
        if(arguments.length === 2) {
            callback = arguments[1];
            titleText = '';
        }
        titleText = titleText || '';

        dialog.setTitle(titleText);

        confirmTip.html(config.html);  //设置中间html内容

        function onCancel() {

            if(typeof callback === 'function') {
                callback(false);
            }
            dialog.hide();
        }

        function onConfirm() {

            if(typeof callback === 'function') {
                callback(true);
            }
            if(standBy){

            }else{

                dialog.hide();
            }
        }

        if(initFn) {
            initFn();
        }

        closeBtn.on('click', onCancel);
        cancelBtn.on('click', onCancel);
        confirmBtn.on('click', onConfirm);

        dialog.bind('hide', function() {

            closeBtn.off('click', onCancel);
            cancelBtn.off('click', onCancel);
            confirmBtn.off('click', onConfirm);

            dialog.unbind('hide', arguments.callee);
        });

        dialog.show().setPosition();

        return dialog;
    };



    /*
     * 模拟window.alert
     * conf = {
     *     tipText: '提示内容',
     *     titleText: '标题栏文本',
     *     mask: 是否显示屏蔽（true/false）
     *     timeout: 定时关闭（毫秒）
     * }
     */
    YsDialog.hint = function(conf) {

        var dialog = YsDialog.hint._dialog,
            dialogEle = dialog ? dialog.getAttr('widgetEle') : null,
            confirmTipEle,
            confirmBtn;
        conf = conf || {};
        if(!dialog) {
            dialog = new YsDialog();

            dialog.setSize(213);

            YsDialog.hint._dialog = dialog;

            dialogEle = dialog.getAttr('widgetEle');

            dialog.append([
                '<div style="padding: 10px 30px">',
                    '<div class="J-confirmTip" style="padding:20px 0;color:red;line-height:1.5;"></div>',
                    '</div>',
                '</div>'
            ].join(''));
            dialogEle.find('a.sea-ysdialog-close').remove();
            dialogEle.find('H4.sea-ysdialog-title').remove();
            dialogEle.find('div.sea-ysdialog').addClass('hint');
            dialogEle.find('div.sea-ysdialog').parent().css('z-index','1000000');
        }

        confirmTipEle = dialogEle.find('div.J-confirmTip');

        confirmTipEle.html(conf.tipText || '');

        conf.timeout = parseInt(conf.timeout);

         var height=$('body').prop('scrollHeight') || $('body').outerWidth(),
             width= $('body').prop('scrollWidth') || $('body').outerHeight(),
             newmak=$('<div style="height: '+height+'px; width: '+width+'px; opacity: 0.7; position: absolute; left: 0px; top: 0px; z-index: 999999; background: rgb(170, 170, 170);"></div>').appendTo('body');

        if(conf.timeout) {
            setTimeout(function() {
                dialog.hide();
                newmak.hide();
            }, conf.timeout);
        }
        dialog.setAttr('mask', conf.mask);
        dialog.show().setPosition();
        return dialog;
    };


    /*
     * 模拟window.alert
     * conf = {
     *     tipText: '提示内容',
     *     titleText: '标题栏文本',
     *     mask: 是否显示屏蔽（true/false）
     *     timeout: 定时关闭（毫秒）
     * }
     */
    YsDialog.alert = function(conf) {

        var dialog = YsDialog.alert._dialog,
            dialogEle = dialog ? dialog.getAttr('widgetEle') : null,
            confirmTipEle,
            confirmBtn;

        conf = conf || {};

        if(!dialog) {
            dialog = new YsDialog({
                mask: true,
                titleText: '&nbsp;'
            });

            dialog.setSize(290);

            YsDialog.alert._dialog = dialog;

            dialogEle = dialog.getAttr('widgetEle');

            dialog.append([
                '<div style="padding: 10px 30px">',
                    '<div class="J-confirmTip" style="padding:10px 0;line-height:1.5;"></div>',
                    '<div style="height:28px;padding: 20px 0 10px">',
                        '<a class="sea-ysdialog-btn sea-ysdialog-btn-orange" href="javascript:;" style="float:right;">确定</a>',
                    '</div>',
                '</div>'
            ].join(''));

            dialogEle.find('a.sea-ysdialog-btn-orange').on('click', function() {
                dialog.hide();
            });
        }

        confirmTipEle = dialogEle.find('div.J-confirmTip');

        dialog.setTitle(conf.titleText || '');
        confirmTipEle.html(conf.tipText || '');

        conf.timeout = parseInt(conf.timeout);

        if(conf.timeout) {
            setTimeout(function() {
                dialog.hide();
            }, conf.timeout);
        }

        if(conf.mask === undefined) {
            conf.mask = true;
        } else {
            conf.mask = !!conf.mask;
        }
        dialog.setAttr('mask', conf.mask);

        dialog.show().setPosition();

        return dialog;
    };

    require('./dialog.css');

    return YsDialog;
});
