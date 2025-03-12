"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      password: "",
      repeatpassword: ""
    };
  },
  methods: {
    //返回上级页面
    toBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    register() {
      var flag = this.verifyData();
      if (flag) {
        common_vendor.index.request({
          url: "http://localhost:8080/vendor/register",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            phone: this.phone,
            password: this.password
          },
          success: (res) => {
            common_vendor.index.showToast({
              icon: "none",
              title: res.data.data
            });
            if (res.data.data === "注册成功") {
              setTimeout(() => {
                common_vendor.index.navigateTo({
                  url: "/pages/vendor/login/login"
                });
              }, 1e3);
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/login/login"
      });
    },
    verifyData() {
      var flag = true;
      if (!this.phone) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号不能为空"
        });
        return false;
      }
      var re11 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      var res = re11.test(this.phone);
      if (res == false) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号有误"
        });
        return false;
      }
      if (!this.password) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "密码不能为空"
        });
        return false;
      }
      if (!this.repeatpassword) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "请再输入一次密码"
        });
        return false;
      }
      if (this.password != this.repeatpassword) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "两次密码不一致"
        });
        return false;
      }
      return flag;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.phone,
    b: common_vendor.o(($event) => $data.phone = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: $data.repeatpassword,
    f: common_vendor.o(($event) => $data.repeatpassword = $event.detail.value),
    g: common_vendor.o((...args) => $options.register && $options.register(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/register/register.vue"]]);
wx.createPage(MiniProgramPage);
