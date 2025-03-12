"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "polygon-editor",
  methods: {},
  data() {
    return {};
  },
  onload() {
  },
  oncreated() {
  },
  setup() {
    const selectd = common_vendor.ref(0);
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTkxMDQzIiwiZXhwIjoxNzE2OTgyNjcxfQ.MCM-ztYEPvBResEWmz0Gkp7jsBdlla3sf4hWcOdIvR0";
    const editor = common_vendor.ref();
    const mapcenter = common_vendor.ref({ lat: 23.106154, lng: 113.281485 });
    const geometries = common_vendor.ref([]);
    const streetGeometries = common_vendor.ref([]);
    const updateName = common_vendor.ref();
    const actionMode = common_vendor.ref(0);
    let tempGeometries;
    const selectGeometries = common_vendor.ref();
    const Labelgeometries = common_vendor.ref([]);
    const lstyles = common_vendor.shallowRef({
      label: {
        color: "#ff5500",
        // 颜色属性
        strokeColor: "#ffffff",
        size: 18,
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
    const newGeometries = {
      id: "",
      // 多边形图形数据的标志信息
      styleId: "polygon",
      // 样式id
      paths: [],
      // 多边形的位置信息
      properties: {
        // 多边形的属性数据
        title: ""
      }
    };
    function showArea() {
      common_vendor.index.request({
        url: "http://localhost:8080/admin/showArea",
        method: "GET",
        header: {
          "Authorization": token
        },
        success: (res) => {
          console.log("传入数据:", res.data.data);
          res.data.data.forEach((item) => {
            let areaData = {
              id: item.areaId,
              paths: item.areaRange.paths,
              properties: {
                title: item.areaName
              }
            };
            console.log("读取区域", areaData.properties);
            geometries.value.push(areaData);
          });
          res.data.data.forEach((item) => {
            const polygonPt = item.areaRange.paths.map((path) => [path.lat, path.lng]);
            polygonPt.push(polygonPt[0]);
            const poly = common_vendor.polygon([polygonPt]);
            let centr = common_vendor.center(poly);
            let centrPath = { "lat": centr.geometry.coordinates[0], "lng": centr.geometry.coordinates[1] };
            let labelData = {
              id: item.areaId,
              styleId: "label",
              position: centrPath,
              content: item.areaName,
              properties: {
                title: "label"
              }
            };
            Labelgeometries.value.push(labelData);
            console.log("标签", Labelgeometries.value);
          });
        }
      });
    }
    showArea();
    function showStreet() {
      common_vendor.index.request({
        url: "http://localhost:8080/street/showArea",
        method: "GET",
        header: {
          "Authorization": token
        },
        success: (res) => {
          console.log("传入数据:", res.data.data);
          res.data.data.forEach((item) => {
            let areaData = {
              id: item.streetId,
              styleId: item.streetId,
              paths: item.streetArea.paths,
              properties: {
                title: item.streetId
              }
            };
            streetGeometries.value.push(areaData);
          });
          console.log("street", streetGeometries.value);
        }
      });
    }
    showStreet();
    common_vendor.watch(
      () => geometries.value,
      () => {
        console.log("paths", geometries.value);
        console.log("多边形数量", geometries.value.length);
      }
      // () => updateName,
      // ()=>{
      // 	console.log("updateName",updateName)
      // }
    );
    return {
      lid: "label-layer",
      lstyles,
      Labelgeometries,
      selectd,
      tempGeometries,
      selectGeometries,
      streetGeometries,
      updateName,
      // sid,
      mapcenter,
      editor,
      id: "polygon-layer",
      styles: {
        drawing: {
          // color: '#3a8e92', // 面填充色
          // showBorder: true, // 是否显示拔起面的边线
          // borderColor: '#00FFFF', // 边线颜色
          // borderWidth: 1,
        },
        selected: {
          // color: '#3a8e92', // 面填充色
          // showBorder: true, // 是否显示拔起面的边线
          // borderColor: '#00FFFF', // 边线颜色
          // borderWidth: 1,
        }
      },
      styles1: {
        default: {
          color: "#3a8e92",
          // 面填充色
          showBorder: true,
          // 是否显示拔起面的边线
          borderColor: "#00FFFF",
          // 边线颜色
          borderWidth: 1
        }
      },
      geometries,
      actionMode,
      select: () => {
        var _a;
        if ((_a = editor.value) == null ? void 0 : _a.select) {
          editor.value.select();
        }
      },
      stop: () => {
        var _a;
        if ((_a = editor.value) == null ? void 0 : _a.stop) {
          editor.value.stop();
        }
      },
      split: () => {
        var _a;
        if ((_a = editor.value) == null ? void 0 : _a.split) {
          editor.value.split();
        }
      },
      union: () => {
        var _a;
        if ((_a = editor.value) == null ? void 0 : _a.union) {
          editor.value.union();
        }
      },
      del: () => {
        common_vendor.index.showModal({
          title: "确认删除?",
          confirmText: "删除",
          confirmColor: "#e06c75",
          cancelText: "取消",
          success: (res) => {
            var _a;
            if (res.confirm && ((_a = editor.value) == null ? void 0 : _a.delete)) {
              common_vendor.index.request({
                url: "http://localhost:8080/admin/deleteArea",
                method: "POST",
                header: {
                  "content-type": "application/json",
                  "Authorization": token
                },
                data: selectGeometries.value,
                success: () => {
                  common_vendor.index.showToast({
                    icon: "success",
                    title: "删除成功"
                  });
                }
              });
              actionMode.value = 0;
              const indexToRemoveArea = geometries.value.findIndex((obj) => obj.id === selectGeometries.value.id);
              if (indexToRemoveArea !== -1) {
                geometries.value.splice(indexToRemoveArea, 1);
              }
              const indexToRemoveLabel = Labelgeometries.value.findIndex((obj) => obj.id === selectGeometries.value.id);
              if (indexToRemoveLabel !== -1) {
                Labelgeometries.value.splice(indexToRemoveLabel, 1);
                Labelgeometries.value = [
                  ...Labelgeometries.value
                ];
                console.log("标签", Labelgeometries.value);
              }
            }
          }
        });
      },
      save() {
        console.log("save", geometries.value);
        common_vendor.index.showModal({
          title: "区域信息",
          content: "",
          editable: true,
          //是否显示输入框
          placeholderText: "请输入区域名称",
          //输入框提示内容
          confirmText: "保存",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              console.log("输入的内容：", res.content);
              console.log("最新多边形1", geometries.value[geometries.value.length - 1]);
              const addGeometries = geometries.value[geometries.value.length - 1];
              newGeometries.id = addGeometries.id;
              newGeometries.styleId = addGeometries.styleId;
              newGeometries.paths = addGeometries.paths;
              newGeometries.properties.title = res.content;
              geometries.value.pop();
              geometries.value.push(newGeometries);
              const polygonPt = newGeometries.paths.map((path) => [path.lat, path.lng]);
              polygonPt.push(polygonPt[0]);
              const poly = common_vendor.polygon([polygonPt]);
              let centr = common_vendor.center(poly);
              let centrPath = { "lat": centr.geometry.coordinates[0], "lng": centr.geometry.coordinates[1] };
              let labelData = {
                id: newGeometries.id,
                styleId: "label",
                position: centrPath,
                content: newGeometries.properties.title,
                properties: {
                  title: "label"
                }
              };
              Labelgeometries.value = [
                ...Labelgeometries.value,
                labelData
              ];
              console.log("标签", Labelgeometries.value);
              const pt = common_vendor.point([centrPath.lat, centrPath.lng]);
              console.log("pt", pt);
              for (let i = 0; i < streetGeometries.value.length; i++) {
                const polygonPt2 = streetGeometries.value[i].paths.map((path) => [path.lat, path.lng]);
                polygonPt2.push(polygonPt2[0]);
                console.log("polygonPt", polygonPt2);
                const poly2 = common_vendor.polygon([polygonPt2]);
                if (common_vendor.booleanPointInPolygon(pt, poly2)) {
                  console.log("所属街道", streetGeometries.value[i]);
                  newGeometries.styleId = streetGeometries.value[i].id;
                  break;
                }
              }
              common_vendor.index.request({
                url: "http://localhost:8080/admin/addArea",
                method: "POST",
                header: {
                  "content-type": "application/json",
                  "Authorization": token
                },
                data: newGeometries,
                success: () => {
                  common_vendor.index.showToast({
                    icon: "success",
                    title: "保存成功！"
                  });
                },
                fail: () => {
                },
                complete: () => {
                  actionMode.value = 0;
                }
              });
            }
          }
        });
      },
      update() {
        selectGeometries.value.properties.title = updateName.value;
        const indexToModify = geometries.value.findIndex((obj) => obj.id === selectGeometries.value.id);
        if (indexToModify !== -1) {
          geometries.value[indexToModify].properties.title = updateName.value;
        }
        const indexLabel = Labelgeometries.value.findIndex((obj) => obj.id === selectGeometries.value.id);
        if (indexToModify !== -1) {
          Labelgeometries.value[indexLabel].content = updateName.value;
          Labelgeometries.value = [
            ...Labelgeometries.value
          ];
        }
        console.log(selectGeometries.value);
        common_vendor.index.request({
          url: "http://localhost:8080/admin/editArea",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Authorization": token
          },
          data: selectGeometries.value,
          success: () => {
            common_vendor.index.showToast({
              icon: "success",
              title: "更新成功！"
            });
          },
          fail: () => {
          },
          complete: () => {
            actionMode.value = 0;
          }
        });
      },
      onSelect: (e) => {
        if (e) {
          selectd.value = 1;
        }
        console.log("选中print", e);
        console.log("选中paths", geometries.value);
        selectGeometries.value = e[0];
        tempGeometries = e[0];
        console.log("temp", tempGeometries);
        updateName.value = tempGeometries.properties.title;
      },
      onError: (e) => {
        console.log("未知print", e);
      },
      changeColor(e) {
        selectd.value = 0;
        actionMode.value = e;
      }
    };
  }
});
if (!Array) {
  const _component_tmap_multi_polygon = common_vendor.resolveComponent("tmap-multi-polygon");
  const _component_tmap_polygon_editor = common_vendor.resolveComponent("tmap-polygon-editor");
  const _component_tmap_multi_label = common_vendor.resolveComponent("tmap-multi-label");
  const _component_tmap_map = common_vendor.resolveComponent("tmap-map");
  (_component_tmap_multi_polygon + _component_tmap_polygon_editor + _component_tmap_multi_label + _component_tmap_map)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.actionMode === 0
  }, _ctx.actionMode === 0 ? {
    b: _ctx.id,
    c: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      geometries: _ctx.geometries
    })
  } : {
    d: common_vendor.sr("editor", "eb14dbb4-2,eb14dbb4-0"),
    e: _ctx.id,
    f: common_vendor.o(_ctx.onSelect),
    g: common_vendor.o(_ctx.onError),
    h: common_vendor.o(($event) => _ctx.geometries = $event),
    i: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      ["action-mode"]: _ctx.actionMode,
      modelValue: _ctx.geometries
    })
  }, {
    j: _ctx.lid,
    k: common_vendor.p({
      id: _ctx.lid,
      styles: _ctx.lstyles,
      geometries: _ctx.Labelgeometries
    }),
    l: _ctx.actionMode == 0 ? 1 : "",
    m: common_vendor.o(($event) => _ctx.changeColor(0)),
    n: _ctx.actionMode == 1 ? 1 : "",
    o: common_vendor.o(($event) => _ctx.changeColor(1)),
    p: _ctx.actionMode == 2 ? 1 : "",
    q: common_vendor.o(($event) => _ctx.changeColor(2)),
    r: _ctx.actionMode === 1
  }, _ctx.actionMode === 1 ? {
    s: common_vendor.o((...args) => _ctx.update && _ctx.update(...args))
  } : {}, {
    t: _ctx.actionMode === 1
  }, _ctx.actionMode === 1 ? {
    v: common_vendor.o((...args) => _ctx.del && _ctx.del(...args))
  } : {}, {
    w: _ctx.actionMode === 2
  }, _ctx.actionMode === 2 ? {
    x: common_vendor.o((...args) => _ctx.save && _ctx.save(...args))
  } : {}, {
    y: common_vendor.o((...args) => _ctx.stop && _ctx.stop(...args)),
    z: _ctx.actionMode === 1 && _ctx.selectd === 1
  }, _ctx.actionMode === 1 && _ctx.selectd === 1 ? {
    A: common_vendor.o((...args) => _ctx.stop && _ctx.stop(...args)),
    B: _ctx.updateName,
    C: common_vendor.o(($event) => _ctx.updateName = $event.detail.value)
  } : {}, {
    D: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW",
      center: _ctx.mapcenter
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eb14dbb4"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/admin/area/area.vue"]]);
wx.createPage(MiniProgramPage);
