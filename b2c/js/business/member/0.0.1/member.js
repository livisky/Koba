define("business/member/0.0.1/member",["common/region/0.0.1/region"],function(a){var b=window.select_addr=a("common/region/0.0.1/region"),c=window.test_form=a("common/test/0.0.1/test"),d=a("common/ysDialog/0.0.1/ysDialog"),e={addrDivBoxDom:$("#addr_div_box"),addAddrDom:$(".delivery-addr-title .add-addr a"),addAddrBtn:$("#add"),noDeliveryAddr:$(".no-delivery-addr"),provinceDom:$("#province"),cityDom:$("#city"),areaDom:$("#area"),townDom:$("#town"),unsetBtn:$("#unset"),saveBtn:$("#save"),updateBtn:$(".updateBtn"),saveModiBtn:$("#saveModi"),unsetModiBtn:$("#unsetModi"),deleteBtn:$(".deleteBtn"),removeDefaultBtn:$(".removeDefaultBtn"),setDefaultBtn:$(".setDefaultBtn"),deleteUrl:$("#delete").val(),updateUrl:$("#update").val(),modiAddrUrl:$("#getAddr").val(),saveAddrUrl:$("#saveAddr").val(),setDefaultUrl:$("#setDefault").val(),removeDefaultUrl:$("#removeDefault").val(),deliveryAddrList:$(".delivery-addr-list"),ALLOWED_ADD_ADDR:!0,checkTotalAddrNum:function(){this.deliveryAddrList.find("ul").length>=6&&($("#noticebox").show(),this.ALLOWED_ADD_ADDR=!1)},bindEvent:function(){var a=this;a.addAddrDom.on("click",function(){a.ALLOWED_ADD_ADDR&&(a.noDeliveryAddr.hide(),a.addrDivBoxDom.show(),$(this).hide())}),a.addAddrBtn.on("click",function(){a.addrDivBoxDom.show(),a.noDeliveryAddr.hide()}),a.unsetBtn.on("click",function(){a.addrDivBoxDom.hide(),a.addAddrDom.show()}),a.removeDefaultBtn.on("click",function(){var b=$(this).parents("ul.addr-item-content").find("input").val(),c=$('meta[name="csrf-token"]').attr("content");$.ajax({url:a.removeDefaultUrl,data:{_csrf:c,addrId:b},type:"post",success:function(a){a.status===!0?(alert(a.msg),location.reload()):alert(a.msg)},error:function(){}})}),a.setDefaultBtn.on("click",function(){var b=$(this).parents("ul.addr-item-content").find("input").val(),c=$('meta[name="csrf-token"]').attr("content");$.ajax({url:a.setDefaultUrl,data:{_csrf:c,addrId:b},type:"post",success:function(a){a.status===!0?(alert(a.msg),location.reload()):alert(a.msg)},error:function(){}})}),a.updateBtn.on("click",function(){var b=$(this).parents("ul.addr-item-content").find("input").val(),c=$('meta[name="csrf-token"]').attr("content");$.ajax({url:a.modiAddrUrl,data:{_csrf:c,addrId:b},type:"post",success:function(b){a.renderPop(b)},error:function(){}})}),a.deleteBtn.on("click",function(){var b=$(this).parents("ul.addr-item-content").find("input").val(),c=$('meta[name="csrf-token"]').attr("content");d.confirm("确定删除？","提示",function(e){1==e&&$.ajax({url:a.deleteUrl,data:{_csrf:c,addrId:b},type:"post",success:function(a){a.status===!0?location.reload():d.alert({tipText:a.msg,titleText:"提示",timeout:3e3})},error:function(){}})})});var b=$("#name"),e=$("#addr"),f=$("#mobile"),g=$("#checkout-select-area .region select");b.on("blur",function(){var a=$("#name").val(),b=$("#name").parent("td").find(".error.caution");c.test_form.notNull(a,b)}),e.on("blur",function(){var a=$("#addr").val(),b=$("#addr").parent("td").find(".error.caution");c.test_form.notNull(a,b)}),f.on("blur",function(){var a=$("#mobile").val(),b=$("#mobile").parent("td").find(".error.caution");c.test_form.mobileTest(a,b)}),g.each(function(){$(this).on("click",function(){var a=$("#checkout-select-area .error.caution");c.test_form.changeTest($(this),a)})}),a.saveBtn.on("click",function(){var b=a.checkData(),c=parseInt($("#province").find("option:selected").attr("value"))||"",d=parseInt($("#city").find("option:selected").attr("value"))||"",e=parseInt($("#area").find("option:selected").attr("value"))||"",f=parseInt($("#town").find("option:selected").attr("value"))||"",g=$("#name").val(),h=$("#addr").val(),i=$("#mobile").val(),j=$('meta[name="csrf-token"]').attr("content");b&&$.ajax({url:a.saveAddrUrl,data:{contacts:g,province:c,city:d,district:e,town:f,street:h,mobile:i,_csrf:j},type:"post",success:function(a){a.status===!0?(alert(a.msg),location.reload()):alert(a.msg)},error:function(){}})})},checkData:function(){var a=$("#name").val(),b=$("#province"),d=$("#city"),e=$("#area"),f=$("#town"),g=$("#addr").val(),h=$("#mobile").val(),i=$("#name").parent("td").find(".error.caution"),j=$("#addr").parent("td").find(".error.caution"),k=$("#mobile").parent("td").find(".error.caution"),l=$("#checkout-select-area .error.caution"),m=c.test_form.notNull(a,i),n=c.test_form.areaTest(b,l),o=c.test_form.areaTest(d,l),p=c.test_form.areaTest(e,l),q=c.test_form.areaTest(f,l),r=c.test_form.notNull(g,j),s=c.test_form.mobileTest(h,k);return m&&n&&o&&p&&q&&r&&s?!0:!1},renderPop:function(a){var c=this,e=a.data.address_id,f=a.data.contacts,g=a.data.mobile,h=(a.data.province,a.data.city,a.data.district,a.data.town,a.data.street),i=a.data.is_default;0===i?(no='checked="checked"',yes=""):(yes='checked="checked"',no="");var j=['<table id="modifyAddr" width="100%" border="0" cellspacing="0" cellpadding="0" class="liststyle data">',"<tbody>","<tr>","<th>默认收货地址：</th>",'<td id="wetherDefault">','<input type="radio" name="default" id="dom_el_9601b40-1" value="0"'+no+">",'<label for="dom_el_9601b40-1">否</label></br>','<input type="radio" name="default" id="dom_el_9601b40-2" value="1"'+yes+">",'<label for="dom_el_9601b40-2">是</label>',"</td>","</tr>","<tr>",'<th><em class="red">*</em>姓名：</th>',"<td>",'<input autocomplete="off" class="x-input inputstyle" name="modiName" type="text" vtype="required" value="'+f+'" id="modiName">',"</td>","</tr>","<tr>",'<th><em class="red">*</em>手机：</th>',"<td>",'<input autocomplete="off" class="x-input inputstyle" name="modiMobile" vtype="mobile" value="18767136060" value="'+g+'" id="modiMobile" type="text">',"</td>","</tr>","<tr>",'<th><em class="red">*</em>地区：</th>',"<td>",'<span id="checkout-select-area">','<span class="region" vtype="area">','<select id="modifyProvince" class="inputstyle" data-level-index="0" name="modifyProvince">','<option value="">请选择</option>',"</select>",'<select id="modifyCity" class="inputstyle" data-level-index="1" name="modifyCity">','<option value="">请选择</option>',"</select>",'<select id="modifyArea" class="inputstyle" data-level-index="2" name="modifyArea">','<option value="">请选择</option>',"</select>",'<select id="modifyTown" class="inputstyle" data-level-index="3" name="modifyTown">','<option value="">请选择</option>',"</select>","</span>","</span>","</td>","</tr>","<tr>",'<th><em class="red">*</em>地址：</th>',"<td>",'<textarea id="modiAddr" class="inputstyle" type="textarea" name="modiAddr" cols="30" vtype="required" rows="3">'+h+"</textarea>","</td>","</tr>","</tbody>","</table>"].join("");d.popup("修改收货地址",{ok:"提交",cancel:"取消",html:j},function(a){1==a&&c.sureModiAddr(e)});var k=$("#modifyProvince"),l=$("#modifyCity"),m=$("#modifyArea"),n=$("#modifyTown");b.select_addr.init(k,l,m,n)},sureModiAddr:function(a){var b=$("#modiName").val(),c=parseInt($("#wetherDefault").find("input:checked").attr("value")),d=parseInt($("#modifyProvince").find("option:selected").attr("value"))||"",e=parseInt($("#modifyCity").find("option:selected").attr("value"))||"",f=parseInt($("#modifyArea").find("option:selected").attr("value"))||"",g=parseInt($("#modifyTown").find("option:selected").attr("value"))||"",h=$("#modiAddr").val(),i=$("#modiMobile").val(),j=$('meta[name="csrf-token"]').attr("content");$.ajax({url:this.updateUrl,data:{contacts:b,province:d,city:e,district:f,town:g,street:h,mobile:i,_csrf:j,is_default:c,address_id:a},type:"post",success:function(a){a.status===!0?(alert(a.msg),location.reload()):alert(a.msg)},error:function(){}})},init:function(){this.checkTotalAddrNum(),this.bindEvent()}};e.init(),b.select_addr.init(e.provinceDom,e.cityDom,e.areaDom,e.townDom)});