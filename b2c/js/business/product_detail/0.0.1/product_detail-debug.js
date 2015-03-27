/*
 * Author: sgl
 * Date: 2015-03-05
 * Memo: 商品详情页面js代码
 */
define("business/product_detail/0.0.1/product_detail-debug", [ "common/ysDialog/0.0.1/ysDialog-debug" ], function(require) {
    var Dialog = require("common/ysDialog/0.0.1/ysDialog-debug"), tabBtn = $(".tab_inner_1 li").not(".cart"), tabCon = $(".item_con"), toCart = $("a.toCart"), hasSpec = $("#is_spec").val() == "1" || $("#is_spec").val() == "true" ? true : false, specAjaxUrl = "/product.php/default/getspec", toCartAjaxUrl = "/product.php/default/addcart", goodsId = toCart.attr("buy");
    tabBtn.click(function() {
        //点击tab切换
        var index = $(this).index();
        tabBtn.removeClass("active").eq(index).addClass("active");
        tabCon.addClass("hide").eq(index).removeClass("hide");
    });
    toCart.click(function(event) {
        //点击加入购物车按钮
        if (hasSpec) {
            //有规格的处理方法
            doAjax(specAjaxUrl, {
                goodsId: goodsId
            }, function(json) {
                //规格数据获取成功的处理方法
                if (json.status) {
                    var proInfo = json.data.spec_info, specBox_list = [];
                    $.each(proInfo, function(key, val) {
                        //处理规格html
                        specBox_list.push(createSpecList(val));
                    });
                    var specBoxConfig = {
                        pro_img: proInfo[0].spec_img,
                        pro_name: json.data.goods_name,
                        priceMin: json.data.price_low,
                        priceMax: json.data.price_height,
                        specList: specBox_list.join("")
                    };
                    Dialog.popup("选择规格", {
                        ok: "提交",
                        cancel: "取消",
                        width: "420",
                        html: createSpecBox(specBoxConfig)
                    }, function(res) {
                        // 点提交的处理方法
                        if (res == true) {
                            if ($(".specBtn.seled").length > 0) {
                                var specid = $(".specBtn.seled").attr("specid");
                                doAjax(toCartAjaxUrl, {
                                    goodsId: goodsId,
                                    specId: specid
                                }, function(json) {
                                    //ajax成功方法
                                    if (json.status) {
                                        $(".sea-ysdialog").parent().hide().prev().hide();
                                    }
                                    Dialog.hint({
                                        tipText: json.status ? "success" : json.msg,
                                        timeout: 2e3
                                    });
                                });
                            } else {
                                Dialog.hint({
                                    tipText: "请选择规格！",
                                    timeout: 2e3
                                });
                            }
                        }
                    }, function() {
                        // 初始化方法
                        $(".specBox").click(function(event) {
                            var event = event || window.event, target = $(event.target) || $(event.srcElement), picObj = $(".spec-pic img"), priceObj = $(".pro-price b"), specSubIpt = $("#specSubIpt"), initPic = specSubIpt.attr("data-picinit"), initPrice = specSubIpt.attr("data-priceinit");
                            if (target.hasClass("specBtn")) {
                                var price = target.attr("specprice"), picSrc = target.attr("specpic"), specid = target.attr("specid"), specvid = target.attr("specvid");
                                target[target.hasClass("seled") ? "removeClass" : "addClass"]("seled");
                                //更新是否选中
                                target.parent("li").siblings().find("a.specBtn").removeClass("seled");
                                //其他规格全部去除选中
                                if (target.hasClass("seled")) {
                                    //选中某规格
                                    picObj.attr("src", picSrc);
                                    priceObj.text("￥" + price);
                                    specSubIpt.attr({
                                        "data-price": price,
                                        "data-picsrc": picSrc,
                                        "data-specid": specid,
                                        "data-specvid": specvid
                                    });
                                } else {
                                    //取消选中某规格
                                    picObj.attr("src", initPic);
                                    priceObj.text(initPrice);
                                    specSubIpt.removeAttr("data-price data-picsrc data-specid data-specvid");
                                }
                            }
                        });
                    }, "standBy");
                } else {
                    Dialog.hint({
                        tipText: "获取规格失败，请重试！",
                        timeout: 2e3
                    });
                }
            });
        } else {
            //无规格的处理方法
            doAjax(toCartAjaxUrl, {
                goodsId: goodsId
            }, function(json) {
                //ajax成功方法
                Dialog.hint({
                    tipText: json.status ? "success" : json.msg,
                    timeout: 2e3
                });
            });
        }
    });
    function doAjax(url, data, sucFn) {
        $.ajax({
            type: "post",
            url: url,
            data: data,
            timeout: "15000",
            dataType: "json",
            success: sucFn,
            error: function(xhr, type) {
                Dialog.hint({
                    tipText: "出错了！",
                    timeout: 2e3
                });
            }
        });
    }
    function createSpecList(config) {
        //处理规格html
        var temp = [ "<li>", '<a class="specBtn" specpic="{spec_img}" specid="{spec_id}" specvid="{specvid}" specprice="{price}" href="javascript:;">', "{param}", '<i title="点击取消选择"> </i>', "</a>", "</li>" ].join("");
        var el = temp.replace(/(\{.+?\})/g, function($1) {
            return config[$1.slice(1, -1)];
        });
        //替换ajax变量
        return el;
    }
    function createSpecBox(config) {
        //处理规格选择框html
        var temp = [ '<div class="specBox">', '<div class="spec-pic fl">', '<img height="85" src="{pro_img}">', "</div>", '<div class="spec-con fl">', '<div class="pro-name">{proName}</div>', '<div class="pro-price">价格：<span class="spec-price-orange"><b>￥{priceMin}-￥{priceMax}</b></span></div>', '<div class="spec-list">', '<div class="spec-label">配置：</div>', '<div class="spec-values">', "<ul>{specList}</ul>", "</div>", "</div>", "</div>", '<input type="hidden" id="specSubIpt" data-picinit="{pro_img}" data-priceinit="￥{priceMin}-￥{priceMax}" />', "</div>" ].join("");
        var el = temp.replace(/(\{.+?\})/g, function($1) {
            return config[$1.slice(1, -1)];
        });
        //替换变量
        return el;
    }
});
