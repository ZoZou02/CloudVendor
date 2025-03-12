"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "Home",
  setup() {
    const center = common_vendor.ref({ lat: 30.290756, lng: 120.074387 });
    const zoom = common_vendor.ref(10);
    const doubleClickZoom = common_vendor.ref(true);
    const move = (latLng) => {
      center.value = latLng;
    };
    const zoomTo = (value) => {
      zoom.value = value;
    };
    const print = (e) => {
      console.log(e);
    };
    return {
      center,
      zoom,
      doubleClickZoom,
      control: {
        scale: {},
        zoom: {
          position: "bottomRight"
        }
      },
      events: {
        dblclick: print
      },
      move,
      zoomTo,
      toggleDoubleClickZoom: (value) => {
        doubleClickZoom.value = value;
      }
    };
  }
});
if (!Array) {
  const _component_tmap_map = common_vendor.resolveComponent("tmap-map");
  _component_tmap_map();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => _ctx.move({
      lat: 30.290756,
      lng: 120.074387
    })),
    b: common_vendor.o(($event) => _ctx.move({
      lat: 39.943436,
      lng: 116.455078
    })),
    c: common_vendor.o(($event) => _ctx.zoomTo(10)),
    d: common_vendor.o(($event) => _ctx.zoomTo(15)),
    e: common_vendor.t(_ctx.doubleClickZoom),
    f: common_vendor.o(($event) => _ctx.toggleDoubleClickZoom(!_ctx.doubleClickZoom)),
    g: common_vendor.p({
      mapKey: "TOZBZ-OU2CX-JJP4Z-7FCBV-CDDJ2-AHFQZ",
      events: _ctx.events,
      center: _ctx.center,
      zoom: _ctx.zoom,
      doubleClickZoom: _ctx.doubleClickZoom,
      control: _ctx.control
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8181d006"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/test/map.vue"]]);
wx.createPage(MiniProgramPage);
