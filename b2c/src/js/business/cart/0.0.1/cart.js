 /* Author
  * Date: 
  * Memo: 
  *       
  *       
  *       
  */

(function($) {
	
	$('.deleteHint a').on({
		'mouseenter': function() {
			$(this).parent('td').css({
				'border': '1px solid #ff7200'
			});
		},
		'mouseleave': function() {
			$(this).parent('td').css({
				'border': 'none'
			});
		}
	});


	$('#goodsbody ').find('tr').each(function(index, el) {
		$(el).on('click', function(e ) {

			if($(e.target).hasClass('del')) {
				//点击删除
				Cart.removeItem($(e.target));

			} else if($(e.target).hasClass('numadjust')) {
				//更改商品数量

			} else if($(e.target).hasClass('cart-check')) {
				//选择单个商品
				Cart.checkItem($(e.target));
			} else if($(e.target).hasClass('shop-check')) {
				//选择店铺
				Cart.checkShop($(e.target));
			} else if($(e.target).hasClass('checkAll')) {
				//全选
				Cart.checkAllShop($(e.target));
			}
		})
	});

	$('.cart-operate').on('click', function(e) {
		if($(e.target).hasClass('checkAll')) {
			//全选
			Cart.checkAllShop($(e.target));

		} else if($(e.target).hasClass('delete')) {
			//批量删除
			Cart.removeAll($(e.target));
		}
	});

	var Emulate = true,
		emulateData = {
			removeCart: {
				status: true,
				code: '1004',
				msg: 'success',
				data: {
					is_empty: 'false',					//删除后购物车是否为空
					shop_active: [						//店铺活动
						{		
							shopId: 'shop1',            //店铺ID							
							sale: '20',					//单个店铺优惠金额
							notEnough: true,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						}
					],
					suitable_active: [				//活动列表
						{
					        "name": "满199包邮",
					        "discount_amount": "5.00"
					    },
					    {
					        "name": "庆国庆满700减50",
					        "discount_amount": "50.00"
					    }
				    ],
				    used_coupons: [					//已选优惠券
				    	{
					        "name": "买C2减20",
					        "discount_amount": "40.00"
					    },
					    {
					        "name": "买套装减30",
					        "discount_amount": "30.00"
					    }
				    ],
					sub_total: {						//金额
						discount_amount_order: '90',	//合计优惠价格
						promotion_subtotal: '2457.00'	//最终价格
					},
					recommend_data: [					//推荐商品
						{
							goods_id: "49",
					        name: "N1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "48",
					        name: "N1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "47",
					        name: "N1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "46",
					        name: "N1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						}
				        
					]
				}
			},
			checkItem: {
				status: true,
				code: '1004',
				msg: 'success',
				data: {
					shop_active: [						//店铺活动
						{		
							shopId: 'shop1',            //店铺ID							
							sale: '20',					//单个店铺优惠金额
							notEnough: true,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						}
					],
					suitable_active: [				//活动列表
						{
					        "name": "满199包邮",
					        "discount_amount": "5.00"
					    },
					    {
					        "name": "庆国庆满700减50",
					        "discount_amount": "50.00"
					    }
				    ],
				    used_coupons: [					//已选优惠券
				    	{
					        "name": "买C2减20",
					        "discount_amount": "40.00"
					    },
					    {
					        "name": "买套装减30",
					        "discount_amount": "30.00"
					    }
				    ],
					sub_total: {						//金额
						discount_amount_order: '90',	//合计优惠价格
						promotion_subtotal: '2457.00'	//最终价格
					}
				}
			},
			checkShop: {
				status: true,
				code: '1004',
				msg: 'success',
				data: {
					shop_active: [						//店铺活动
						{		
							shopId: 'shop1',            //店铺ID							
							sale: '20',					//单个店铺优惠金额
							notEnough: true,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						}
					],
					suitable_active: [				//活动列表
						{
					        "name": "满199包邮单个店铺",
					        "discount_amount": "5.00"
					    },
					    {
					        "name": "庆国庆满700减50",
					        "discount_amount": "50.00"
					    }
				    ],
				    used_coupons: [					//已选优惠券
				    	{
					        "name": "买C2减20",
					        "discount_amount": "40.00"
					    },
					    {
					        "name": "买套装减30",
					        "discount_amount": "30.00"
					    }
				    ],
					sub_total: {						//金额
						discount_amount_order: '90',	//合计优惠价格
						promotion_subtotal: '2457.00'	//最终价格
					}
				}
			},
			checkAllShop: {
				status: true,
				code: '1004',
				msg: 'success',
				data: {
					shop_active: [						//店铺活动
						{
							shopId: 'shop1',			//店铺ID				
							sale: '90',					//单个店铺优惠金额
							notEnough: true,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						},{
							shopId: 'shop2',			//店铺ID				
							sale: '290',				//单个店铺优惠金额
							notEnough: false,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						}

					],
					suitable_active: [				//活动列表
						{
					        "name": "满199包邮全选",
					        "discount_amount": "5.00"
					    },
					    {
					        "name": "庆国庆满700减50",
					        "discount_amount": "50.00"
					    }
				    ],
				    used_coupons: [					//已选优惠券
				    	{
					        "name": "买C2减20",
					        "discount_amount": "40.00"
					    },
					    {
					        "name": "买套装减30",
					        "discount_amount": "30.00"
					    }
				    ],
					sub_total: {						//金额
						discount_amount_order: '90',	//合计优惠价格
						promotion_subtotal: '2457.00'	//最终价格
					}
				}

			},
			removeAll: {
				status: true,
				code: '1004',
				msg: 'success',
				data: {
					is_empty: 'false',					//删除后购物车是否为空
					shop_active: [						//店铺活动
						{		
							shopId: 'shop1',            //店铺ID							
							sale: '20',					//单个店铺优惠金额
							notEnough: true,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						},{		
							shopId: 'shop2',            //店铺ID							
							sale: '888',				//单个店铺优惠金额
							notEnough: false,			//不满足活动，是否去凑单
							addr: 'XXXXXXX'				//凑单时的链接地址
						}
					],
					suitable_active: [				//活动列表
						{
					        "name": "满199包邮批量删除",
					        "discount_amount": "15.00"
					    },
					    {
					        "name": "庆国庆满700减50",
					        "discount_amount": "50.00"
					    }
				    ],
				    used_coupons: [					//已选优惠券
				    	{
					        "name": "买C2减20",
					        "discount_amount": "40.00"
					    },
					    {
					        "name": "买套装减30",
					        "discount_amount": "30.00"
					    }
				    ],
					sub_total: {						//金额
						discount_amount_order: '290',	//合计优惠价格
						promotion_subtotal: '8888.00'	//最终价格
					},
					recommend_data: [					//推荐商品
						{
							goods_id: "49",
					        name: "R1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "48",
					        name: "R1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "47",
					        name: "R1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						},{
							goods_id: "46",
					        name: "R1 互联网硬盘录像机",
					        current_price: "229.000",
					        img_src: "http://statics.ys7.com/mall/public/images/ea/f1/6f/f32af7cf2993f3dc5a5f4bd16e257dc1.png"
						}
				        
					]
				}

			}
		};
	var Cart = {
		//全选
		checkAllShop: function(el) {
			var _this = this,
				params = {
					checked: false								//true--添加 false--删除
				};

			if(el[0].nodeName.toLowerCase() == 'a') {
				//当前是a标签的全选
				params.checked = !$('.cart-operate input.checkAll')[0].checked;
			} else if(el[0].checked) {
				//添加
				params.checked = true;
			}

			//有两个全选按钮 保持一致
			$('.checkAll[type=checkbox]').each(function(index, item) {
				item.checked = params.checked;
			});

			CartManager.checkAllShop(params, function(re) {

				if(params.checked) {
					//添加 所有商品选中
					$('.shop .shop-check').each(function(index, el) {
						el.checked = true;
					});
					$('tr.item').each(function(index, el) {
						$(el).addClass('checked');
					});
					$('tr.item .cart-check').each(function(index, val) {
						val.checked = true
					});
				} else {
					//删除 所有商品取消
					$('.shop .shop-check').each(function(index, el) {
						el.checked = false;
					});
					$('tr.item').each(function(index, el) {
						$(el).removeClass('checked');
					});
					$('tr.item .cart-check').each(function(index, val) {
						val.checked = false
					});
				}

				
				_this.updateShopActivity(re.shop_active);		// 更新所有店铺的活动
                _this.updateActivity(re.suitable_active);		//更新活动
                _this.updateCoupons(re.used_coupons);			//更新优惠券
                _this.updateTotalPrice(re.sub_total);			//更新金额
			});

		},
		
		//选择某个店铺
		checkShop: function(el) {
			var _this = this,
				item = el.parents('tr'),
				shopId = item.attr('id'),
				shopChilds = $('[data_shop_attr='+shopId+']'), 	//店铺所有商品
				params = {
					shopId: shopId,									//店铺id
					checked: false								//true--添加 false--删除
				};

			if(el[0].checked) {
				//添加
				params.checked = true;
			}

			CartManager.checkShop(params, function(re) {

				if(params.checked) {
					//添加店铺 把该店铺所有商品选中
					for(var i=0,len = shopChilds.length; i<len; i++ ) {
						$(shopChilds[i]).addClass('checked');
						$(shopChilds[i]).find('.cart-check')[0].checked = true;
					}
				} else {
					//删除店铺 把该店铺所有商品取消
					for(var i=0,len = shopChilds.length; i<len; i++ ) {
						$(shopChilds[i]).removeClass('checked');
						$(shopChilds[i]).find('.cart-check')[0].checked = false;
					}
				}
				_this.updateAllCheck();
                _this.updateShopActivity(re.shop_active);		//更新店铺信息
                _this.updateActivity(re.suitable_active);		//更新活动
                _this.updateCoupons(re.used_coupons);			//更新优惠券
                _this.updateTotalPrice(re.sub_total);			//更新金额
			});


		},

		//选择单个商品
		checkItem: function(el) {
			var _this = this,
				item = el.parents('tr'),
				shopId = item.attr('data_shop_attr'),
				chlid_attr = item.attr('data_child_attr'),
				params = {
					id: item.attr('data_product_id'),		//商品id
					shopId: shopId,							//当前店铺ID
					checked: false							//true--添加 false--删除
				};

			if(el[0].checked) {
				//添加
				params.checked = true;
			}

			CartManager.checkItem(params, function(re) {

				if(params.checked) {
					//添加

					// 选中自己
					item.addClass('checked');

					//包含子商品 将子商品全部选中
	                if(item.hasClass('hasChild')){
	                    $('#goodsbody tbody .' + chlid_attr).each(function(index, subItem){
	                    	$(subItem).addClass('checked');
	                    	$(subItem).find('.cart-check').each(function(index, val) {
	                    		$(val)[0].checked = true;
	                    	});
	                    });
	                }

					// 判断是否将商铺全选
					var shopAllCheck = true;							//店铺全选
					var shopChilds = $('[data_shop_attr='+shopId+']'); 	//店铺所有商品
					for(var i=0,len = shopChilds.length; i<len; i++ ) {
						if(!$(shopChilds[i]).hasClass('checked')) {
							shopAllCheck = false;
							break;
						}
					}
					if(shopAllCheck) {
						$('#'+ shopId).find('.shop-check')[0].checked = true;
					}

				} else {
					item.removeClass('checked');
					//包含子商品 将子商品全部删除
	                if(item.hasClass('hasChild')){
	                    $('#goodsbody tbody .' + chlid_attr).each(function(index, subItem){
	                    	$(subItem).removeClass('checked');
	                    	$(subItem).find('.cart-check').each(function(index, val) {
	                    		$(val)[0].checked = false;
	                    	});
	                    });
	                }
					$('#'+ shopId).find('.shop-check')[0].checked = false;
				}

				_this.updateAllCheck();
                _this.updateShopActivity(re.shop_active);//更新店铺信息
                _this.updateActivity(re.suitable_active);		//更新活动
                _this.updateCoupons(re.used_coupons);			//更新优惠券
                _this.updateTotalPrice(re.sub_total);			//更新金额
			});
		},
		//更新全选框
		updateAllCheck: function() {

			var shops = $('.shop-check'),
				checkAll = true;

			for(var i=0,len = shops.length; i<len; i++) {
				if(!shops[i].checked) {
					checkAll = false;
					break;
				}
			}
			if(checkAll) {
				$('.checkAll').each(function(index, item) {
					item.checked = true;
				});
			} else {
				$('.checkAll').each(function(index, item) {
					item.checked = false;
				});
			}
		},

		//删除单个商品
		removeItem: function(el) {
			var _this = this,
				item = el.parents('tr'),
				shopId = item.attr('data_shop_attr'),
				params = {
					id: item.attr('data_product_id'),
					shopId: shopId
				};

			CartManager.removeCart(params, function(re) {

				//购物车为空
				if (re.is_empty === 'true') {
                    var _empty_html = '<div class="cart-empty"><img src="statics/b2c/src/images/cart/empty.jpg" /><p>您的购物车里还没有商品,<br />去看看&nbsp;<a href="" class="orange">萤石商城>></a></p></div>';
                   
					$('#cart-items').empty().html(_empty_html);
					return;
                } 

				//包含子商品
                if(item.hasClass('hasChild')){
                    var chlid_attr = item.attr('data_child_attr');
                    $('#goodsbody tbody .' + chlid_attr).each(function(index, subItem, array){
                    	$(subItem).remove();
                    });
                }

                item.remove();

               
                _this.updateShopActivity(re.shop_active);		 //更新店铺信息
                // 更新区域
                _this.updateActivity(re.suitable_active);		//更新活动
                _this.updateCoupons(re.used_coupons);			//更新优惠券
                _this.updateTotalPrice(re.sub_total);			//更新金额
                _this.updateRecommendData(re.recommend_data);	//更新建议商品
			});
		},
		//批量删除
		removeAll: function() {
			var _this = this,
				items = $('#goodsbody tbody .item.checked'),
				item = null,
				params = [],
				childNotCheck = false;	//主商品的搭配商品未选择

			for (var i = items.length - 1; i >= 0; i--) {
				item = $(items[i]);
				params.push({
					id: item.attr('data_product_id'),
					shopId: item.attr('data_shop_attr')
				});

				//删除了主商品 搭配商品必须删除
				if(item.hasClass('hasChild')) {
					var chlid_attr = item.attr('data_child_attr');
					$('.' + chlid_attr).each(function(index, el) {
						if(!$(this).hasClass('checked')) {
							childNotCheck = true;
							params.push({
								id: $(this).attr('data_product_id'),
								shopId: $(this).attr('data_shop_attr')
							});
						}
					});
				}
			};

			if(childNotCheck) {
				alert('搭配商品必须删除');
			} else {
				CartManager.removeAll(params, function(re) {
					//购物车为空
					if (re.is_empty === 'true') {
	                    var _empty_html = '<div class="cart-empty"><img src="statics/b2c/src/images/cart/empty.jpg" /><p>您的购物车里还没有商品,<br />去看看&nbsp;<a href="" class="orange">萤石商城>></a></p></div>';
	                   
						$('#cart-items').empty().html(_empty_html);
						return;
	                } 

	                // 逐个删除
	                for (var j = params.length - 1; j >= 0; j--) {
	                	var el = $('[data_product_id='+params[j].id+'][data_shop_attr="'+params[j].shopId+'"]');

	                	if(!el) continue;	// el已经被删除
	                	//包含子商品
		                if(el.hasClass('hasChild')){
		                    var chlid_attr = item.attr('data_child_attr');
		                    $('#goodsbody tbody .' + chlid_attr).each(function(index, subItem, array){
		                    	$(subItem).remove();
		                    });
		                }

		                el.remove();

	                };

	                _this.updateShopActivity(re.shop_active);		 //更新店铺信息
	                _this.updateActivity(re.suitable_active);		 //更新活动
	                _this.updateCoupons(re.used_coupons);			 //更新优惠券
	                _this.updateTotalPrice(re.sub_total);			 //更新金额
	                _this.updateRecommendData(re.recommend_data);	 //更新建议商品

				});
			}



		},


		/*更新店铺活动及优惠信息*/
		updateShopActivity: function(data) {

			for (var i = data.length - 1; i >= 0; i--) {
				var item = data[i],
					shopId = item.shopId,
					shop = $('#' + shopId);

				//该商店已经没有商品
				if( $('[data_shop_attr='+shopId+']').length <=0 ) {
					shop.remove();
					continue;
				}

				//店铺本身没有任何活动
				if( shop.find('.shop-active').length <=0 ) {
					continue;
				}

				var saleCon = shop.find('.shop-sale'),
					el;
				saleCon.empty();


				//不够 去凑单
				if(item.notEnough) {
					el = '还不够？<a class="shop-sale-below" href="'+item.addr+'">去凑单</a>';
					
				} else {
					el = '优惠：<span class="orange">-￥'+item.sale+'</span>';
				}

				saleCon.append(el);
			};

		},
		/*更新活动*/
		updateActivity: function(data) {

			$('#cart-total #activity .name').empty();
			$('#cart-total #activity .account').empty();

			$.each(data, function(index, val) {
				 /* iterate through array or object */
				$('#cart-total #activity .name').append('<p>'+val.name+'</p>');
				$('#cart-total #activity .account').append('<p>-￥'+val.discount_amount+'</p>');
			});
			if(!data || data.length<=0) {
				$('#cart-total #activity').removeClass('show').addClass('hide');
			} else {
				$('#cart-total #activity').removeClass('hide').addClass('show');
			}
		},
		/*更新优惠券*/
		updateCoupons: function(data) {

			$('#cart-total #coupons .name').empty();
			$('#cart-total #coupons .account').empty();

			$.each(data, function(index, val) {
				 /* iterate through array or object */
				$('#cart-total #coupons .name').append('<p>'+val.name+'</p>');
				$('#cart-total #coupons .account').append('<p>-￥'+val.discount_amount+'</p>');
			});
			if(!data || data.length<=0) {
				$('#cart-total #coupons').removeClass('show').addClass('hide');
			} else {
				$('#cart-total #coupons').removeClass('hide').addClass('show');
			}
		},
		/*更新总金额*/
		updateTotalPrice: function(data) {

			//优惠总计
			$('#cart-total  #total-coupon-price .account').empty().html('-￥' + data.discount_amount_order);
			//总计
			$('#cart-total #total-price #total-money').empty().html(data.promotion_subtotal);
		},
		/*更新建议商品*/
		updateRecommendData: function(data) {

			var item;
			$('.recommendContainer .recommendGoods').empty();

			for(var i=0; item=data[i]; i++) {
	            $('.recommendContainer .recommendGoods').append( this.renderTmp(item,recommendListTmp) );
	        }

		},
        renderTmp: function (item, tmp) {
            return tmp.replace(/\{.+?\}/g, function($1) { return item[$1.slice(1, -1)]; });
        }
	};

	/*建议购买商品列表模板*/
    var recommendListTmp = [
        '<li class="recommendGood">',
            '<p class="img">',
                '<a href="javascript:void(0)">',
                    '<img src="{img_src}">',
                '</a>',
            '</p>',
            '<p class="title">',
                '<a href="javascript:void(0)">{name}</a>',
            '</p>',
            '<p class="price">￥{current_price}</p>',
            '<p class="addCartBtn itemsList" product="{goods_id}">',
                '<a href="javascript:void(0)" class="addItem" type="g" title="加入购物车" >加入购物车</a>',
            '</p>',
        '</li>'
    ].join('');


	var CartManager = {

        /*
        @function 接口 全选商品
        params = {
			checked: true   添加---true 或 删除---false
        } 
        callback 成功后的回调函数
        */
		checkAllShop: function(params, callback) {
			if(Emulate) {
				callback(emulateData.checkAllShop.data);
			} else {
				$.ajax({
                    url: '',
                    type: 'get',
                    data: params,
                    success: function(re) {
                        if(re.status) {
                            callback(re.data);
                        }
                    }
                });
			}
		},

        /*
        @function 接口 选择单个商品  添加 或 删除
        删除时--如有子商品 --一并删除
        添加时--如有子商品 --一并添加
        params = {
			id: '',			商品的product-id
			checked: true   添加---true 或 删除---false
        } 
        callback 成功后的回调函数
        */
		checkItem: function(params, callback) {
			if(Emulate) {
				callback(emulateData.checkItem.data);
			} else {
				$.ajax({
                    url: '',
                    type: 'get',
                    data: params,
                    success: function(re) {
                        if(re.status) {
                        	//删除成功
                            callback(re.data);
                        }
                        
                    }
                });
			}
		},
 		/*
        @function 接口 选择店铺  添加 或 删除
        params = {
			id: '',			店铺的id
			checked: true   添加---true 或 删除---false
        } 
        callback 成功后的回调函数
        */
		checkShop: function(params, callback) {
			if(Emulate) {
				callback(emulateData.checkShop.data);
			} else {
				$.ajax({
                    url: '',
                    type: 'get',
                    data: params,
                    success: function(re) {
                        if(re.status) {
                        	//删除成功
                            callback(re.data);
                        }
                        
                    }
                });
			}
		},
        /*
        @function 接口 删除单个商品
        params = {
			id: '',			删除商品的product-id
			shopId: ''   	删除商品当前店铺的ID
        }

        removeId 删除商品的product-id
        callback 删除成功后的回调函数
        */
		removeCart: function(params, callback) {
			if(Emulate) {
				callback(emulateData.removeCart.data);
			} else {
				$.ajax({
                    url: '',
                    type: 'get',
                    data: params,
                    success: function(re) {
                        if(re.status) {
                        	//删除成功
                            callback(re.data);
                        }
                        
                    }
                });
			}
		},

        /*
        @function 接口 批量删除商品
        params = [
			{
				id: '',			删除商品的product-id
				shopId: ''   	删除商品当前店铺的ID
	        },
	        {
				id: '',			删除商品的product-id
				shopId: ''   	删除商品当前店铺的ID
	        }

        ]

        removeId 删除商品的product-id
        callback 删除成功后的回调函数
        */
		removeAll: function(params, callback) {
			if(Emulate) {
				callback(emulateData.removeAll.data);
			} else {
				$.ajax({
                    url: '',
                    type: 'get',
                    data: params,
                    success: function(re) {
                        if(re.status) {
                        	//删除成功
                            callback(re.data);
                        }
                        
                    }
                });
			}
		}
	};


})(jQuery)