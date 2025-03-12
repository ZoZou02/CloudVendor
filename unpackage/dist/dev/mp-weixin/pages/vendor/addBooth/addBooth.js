"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      boothSamplePic: "../../../static/booth/booth.jpg",
      boothInfo: {
        id: "",
        boothId: "",
        boothName: "",
        boothPic: "",
        description: "",
        startTime: "",
        endTime: "",
        type: ""
      },
      token: "",
      typeArray: ["食品类", "饰品类", "日用品类", "纺织服装类", "花卉水果类", "电子产品类"],
      typeIndex: 0
    };
  },
  onLoad() {
    this.token = common_vendor.index.getStorageSync("token");
  },
  methods: {
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.boothSamplePic = res.tempFilePaths[0];
          console.log(this.boothSamplePic);
        }
      });
    },
    saveBooth() {
      if (this.verifyData()) {
        console.log("摊位信息", this.boothInfo);
        common_vendor.index.request({
          url: "http://localhost:8080/booth/addBooth",
          method: "GET",
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            id: this.boothInfo.id,
            boothId: this.boothInfo.boothId,
            boothName: this.boothInfo.boothName,
            boothPic: this.boothInfo.boothPic,
            description: this.boothInfo.description,
            startTime: this.boothInfo.startTime,
            endTime: this.boothInfo.endTime,
            type: this.boothInfo.type
          },
          header: {
            "Authorization": this.token
          },
          success: () => {
            this.uploadImage();
            common_vendor.index.navigateBack();
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    },
    verifyData() {
      if (!this.boothInfo.boothName) {
        common_vendor.index.showToast({
          icon: "error",
          title: "名称未填写!"
        });
        console.log("名称不能为空");
        return false;
      }
      if (!this.boothInfo.description) {
        common_vendor.index.showToast({
          icon: "error",
          title: "描述不能为空!"
        });
        console.log("描述不能为空");
        return false;
      }
      if (this.boothInfo.startTime >= this.boothInfo.endTime) {
        console.log("营业开始时间必须早于营业结束时间");
        common_vendor.index.showToast({
          icon: "error",
          title: "营业开始时间必须早于营业结束时间"
        });
        return false;
      }
      return true;
    },
    bindTypeChange(e) {
      console.log("e", e);
      this.typeIndex = e.detail.value;
      this.boothInfo.type = this.typeArray[this.typeIndex];
    },
    bindStartTimeChange(e) {
      this.boothInfo.startTime = e.detail.value;
    },
    bindEndTimeChange(e) {
      this.boothInfo.endTime = e.detail.value;
    },
    uploadImage() {
      common_vendor.index.uploadFile({
        url: "http://localhost:8080/booth/uploadBoothPic",
        // 上传接口地址
        filePath: this.boothSamplePic,
        header: {
          "Authorization": this.token
        },
        name: "boothPic",
        success: (res) => {
          console.log("上传成功:", res);
        },
        fail: (err) => {
          console.log("上传失败:", err);
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
    a: $data.boothSamplePic,
    b: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    c: $data.boothInfo.boothName,
    d: common_vendor.o(($event) => $data.boothInfo.boothName = $event.detail.value),
    e: common_vendor.t($data.typeArray[$data.typeIndex]),
    f: common_vendor.p({
      type: "right"
    }),
    g: common_vendor.o((...args) => $options.bindTypeChange && $options.bindTypeChange(...args)),
    h: $data.typeIndex,
    i: $data.typeArray,
    j: $data.boothInfo.description,
    k: common_vendor.o(($event) => $data.boothInfo.description = $event.detail.value),
    l: common_vendor.t($data.boothInfo.startTime),
    m: common_vendor.p({
      type: "right"
    }),
    n: common_vendor.o((...args) => $options.bindStartTimeChange && $options.bindStartTimeChange(...args)),
    o: $data.boothInfo.startTime,
    p: common_vendor.t($data.boothInfo.endTime),
    q: common_vendor.p({
      type: "right"
    }),
    r: common_vendor.o((...args) => $options.bindEndTimeChange && $options.bindEndTimeChange(...args)),
    s: $data.boothInfo.endTime,
    t: common_vendor.o((...args) => $options.saveBooth && $options.saveBooth(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/addBooth/addBooth.vue"]]);
wx.createPage(MiniProgramPage);
