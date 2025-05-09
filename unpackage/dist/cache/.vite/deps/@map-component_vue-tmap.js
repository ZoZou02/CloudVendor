import "./chunk-6MT7EBHR.js";

// ../../../uniappProject/CloudVendor/node_modules/@map-component/vue-tmap/dist/index.js
import { defineComponent, ref, onMounted, onUnmounted, watch, provide, h, inject, toRaw, computed } from "vue";
function loadSDK(version, key, libraries) {
  const libs = ["visualization", "tools", "geometry", ...libraries || []];
  return new Promise((resolve) => {
    if (window.TMap) {
      resolve(window.TMap);
      return;
    }
    window.tmapCallback = function tmapCallback() {
      resolve(window.TMap);
    };
    if (window.__POWERED_BY_QIANKUN__ && top) {
      top.tmapCallback = function tmapCallback() {
        resolve(TMap);
      };
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://map.qq.com/api/gljs?v=${version}&key=${key}&libraries=${libs.join(
      ","
    )}&callback=tmapCallback`;
    document.body.appendChild(script);
  });
}
function setMapCtrl(mapIns, ctrlId, config, positionMap) {
  if (!config) {
    mapIns.removeControl(ctrlId);
    return;
  }
  const ctrl = mapIns.getControl(ctrlId);
  const { position, className } = config;
  if (positionMap[position]) {
    ctrl.setPosition(positionMap[position]);
  }
  ctrl.setClassName(className);
}
var TMap$1 = defineComponent({
  name: "tmap-map",
  props: {
    version: {
      type: String,
      default: "1.exp"
    },
    mapKey: {
      type: String,
      default: ""
    },
    libraries: {
      type: Array,
      default: () => []
    },
    class: {
      type: String,
      default: ""
    },
    style: {
      type: Object,
      default: () => ({})
    },
    center: {
      type: Object,
      default: () => ({ lat: 40.040452, lng: 116.273486 })
    },
    zoom: {
      type: Number,
      default: 17
    },
    minZoom: {
      type: Number,
      default: 3
    },
    maxZoom: {
      type: Number,
      default: 20
    },
    rotation: {
      type: Number,
      default: 0
    },
    pitch: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 1
    },
    offset: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    draggable: {
      type: Boolean,
      default: true
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    boundary: {
      type: Object,
      default: null
    },
    mapStyleId: {
      type: String
    },
    baseMap: {
      type: Object
    },
    viewMode: {
      type: String,
      default: "3D"
    },
    control: {
      type: Object,
      default: () => ({ scale: {}, zoom: {}, rotation: {} })
    },
    events: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const el = ref(null);
    const map = ref(null);
    let mapIns;
    let positionMap;
    const events = [];
    Object.keys(props.events).forEach((eventName) => {
      events.push(eventName);
    });
    onMounted(async () => {
      await loadSDK(props.version, props.mapKey, props.libraries);
      positionMap = {
        topLeft: TMap.constants.CONTROL_POSITION.TOP_LEFT,
        topCenter: TMap.constants.CONTROL_POSITION.TOP_CENTER,
        topRight: TMap.constants.CONTROL_POSITION.TOP_RIGHT,
        centerLeft: TMap.constants.CONTROL_POSITION.CENTER_LEFT,
        center: TMap.constants.CONTROL_POSITION.CENTER,
        centerRight: TMap.constants.CONTROL_POSITION.CENTER_RIGHT,
        bottomLeft: TMap.constants.CONTROL_POSITION.BOTTOM_LEFT,
        bottomCenter: TMap.constants.CONTROL_POSITION.BOTTOM_CENTER,
        bottomRight: TMap.constants.CONTROL_POSITION.BOTTOM_RIGHT
      };
      const center = new TMap.LatLng(props.center.lat, props.center.lng);
      if (el.value) {
        mapIns = new TMap.Map(el.value, {
          center,
          zoom: props.zoom,
          minZoom: props.minZoom,
          maxZoom: props.maxZoom,
          rotation: props.rotation,
          pitch: props.pitch,
          scale: props.scale,
          offset: props.offset,
          draggable: props.draggable,
          scrollable: props.scrollable,
          doubleClickZoom: props.doubleClickZoom,
          boundary: props.boundary,
          mapStyleId: props.mapStyleId,
          baseMap: props.baseMap,
          viewMode: props.viewMode,
          showControl: true
        });
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.SCALE,
          props.control.scale,
          positionMap
        );
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.ZOOM,
          props.control.zoom,
          positionMap
        );
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.ROTATION,
          props.control.rotation,
          positionMap
        );
        events.forEach((eventName) => {
          mapIns.on(eventName, props.events[eventName]);
        });
        map.value = mapIns;
      }
    });
    onUnmounted(() => {
      if (mapIns) {
        events.forEach((eventName) => {
          mapIns.off(eventName, props.events[eventName]);
        });
        mapIns.destroy();
      }
    });
    watch(
      () => [props.center, props.zoom, props.rotation, props.pitch],
      ([center, zoom, rotation, pitch]) => {
        if (mapIns) {
          mapIns.easeTo(
            {
              center: new TMap.LatLng(center.lat, center.lng),
              zoom,
              rotation,
              pitch
            },
            {
              duration: 500
            }
          );
        }
      }
    );
    watch(
      () => props.scale,
      (value) => mapIns && mapIns.setScale(value)
    );
    watch(
      () => props.offset,
      (value) => mapIns && mapIns.setOffset(value)
    );
    watch(
      () => props.draggable,
      (value) => mapIns && mapIns.setDraggable(value)
    );
    watch(
      () => props.scrollable,
      (value) => mapIns && mapIns.setScrollable(value)
    );
    watch(
      () => props.doubleClickZoom,
      (value) => mapIns && mapIns.setDoubleClickZoom(value)
    );
    watch(
      () => props.boundary,
      (value) => mapIns && mapIns.setBoundary(value)
    );
    watch(
      () => props.control,
      (value) => {
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.SCALE,
          value.scale,
          positionMap
        );
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.ZOOM,
          value.zoom,
          positionMap
        );
        setMapCtrl(
          mapIns,
          TMap.constants.DEFAULT_CONTROL_ID.ROTATION,
          value.rotation,
          positionMap
        );
      }
    );
    provide("map", map);
    return {
      map,
      el,
      getCenter: () => mapIns == null ? void 0 : mapIns.getCenter(),
      getZoom: () => mapIns == null ? void 0 : mapIns.getZoom()
    };
  },
  render() {
    return h(
      "div",
      {
        class: this.class,
        style: { ...this.style, height: "100%", width: "100%" },
        ref: "el"
      },
      this.$slots.default && this.map ? this.$slots.default() : []
    );
  }
});
function useEvent(overlay, attrs, emit) {
  const events = [];
  const listeners = [];
  Object.keys(attrs).forEach((attr) => {
    if (attr.indexOf("on") === 0) {
      const eventName = attr[2].toLowerCase() + attr.slice(3);
      events.push(eventName);
      listeners.push(emit.bind(null, eventName));
    }
  });
  events.forEach((eventName, i) => {
    overlay.on(eventName, listeners[i]);
  });
  onUnmounted(() => {
    events.forEach((eventName, i) => {
      overlay.off(eventName, listeners[i]);
    });
  });
}
function useCleanUp(map, id) {
  const overlay = map.getLayer(id);
  if (overlay) {
    overlay.setMap(null);
  }
  const oldOverlayBorder = map.getLayer(`${id}_border_line`);
  if (oldOverlayBorder) {
    oldOverlayBorder.setMap(null);
  }
  const overlayBorder = map.getLayer(`${id}_border`);
  if (overlayBorder) {
    overlayBorder.setMap(null);
  }
}
function builtStyle$4(opt) {
  const styled = {};
  Object.keys(opt).forEach((k) => {
    styled[k] = new TMap.MarkerStyle(opt[k]);
  });
  return styled;
}
function buildGeometries$2(geometries) {
  return geometries.map((v) => ({
    ...v,
    position: new TMap.LatLng(v.position.lat, v.position.lng)
  }));
}
var MultiMarker = defineComponent({
  name: "tmap-multi-marker",
  props: {
    id: {
      type: String,
      default: "default"
    },
    styles: {
      type: Object,
      required: true
    },
    geometries: {
      type: Array,
      required: true
    }
  },
  setup(props, { attrs, emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const markers = new TMap.MultiMarker({
      id: props.id,
      map: originMap,
      styles: builtStyle$4(props.styles),
      geometries: buildGeometries$2(props.geometries)
    });
    useEvent(markers, attrs, emit);
    watch(
      () => props.styles,
      (styles) => {
        markers.setStyles(builtStyle$4(styles));
      }
    );
    watch(
      () => props.geometries,
      (geometries) => {
        markers.setGeometries(buildGeometries$2(geometries));
      }
    );
    onUnmounted(() => {
      markers.setMap(null);
    });
    return {
      getStyles: markers.getStyles,
      moveAlong: markers.moveAlong.bind(markers),
      stopMove: markers.stopMove.bind(markers),
      pauseMove: markers.pauseMove.bind(markers),
      resumeMove: markers.resumeMove.bind(markers),
      on: markers.on.bind(markers)
    };
  },
  render() {
    return null;
  }
});
var MarkerCluster = defineComponent({
  name: "tmap-marker-cluster",
  props: {
    id: {
      type: String,
      default: "default"
    },
    enableDefaultStyle: {
      type: Boolean,
      default: true
    },
    minimumClusterSize: {
      type: Number,
      default: 2
    },
    geometries: {
      type: Array,
      required: true
    },
    zoomOnClick: {
      type: Boolean,
      default: true
    },
    gridSize: {
      type: Number,
      default: 60
    },
    averageCenter: {
      type: Boolean,
      default: false
    },
    maxZoom: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const markers = new TMap.MarkerCluster({
      id: props.id,
      map: toRaw(map.value),
      enableDefaultStyle: props.enableDefaultStyle,
      minimumClusterSize: props.minimumClusterSize,
      geometries: buildGeometries$2(props.geometries),
      zoomOnClick: props.zoomOnClick,
      gridSize: props.gridSize,
      averageCenter: props.averageCenter,
      maxZoom: props.maxZoom
    });
    watch(
      () => props.geometries,
      (geometries) => {
        markers.setGeometries(buildGeometries$2(geometries));
      }
    );
    return {};
  },
  render() {
    return null;
  }
});
function builtStyle$3(opt) {
  const styled = {};
  Object.keys(opt).forEach((k) => {
    styled[k] = new TMap.PolylineStyle(opt[k]);
  });
  return styled;
}
function buildGeometries$1(geometries) {
  return geometries.map((v) => {
    return {
      ...v,
      paths: v.paths.map((p) => new TMap.LatLng(p.lat, p.lng))
    };
  });
}
var MultiPolyline = defineComponent({
  name: "tmap-multi-polyline",
  props: {
    id: {
      type: String,
      default: "default"
    },
    zIndex: {
      type: Number,
      default: 1
    },
    styles: {
      type: Object,
      required: true
    },
    geometries: {
      type: Array,
      required: true
    }
  },
  setup(props, { attrs, emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const polyline = new TMap.MultiPolyline({
      id: props.id,
      map: originMap,
      zIndex: props.zIndex,
      styles: builtStyle$3(props.styles),
      geometries: buildGeometries$1(props.geometries)
    });
    useEvent(polyline, attrs, emit);
    watch(
      () => props.zIndex,
      (zIndex) => {
        polyline.setZIndex(zIndex);
      }
    );
    watch(
      () => props.styles,
      (styles) => {
        polyline.setStyles(builtStyle$3(styles));
      }
    );
    watch(
      () => props.geometries,
      (geometries) => {
        polyline.setGeometries(buildGeometries$1(geometries));
      }
    );
    onUnmounted(() => {
      polyline.setMap(null);
    });
    return {};
  },
  render() {
    return null;
  }
});
function keyBy(collection, iteratee) {
  return collection.reduce((result, value) => {
    const key = value[iteratee];
    result[key] = value;
    return result;
  }, {});
}
function equalPolygonGeometry(a, b) {
  var _a, _b;
  if (a.id !== b.id) {
    return false;
  }
  if (a.styleId !== b.styleId) {
    return false;
  }
  if (a.rank !== b.rank) {
    return false;
  }
  if (a.paths.length === b.paths.length) {
    if (JSON.stringify(a.paths) !== JSON.stringify(b.paths)) {
      return false;
    }
  } else {
    return false;
  }
  if (a.properties !== void 0 && b.properties !== void 0) {
    const aPropertyKeys = Object.keys(a.properties || {});
    const bPropertyKeys = Object.keys(b.properties || {});
    if (aPropertyKeys.length !== bPropertyKeys.length) {
      return false;
    }
    for (let i = aPropertyKeys.length - 1; i >= 0; i -= 1) {
      const key = aPropertyKeys[i];
      if (((_a = a.properties) == null ? void 0 : _a[key]) !== ((_b = b.properties) == null ? void 0 : _b[key])) {
        return false;
      }
    }
  } else if (a.properties !== b.properties) {
    return false;
  }
  return true;
}
function builtStyle$2(opt) {
  const styled = {};
  Object.keys(opt).forEach((k) => {
    styled[k] = new TMap.PolygonStyle(opt[k]);
  });
  return styled;
}
function buildGeometries(geometries) {
  return geometries.map((v) => {
    return {
      ...v,
      paths: v.paths.map((p) => new TMap.LatLng(p.lat, p.lng))
    };
  });
}
var MultiPolygon = defineComponent({
  name: "tmap-multi-polygon",
  props: {
    id: {
      type: String,
      default: "default"
    },
    zIndex: {
      type: Number,
      default: 1
    },
    styles: {
      type: Object,
      required: true
    },
    geometries: {
      type: Array,
      required: true
    }
  },
  setup(props, { attrs, emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    let currentGeometries = props.geometries;
    useCleanUp(originMap, props.id);
    const polygon = new TMap.MultiPolygon({
      id: props.id,
      map: originMap,
      zIndex: props.zIndex,
      styles: builtStyle$2(props.styles),
      geometries: buildGeometries(currentGeometries)
    });
    useEvent(polygon, attrs, emit);
    watch(
      () => props.zIndex,
      (zIndex) => {
        polygon.setZIndex(zIndex);
      }
    );
    watch(
      () => props.styles,
      (styles) => {
        polygon.setStyles(builtStyle$2(styles));
      }
    );
    watch(
      () => props.geometries,
      (geometries) => {
        const currentGeometriesMap = keyBy(currentGeometries, "id");
        const toDelete = new Set(Object.keys(currentGeometriesMap));
        const toAddOrModify = [];
        geometries.forEach((v) => {
          if (currentGeometriesMap[v.id]) {
            toDelete.delete(v.id);
            if (!equalPolygonGeometry(currentGeometriesMap[v.id], v)) {
              toAddOrModify.push(v);
            }
          } else {
            toAddOrModify.push(v);
          }
        });
        currentGeometries = geometries;
        if (toDelete.size > 0) {
          polygon.remove([...toDelete]);
        }
        if (toAddOrModify.length > 0) {
          polygon.updateGeometries(buildGeometries(geometries));
        }
      }
    );
    provide("geometry", polygon);
    onUnmounted(() => {
      polygon.setMap(null);
    });
    return {};
  },
  render() {
    return this.$slots.default ? this.$slots.default() : null;
  }
});
function builtStyle$1(opt) {
  const styled = {};
  Object.keys(opt).forEach((k) => {
    styled[k] = new TMap.LabelStyle(opt[k]);
  });
  return styled;
}
var MultiLabel = defineComponent({
  name: "tmap-multi-label",
  props: {
    id: {
      type: String,
      default: "default"
    },
    styles: {
      type: Object,
      required: true
    },
    geometries: {
      type: Array,
      required: true
    },
    enableCollision: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, { attrs, emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const getResGeo = (geo) => geo.map((item) => ({
      ...item,
      position: new TMap.LatLng(item.position.lat, item.position.lng)
    }));
    const labelInstance = new TMap.MultiLabel({
      id: props.id,
      map: toRaw(map.value),
      styles: builtStyle$1(props.styles),
      geometries: getResGeo(props.geometries),
      enableCollision: props.enableCollision
    });
    useEvent(labelInstance, attrs, emit);
    watch(
      () => props.styles,
      (styles) => {
        labelInstance.setStyles(builtStyle$1(styles));
      }
    );
    watch(
      () => props.geometries,
      (r) => {
        labelInstance.setGeometries(getResGeo(r));
      }
    );
    onUnmounted(() => {
      labelInstance.setMap(null);
    });
    return {};
  },
  render() {
    return null;
  }
});
function builtStyle(opt) {
  const styled = {};
  Object.keys(opt).forEach((k) => {
    styled[k] = new TMap.CircleStyle(opt[k]);
  });
  return styled;
}
var MultiCircle = defineComponent({
  name: "tmap-multi-circle",
  props: {
    id: {
      type: String,
      default: "default"
    },
    zIndex: {
      type: Number,
      default: 1
    },
    styles: {
      type: Object,
      required: true
    },
    geometries: {
      type: Array,
      required: true
    }
  },
  setup(props, { attrs, emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const getResGeo = (geo) => geo.map((item) => ({
      ...item,
      center: new TMap.LatLng(item.center.lat, item.center.lng)
    }));
    const circle = new TMap.MultiCircle({
      id: props.id,
      map: originMap,
      styles: builtStyle(props.styles),
      geometries: getResGeo(props.geometries),
      zIndex: 1
    });
    useEvent(circle, attrs, emit);
    watch(
      () => props.zIndex,
      (zIndex) => {
        circle.setZIndex(zIndex);
      }
    );
    watch(
      () => props.styles,
      (styles) => {
        circle.setStyles(builtStyle(styles));
      }
    );
    watch(
      () => props.geometries,
      (r) => {
        circle.setGeometries(getResGeo(r));
      }
    );
    onUnmounted(() => {
      circle.setMap(null);
    });
    return {};
  },
  render() {
    return null;
  }
});
var getLatLng$1 = (latlngData) => {
  return new TMap.LatLng(latlngData.lat, latlngData.lng);
};
var InfoWindow = defineComponent({
  name: "tmap-info-window",
  props: {
    id: {
      type: String,
      default: "default"
    },
    visible: {
      type: Boolean,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    zIndex: {
      type: Number,
      required: false,
      default: 0
    },
    offset: {
      type: Object,
      required: false,
      default: () => ({ x: 0, y: 0 })
    },
    enableCustom: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["close-click"],
  setup(props, { emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const center = getLatLng$1(props.position);
    const infoWindow = new TMap.InfoWindow({
      map: toRaw(map.value),
      position: center,
      content: props.content,
      zIndex: props.zIndex,
      offset: props.offset,
      enableCustom: props.enableCustom
    });
    infoWindow.on("closeclick", () => {
      emit("close-click");
    });
    watch(
      () => props.visible,
      (v) => {
        if (v) {
          infoWindow.open();
        } else {
          infoWindow.close();
        }
      }
    );
    watch(
      () => props.content,
      (v) => {
        infoWindow.setContent(v);
      }
    );
    watch(
      () => props.position,
      (v) => {
        infoWindow.setPosition(getLatLng$1(v));
      }
    );
    onUnmounted(() => {
      infoWindow.destroy();
    });
    return {};
  },
  render() {
    return null;
  }
});
var PolygonEditor = defineComponent({
  name: "tmap-polygon-editor",
  props: {
    id: {
      type: String,
      default: "default"
    },
    zIndex: {
      type: Number,
      default: 2
    },
    snappable: {
      type: Boolean,
      default: true
    },
    drawingStyleId: {
      type: String,
      default: "drawing"
    },
    selectedStyleId: {
      type: String,
      default: "selected"
    },
    styles: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Array,
      required: true
    },
    actionMode: {
      type: Number
    }
  },
  emits: ["update:modelValue", "select", "error"],
  setup(props, { emit }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const geometries = buildGeometries(props.modelValue);
    const polygon = new TMap.MultiPolygon({
      id: props.id,
      map: originMap,
      zIndex: props.zIndex,
      styles: builtStyle$2(props.styles),
      geometries
    });
    const editor = new TMap.tools.GeometryEditor({
      map: originMap,
      overlayList: [
        {
          overlay: polygon,
          id: props.id,
          drawingStyleId: props.drawingStyleId,
          selectedStyleId: props.selectedStyleId
        }
      ],
      actionMode: props.actionMode === 1 ? TMap.tools.constants.EDITOR_ACTION.INTERACT : TMap.tools.constants.EDITOR_ACTION.DRAW,
      activeOverlayId: props.id,
      selectable: true,
      snappable: props.snappable
    });
    editor.on("select", () => {
      emit("select", editor.getSelectedList());
    });
    editor.on("draw_complete", (e) => {
      emit("update:modelValue", [...props.modelValue, e]);
    });
    editor.on("adjust_complete", (e) => {
      for (let i = props.modelValue.length - 1; i >= 0; i -= 1) {
        if (props.modelValue[i].id === e.id) {
          Object.assign(props.modelValue[i], e);
          emit("update:modelValue", [...props.modelValue]);
          break;
        }
      }
    });
    editor.on("delete_complete", (e) => {
      const removedIds = e.map((v) => v.id);
      emit(
        "update:modelValue",
        props.modelValue.filter((v) => removedIds.indexOf(v.id) === -1)
      );
      emit("select", editor.getSelectedList());
    });
    editor.on("split_complete", (e) => {
      const activeOverlay = editor.getActiveOverlay();
      emit("update:modelValue", [
        ...activeOverlay.overlay.getGeometries(),
        ...e
      ]);
      emit("select", editor.getSelectedList());
    });
    editor.on("union_complete", (e) => {
      const activeOverlay = editor.getActiveOverlay();
      emit("update:modelValue", [...activeOverlay.overlay.getGeometries(), e]);
      emit("select", editor.getSelectedList());
    });
    editor.on("split_fail", (e) => {
      emit("error", e);
    });
    editor.on("union_fail", (e) => {
      emit("error", e);
    });
    watch(
      () => props.actionMode,
      (actionMode) => {
        const x = actionMode === 1 ? TMap.tools.constants.EDITOR_ACTION.INTERACT : TMap.tools.constants.EDITOR_ACTION.DRAW;
        editor.setActionMode(x);
      }
    );
    onUnmounted(() => {
      polygon.setMap(null);
      try {
        editor.destroy();
      } catch (e) {
      }
    });
    return {
      select: editor.select.bind(editor),
      stop: editor.stop.bind(editor),
      split: editor.split.bind(editor),
      union: editor.union.bind(editor),
      delete: editor.delete.bind(editor),
      destroy: editor.destroy.bind(editor)
    };
  },
  render() {
    return null;
  }
});
var getLatLng = (latlngData) => {
  return new TMap.LatLng(latlngData.lat, latlngData.lng);
};
var DOMOverlay = defineComponent({
  name: "tmap-dom-overlay",
  props: {
    id: {
      type: String,
      default: "default"
    },
    position: {
      type: Object,
      required: true
    },
    offset: {
      type: Array,
      required: false,
      default: () => [0, 0]
    }
  },
  setup(props, { slots }) {
    const map = inject("map");
    if (!map) {
      return {};
    }
    const originMap = toRaw(map.value);
    useCleanUp(originMap, props.id);
    const domRef = ref(document.createElement("div"));
    const position = computed(() => {
      return getLatLng(getLatLng(props.position));
    });
    class DomClass extends TMap.DOMOverlay {
      constructor(options) {
        super(options);
        this.map = options.map;
        this.onInit(options);
      }
      onInit(options) {
        this.ele = options.ele;
      }
      createDOM() {
        return this.ele;
      }
      updateDOM() {
        const pixel = this.map.projectToContainer(position.value);
        const left = `${pixel.getX() - this.ele.clientWidth / 2 + props.offset[0]}px`;
        const top2 = `${pixel.getY() - this.ele.clientHeight / 2 + props.offset[1]}px`;
        this.ele.setAttribute(
          "style",
          `top: ${top2}; left: ${left}; position: absolute;`
        );
      }
      onDestroy() {
        this.ele.innerHTML = "";
      }
    }
    let domIns;
    onMounted(() => {
      domIns = new DomClass({
        map: map.value,
        ele: domRef.value
      });
    });
    watch(
      () => props.position,
      () => {
        domIns.updateDOM();
      }
    );
    onUnmounted(() => {
      domIns.onDestroy();
    });
    return () => h(
      "span",
      {
        ref: domRef
      },
      slots.default ? slots.default() : []
    );
  }
});
var components = [
  TMap$1,
  MultiMarker,
  MarkerCluster,
  MultiPolygon,
  MultiPolyline,
  MultiLabel,
  MultiCircle,
  InfoWindow,
  PolygonEditor,
  DOMOverlay
];
var install = (Vue) => {
  components.forEach((Component) => {
    Vue.component(Component.name, Component);
  });
};
export {
  DOMOverlay,
  InfoWindow,
  MarkerCluster,
  MultiCircle,
  MultiLabel,
  MultiMarker,
  MultiPolygon,
  MultiPolyline,
  PolygonEditor,
  TMap$1 as TMap,
  install as default
};
//# sourceMappingURL=@map-component_vue-tmap.js.map
