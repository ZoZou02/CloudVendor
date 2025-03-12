"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      boothPic: "../../../static/booth/booth.jpg",
      boothInfo: {},
      boothState: {},
      boothList: {},
      token: "",
      startTime: "",
      endTime: ""
    };
  },
  onPullDownRefresh() {
    console.log("开启下拉刷新");
    setTimeout(function() {
      window.location.reload();
    }, 1e3);
  },
  onShow() {
  },
  onLoad() {
    this.getBoothInfo();
  },
  methods: {
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
          console.log("摊位信息", res.data);
          this.boothInfo = res.data.data;
          this.token = token;
          this.getBoothState();
          this.getBoothList();
          if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
            this.boothPic = this.boothInfo.boothPic;
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    getBoothState() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getBoothState",
        method: "GET",
        data: {},
        header: {
          "Authorization": this.token
        },
        success: (res) => {
          this.boothState = res.data.data;
          console.log("摊位状态", res.data);
        }
      });
    },
    getBoothList() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getBoothList",
        method: "GET",
        data: {},
        header: {
          "Authorization": this.token
        },
        success: (res) => {
          const list = res.data.data;
          this.boothList = list.filter((item) => item.id !== this.boothInfo.id);
          console.log("摊位列表", this.boothList);
          console.log("摊位列表", res.data.data);
        }
      });
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/page/Vendor/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.boothInfo.boothName),
    b: $data.boothState.boothState === "营业中"
  }, $data.boothState.boothState === "营业中" ? {} : {}, {
    c: common_vendor.t($data.boothInfo.boothId),
    d: common_vendor.t($data.boothInfo.startTime),
    e: common_vendor.t($data.boothInfo.endTime),
    f: common_vendor.f($data.boothList, (booth, k0, i0) => {
      return {
        a: common_vendor.t(booth.boothName),
        b: common_vendor.t(booth.boothId),
        c: common_vendor.t(booth.startTime),
        d: common_vendor.t(booth.endTime)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/index/index.vue"]]);
wx.createPage(MiniProgramPage);
