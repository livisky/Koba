/*
 * Author: gulisha(谷莉莎)
 * Date: 2014-09-25
 * Memo: 该文件处理用户下单后我的购物车页面
 */
define("business/cart/0.0.1/cart-debug", [], function(require) {
    /*
    * CartJs update :2009-9-8 11:33:20
    *
    * Author litie[aita]shopex.cn
    *
    */
    /* 购物车小图mouseenter效果 */
    function thumb_pic() {
        // 购物车为空
        if (!$("goodsbody")) return;
        var cart_product_img_viewer = new Element("div", {
            styles: {
                position: "absolute",
                zIndex: 500,
                opacity: 0,
                border: "1px #666 solid",
                background: "#fff"
            }
        }).inject(document.body), cpiv_show = function(img, event) {
            if (!img) return;
            cart_product_img_viewer.empty().adopt($(img).clone().removeProperties("width", "height").setStyle("border", "1px #fff solid")).fade(1);
            var size = window.getSize(), scroll = window.getScroll(), tip = {
                x: cart_product_img_viewer.offsetWidth,
                y: cart_product_img_viewer.offsetHeight
            }, props = {
                x: "left",
                y: "top"
            };
            for (var z in props) {
                var pos = event.page[z] + 10;
                if (pos + tip[z] - scroll[z] > size[z]) pos = event.page[z] - 10 - tip[z];
                cart_product_img_viewer.setStyle(props[z], pos);
            }
        };
        $$("#cart-index .cart-product-img").each(function(i) {
            new Asset.image(i.get("isrc"), {
                onload: function(img) {
                    if (!img) return;
                    //解决 我的购物车 商品列表图片变形的问题  Author : wangxingyun
                    var _img = img;
                    if (!_img) return;
                    _img.setStyle("cursor", "pointer").addEvents({
                        mouseenter: function(e) {
                            cpiv_show(_img, e);
                        },
                        mouseleave: function(e) {
                            cart_product_img_viewer.fade(0);
                        }
                    });
                    i.empty().adopt(new Element("a", {
                        href: i.get("ghref"),
                        target: "_blank",
                        styles: {
                            border: 0
                        }
                    }).adopt(_img));
                },
                onerror: function() {
                    i.empty();
                }
            });
        });
    }
    /* 
     *  页面加载时判断购物车数量临界值 2014.11.19 Author:gulisha
     */
    function checkNumPermission() {
        jQuery("#goodsbody").find("tbody tr").each(function() {
            var nowNum = jQuery(this).find(".Numinput input").val(), maxNum, minNum;
            // 搭配购买的搭配的商品
            if (jQuery(this).hasClass("adjunct_item")) {
                minNum = jQuery(this).attr("min_num");
                var basic_number = jQuery(this).attr("basic_number"), parentNum = jQuery("#goodsbody").find("tr[chlid_id= " + jQuery(this).attr("class").split(" ")[0] + "]").find("input[name^=modify_quantity]").val(), num_1 = basic_number * parentNum, num_2 = parseInt(jQuery(this).attr("number"));
                num_1 - num_2 >= 0 ? maxNum = num_1 : maxNum = num_2;
            } else {
                maxNum = parseInt(jQuery(this).attr("number")), minNum = 1;
            }
            if (maxNum == 1) {
                jQuery(this).find(".numadjust.decrease").addClass("crisis");
                jQuery(this).find(".numadjust.increase").addClass("crisis");
            } else {
                if (nowNum == minNum) {
                    jQuery(this).find(".numadjust.decrease").addClass("crisis");
                } else if (nowNum > minNum && nowNum < maxNum) {
                    jQuery(this).find(".numadjust.decrease").removeClass("crisis");
                    jQuery(this).find(".numadjust.increase").removeClass("crisis");
                } else if (nowNum == maxNum) {
                    jQuery(this).find(".numadjust.increase").addClass("crisis");
                }
            }
        });
    }
    window.addEvent("domready", function() {
        thumb_pic();
        checkNumPermission();
    });
    /* 购物车处理 */
    void function() {
        var cartTotalPanel = $("cartitems");
        Cart = {};
        Cart.utility = {
            keyCodeFix: [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 8, 9, 46, 37, 39 ],
            accAdd: function(arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (arg1 * m + arg2 * m) / m;
            },
            moneyFormat: {
                // evaluate form PHP Smarty
                rule: myrule,
                format: function(num) {
                    var rule = this.rule;
                    num = num.toFloat();
                    num = num.round(rule.decimals) + "";
                    var p = num.indexOf(".");
                    if (p < 0) {
                        p = num.length;
                        part = "";
                    } else {
                        part = num.substr(p + 1);
                    }
                    while (part.length < rule.decimals) {
                        part += "0";
                    }
                    var c = [];
                    while (p > 0) {
                        if (p > 2) {
                            c.unshift(num.substr(p -= 3, 3));
                        } else {
                            c.unshift(num.substr(0, p));
                            break;
                        }
                    }
                    return rule.sign + c.join(rule.thousands_sep) + rule.dec_point + part;
                }
            }
        };
        Object.append(Cart, {
            removeItem: function(handle) {
                var msg = "", tr = $(handle).getParent("tr");
                // 删除有搭配的商品
                if (tr.hasClass("havechild") && tr.hasClass("adjunctItem")) {
                    msg = "你确定要删除该搭配的所有商品吗？";
                } else {
                    msg = "你确定要删除该商品吗？";
                }
                Ex_Dialog.confirm(msg, function(e) {
                    if (!e) return;
                    var item = $(handle).getParent("tr");
                    var remoteURL = item.get("urlremove");
                    // 处理删除的购物车object数据
                    var _data = item.getElement("div.Numinput").toQueryString();
                    if (item.hasClass("havechild")) {
                        var chlid_id = item.get("chlid_id");
                        if (group = item.getParent("table").getElements("." + chlid_id)) group.each(function(ell) {
                            ell.getElements("input").set("disabled", true);
                        });
                    }
                    var _this = this;
                    this.updateTotal(remoteURL, {
                        data: _data + "&response_type=true",
                        onRequest: function() {
                            if (!Browser.ie6) {
                                item.getElements("td")[1].set("html", "正在删除...");
                                item.setStyles({
                                    background: "#FBE3E4",
                                    opacity: 1
                                });
                            }
                        },
                        onComplete: function(res) {
                            var _success_res = JSON.decode(res);
                            if (_success_res.is_empty === "true") {
                                var _empty_html = '<div class="division cart-empty" id="goodsbody"><div class="w400 ma clearfix"><img src=' + myres_url + ' class="flt m5"/>     <p class="pt10">您的购物车里还没有商品,您可以：<br />将收藏夹中的商品添加进来<br />或者去看看&nbsp;<a href="/product-mall.html" class="font-orange">萤石商城>></a></p></div></div>';
                                $("cart-index").set("html", _empty_html);
                            } else {
                                if (_success_res.error) {
                                    //Message.error(_success_res.error);//** 更新区域
                                    Ex_Dialog.alert(_success_res.error, "");
                                } else {
                                    //删除配件
                                    if (item.hasClass("havechild")) {
                                        var chlid_id = item.get("chlid_id");
                                        if (group = item.getParent("table").getElements("." + chlid_id)) group.each(function(ell) {
                                            ell.destroy();
                                        });
                                    }
                                    // 删除选择删除的商品
                                    item.destroy();
                                    // 删除商品时将订单赠品一同删掉 BUG 修复  2014.11.28  @guolisha
                                    var oTbody = jQuery("#goodsbody tbody"), aHavechildTr = oTbody.find("tr.havechild");
                                    if (aHavechildTr.length == 0) {
                                        var rule_id = $$(".order_rule_id"), order_id = $$("tr[order_rule_id]");
                                        // 订单赠品的 DOM
                                        if (!!order_id.length) {
                                            order_id.each(function(tr) {
                                                if (!rule_id.length) return tr.destroy();
                                                var _tr_destory = rule_id.some(function(el, i) {
                                                    if (tr.get("order_rule_id").split(",").contains(el.value)) return true;
                                                });
                                                if (!_tr_destory) tr.destroy();
                                            });
                                        }
                                    }
                                    // 更新区域
                                    _this.updateActivity(_success_res.suitable_active);
                                    _this.updateCoupons(_success_res.used_coupons);
                                    _this.updateTotalPrice(_success_res.sub_total);
                                    _this.updateRecommendData(_success_res.recommend_data);
                                    _this.updateWillGetPromotion(_success_res.unuse_rule);
                                }
                            }
                            if ($("goodsbody").getElement("tbody") && $("goodsbody").getElement("tbody").get("html").trim() == "") {
                                $("goodsbody").destroy();
                            }
                            // 更新购物车商品数量
                            var curNum = Cookie.read("S[CART_COUNT]") || 0;
                            _this.updateWidgetsCartNum(_success_res.number);
                            $$(".cart-number").set("text", curNum);
                            if ($$(".minicart-title .num")) $$(".minicart-title .num").set("text", curNum);
                            if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
                            if (curNum.toString() === "0") {
                                $$(".minicart_box").removeClass("has-pro");
                            } else {
                                $$(".minicart_box").addClass("has-pro");
                            }
                        }
                    });
                }.bind(this));
            },
            addItem: function(goods_id, product_id) {
                var addurl = myaddurl;
                addurl = addurl.replace(/(_goods_id)/g, goods_id);
                if (product_id != 0) {
                    addurl = addurl.replace(/(_product_id)/g, product_id);
                } else {
                    addurl = addurl.replace(/(-_product_id)/g, "");
                }
                var _this = this;
                _this.updateTotal(addurl, {
                    onComplete: function(res) {
                        if (JSON.validate(res)) {
                            var _success_res = JSON.decode(res);
                            Ex_Dialog.alert(_success_res.error, "");
                        } else {
                            $("cart-items-detail").set("html", res);
                        }
                        thumb_pic();
                        _this.updateOtherDatas();
                    }
                });
            },
            updateOtherDatas: function(handle) {
                var getDataUrl = mygetDataUrl;
                var _this = this;
                _this.updateTotal(getDataUrl, {
                    onComplete: function(res) {
                        var _success_res = JSON.decode(res);
                        _this.updateActivity(_success_res.suitable_active);
                        _this.updateCoupons(_success_res.used_coupons);
                        _this.updateTotalPrice(_success_res.sub_total);
                        _this.updateRecommendData(_success_res.recommend_data);
                        _this.updateWillGetPromotion(_success_res.unuse_rule);
                        // 更新购物车商品数量
                        _this.updateWidgetsCartNum(_success_res.number);
                        $$(".cart-number").set("text", Cookie.read("S[CART_COUNT]") || 0);
                        if ($$(".minicart-title .num")) $$(".minicart-title .num").set("text", Cookie.read("S[CART_COUNT]") || 0);
                        if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
                    }
                });
            },
            /*
             *  移除减少数量临界值 2014.11.19 Author:gulisha
             */
            removeDecreaseCrisis: function(numInput) {
                numInput.getParent(".Numinput").getElements(".numadjust.decrease").removeClass("crisis");
            },
            /*
             *  移除增加数量临界值 2014.11.19 Author:gulisha
             */
            removeIncreaseCrisis: function(numInput) {
                numInput.getParent(".Numinput").getElements(".numadjust.increase").removeClass("crisis");
            },
            /*
             *  添加减少数量临界值 2014.11.19 Author:gulisha
             */
            addDecreaseCrisis: function(numInput) {
                numInput.getParent(".Numinput").getElements(".numadjust.decrease").addClass("crisis");
            },
            /*
             *  添加增加数量临界值 2014.11.19 Author:gulisha
             */
            addIncreaseCrisis: function(numInput) {
                numInput.getParent(".Numinput").getElements(".numadjust.increase").addClass("crisis");
            },
            /*
             *  用户增减购物车物品数量时判断购物车数量临界值 2014.11.19 Author:gulisha
             */
            CheckNum: function(numInput, enterNum, max_num, min_num) {
                // 最大值为1
                if (max_num == 1) {
                    Cart.addDecreaseCrisis(numInput);
                    Cart.addIncreaseCrisis(numInput);
                } else if (max_num == 2) {
                    if (enterNum == 1) {
                        Cart.addDecreaseCrisis(numInput);
                        Cart.removeIncreaseCrisis(numInput);
                    } else if (enterNum == 2) {
                        Cart.removeDecreaseCrisis(numInput);
                        Cart.addIncreaseCrisis(numInput);
                    }
                } else {
                    if (enterNum == min_num) {
                        Cart.addDecreaseCrisis(numInput);
                    } else if (enterNum > min_num && enterNum < max_num) {
                        Cart.removeDecreaseCrisis(numInput);
                        Cart.removeIncreaseCrisis(numInput);
                    } else if (enterNum == max_num) {
                        Cart.addIncreaseCrisis(numInput);
                    }
                }
            },
            ItemNumUpdate: function(numInput, num, evt, abort) {
                // 购物流程优化  2014.12.09  @gulisha
                if (!numInput) return;
                num = num || numInput.value;
                var _float_store = numInput.getParent("tr").get("floatstore"), type = [ "toInt", "toFloat" ], forUpNum = numInput.value[type[_float_store]]();
                // 输入框数量
                if (evt && new Event(evt).target != numInput) {
                    forUpNum = (isNaN(forUpNum) ? 1 : forUpNum) + num;
                }
                if (forUpNum[type[_float_store]]() <= 0) {
                    forUpNum = 1;
                }
                numInput.value = forUpNum.limit(0, Number.MAX_VALUE);
                var good_id = numInput.getParent("tr").getAttribute("goods-id"), total_num = 0, p_num = 0;
                $$("tr[goods-id=" + good_id + "]").each(function(i) {
                    p_num = parseInt(i.getElementsByTagName("input")[0].value);
                    total_num += isNaN(p_num) ? 1 : p_num;
                });
                var _goods_number = numInput.getParent("tr").getAttribute("number")[type[_float_store]](), _group_number = numInput.getParent("tr").getAttribute("g_number");
                if (forUpNum > _goods_number) {
                    if (_group_number != null && _group_number != "no_num" && _group_number[type[_float_store]]() > 0 && _group_number[type[_float_store]]() < _goods_number) _goods_number = _group_number[type[_float_store]]();
                    numInput.value = _goods_number;
                    //Ex_Dialog.alert('数量错误！' + numInput.getParent('tr').getAttribute('g_name') + "(可购买数量为：" + _goods_number + ") ", '');
                    this.updateItem(evt, numInput, numInput.getParent("tr"), abort);
                    this.__forUpNum = forUpNum;
                    this.__goods_number = _goods_number;
                    return;
                }
                var _min_number = numInput.getParent("tr").getAttribute("min_num");
                if (_min_number != null && forUpNum < _min_number[type[_float_store]]()) {
                    numInput.value = _min_number;
                    //Ex_Dialog.alert('数量错误！<br/>该配件' + numInput.getParent('tr').getAttribute('g_name') + "(最小购买数量为：" + _min_number + ") ", '');
                    this.updateItem(evt, numInput, numInput.getParent("tr"), abort);
                    this.__forUpNum = forUpNum;
                    this.__goods_number = _goods_number;
                    return;
                }
                if (_group_number != null) {
                    if (_group_number == "no_num" || _group_number != 0 && total_num > _group_number[type[_float_store]]()) {
                        numInput.value = _group_number;
                        if (_group_number == "no_num") _group_number = 0;
                    }
                }
                if (numInput.getParent("tr").hasClass("adjunctItem")) {
                    var to_handle = handle_num = 0, number, adjunct_num = $$(".adjunct_item," + numInput.getParent("tr").getAttribute("goods-id")).length;
                    $$(".adjunct_item," + numInput.getParent("tr").getAttribute("goods-id")).each(function(e) {
                        number = e.getAttribute("basic_number")[type[_float_store]]();
                        e.setAttribute("number", number * numInput.value);
                        var adjunct_obj = e, inputDom = adjunct_obj.getElement("input"), inputNum = parseInt(inputDom.getValue()[0]), maxInputNum = adjunct_obj.getAttribute("number"), minNum = 1;
                        Cart.CheckNum(inputDom, inputNum, maxInputNum, minNum);
                        if (e.getElement("input[name^=modify_quantity]").value > number * numInput.value) {
                            e.getElement("input[name^=modify_quantity]").value = number * numInput.value;
                            to_handle++;
                            var input = e.getElement("input[name^=modify_quantity]");
                            var _query_string = input.getParent("tr").toQueryString();
                            e.store("request", new Request({
                                url: e.get("urlupdate"),
                                data: _query_string + "&response_type=true",
                                method: "post",
                                onSuccess: function(res) {
                                    handle_num++;
                                    var _success_res = JSON.decode(res);
                                    if (_success_res && _success_res.success) {
                                        this.updateActivity(_success_res.suitable_active);
                                        this.updateCoupons(_success_res.used_coupons);
                                        Cart.updateTotalPrice(_success_res.sub_total);
                                        Cart.updateWillGetPromotion(_success_res.unuse_rule);
                                        Cart.updateNum(input, _success_res.edit_ajax_data, _success_res.error_msg);
                                        Cart.updateWidgetsCartNum(_success_res.number);
                                    } else {
                                        Ex_Dialog.alert(_success_res.error, "");
                                    }
                                    if (handle_num != 0 && handle_num == to_handle) {
                                        Cart.updateItem(evt, numInput, numInput.getParent("tr"), abort);
                                    }
                                    if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
                                }.bind(Cart),
                                onFailure: function(xhr) {
                                    input.focus();
                                }.bind(Cart)
                            }).send());
                        }
                    });
                }
                if (!numInput.getParent("tr").hasClass("adjunctItem") || to_handle <= 0) {
                    this.updateItem(evt, numInput, numInput.getParent("tr"), abort);
                }
                this.__forUpNum = forUpNum;
                this.__goods_number = _goods_number;
            },
            updateItem: function(evt, input, item, abort) {
                if (abort) {
                    return;
                } else {
                    var min_num, // 最小购买数量
                    enterNum = input.value.toInt(), // 用户输入的数量
                    availableMaxNum;
                    // 最大购买数量
                    // 主商品
                    if (item.className.indexOf("adjunct_item") == -1) {
                        availableMaxNum = item.getAttribute("number").toInt();
                        min_num = 1;
                    } else if (item.className.indexOf("adjunct_item") >= 0) {
                        min_num = item.getAttribute("min_num");
                        var basic_number = item.getAttribute("basic_number").toInt(), // basic_number用于搭配的商品，用来标识购买一件主商品最多可以购买几件搭配的商品
                        parentNum = $("goodsbody").getElement("tr[chlid_id= " + item.className.split(" ")[0] + "]").getElement("input[name^=modify_quantity]").value.toInt(), num_1 = basic_number * parentNum, num_2 = item.getAttribute("number").toInt();
                        num_1 - num_2 >= 0 ? availableMaxNum = num_1 : availableMaxNum = num_2;
                    }
                }
                if (input.value == "NaN") {
                    input.value = 1;
                    return false;
                }
                var _query_string = input.getParent("tr").toQueryString();
                // 按钮可点击的时候向后台发送请求
                var targetDom = evt.target ? evt.target : evt.srcElement;
                if (!targetDom.hasClass("crisis") || !targetDom.hasClass("crisis")) {
                    item.store("request", new Request({
                        url: item.get("urlupdate"),
                        data: _query_string + "&response_type=true",
                        method: "post",
                        onSuccess: function(res) {
                            var _success_res = JSON.decode(res);
                            if (_success_res && _success_res.success) {
                                this.updateActivity(_success_res.suitable_active);
                                this.updateCoupons(_success_res.used_coupons);
                                this.updateTotalPrice(_success_res.sub_total);
                                this.updateWillGetPromotion(_success_res.unuse_rule);
                                this.updateNum(input, _success_res.edit_ajax_data, _success_res.error_msg);
                                this.updateWidgetsCartNum(_success_res.number);
                            } else {
                                Ex_Dialog.alert(_success_res.error, "");
                            }
                            if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
                        }.bind(this),
                        onFailure: function(xhr) {
                            input.focus();
                        }.bind(this)
                    }).send());
                }
                Cart.CheckNum(input, enterNum, availableMaxNum, min_num);
            },
            // 更新活动区域 2014.11.25 Author:gulisha
            updateActivity: function(suitable_active) {
                var actDom = jQuery(".activity");
                // 有活动信息
                if (suitable_active.length != 0 && suitable_active != false) {
                    actDom.show();
                    // 之前没有活动信息
                    if (jQuery(".activity #content").length == 0) {
                        var actContentDom = jQuery('<td class="left">活动：</td><td id="content"></td>');
                        actDom.append(actContentDom);
                    } else {
                        var actContentDom = jQuery(".activity #content");
                        actContentDom.empty();
                    }
                    var actContentDom = jQuery(".activity #content");
                    for (var i = 0; i < suitable_active.length; i++) {
                        var actNameDom = jQuery('<div class="center"></div>'), actDecPriceDom = jQuery('<div class="right"></div>');
                        actNameDom.html(suitable_active[i].name);
                        suitable_active[i].discount_amount == 0 ? actDecPriceDom.html("") : actDecPriceDom.html("-￥" + suitable_active[i].discount_amount);
                        actContentDom.append(actNameDom, actDecPriceDom);
                    }
                } else {
                    actDom.hide();
                }
            },
            // 更新优惠券区域 2014.11.25 Author:gulisha
            updateCoupons: function(used_coupons) {
                var couponsDom = jQuery(".coupon");
                // 没有优惠券
                if (used_coupons == false) {
                    couponsDom.hide();
                } else {
                    couponsDom.show();
                    // 之前没有选用的优惠券
                    if (jQuery(".coupon #content").length == 0) {
                        var couponsContentDom = jQuery('<td class="left">已选优惠券：</td><td id="content"></td>');
                        couponsDom.append(couponsContentDom);
                    } else {
                        var couponsContentDom = jQuery(".coupon #content");
                        couponsContentDom.empty();
                    }
                    var couponsContentDom = jQuery(".coupon #content");
                    for (var v in used_coupons) {
                        var used_coupon = used_coupons[v], couponName = used_coupon.name, couponDecPrice = used_coupon.discount_amount, couponNameDom = jQuery('<div class="center"></div>'), couponDecPriceDom = jQuery('<div class="right"></div>');
                        couponNameDom.html(couponName);
                        couponDecPriceDom.html("-￥" + couponDecPrice);
                        couponsContentDom.append(couponNameDom, couponDecPriceDom);
                    }
                }
            },
            // 更新价格区域 2014.11.25 Author:gulisha
            updateTotalPrice: function(subtotal) {
                var promotion_subtotal = subtotal.promotion_subtotal, // 最终合计金额
                discount_amount_order = subtotal.discount_amount_order, // 合计优惠金额
                totalFavDom = jQuery(".total-fav"), // 合计优惠金额DOM
                cart_promotion_subtotal = jQuery("#cart-promotion-subtotal"), // 最终合计金额
                totalPriceDom = jQuery(".total-price");
                // 最终合计金额DOM
                cart_promotion_subtotal.html(promotion_subtotal);
                // 订单包含优惠金额
                if (discount_amount_order != 0) {
                    totalFavDom.show();
                    // 之前没有订单优惠金额
                    if (jQuery("#cart-promotion_discount_price").length == 0) {
                        var cart_promotion_discount_price_Dom = jQuery('<td class="left">合计优惠：</td><td class="right" id="cart-promotion_discount_price"></td>');
                        totalFavDom.append(cart_promotion_discount_price_Dom);
                    } else {
                        var cart_promotion_discount_price = jQuery("#cart-promotion_discount_price");
                        cart_promotion_discount_price.empty();
                    }
                    var cart_promotion_discount_price = jQuery("#cart-promotion_discount_price");
                    cart_promotion_discount_price.html(discount_amount_order);
                } else {
                    totalFavDom.hide();
                }
            },
            updateWidgetsCartNum: function(cart_number) {
                if ($$(".cart-count")) {
                    $$(".cart-count").set("html", cart_number.cart_count ? cart_number.cart_count : 0);
                } else if ($$(".cart-number")) {
                    $$(".cart-number").set("html", cart_number.cart_number ? cart_number.cart_number : 0);
                }
            },
            updateWillGetPromotion: function(unuse_rule) {
                if (unuse_rule) {
                    var _cart_will_getsalespromotion = $("cart-will-get-sales-promotion");
                    var _unuse_rule_html = "";
                    var _tr = "";
                    unuse_rule.each(function(item, index) {
                        _tr += '<tr><td class="span-2">' + item.name + "</td>" + '<td class="span-6" style="text-align:left">' + item.desc + "</td>" + '<td class="span-6" style="text-align:left">' + item.solution + "</td></tr>";
                    });
                    var _html = ' <h4>赶快行动得促销优惠</h4><table width="100%" cellpadding="3" cellspacing="0">{_unuse_rule_html}</table>';
                    _html = _html.substitute({
                        _unuse_rule_html: _tr
                    });
                    if (!_cart_will_getsalespromotion) {
                        _cart_will_getsalespromotion = new Element("div", {
                            id: "cart-will-get-sales-promotion",
                            "class": "sales-promotion clearfix",
                            html: _html
                        });
                        _cart_will_getsalespromotion.inject($("cart-return-btn"), "after");
                    } else {
                        _cart_will_getsalespromotion.set("html", _html);
                    }
                } else {
                    var _cart_will_getsalespromotion = $("cart-will-get-sales-promotion");
                    if (_cart_will_getsalespromotion) _cart_will_getsalespromotion.destroy();
                }
            },
            updateRecommendData: function(recommend_data) {
                if (recommend_data) {
                    var _cart_recommend_data = $("cart-recommend—data");
                    var _recommend_data_html = "", _li = "", _goods_id;
                    recommend_data.each(function(item, index) {
                        _li += '<li class="recommendGood">';
                        _li += '        <p class="img"><a href=' + mylink1 + ' target="_blank"><img src="' + item.img_src + '"></a></p>';
                        _li += '        <p class="title"><a href=' + mylink2 + ' target="_blank">' + item.name + "</a></p>";
                        _li += '        <p class="price">￥' + item.price + "</p>";
                        _li += '        <p class="addCartBtn itemsList" product="' + item.goods_id + '">';
                        if (item.product_num > 1) {
                            _li += '        <a class="hasSpec repos" type="g" target="_dialog_minicart" title="加入购物车" rel="nofollow">加入购物车</a>';
                        } else {
                            _li += '        <a class="addItem" type="g" title="加入购物车" rel="nofollow" >加入购物车</a>';
                        }
                        _li += "        </p>";
                        _li += "</li>";
                        _li = _li.replace(/(index-_goods_id)/g, item.goods_id);
                    });
                    var _html = "";
                    _html += '<div class="recommendTitleCon">';
                    _html += '    <div class="recommendTitle">也许您还需要</div>';
                    _html += "</div>";
                    _html += '<div class="recommendContainer">';
                    _html += '    <ul class="recommendGoods">';
                    _html += "{_recommend_data_html}";
                    _html += "    </ul>";
                    _html += "</div>";
                    _html = _html.substitute({
                        _recommend_data_html: _li
                    });
                    if (!_cart_recommend_data) {
                        _cart_recommend_data = new Element("div", {
                            id: "cart-recommend—data",
                            "class": "sales-promotion clearfix",
                            html: _html
                        });
                        _cart_recommend_data.inject($("cart-return-btn"), "after");
                    } else {
                        _cart_recommend_data.set("html", _html);
                    }
                } else {
                    var _cart_recommend_data = $("cart-recommend—data");
                    if (_cart_recommend_data) _cart_recommend_data.destroy();
                }
                specdialog();
            },
            updatePromotion: function(promotion) {
                var _cart_realsalespromotion = $("cart-real-sales-promotion");
                if (!promotion || !promotion.order) {
                    if (_cart_realsalespromotion) _cart_realsalespromotion.destroy();
                } else {
                    var _odr_promotion = promotion.order;
                    var _li = "<h4>已享受的促销优惠</h4><ul>";
                    var _li_object = new Object();
                    Object.each(_odr_promotion, function(pitem, index) {
                        _li_object = {
                            rule_id: pitem.rule_id,
                            name: pitem.name,
                            solution: pitem.solution
                        };
                        _li += '<li class="clearfix p10"><span class="w300 fl"><input type="hidden" class="order_rule_id" value="{rule_id}" />{name}</span><span class="w400 fl ml10">{solution}</span></li>'.substitute(_li_object);
                    });
                    _li += "</ul>";
                    if (!_cart_realsalespromotion) {
                        _cart_realsalespromotion = new Element("div", {
                            id: "cart-real-sales-promotion",
                            "class": "sales-promotion",
                            html: _li
                        });
                        _cart_realsalespromotion.inject($("btn-cart-del-area"), "after");
                    } else {
                        _cart_realsalespromotion.set("html", _li);
                    }
                }
            },
            updateNum: function(input, data, error_msg) {
                data = JSON.decode(data);
                if (typeof error_msg != "undefined" && error_msg != "") {
                    //更新数量 按照数据库数量进行更新 author : ck
                    input.value = data.quantity;
                    Ex_Dialog.alert(error_msg, "");
                }
                var item = input.getParent("tr"), _node_error = input.getElements(".t");
                item.set("buy_store", input.value);
                [ "buy_price", "consume_score" ].each(function(str, i) {
                    var el = item.getElement("." + str);
                    if (el) {
                        el.set("text", data[str]);
                    }
                });
            },
            updateTotal: function(remoteURL, options) {
                options = options || {};
                new Request(Object.append({
                    method: "post",
                    url: remoteURL
                }, options)).send();
                if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
            },
            empty: function(remoteURL) {
                var _this = this;
                Ex_Dialog.confirm("确认清空购物车？", function(e) {
                    if (!e) return;
                    new Request({
                        url: remoteURL,
                        data: "response_type=true",
                        onComplete: function(res) {
                            var _success_res = JSON.decode(res);
                            if (_success_res && _success_res.error) {
                                Ex_Dialog.alert(_success_res.error, "");
                            } else {
                                var msgTxt = "清空购物车成功！";
                                if (_success_res.is_empty !== "true") {
                                    msgTxt = "清空购物车成功（保留赠品）！";
                                }
                                Message.success(msgTxt, function() {
                                    // 更新购物车商品数量
                                    _this.updateWidgetsCartNum(_success_res.number);
                                    $$(".cart-number").set("text", Cookie.read("S[CART_COUNT]") || 0);
                                    if ($$(".minicart-title .num")) $$(".minicart-title .num").set("text", Cookie.read("S[CART_COUNT]") || 0);
                                    if ($$(".cart-money-total")) $$(".cart-money-total").set("text", Cookie.read("S[CART_TOTAL_PRICE]") || 0);
                                    var curNum = Cookie.read("S[CART_COUNT]") || 0;
                                    if (curNum.toString() === "0") {
                                        $$(".minicart_box").removeClass("has-pro");
                                    } else {
                                        $$(".minicart_box").addClass("has-pro");
                                    }
                                    if (_success_res.is_empty !== "true") {
                                        location.reload();
                                    } else {
                                        var _empty_html = '<div class="division cart-empty" id="goodsbody"><div class="w400 ma clearfix"><img src="' + RES_URL + '/bundle/empty_pic.gif" class="flt m5"/>     <p class="pt10">您的购物车里还没有商品,您可以：<br />将收藏夹中的商品添加进来<br />或者去看看&nbsp;<a href="/product-mall.html" class="font-orange">萤石商城>></a></p></div></div>';
                                        $("cart-index").set("html", _empty_html);
                                    }
                                });
                            }
                        }
                    }).post();
                });
            }
        });
        if ($("cart-items")) {
            $("form-cart").getLast("div").addEvents({
                mousedown: function(e) {
                    var target = $(e.target);
                    if (target.hasClass("numadjust")) target.addClass("active"); else if (target.hasClass("order-btn") || target.getParent(".order-btn")) {
                        var ipt = $$("input[name^=modify_quantity[]:focus")[0];
                        ipt && ipt.removeEvents("change").addEvent("change", function(e) {
                            Cart.ItemNumUpdate(this, this.value, e, true);
                        });
                    }
                },
                mouseup: function(e) {
                    var target = $(e.target);
                    if (target.hasClass("numadjust")) target.removeClass("active");
                },
                keydown: function(e) {
                    var target = $(e.target);
                    if (target.hasClass("textcenter")) {
                        if (target.getParent("tr").getAttribute("floatstore").toInt() == 1) {
                            if (e.code == 110 || e.code == 190) e.code = 48;
                        }
                        if (!Cart.utility.keyCodeFix.contains(e.code)) {
                            e.stop();
                        }
                    }
                },
                click: function(e) {
                    var target = $(e.target);
                    if (target.hasClass("numadjust")) {
                        var num = target.hasClass("increase") ? 1 : -1;
                        var ipt = target.getParent(".numadjust-arr").getPrevious("input");
                        if (num == -1 && ipt.value < 1) return;
                        return Cart.ItemNumUpdate(ipt, num, e);
                    }
                    if (target.hasClass("delItem")) {
                        Cart.removeItem(target);
                    }
                    if (target.hasClass("addItem")) {
                        Cart.addItem(target.getParent("p").get("product"), 0);
                        var item = target.getParent("li");
                        if (!Browser.ie6) {
                            item.set("html", "正在加入购物车...");
                            item.setStyles({
                                background: "#E4F4E4",
                                opacity: 1
                            });
                        }
                    }
                }
            });
        }
        //2014.02.13 Author : lixc 关于用户组购买数量的限制(去结算按钮)
        $$(".btn_e.btn_e3.fr").removeEvents("click").addEvent("click", function(e) {
            var goods_number = 0, group_number = 0, num = 0, error_names = "", error_num = 0;
            $$("input[name^=modify_quantity]").each(function(e) {
                num = parseInt(e.value);
                goods_number = parseInt(e.getParent("tr").getAttribute("number"));
                group_number = e.getParent("tr").getAttribute("g_number");
                if (num > goods_number || group_number == "no_num" || group_number != 0 && num > parseInt(group_number)) {
                    e.value = goods_number > parseInt(group_number) ? parseInt(group_number) : goods_number;
                    error_names = e.getParent("tr").getAttribute("g_name");
                }
            });
            if (error_names != "") {
                if (parseInt(group_number) > 0) {
                    error_num = goods_number > group_number ? group_number : goods_number;
                } else {
                    error_num = goods_number;
                }
                //Message.error("" + error_names + "：累计购买数量超出每人限购数量<br/>（可购买数量为：" + error_num + "）");
                Ex_Dialog.alert("" + error_names + "：累计购买数量超出每人限购数量<br/>（可购买数量为：" + error_num + "）", "");
            }
            var ipt = $$(".numadjust-arr").getPrevious("input");
            Cart.updateItem(e, ipt, ipt.getParent("tr"), "abort");
        });
    }();
});
