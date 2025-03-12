"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    show() {
      console.log("按钮！");
    },
    reflash() {
      location.reload();
    }
  }
};
if (!Array) {
  const _component_tmap_map = common_vendor.resolveComponent("tmap-map");
  _component_tmap_map();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.show && $options.show(...args)),
    b: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW"
    }),
    c: common_vendor.o((...args) => $options.reflash && $options.reflash(...args)),
    d: common_vendor.o((...args) => $options.reflash && $options.reflash(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-faf54e70"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/test/clicktest.vue"]]);
wx.createPage(MiniProgramPage);
