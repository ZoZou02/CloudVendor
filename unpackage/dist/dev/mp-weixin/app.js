"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/vendor/index/index.js";
  "./pages/vendor/register/register.js";
  "./pages/vendor/login/login.js";
  "./pages/vendor/booth/booth.js";
  "./pages/vendor/vendor/vendor.js";
  "./pages/test/map.js";
  "./pages/vendor/certification/certification.js";
  "./pages/vendor/editProfile/editProfile.js";
  "./pages/vendor/setting/setting.js";
  "./pages/vendor/editAvatar/editAvatar.js";
  "./pages/vendor/testCert/testCert.js";
  "./pages/admin/area/area.js";
  "./pages/test/test.js";
  "./pages/vendor/map/map.js";
  "./pages/test/testName.js";
  "./pages/test/clicktest.js";
  "./pages/admin/console/console.js";
  "./pages/vendor/editBooth/editBooth.js";
  "./pages/vendor/addBooth/addBooth.js";
  "./pages/admin/street/street.js";
  "./pages/vendor/QrCode/QrCode.js";
}
const _sfc_main = common_vendor.defineComponent({
  name: "HomePage",
  setup() {
    const center = common_vendor.ref({ lat: 23.106154, lng: 113.281485 });
    const zoom = common_vendor.ref(16);
    const doubleClickZoom = common_vendor.ref(false);
    const print = (e) => {
      console.log(e);
    };
    return {
      events: {
        dblclick: print
      },
      center,
      zoom,
      doubleClickZoom,
      control: {
        scale: {},
        zoom: {
          position: "bottomRight"
        }
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
    a: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW",
      events: _ctx.events,
      center: _ctx.center,
      zoom: _ctx.zoom,
      doubleClickZoom: _ctx.doubleClickZoom,
      control: _ctx.control
    })
  };
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.install);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
