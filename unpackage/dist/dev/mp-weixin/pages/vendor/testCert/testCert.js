"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      frontUrl: "../../../static/IdCard/frontIdCard.png",
      backUrl: "../../../static/IdCard/backIdCard.png",
      title: "input",
      focus: false,
      name: "",
      IdNumber: ""
    };
  },
  onLoad() {
  },
  methods: {
    getIDCard() {
      var flag = this.verifyData();
      if (flag) {
        console.log("==");
        common_vendor.index.showLoading({
          mask: true,
          title: "识别中，请等待"
        });
      }
    },
    //校验输入的数据
    verifyData() {
      var flag = true;
      if (!this.name) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "姓名不能为空"
        });
        return false;
      }
      if (!this.IdNumber) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "身份证号不能为空"
        });
        return false;
      }
      var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
      var res = re15.test(this.IdNumber) || re18.test(this.IdNumber);
      if (res == false) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "身份证号填写有误"
        });
        return false;
      }
      if (!this.frontUrl) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "请上传身份证含照片一面"
        });
        return false;
      }
      return flag;
    },
    chooseFront() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.frontUrl = res.tempFilePaths[0];
        }
      });
    },
    chooseBack() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.backUrl = res.tempFilePaths[0];
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.name,
    b: common_vendor.o(($event) => $data.name = $event.detail.value),
    c: $data.IdNumber,
    d: common_vendor.o(($event) => $data.IdNumber = $event.detail.value),
    e: this.frontUrl,
    f: common_vendor.o(($event) => $options.chooseFront()),
    g: this.backUrl,
    h: common_vendor.o(($event) => $options.chooseBack()),
    i: common_vendor.o(($event) => $options.getIDCard())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/testCert/testCert.vue"]]);
wx.createPage(MiniProgramPage);
