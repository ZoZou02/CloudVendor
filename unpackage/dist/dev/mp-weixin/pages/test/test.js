"use strict";
const common_vendor = require("../../common/vendor.js");
const paths = [
  { lat: 40.041054, lng: 116.272305 },
  { lat: 40.039419, lng: 116.272721 },
  { lat: 40.039764, lng: 116.274824 },
  { lat: 40.041374, lng: 116.274491 }
];
const geometriesData = [
  {
    id: "label",
    // 点图形数据的标志信息
    styleId: "label",
    // 样式id
    position: { lat: 40.041054, lng: 116.272305 },
    // 标注点位置
    content: "腾讯北京总部",
    // 标注文本
    properties: {
      // 标注点的属性数据
      title: "label"
    }
  }
];
const _sfc_main = common_vendor.defineComponent({
  name: "multi-label",
  setup() {
    const styles = common_vendor.shallowRef({
      label: {
        color: "#3777FF",
        // 颜色属性
        size: 20,
        // 文字大小属性
        offset: { x: 0, y: 0 },
        // 文字偏移属性单位为像素
        angle: 0,
        // 文字旋转属性
        alignment: "center",
        // 文字水平对齐属性
        verticalAlignment: "middle"
        // 文字垂直对齐属性
      }
    });
    const geometries = common_vendor.shallowRef(geometriesData);
    let index = 1;
    function setColor(color) {
      styles.value.label.color = color;
      styles.value = {
        ...styles.value
      };
    }
    function onAdd() {
      if (index > 3)
        return;
      geometries.value = [
        ...geometries.value,
        {
          id: String(Date.now()),
          styleId: "label",
          // 样式id
          position: paths[index],
          // 标注点位置
          content: `自定义文本${index}`,
          // 标注文本
          properties: {
            title: "label"
          }
        }
      ];
      index += 1;
    }
    return {
      id: "label-layer",
      styles,
      geometries,
      setColor,
      onAdd,
      print() {
        console.log("222");
      }
    };
  }
});
if (!Array) {
  const _component_tmap_multi_label = common_vendor.resolveComponent("tmap-multi-label");
  const _component_tmap_map = common_vendor.resolveComponent("tmap-map");
  (_component_tmap_multi_label + _component_tmap_map)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.id,
    b: common_vendor.o(_ctx.print),
    c: common_vendor.o(_ctx.print),
    d: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      geometries: _ctx.geometries
    }),
    e: common_vendor.o(($event) => _ctx.setColor("#00FF00")),
    f: common_vendor.o(($event) => _ctx.setColor("#00FFFF")),
    g: common_vendor.o((...args) => _ctx.onAdd && _ctx.onAdd(...args)),
    h: common_vendor.sr("map", "727d09f0-0"),
    i: common_vendor.p({
      mapKey: "TOZBZ-OU2CX-JJP4Z-7FCBV-CDDJ2-AHFQZ"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-727d09f0"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/test/test.vue"]]);
wx.createPage(MiniProgramPage);
