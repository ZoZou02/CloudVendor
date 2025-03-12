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
    const markers = common_vendor.ref();
    const markerGeometries = common_vendor.ref([
      {
        id: "booth",
        styleId: "booth",
        position: { lat: 23.106154, lng: 113.281485 }
      }
    ]);
    let token = "";
    const center = common_vendor.ref({ lat: 23.106154, lng: 113.281485 });
    const geometries = common_vendor.ref([]);
    const isOperate = common_vendor.ref(false);
    const inArea = common_vendor.ref(false);
    const inAreaId = common_vendor.ref();
    let paths = [
      { lat: 23.106154, lng: 113.281485 },
      { lat: 23.106154, lng: 113.281485 }
    ];
    const boothInfo = common_vendor.ref({});
    const hasBooth = common_vendor.ref(false);
    const mark = (e) => {
      console.log("坐标", e.latLng);
      paths[1] = e.latLng;
      markerGeometries.value[0].position = e.latLng;
      markers.value.moveAlong(
        {
          booth: {
            path: paths.map((p) => new window.TMap.LatLng(p.lat, p.lng)),
            speed: 25e9
          }
        },
        {
          autoRotation: false
        }
      );
      const pt = common_vendor.point([e.latLng.lat, e.latLng.lng]);
      console.log("pt", pt);
      checkArea(pt);
    };
    function showArea() {
      const getToken = common_vendor.index.getStorageSync("token");
      console.log("token：" + getToken);
      token = getToken;
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
        }
      });
    }
    function getBoothInfo() {
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
          if (res.data.success) {
            console.log(res.data);
            boothInfo.value = res.data.data;
            console.log("boothInfo", boothInfo.value);
            hasBooth.value = true;
            if (hasBooth.value) {
              getBoothState();
              getBoothLocation();
              console.log("摊位状态", isOperate.value);
            }
            getLocationList();
          } else {
            console.log("该摊主尚未拥有摊位");
            hasBooth.value = false;
            common_vendor.index.showToast({
              icon: "error",
              title: "请申请摊位"
            });
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    }
    function getBoothState() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getBoothState",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          if (res.data.data.boothState === "营业中") {
            isOperate.value = true;
          }
          console.log(res.data);
        }
      });
    }
    function getBoothLocation() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getBoothLocation",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          markerGeometries.value[0].position.lat = res.data.data.locationPoint.lat;
          markerGeometries.value[0].position.lng = res.data.data.locationPoint.lng;
          center.value.lat = res.data.data.locationPoint.lat;
          center.value.lng = res.data.data.locationPoint.lng;
          const pt = common_vendor.point([markerGeometries.value[0].position.lat, markerGeometries.value[0].position.lng]);
          console.log("pt", pt);
          checkArea(pt);
          console.log("center", markerGeometries.value[0]);
        }
      });
    }
    function getBoothList() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getBoothList",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          console.log("摊位列表", res.data.data);
        }
      });
    }
    function getLocationList() {
      common_vendor.index.request({
        url: "http://localhost:8080/booth/getLocationList",
        method: "GET",
        data: {},
        header: {
          "Authorization": token
        },
        success: (res) => {
          console.log("位置列表", res.data.data);
          console.log("当前摊位位置id", boothInfo.value.tlocationId);
          const locationList = res.data.data;
          for (let i = 0; i < locationList.length; i++) {
            if (locationList[i].id != boothInfo.value.tlocationId) {
              markerGeometries.value = [
                ...markerGeometries.value,
                {
                  id: "other",
                  styleId: "other",
                  position: locationList[i].locationPoint
                }
              ];
            }
          }
        }
      });
    }
    function checkArea(pt) {
      for (let i = 0; i < geometries.value.length; i++) {
        const polygonPt = geometries.value[i].paths.map((path) => [path.lat, path.lng]);
        polygonPt.push(polygonPt[0]);
        console.log("polygonPt", polygonPt);
        const poly = common_vendor.polygon([polygonPt]);
        inArea.value = false;
        if (common_vendor.booleanPointInPolygon(pt, poly)) {
          inArea.value = true;
          console.log("所在区域ID", geometries.value[i].id);
          inAreaId.value = geometries.value[i].id;
          break;
        }
      }
    }
    common_vendor.onMounted(() => {
      showArea();
      getBoothInfo();
      getBoothList();
      console.log("hasBooth.value", hasBooth.value);
    });
    return {
      //摊位信息
      boothInfo,
      hasBooth,
      //地图事件
      events: {
        click: mark
      },
      markers,
      markerStyles: {
        booth: {
          width: 40,
          height: 40,
          anchor: { x: 16, y: 32 },
          src: "../../../static/myIcon/marker.png"
        },
        other: {
          width: 20,
          height: 20,
          anchor: { x: 16, y: 32 },
          src: "../../../static/myIcon/other_marker.png"
        }
      },
      markerGeometries,
      center,
      control: {
        //地图控件
        zoom: {}
      },
      isOperate,
      inArea,
      inAreaId,
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
      reload() {
        location.reload();
      },
      operate() {
        console.log("出摊");
        console.log("maekerPoint", markerGeometries.value[0].position);
        const locationData = {
          "location": markerGeometries.value[0].position,
          // 'location': markerPoint.value,
          "areaId": inAreaId.value,
          "boothId": boothInfo.value.boothId
        };
        common_vendor.index.request({
          url: "http://localhost:8080/booth/operate",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Authorization": token
          },
          data: locationData,
          success: () => {
            center.value = markerGeometries.value[0].position;
            isOperate.value = true;
            common_vendor.index.showToast({
              icon: "success",
              title: "成功出摊"
            });
          }
        });
      },
      closed() {
        console.log("休息");
        common_vendor.index.request({
          url: "http://localhost:8080/booth/closed",
          method: "GET",
          header: {
            "Authorization": token
          },
          data: {},
          success: () => {
            isOperate.value = false;
            common_vendor.index.showToast({
              icon: "success",
              title: "已经休息"
            });
          }
        });
      },
      operateToast() {
        console.log("未在规定区域");
        common_vendor.index.showToast({
          icon: "error",
          title: "未在摆摊区域"
        });
      },
      toBooth() {
        common_vendor.index.navigateTo({
          url: "/pages/vendor/booth/booth",
          fail(e) {
            console.log("错误", e);
          }
        });
      }
    };
  }
});
if (!Array) {
  const _component_tmap_multi_polygon = common_vendor.resolveComponent("tmap-multi-polygon");
  const _component_tmap_multi_marker = common_vendor.resolveComponent("tmap-multi-marker");
  const _component_tmap_map = common_vendor.resolveComponent("tmap-map");
  (_component_tmap_multi_polygon + _component_tmap_multi_marker + _component_tmap_map)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.hasBooth === true && _ctx.isOperate === false
  }, _ctx.hasBooth === true && _ctx.isOperate === false ? {
    b: _ctx.id,
    c: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      geometries: _ctx.geometries
    }),
    d: common_vendor.sr("markers", "f274b89e-2,f274b89e-0"),
    e: common_vendor.p({
      styles: _ctx.markerStyles,
      geometries: _ctx.markerGeometries
    }),
    f: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW",
      events: _ctx.events,
      center: _ctx.center,
      control: _ctx.control,
      doubleClickZoom: false
    }),
    g: common_vendor.o((...args) => _ctx.reload && _ctx.reload(...args)),
    h: _ctx.inArea ? 1 : "",
    i: common_vendor.o(($event) => _ctx.inArea ? _ctx.operate() : _ctx.operateToast())
  } : _ctx.hasBooth === true && _ctx.isOperate === true ? {
    k: _ctx.id,
    l: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      geometries: _ctx.geometries
    }),
    m: common_vendor.sr("markers", "f274b89e-5,f274b89e-3"),
    n: common_vendor.p({
      styles: _ctx.markerStyles,
      geometries: _ctx.markerGeometries
    }),
    o: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW",
      center: _ctx.center,
      control: _ctx.control,
      doubleClickZoom: false
    }),
    p: common_vendor.o((...args) => _ctx.reload && _ctx.reload(...args)),
    q: common_vendor.o((...args) => _ctx.closed && _ctx.closed(...args))
  } : {
    r: _ctx.id,
    s: common_vendor.p({
      id: _ctx.id,
      styles: _ctx.styles,
      geometries: _ctx.geometries
    }),
    t: common_vendor.p({
      mapKey: "MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW",
      center: _ctx.center,
      control: _ctx.control,
      doubleClickZoom: false
    }),
    v: common_vendor.o((...args) => _ctx.reload && _ctx.reload(...args)),
    w: common_vendor.o(($event) => _ctx.toBooth())
  }, {
    j: _ctx.hasBooth === true && _ctx.isOperate === true
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f274b89e"], ["__file", "D:/develop/uniappProject/CloudVendor/pages/vendor/map/map.vue"]]);
wx.createPage(MiniProgramPage);
