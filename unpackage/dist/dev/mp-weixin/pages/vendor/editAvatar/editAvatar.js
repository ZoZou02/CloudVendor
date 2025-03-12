"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      imageUrl: "",
      path: "",
      token: ""
    };
  },
  onLoad() {
  },
  onShow() {
    this.getUserInfo();
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
          this.imageUrl = this.userInfo.vendorPic;
          this.token = token;
          console.log(this.imageUrl);
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
          console.log(this.imageUrl);
        }
      });
    },
    uploadImage() {
      common_vendor.index.uploadFile({
        url: "http://localhost:8080/vendor/upload",
        // 上传接口地址
        filePath: this.imageUrl,
        header: {
          "Authorization": this.token
        },
        name: "avatar",
        success: (res) => {
          console.log("上传成功:", res);
          common_vendor.index.navigateBack();
        },
        fail: (err) => {
          console.log("上传失败:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imageUrl,
    b: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    c: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/editAvatar/editAvatar.vue"]]);
wx.createPage(MiniProgramPage);
