"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      boothPic: "../../../static/booth/booth.jpg",
      boothBackGround: "../../../static/booth/boothBG.jpg",
      boothInfo: {},
      token: "",
      hasBooth: false
    };
  },
  mounted() {
  },
  onShow() {
    this.getBoothInfo();
  },
  onLoad() {
  },
  methods: {
    formatTime(time) {
      return time ? time.substring(0, 5) : "";
    },
    getBoothInfo() {
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
        url: "http://localhost:8080/booth/showBooth",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          if (res.data.success) {
            console.log(res.data);
            this.boothInfo = res.data.data;
            if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
              this.boothPic = this.boothInfo.boothPic;
            }
            console.log("pic", this.boothPic);
            this.token = token;
            this.hasBooth = true;
          } else {
            console.log("该摊主尚未拥有摊位");
            this.hasBooth = false;
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    getQrCode() {
    },
    toEditBooth() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/editBooth/editBooth",
        fail(e) {
          console.log("错误", e);
        }
      });
    },
    toAddBooth() {
      common_vendor.index.navigateTo({
        url: "/pages/vendor/addBooth/addBooth",
        fail(e) {
          console.log("错误", e);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.hasBooth
  }, $data.hasBooth ? {
    b: $data.boothPic,
    c: common_vendor.t($data.boothInfo.boothId),
    d: common_vendor.t($data.boothInfo.boothName),
    e: common_vendor.t($data.boothInfo.type),
    f: common_vendor.t($data.boothInfo.description),
    g: common_vendor.t($options.formatTime($data.boothInfo.startTime)),
    h: common_vendor.t($options.formatTime($data.boothInfo.endTime)),
    i: common_vendor.o((...args) => $options.getQrCode && $options.getQrCode(...args)),
    j: common_vendor.o((...args) => $options.toEditBooth && $options.toEditBooth(...args))
  } : {
    k: $data.boothBackGround,
    l: common_vendor.o((...args) => $options.toAddBooth && $options.toAddBooth(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/booth/booth.vue"]]);
wx.createPage(MiniProgramPage);
