"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      user: {
        phone: "",
        password: ""
      }
    };
  },
  onLoad() {
  },
  methods: {
    login() {
      var flag = this.verifyData();
      if (flag) {
        common_vendor.index.request({
          url: "http://localhost:8080/vendor/login",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            phone: this.user.phone,
            password: this.user.password
          },
          success: (res) => {
            console.log(res.data);
            if (res.data.data.code === 200) {
              this.getToken();
              common_vendor.index.showToast({
                icon: "none",
                title: "登录成功！"
              });
            } else {
              common_vendor.index.showToast({
                icon: "error",
                title: res.data.data
              });
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    },
    getToken() {
      common_vendor.index.request({
        url: "http://localhost:8080/getToken",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          id: this.user.phone
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.code === 200) {
            common_vendor.index.setStorageSync("token", res.data.data);
            this.toIndex();
          } else {
            common_vendor.index.showToast({
              icon: "error",
              title: "获取token失败"
            });
          }
        },
        fail() {
        },
        complete() {
        }
      });
    },
    toRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/register/register"
      });
    },
    toBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    toIndex() {
      common_vendor.index.reLaunch({
        url: "/pages/vendor/index/index"
      });
    },
    verifyData() {
      var flag = true;
      if (!this.user.phone) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号不能为空"
        });
        return false;
      }
      var re11 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      var res = re11.test(this.user.phone);
      if (res == false) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号有误"
        });
        return false;
      }
      if (!this.user.password) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "密码不能为空"
        });
        return false;
      }
      return flag;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.user.phone,
    b: common_vendor.o(($event) => $data.user.phone = $event.detail.value),
    c: $data.user.password,
    d: common_vendor.o(($event) => $data.user.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.login && $options.login(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/login/login.vue"]]);
wx.createPage(MiniProgramPage);
