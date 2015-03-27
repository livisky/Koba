/* Author: gulisha(谷莉莎)
  * Date: 2015-03-13
  * Memo: 该文件中代码是实现基础表单验证
  */
define("common/test/0.0.1/test-debug", [], function(require, exports) {
    var test_form = {
        /**
         *  非空验证
         *  @param : 
         *      value    : 所需要验证的值
         *      errorDom : 错误提示DOM
         *  @return :
         *      true  : 值为非空
         *      false : 值为空
         */
        notNull: function(value, errorDom) {
            //debugger
            if (value === "") {
                if (errorDom) {
                    $(errorDom).show();
                }
                return false;
            } else {
                if (errorDom) {
                    $(errorDom).hide();
                }
                return true;
            }
        },
        /**
         *  手机号码验证
         *  @param : 
         *      value    : 所需要验证手机号码的值
         *      errorDom : 错误提示DOM
         *  @return :
         *      true  : 手机号码有效
         *      false : 手机号码无效
         */
        mobileTest: function(value, errorDom) {
            var notNull = this.notNull(value, errorDom), reg = /^1[3458][0-9]{9}|1(47|70)[0-9]{8}$/;
            if (notNull) {
                if (!reg.test(value)) {
                    $(errorDom).html("请输入有效的手机号码");
                    $(errorDom).show();
                    return false;
                } else {
                    $(errorDom).hide();
                    return true;
                }
            } else {
                return false;
            }
        },
        /**
         *  下拉框切换
         *  @param : 
         *      areaDom  : 地区某一级下拉框Dom
         *      errorDom : 错误提示DOM
         *  @return :
         *      true  : 地区某一级为非空
         *      false : 地区某一级为空
         */
        changeTest: function(areaDom, errorDom) {
            var areaValue = areaDom.find("option:selected").attr("value");
            this.notNull(areaValue, errorDom);
        },
        /**
         *  地区验证
         *  @param : 
         *      areaDom  : 地区某一级下拉框Dom
         *      errorDom : 错误提示DOM
         *  @return :
         *      true  : 地区某一级为非空
         *      false : 地区某一级为空
         */
        areaTest: function(areaDom, errorDom) {
            if (!areaDom.hasClass("disabled")) {
                var areaValue = areaDom.find("option:selected").attr("value"), notNull = this.notNull(areaValue, errorDom);
                if (notNull) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    };
    exports.test_form = test_form;
});
