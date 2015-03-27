 /* Author: gulisha(谷莉莎)
  * Date: 2015-03-11
  * Memo: 该文件中代码是实现地址四级联动的功能
  *       在依赖该文件的 JS 文件中，调用 select_addr 对象的初始化函数 init 即可
  * eg  : select_addr.select_addr.init(一级地址, 二级地址, 三级地址, 四级地址);
  */

define(function(require, exports) {

    var region_Data = require('common/region/0.0.1/data');
        require('common/region/0.0.1/jquery.chained')($);

    var select_addr = {
        /**
         *  一次加载全部地址数据
         *  @param : 
         *      data : 后台生成的 data.js 文件中的地址数据
         */
        renderData : function(data) {

            var provinceItems = data.region_Data.citylist;

            for(var i in provinceItems) {
                
                var provinceItem = provinceItems[i];

                this.renderProviceDom(provinceItem);
            }
        },
        /**
         *  生成一级地址下拉选择框内容
         *  @param : 
         *      provinceItem : 一级地址
         */
        renderProviceDom : function(provinceItem) {

            var provinceValue = provinceItem.code;

            var provinceItemOption = '<option value="'+provinceValue+'">'+provinceItem.name+'</option>';

            select_addr.provinceDom.append(provinceItemOption);

            var cityItems = provinceItem.children;

            for(var i in cityItems) {

                var cityItem = cityItems[i];

                this.renderCityDom(cityItem, provinceValue);
            }
        },
        /**
         *  生成二级地址下拉选择框内容
         *  @param : 
         *      cityItem      : 二级地址
         *      provinceValue ：父级地址ID 
         */
        renderCityDom : function(cityItem, provinceValue) {

            var areaValue = cityItem.code;

            var cityItemOption = '<option value="'+areaValue+'" class="'+provinceValue+'">'+cityItem.name+'</option>';

            select_addr.cityDom.append(cityItemOption);

            var areaItems = cityItem.children;

            for(var i in areaItems) {

                var areaItem = areaItems[i];

                this.renderAreaDom(areaItem, areaValue);
            }
        },
        /**
         *  生成三级地址下拉选择框内容
         *  @param : 
         *      areaItem  : 三级地址
         *      areaValue ：父级地址ID 
         */
        renderAreaDom : function(areaItem, areaValue) {

            var townValue = areaItem.code;

            var areaItemOption = '<option value="'+townValue+'" class="'+areaValue+'">'+areaItem.name+'</option>';

            select_addr.areaDom.append(areaItemOption);

            var townItems = areaItem.children;

            for(var i in townItems) {

                var townItem = townItems[i];

                this.renderTownDom(townItem, townValue);
            }
        },
        /**
         *  生成四级地址下拉选择框内容
         *  @param : 
         *      townItem  : 四级地址
         *      townValue ：父级地址ID 
         */
        renderTownDom : function(townItem, townValue) {

            var townItemOption = '<option value="'+townValue+'" class="'+townValue+'">'+townItem.name+'</option>';

            select_addr.townDom.append(townItemOption);
        },
        /**
         *  关联各级地址，实现联动
         */
        chainData : function() {

            select_addr.townDom.chained(select_addr.areaDom); 
            select_addr.areaDom.chained(select_addr.cityDom);
            select_addr.cityDom.chained(select_addr.provinceDom);
        },
        /**
         *  初始化函数
         *  @param : 
         *      addr_1 : 一级地址 || 省
         *      addr_2 ：二级地址 || 市
         *      addr_3 ：三级地址 || 区/县
         *      addr_4 ：四级地址 || 镇/乡
         */
        init : function(addr_1, addr_2, addr_3, addr_4) {

            select_addr.townDom     = addr_4;
            select_addr.areaDom     = addr_3;
            select_addr.cityDom     = addr_2;
            select_addr.provinceDom = addr_1;

            this.renderData(region_Data);
            this.chainData();
        }
    }

    exports.select_addr = select_addr;

});