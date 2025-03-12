"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      vendorPic: "../../../static/avatar/avatar.png",
      userInfo: {},
      array: [
        {
          value: "0",
          name: "未知"
        },
        {
          value: "1",
          name: "男"
        },
        {
          value: "2",
          name: "女"
        }
      ],
      sexIndex: 0,
      token: "",
      time: "",
      sex: ""
    };
  },
  onLoad() {
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
          this.token = token;
          if (this.userInfo.sex === "1") {
            this.sex = "男";
          } else if (this.userInfo.sex === "2") {
            this.sex = "女";
          } else {
            this.sex = "未知";
          }
          this.sexIndex = parseInt(this.userInfo.sex);
          console.log("user", this.userInfo);
          if (this.userInfo.vendorPic != null && this.userInfo.vendorPic != "") {
            this.vendorPic = this.userInfo.vendorPic;
          }
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
          this.vendorPic = res.tempFilePaths[0];
          console.log(this.vendorPic);
        }
      });
    },
    save() {
      var flag = this.verifyData();
      if (flag) {
        this.uploadImage();
        common_vendor.index.request({
          url: "http://localhost:8080/vendor/editVendorInfo",
          method: "GET",
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            vendorId: this.userInfo.vendorId,
            vendorName: this.userInfo.vendorName,
            phone: this.userInfo.phone,
            address: this.userInfo.address,
            sex: this.sexIndex
            // vendorPic: this.userInfo.vendorPic
          },
          header: {
            "Authorization": this.token
          },
          success: () => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    },
    bindPickerChange: function(e) {
      console.log("picker发送选择改变，携带值为", e.detail.value);
      this.sexIndex = e.detail.value;
    },
    sexChange(e) {
      console.log("性别", e);
      this.sexIndex = parseInt(e.detail.value);
    },
    uploadImage() {
      common_vendor.index.uploadFile({
        url: "http://localhost:8080/vendor/upload",
        // 上传接口地址
        filePath: this.vendorPic,
        header: {
          "Authorization": this.token
        },
        name: "avatar",
        success: (res) => {
          console.log("上传成功:", res);
          common_vendor.index.navigateBack({
            delta: 1
          });
        },
        fail: (err) => {
          console.log("上传失败:", err);
        }
      });
    },
    verifyData() {
      var flag = true;
      if (!this.userInfo.phone) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号不能为空"
        });
        return false;
      }
      var re11 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      var res = re11.test(this.userInfo.phone);
      if (res == false) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "手机号有误"
        });
        return false;
      }
      if (!this.userInfo.address) {
        flag = false;
        common_vendor.index.showToast({
          icon: "none",
          title: "地址不能为空"
        });
        return false;
      }
      return flag;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.vendorPic,
    b: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    c: common_vendor.t($data.userInfo.vendorId),
    d: common_vendor.t($data.userInfo.vendorName),
    e: common_vendor.f($data.array, (item, index, i0) => {
      return {
        a: item.value,
        b: index === $data.sexIndex,
        c: common_vendor.t(item.name),
        d: item.value
      };
    }),
    f: common_vendor.o((...args) => $options.sexChange && $options.sexChange(...args)),
    g: $data.userInfo.phone,
    h: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    i: $data.userInfo.address,
    j: common_vendor.o(($event) => $data.userInfo.address = $event.detail.value),
    k: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/editProfile/editProfile.vue"]]);
wx.createPage(MiniProgramPage);
