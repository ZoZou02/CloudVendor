"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      clickedElement: null,
      // 存储点击的元素的属性数据
      clickedElementAttributes: {}
      // 存储点击的元素的其他属性
    };
  },
  methods: {
    handleClick(event) {
      const clickedElement = event.target;
      const tagName = clickedElement.tagName;
      const className = clickedElement.className;
      const id = clickedElement.id;
      const otherAttributes = {};
      for (const attr of clickedElement.attributes) {
        if (attr.nodeName !== "class" && attr.nodeName !== "id") {
          otherAttributes[attr.nodeName] = attr.nodeValue;
        }
      }
      this.clickedElement = {
        tagName,
        className,
        id
      };
      this.clickedElementAttributes = otherAttributes;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.clickedElement
  }, $data.clickedElement ? {
    b: common_vendor.t($data.clickedElement.tagName),
    c: common_vendor.t($data.clickedElement.className),
    d: common_vendor.t($data.clickedElement.id),
    e: common_vendor.t($data.clickedElementAttributes)
  } : {}, {
    f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/test/testName.vue"]]);
wx.createPage(MiniProgramPage);
