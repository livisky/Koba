/*
 * Date   : 2015-03-05
 * Author : gulisha(谷莉莎)
 * Memo   : 该文件中的代码为萤石商城头部模块功能
 *          调用该JS文件的页面视图文件为 mall/common/layouts/main.php
 */ 

define(function(require) {

	(function() {

        var header = {

            qrcodeDom           : $('#qrcode'),                  // 手机萤石Dom
            webNavDom           : $('#web-nav'),                 // 网站导航Dom
            webNavListDom       : $('#web-nav-list'),            // 鼠标网站导航时的导航条Dom
            headerQrcodeLineDom : $('#header-qrcode-line'),      
            headerQrcodeImgDom  : $('#header-qrcode-img'),       // 二维码图片Dom
            usernameDom         : $('#username'),                // 用户名Dom
            userExitDom         : $('#user-exit'),               // 用户退出Dom

            /*
             * 事件绑定
             */ 
            bindEvent : function() {

                var me = this;

                me.webNavDom.on('hover', function() {

                    $(this).toggleClass("nav-btn-hover");

                    me.webNavListDom.toggle();
                });

                me.qrcodeDom.on('hover', function() {

                    $(this).toggleClass("qrcode-hover");

                    me.headerQrcodeLineDom.toggle();
                    me.headerQrcodeImgDom.toggle();
                });

                me.usernameDom.on('hover', function() {

                    $(this).toggleClass("username-hover");

                    me.userExitDom.toggle();

                    var width = $(this).width() + 2 * parseInt($('#username').css('padding-left'));

                    me.userExitDom.css({
                        'width' : width
                    });
                });
            },
            /*
             * 初始化
             */ 
            init : function() {

                this.bindEvent();
            }
        };

        header.init();



        var Emulate    = true,                                                      //模拟开关
            emulateData = {
                MiniCartList: {
                    status: true,                                                   //成功状态
                    code: 1001,                                                     //错误码
                    msg: 'success',                                                 //提示的文字信息
                    data: {                                                         //返回的数据
                        count: '5',                                                       //商品总数
                        total: '800',                                                    //总价格
                        items: [                                                         
                            {
                                id: '1',                                                //商品唯一标识
                                name: 'C2S 多功能互联网摄像机',                         //名字
                                pic: staticsBase +'/b2c/images/header/goods.png',       //图片
                                price: '200',                                           //单价
                                num: '2',                                               //数量
                                info: '',                                               //简介
                                isAdjunct: false,                                       //是否为搭配商品 搭配减价
                                isGift: false,                                          //是否为赠品
                                hasChild: false                                         //是否含有搭配商品或赠品
                            },
                            {
                                id: '2',
                                name: 'S1 互联网运动摄像机套装',
                                pic: staticsBase +'/b2c/images/header/goods.png',
                                price: '200',
                                num: '1',
                                info: 'S1套装类型：两件套',
                                isAdjunct: false,
                                isGift: false,
                                hasChild: true,                                         //含有搭配商品或赠品
                                chidAttr: '11'                                          //搭配商品的属性 class
                            },
                            {
                                id: '3',
                                name: 'C2S 多功能互联网摄像机',
                                pic: staticsBase +'/b2c/images/header/goods.png',
                                price: '200',
                                num: '1',
                                info: '',
                                isAdjunct: true,                                        //搭配商品
                                isGift: false,                                  
                                hasChild: false,
                                childAttr: '11'                                         //搭配商品的属性 class
                            },
                            {
                                id: '4',
                                name: 'C2S 多功能互联网摄像机',
                                pic: staticsBase +'/b2c/images/header/goods.png',
                                price: '0',
                                num: '1',
                                info: '',
                                isAdjunct: false,
                                isGift: true,                                           //赠品
                                hasChild: false,
                                childAttr: '11'                                         //搭配商品的属性 class
                            },
                            {
                                id: '5',                                                    
                                name: 'c2s MINI',                           
                                pic: staticsBase +'/b2c/images/header/goods.png',       
                                price: '200',                                           
                                num: '2',                                               
                                info: 'mini',                                                   
                                isAdjunct: false,                                           
                                isGift: false,                                         
                                hasChild: false                                         
                            }
                        ]
                    }               
                }
            },
            cart_count =  2;                                                        //购物车商品数量Cookie.read('S[CART_COUNT]');




        /*mini购物车*/
        var MiniCarWidgets = {
            init: function() {
                var minicart = this.cart = $('.minicart');
                if(!minicart) {
                    // 找不到购物车按钮时，不进行初始化
                    return;
                }
                
                this.minicartcont = minicart.find('.minicart-cont');                //购物车列表容器
                this.detailbox = minicart.find('.miniCarDetail');                   //购物车列表
                this.handle = minicart.find('.ibutton');                            //购物车图标 及 数量显示
                this.cartCnt = minicart.find('.ibutton').find('.minicart-title');   //购物车数量

                this.bindEvent();   

                return this;
            },

            bindEvent: function() {
                var _this = this;
                //鼠标移至购物车 查询购物车列表
                this.handle.hover( function(e) {

                    //当前已显示
                    if(_this.minicartcont.css('visibility') == 'visible') return;

                    //数据没有变化，显示之前的购物车列表 --------TODO
                    if( false ) {showMiniCartList(); return;}

                    //请求购物车数据
                    _this.showLoading();
                    _this.showMiniCartList();
                    MiniCartManager.getMiniCartList( function(data) {
                        _this.updateCartList(data);
                    } );
                    
                }, function(e) {
                    // _this.hideMiniCartList();
                });


                this.minicartcont.on('mouseout', function() {   //暂时测试用
                    _this.hideMiniCartList();
                });
            },
            /*加载中*/
            showLoading: function() {
                this.detailbox.empty().html('<div class="loading">加载中...</div>');
            },
            /*显示迷你购物车下拉列表*/
            showMiniCartList: function() {
                this.minicartcont.css({'visibility': 'visible'});
                this.cart.addClass('current');
            },
            /*隐藏迷你购物车下拉列表*/
            hideMiniCartList: function() {
                this.minicartcont.css({'visibility': 'hidden'});
                this.cart.removeClass('current');
            },

            /*更新购物车列表*/
            updateCartList: function(cartData) {

                //更新导航栏购物车商品数量
                cart_count = cartData.count;
                if (this.cartCnt) this.cartCnt.html('(' + cart_count+ ')');
                if(!cart_count || cart_count === '0') {
                    this.cart.removeClass('has-pro');
                } else {
                    this.cart.addClass('has-pro');
                }

                //更新购物车列表数据
                this.renderCartList(cartData);
            },

            /*购物车列表模板*/
            renderCartList: function(cartData) {
                var _this = this,
                    itemList = cartData.items;

                _this.detailbox.empty();


                //购物车为空
                if(itemList && itemList.length <=0 ) {
                    _this.detailbox.html('<div class="cart-empty">购物车中还没有商品，快去选购吧！</div>');
                    return;
                }

                var listCon = $('<div>').attr({'id': 'goodsList'}).addClass('clearfix');
                for(var i=0; item=itemList[i]; i++) {
                    item.tmp_isAdjunct = item.isAdjunct ? 'minicart-adjunct' : '';
                    item.tmp_isGift = item.isGift ? 'minicart-gift' : '';
                    item.tmp_hasChild = item.hasChild ? 'hasChild' : '';
                    item.tmp_childAttr = (item.isGift || item.isAdjunct) ? item.childAttr : '';
                    item.tmp_data_child_attr = item.hasChild ? ('data_child_attr="'+item.chidAttr+'"') : '';

                    el = $( this.renderTmp(item,itemListTmp) );

                    el.find('.delcart').on('click',function(e) {
                        _this.removeCartEvent(_this,this);
                        e.stop();
                    });
                    listCon.append(el);
                }


                _this.detailbox.append(listCon);
                _this.detailbox.append( $( this.renderTmp(cartData,accountTmp) ) );


            },
            /*删除单个商品*/
            removeCartEvent: function(cartDom,el) {
                var _this = cartDom;
                var cartBox =$( $(el).parents('.minicart-single') );

                MiniCartManager.removeCart(cartBox.attr('id'), function(data) {

                    _this.updateCartList(data);

                });

            },
            renderTmp: function (item, tmp) {
                return tmp.replace(/\{.+?\}/g, function($1) { return item[$1.slice(1, -1)]; });
            }
        };

        /*购物车列表模板*/
        var itemListTmp = [
            '<div id="{id}" class="minicart-single {tmp_isAdjunct} {tmp_isGift} {tmp_hasChild} {tmp_childAttr} clearboth clearfix" {tmp_data_child_attr}>',
                '<div class="promotionsBg"></div>',
                '<div class="goodpic">',
                    '<img src="{pic}">',
                '</div>',
                '<div class="goods-main">',
                    '<div class="goodinfo">',
                        '<h3><a href="" class="nc-name">{name}</a></h3>',
                        '<span>{info}</span>',
                    '</div>',
                    '<div class="price-wrap">',
                        '<p class="sum-n-del">',
                            '<span class="pro-price">{price}</span>',
                            '<span class="pro-gift">赠品</span>',
                            '<span class="pro-num">×&nbsp;{num}</span>',
                            '<span class="pro-del"><a href="#" class="delcart">删除</a></span>',
                        '</p>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''),
        accountTmp = [
            '<div class="cartInfoItems">',
                '<div class="clearfix sum-n-go textright">',
                    '<h4 class="micolor1 clearfix">',
                        '<p class="cart-account">总计：',
                            '<span class="subtotal micolor2">{total}</span>',
                        '</p>',
                        '<p class="cart-count">共&nbsp;<span class="item_quantity">{count}</span>&nbsp;件商品</p>',
                    '</h4>',
                    '<div class="clearfix">',
                        '<a href="" class="go-cart">去购物车结算</a>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');


        MiniCarWidgets.init();


        //迷你购物车接口控制中心
        var MiniCartManager = {
            /*
            @function 接口 获取购物车列表
            callback 获取成功后的回调函数
            */
            getMiniCartList: function (callback) {
                if(Emulate) {
                    callback(emulateData.MiniCartList.data);
                } else {
                    $.ajax({
                        url: '',
                        type: 'GET',
                        data: {param1: 'value1'},
                        success: function(re) {
                            if(rs.status) {
                                callback(re.data);
                            } else {
                                //提示错误信息 re.code
                            }
                        },
                        fail: function() {

                        }
                    });
                }

                   
            },
            /*
            @function 接口 删除单个商品
            removeId 删除商品的Id
            callback 删除成功后的回调函数
            */
            removeCart: function(removeId,callback) {

                if(Emulate) {
                    var child_attr='';
                    if($('#' +removeId).hasClass('hasChild')) {
                        child_attr = $('#' +removeId).attr('data_child_attr');
                    }
                    var item,len = emulateData.MiniCartList.data.items.length;
                    for (var i = 0; i < len; i++) {
                        item = emulateData.MiniCartList.data.items.shift();
                        if(item.id == removeId || (child_attr && (item.childAttr == child_attr))) {
                            emulateData.MiniCartList.data.count = emulateData.MiniCartList.data.count - 1;
                            emulateData.MiniCartList.data.total = emulateData.MiniCartList.data.total - 200;
                            continue;
                        }
                        emulateData.MiniCartList.data.items.push(item);

                    };

                    callback(emulateData.MiniCartList.data);
                } else {
                    $.ajax({
                        url: '',
                        type: 'get',
                        data: {id: removeId},
                        success: function(re) {
                            if(re.status) {
                                callback(re.data);
                            }
                            
                        }
                    });
                }
            }
        };

    })();
});


