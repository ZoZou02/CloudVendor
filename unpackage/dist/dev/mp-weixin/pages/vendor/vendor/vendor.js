"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        id: null,
        vendorId: null,
        vendorName: "",
        idNumber: "",
        phone: "",
        address: "",
        registerTime: "",
        loginTime: "",
        sex: "",
        vendorPic: "../../../static/avatar/avatar.png",
        password: ""
      },
      token: ""
    };
  },
  onPullDownRefresh() {
    console.log("开启下拉刷新");
    setTimeout(function() {
      location.reload();
    }, 1e3);
  },
  onLoad() {
  },
  onShow() {
    this.getUserInfo();
    if (this.token) {
      common_vendor.index.request({
        url: "http://localhost:8080/vendor/checkTokenStatus",
        method: "GET",
        data: {},
        header: {
          "Authorization": this.token
        },
        success: (res) => {
          if (res.data.success == false) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({
              icon: "error",
              title: "登录已过期"
            });
            this.getUserInfo();
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    }
  },
  methods: {
    getUserInfo() {
      const token = common_vendor.index.getStorageSync("token");
      console.log("token：" + token);
      if (!token) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请先登录"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://localhost:8080/vendor/getVendorInfo",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          console.log(res.data);
          this.userInfo = res.data.data;
          if (this.userInfo.vendorPic == "" || this.userInfo.vendorPic == null) {
            this.userInfo.vendorPic = "../../../static/avatar/avatar.png";
          }
          this.token = token;
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    logout() {
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.removeStorageSync("token");
      this.toIndex();
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/login/login"
      });
    },
    toIndex() {
      common_vendor.index.reLaunch({
        url: "/pages/vendor/index/index"
      });
    },
    toCert() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/certification/certification"
      });
    },
    toSetting() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/setting/setting"
      });
    },
    toBooth() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/booth/booth"
      });
    },
    toProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/editProfile/editProfile"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.vendorPic,
    b: common_vendor.t($data.token ? $data.userInfo.vendorName : "点击登录"),
    c: common_vendor.t($data.userInfo.vendorId),
    d: common_vendor.t($data.userInfo.address),
    e: common_vendor.o((...args) => $options.toBooth && $options.toBooth(...args)),
    f: common_vendor.o((...args) => $options.toCert && $options.toCert(...args)),
    g: common_vendor.o((...args) => $options.toSetting && $options.toSetting(...args)),
    h: common_vendor.o((...args) => $options.toProfile && $options.toProfile(...args)),
    i: $data.token
  }, $data.token ? {
    j: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {}, {
    k: !$data.token
  }, !$data.token ? {
    l: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-654d5911"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/vendor/vendor.vue"]]);
wx.createPage(MiniProgramPage);
