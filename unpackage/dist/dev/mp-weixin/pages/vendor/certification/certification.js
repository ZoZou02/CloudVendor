"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      frontUrl: "../../../static/IdCard/frontIdCard.png",
      backUrl: "../../../static/IdCard/backIdCard.png",
      title: "input",
      idNumber: "",
      vendorName: "",
      token: "",
      isCert: false,
      uploadFront: false,
      uploadBack: false
    };
  },
  onLoad() {
    this.getCertification();
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
        common_vendor.index.request({
          url: "http://localhost:8080/vendor/vendorCertification",
          method: "GET",
          data: {
            vendorName: this.vendorName,
            idNumber: this.idNumber
          },
          header: {
            "Authorization": this.token
          },
          success: (res) => {
            common_vendor.index.showToast({
              icon: "success",
              title: "实名认证成功！"
            });
            setTimeout(function() {
              common_vendor.index.navigateBack();
            }, 1e3);
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    },
    reCert() {
      this.vendorName = "";
      this.idNumber = "";
      this.isCert = false;
      this.uploadBack = false;
      this.uploadFront = false;
      console.log("vendorname", this.vendorName);
      console.log("idNumber", this.idNumber);
      console.log("isCert", this.isCert);
    },
    //获取用户的实名信息（姓名和身份证号）
    getCertification() {
      this.token = common_vendor.index.getStorageSync("token");
      common_vendor.index.request({
        url: "http://localhost:8080/vendor/getVendorInfo",
        method: "GET",
        data: {},
        header: {
          "Authorization": this.token
        },
        success: (res) => {
          this.vendorName = res.data.data.vendorName;
          this.idNumber = res.data.data.idNumber;
          if (this.vendorName === "未实名认证") {
            this.isCert = false;
            this.vendorName = "";
          } else {
            this.isCert = true;
          }
          console.log("idnumber", this.idNumber);
          console.log("vendorName", this.vendorName);
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    //校验输入的数据
    verifyData() {
      var flag = true;
      if (!this.vendorName) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "姓名不能为空"
        });
        return false;
      }
      if (!this.idNumber) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "身份证号不能为空"
        });
        return false;
      }
      var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
      var res = re15.test(this.idNumber) || re18.test(this.idNumber);
      if (res == false) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "身份证号填写有误"
        });
        return false;
      }
      if (!this.uploadFront) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "请上传身份证含照片一面"
        });
        return false;
      }
      if (!this.uploadBack) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "请上传身份证含国徽一面"
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
          this.uploadFront = true;
        }
      });
    },
    chooseBack() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.backUrl = res.tempFilePaths[0];
          this.uploadBack = true;
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isCert
  }, !$data.isCert ? {
    b: $data.vendorName,
    c: common_vendor.o(($event) => $data.vendorName = $event.detail.value),
    d: $data.idNumber,
    e: common_vendor.o(($event) => $data.idNumber = $event.detail.value),
    f: this.frontUrl,
    g: common_vendor.o(($event) => $options.chooseFront()),
    h: this.backUrl,
    i: common_vendor.o(($event) => $options.chooseBack()),
    j: common_vendor.o(($event) => $options.getIDCard())
  } : {
    k: $data.vendorName,
    l: common_vendor.o(($event) => $data.vendorName = $event.detail.value),
    m: $data.idNumber,
    n: common_vendor.o(($event) => $data.idNumber = $event.detail.value),
    o: common_vendor.o((...args) => $options.reCert && $options.reCert(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/certification/certification.vue"]]);
wx.createPage(MiniProgramPage);
