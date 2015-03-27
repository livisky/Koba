/* Author: gulisha(谷莉莎)
  * Date: 2015-03-10
  * Memo: 该文件中代码功能是新版萤石商城 我的订单-收货地址 模块地址增、删、改功能的实现
  *       页面位置：萤石商城 我的订单 收货地址
  *       调用该js文件的页面视图文件为：\apps\user\views\member\receiver.php
  *       访问地址：/member/receiver
  */
define("business/member/0.0.1/member-debug", [ "common/region/0.0.1/region-debug" ], function(require) {
    var select_addr = window.select_addr = require("common/region/0.0.1/region-debug");
    var test_form = window.test_form = require("common/test/0.0.1/test-debug");
    var Dialog = require("common/ysDialog/0.0.1/ysDialog-debug");
    /**
     * @namespace
     *
     * 用于新版萤石商城 我的订单-收货地址 模块地址增、删、改功能的实现
     */
    var member_receiver = {
        addrDivBoxDom: $("#addr_div_box"),
        // 收货地址按钮Dom
        addAddrDom: $(".delivery-addr-title .add-addr a"),
        // 新增收货地址模块Dom
        addAddrBtn: $("#add"),
        // 新增收货地址按钮
        noDeliveryAddr: $(".no-delivery-addr"),
        // 暂无收货地址Dom
        provinceDom: $("#province"),
        // 添加地址一级地址
        cityDom: $("#city"),
        // 添加地址二级地址
        areaDom: $("#area"),
        // 添加地址三级地址
        townDom: $("#town"),
        // 添加地址四级地址
        unsetBtn: $("#unset"),
        // 取消添加按钮
        saveBtn: $("#save"),
        // 保存按钮
        updateBtn: $(".updateBtn"),
        // 修改地址按钮
        saveModiBtn: $("#saveModi"),
        // 确定修改地址按钮
        unsetModiBtn: $("#unsetModi"),
        // 取消修改地址按钮
        deleteBtn: $(".deleteBtn"),
        // 删除地址按钮
        removeDefaultBtn: $(".removeDefaultBtn"),
        // 取消默认按钮
        setDefaultBtn: $(".setDefaultBtn"),
        // 设为默认按钮
        deleteUrl: $("#delete").val(),
        // 删除地址所请求的URL
        updateUrl: $("#update").val(),
        // 确定修改地址所请求的URL
        modiAddrUrl: $("#getAddr").val(),
        // 点击修改收货地址所请求的URL
        saveAddrUrl: $("#saveAddr").val(),
        // 保存地址所请求的URL
        setDefaultUrl: $("#setDefault").val(),
        // 设为默认地址所请求的URL
        removeDefaultUrl: $("#removeDefault").val(),
        // 取消默认地址所请求的URL
        deliveryAddrList: $(".delivery-addr-list"),
        // 收货地址列表
        ALLOWED_ADD_ADDR: true,
        // 默认地址列表地址数不超过5个
        /**
         *  判断用户地址列表地址数
         */
        checkTotalAddrNum: function() {
            if (this.deliveryAddrList.find("ul").length >= 6) {
                $("#noticebox").show();
                this.ALLOWED_ADD_ADDR = false;
            }
        },
        /**
         *  事件绑定
         */
        bindEvent: function() {
            var me = this;
            // 添加收货地址
            me.addAddrDom.on("click", function() {
                if (me.ALLOWED_ADD_ADDR) {
                    me.noDeliveryAddr.hide();
                    me.addrDivBoxDom.show();
                    $(this).hide();
                } else {
                    return;
                }
            });
            me.addAddrBtn.on("click", function() {
                me.addrDivBoxDom.show();
                me.noDeliveryAddr.hide();
            });
            // 取消添加收货地址
            me.unsetBtn.on("click", function() {
                me.addrDivBoxDom.hide();
                me.addAddrDom.show();
            });
            // 取消设置某个地址为默认地址
            me.removeDefaultBtn.on("click", function() {
                var removeDefaultItem = $(this).parents("ul.addr-item-content").find("input").val(), csrf = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    url: me.removeDefaultUrl,
                    data: {
                        _csrf: csrf,
                        addrId: removeDefaultItem
                    },
                    type: "post",
                    success: function(data) {
                        // 取消设置成功
                        if (data.status === true) {
                            alert(data.msg);
                            location.reload();
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(data) {}
                });
            });
            // 设置某个地址为默认地址
            me.setDefaultBtn.on("click", function() {
                var setDefaultItem = $(this).parents("ul.addr-item-content").find("input").val(), csrf = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    url: me.setDefaultUrl,
                    data: {
                        _csrf: csrf,
                        addrId: setDefaultItem
                    },
                    type: "post",
                    success: function(data) {
                        // 设置成功
                        if (data.status === true) {
                            alert(data.msg);
                            location.reload();
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(data) {}
                });
            });
            // 修改收货地址列表的某个收货地址
            me.updateBtn.on("click", function() {
                var modiAddrVal = $(this).parents("ul.addr-item-content").find("input").val(), csrf = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    url: me.modiAddrUrl,
                    data: {
                        _csrf: csrf,
                        addrId: modiAddrVal
                    },
                    type: "post",
                    success: function(data) {
                        me.renderPop(data);
                    },
                    error: function(data) {}
                });
            });
            // 删除收货地址列表的某个收货地址
            me.deleteBtn.on("click", function() {
                var delItem = $(this).parents("ul.addr-item-content").find("input").val(), csrf = $('meta[name="csrf-token"]').attr("content");
                Dialog.confirm("确定删除？", "提示", function(res) {
                    if (res == true) {
                        $.ajax({
                            url: me.deleteUrl,
                            data: {
                                _csrf: csrf,
                                addrId: delItem
                            },
                            type: "post",
                            success: function(data) {
                                // 删除成功
                                if (data.status === true) {
                                    location.reload();
                                } else {
                                    Dialog.alert({
                                        tipText: data.msg,
                                        titleText: "提示",
                                        timeout: 3e3
                                    });
                                }
                            },
                            error: function(data) {}
                        });
                    }
                });
            });
            var nameDom = $("#name"), // 姓名Dom
            addrDom = $("#addr"), // 地址Dom
            mobileDom = $("#mobile"), // 手机Dom
            region = $("#checkout-select-area .region select");
            // 收货地址下拉选择Dom
            nameDom.on("blur", function() {
                var name = $("#name").val(), nameErrorDom = $("#name").parent("td").find(".error.caution");
                test_form.test_form.notNull(name, nameErrorDom);
            });
            addrDom.on("blur", function() {
                var addr = $("#addr").val(), addrErrorDom = $("#addr").parent("td").find(".error.caution");
                test_form.test_form.notNull(addr, addrErrorDom);
            });
            mobileDom.on("blur", function() {
                var mobile = $("#mobile").val(), mobileErrorDom = $("#mobile").parent("td").find(".error.caution");
                test_form.test_form.mobileTest(mobile, mobileErrorDom);
            });
            // 下拉选择收货地址
            region.each(function() {
                $(this).on("click", function() {
                    var selectErrorDom = $("#checkout-select-area .error.caution");
                    test_form.test_form.changeTest($(this), selectErrorDom);
                });
            });
            // 保存新添加的收货地址
            me.saveBtn.on("click", function() {
                var checkData = me.checkData(), provinceCode = parseInt($("#province").find("option:selected").attr("value")) || "", cityCode = parseInt($("#city").find("option:selected").attr("value")) || "", areaCode = parseInt($("#area").find("option:selected").attr("value")) || "", townCode = parseInt($("#town").find("option:selected").attr("value")) || "", name = $("#name").val(), addr = $("#addr").val(), mobile = $("#mobile").val(), csrf = $('meta[name="csrf-token"]').attr("content");
                if (checkData) {
                    $.ajax({
                        url: me.saveAddrUrl,
                        data: {
                            contacts: name,
                            province: provinceCode,
                            city: cityCode,
                            district: areaCode,
                            town: townCode,
                            street: addr,
                            mobile: mobile,
                            _csrf: csrf
                        },
                        type: "post",
                        success: function(data) {
                            // 保存成功
                            if (data.status === true) {
                                alert(data.msg);
                                location.reload();
                            } else {
                                alert(data.msg);
                            }
                        },
                        error: function(data) {}
                    });
                }
            });
        },
        /**
         *  验证表单
         *  @return :
         *      true  : 验证通过
         *      false : 验证失败
         */
        checkData: function() {
            var name = $("#name").val(), provinceDom = $("#province"), cityDom = $("#city"), areaDom = $("#area"), townDom = $("#town"), addr = $("#addr").val(), mobile = $("#mobile").val(), nameErrorDom = $("#name").parent("td").find(".error.caution"), addrErrorDom = $("#addr").parent("td").find(".error.caution"), mobileErrorDom = $("#mobile").parent("td").find(".error.caution"), selectErrorDom = $("#checkout-select-area .error.caution");
            var testName = test_form.test_form.notNull(name, nameErrorDom), testProvinceDom = test_form.test_form.areaTest(provinceDom, selectErrorDom), testCityDom = test_form.test_form.areaTest(cityDom, selectErrorDom), testaAreaDom = test_form.test_form.areaTest(areaDom, selectErrorDom), testTownDom = test_form.test_form.areaTest(townDom, selectErrorDom), testAddr = test_form.test_form.notNull(addr, addrErrorDom), testMobile = test_form.test_form.mobileTest(mobile, mobileErrorDom);
            if (testName && testProvinceDom && testCityDom && testaAreaDom && testTownDom && testAddr && testMobile) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *  渲染修改地址弹出框
         */
        renderPop: function(data) {
            var me = this, id = data.data.address_id, // 地址ID
            name = data.data.contacts, // 姓名
            mobile = data.data.mobile, // 手机
            provinceCode = data.data.province, cityCode = data.data.city, areaCode = data.data.district, townCode = data.data.town, street = data.data.street, is_default = data.data.is_default;
            // 是否是默认地址  0：不是
            if (is_default === 0) {
                no = 'checked="checked"';
                yes = "";
            } else {
                yes = 'checked="checked"';
                no = "";
            }
            var modiAddrDom = [ '<table id="modifyAddr" width="100%" border="0" cellspacing="0" cellpadding="0" class="liststyle data">', "<tbody>", "<tr>", "<th>默认收货地址：</th>", '<td id="wetherDefault">', '<input type="radio" name="default" id="dom_el_9601b40-1" value="0"' + no + ">", '<label for="dom_el_9601b40-1">否</label></br>', '<input type="radio" name="default" id="dom_el_9601b40-2" value="1"' + yes + ">", '<label for="dom_el_9601b40-2">是</label>', "</td>", "</tr>", "<tr>", '<th><em class="red">*</em>姓名：</th>', "<td>", '<input autocomplete="off" class="x-input inputstyle" name="modiName" type="text" vtype="required" value="' + name + '" id="modiName">', "</td>", "</tr>", "<tr>", '<th><em class="red">*</em>手机：</th>', "<td>", '<input autocomplete="off" class="x-input inputstyle" name="modiMobile" vtype="mobile" value="18767136060" value="' + mobile + '" id="modiMobile" type="text">', "</td>", "</tr>", "<tr>", '<th><em class="red">*</em>地区：</th>', "<td>", '<span id="checkout-select-area">', '<span class="region" vtype="area">', '<select id="modifyProvince" class="inputstyle" data-level-index="0" name="modifyProvince">', '<option value="">请选择</option>', "</select>", '<select id="modifyCity" class="inputstyle" data-level-index="1" name="modifyCity">', '<option value="">请选择</option>', "</select>", '<select id="modifyArea" class="inputstyle" data-level-index="2" name="modifyArea">', '<option value="">请选择</option>', "</select>", '<select id="modifyTown" class="inputstyle" data-level-index="3" name="modifyTown">', '<option value="">请选择</option>', "</select>", "</span>", "</span>", "</td>", "</tr>", "<tr>", '<th><em class="red">*</em>地址：</th>', "<td>", '<textarea id="modiAddr" class="inputstyle" type="textarea" name="modiAddr" cols="30" vtype="required" rows="3">' + street + "</textarea>", "</td>", "</tr>", "</tbody>", "</table>" ].join("");
            Dialog.popup("修改收货地址", {
                ok: "提交",
                cancel: "取消",
                html: modiAddrDom
            }, function(res) {
                if (res == true) {
                    me.sureModiAddr(id);
                }
            });
            var modifyProvinceDom = $("#modifyProvince"), // 修改地址一级地址
            modifyCityDom = $("#modifyCity"), // 修改地址二级地址
            modifyAreaDom = $("#modifyArea"), // 修改地址三级地址
            modifyTownDom = $("#modifyTown");
            // 修改地址四级地址
            select_addr.select_addr.init(modifyProvinceDom, modifyCityDom, modifyAreaDom, modifyTownDom);
        },
        /**
         *  确定修改地址
         */
        sureModiAddr: function(id) {
            var name = $("#modiName").val(), wetherDefault = parseInt($("#wetherDefault").find("input:checked").attr("value")), provinceCode = parseInt($("#modifyProvince").find("option:selected").attr("value")) || "", cityCode = parseInt($("#modifyCity").find("option:selected").attr("value")) || "", areaCode = parseInt($("#modifyArea").find("option:selected").attr("value")) || "", townCode = parseInt($("#modifyTown").find("option:selected").attr("value")) || "", addr = $("#modiAddr").val(), mobile = $("#modiMobile").val(), csrf = $('meta[name="csrf-token"]').attr("content");
            $.ajax({
                url: this.updateUrl,
                data: {
                    contacts: name,
                    province: provinceCode,
                    city: cityCode,
                    district: areaCode,
                    town: townCode,
                    street: addr,
                    mobile: mobile,
                    _csrf: csrf,
                    is_default: wetherDefault,
                    address_id: id
                },
                type: "post",
                success: function(data) {
                    // 修改成功
                    if (data.status === true) {
                        alert(data.msg);
                        location.reload();
                    } else {
                        alert(data.msg);
                    }
                },
                error: function(data) {}
            });
        },
        /**
         *  初始化函数
         */
        init: function() {
            this.checkTotalAddrNum();
            this.bindEvent();
        }
    };
    member_receiver.init();
    select_addr.select_addr.init(member_receiver.provinceDom, member_receiver.cityDom, member_receiver.areaDom, member_receiver.townDom);
});
