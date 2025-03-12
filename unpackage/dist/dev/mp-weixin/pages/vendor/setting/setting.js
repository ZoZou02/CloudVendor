"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      token: "",
      time: "",
      sex: ""
    };
  },
  onShow() {
    this.getUserInfo();
  },
  onLoad(options) {
  },
  onPullDownRefresh() {
    console.log("开启下拉刷新");
    setTimeout(function() {
      location.reload();
    }, 1e3);
  },
  methods: {
    toEdit() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/editProfile/editProfile"
      });
    },
    toAvatar() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/editAvatar/editAvatar"
      });
    },
    showType(tbIndex) {
      this.tabbarIndex = tbIndex;
      this.list = this.orderList[tbIndex];
    },
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
          this.token = token;
          if (this.userInfo.sex === "1") {
            this.sex = "男";
          } else if (this.userInfo.sex === "2") {
            this.sex = "女";
          } else {
            this.sex = "未知";
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.vendorPic,
    b: common_vendor.p({
      type: "right",
      color: "#cecece"
    }),
    c: common_vendor.o((...args) => $options.toAvatar && $options.toAvatar(...args)),
    d: common_vendor.t($data.userInfo.vendorId),
    e: common_vendor.p({
      type: "right",
      color: "#ffffff"
    }),
    f: common_vendor.t($data.userInfo.vendorName),
    g: common_vendor.p({
      type: "right",
      color: "#ffffff"
    }),
    h: common_vendor.t($data.sex),
    i: common_vendor.p({
      type: "right",
      color: "#ffffff"
    }),
    j: common_vendor.t($data.userInfo.address),
    k: common_vendor.p({
      type: "right",
      color: "#ffffff"
    }),
    l: common_vendor.p({
      type: "right",
      color: "#cecece"
    }),
    m: common_vendor.p({
      type: "right",
      color: "#cecece"
    }),
    n: common_vendor.p({
      type: "right",
      color: "#cecece"
    }),
    o: common_vendor.p({
      type: "right",
      color: "#cecece"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/setting/setting.vue"]]);
wx.createPage(MiniProgramPage);
