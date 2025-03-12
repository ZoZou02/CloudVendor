"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      name: "wkiwi",
      height: 0,
      categoryActive: 0,
      scrollTop: 0,
      scrollLeftTop: 0,
      // scrollHeight: 0,
      classifyData,
      arr: [0, 584, 1168, 1752, 2336, 2805, 3274, 3858, 4442, 4911, 5380, 5734, 6203, 6672, 7017],
      //初始值，后边计算会根据手机适配覆盖
      leftItemHeight: 51,
      //49行会计算出新值进行覆盖
      navLeftHeight: 0,
      //左边scroll-view 内层nav的总高度
      diff: 0,
      //左边scroll-view 内层nav的总高度与视口之差
      tabBarHeight: 0
      //如果此页面为Tab页面，自己改变高度值,,一般tab高度为51
    };
  },
  created() {
  },
  onLoad: function() {
    this.height = common_vendor.index.getSystemInfoSync().windowHeight - this.tabBarHeight;
  },
  onReady() {
    this.getHeightList();
  },
  methods: {
    getHeightList() {
      let _this = this;
      let selectorQuery = common_vendor.index.createSelectorQuery();
      selectorQuery.selectAll(".nav-left-item").boundingClientRect(function(rects) {
        _this.leftItemHeight = rects[0].height;
        _this.navLeftHeight = _this.leftItemHeight * classifyData.length;
        _this.diff = _this.navLeftHeight - _this.height;
      });
      selectorQuery.selectAll(".box").boundingClientRect(function(rects) {
        let arr = [0];
        let top = 0;
        rects.forEach(function(rect) {
          top += rect.height;
          arr.push(top);
        });
        console.log(arr);
        _this.arr = arr;
      }).exec();
    },
    scroll(e) {
      let _this = this;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(function() {
        _this.scrollHeight = e.detail.scrollTop + 1 + _this.height / 2;
        for (let i = 0; i < _this.arr.length; i++) {
          let height1 = _this.arr[i];
          let height2 = _this.arr[i + 1];
          if (!height2 || _this.scrollHeight >= height1 && _this.scrollHeight < height2) {
            _this.categoryActive = i;
            _this.diff > 0 && (_this.scrollLeftTop = Math.round(_this.categoryActive * _this.diff / (classifyData.length - 1)));
            return false;
          }
        }
        _this.categoryActive = 0;
        _this.timeoutId = void 0;
      }, 10);
    },
    categoryClickMain(index) {
      this.categoryActive = index;
      this.scrollTop == this.arr[index] ? this.scrollTop = this.scrollTop + 1 : this.scrollTop = this.arr[index];
    },
    cart: function(text) {
      common_vendor.index.showToast({
        title: text,
        icon: "none"
      });
    }
  },
  components: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.classifyData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.o(($event) => $options.categoryClickMain(index), index),
        c: index,
        d: common_vendor.n(index == $data.categoryActive ? "active" : "")
      };
    }),
    b: common_vendor.s("height:" + $data.height + "px"),
    c: $data.scrollLeftTop,
    d: common_vendor.f($data.classifyData, (foods, index, i0) => {
      return {
        a: common_vendor.t(foods.name),
        b: common_vendor.f(foods.foods, (item, i, i1) => {
          return {
            a: common_vendor.t(item.name),
            b: i == 0 ? "first" : "",
            c: i,
            d: common_vendor.o(($event) => $options.cart(item.name), i)
          };
        }),
        c: index
      };
    }),
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    g: common_vendor.s("height:" + $data.height + "px"),
    h: common_vendor.s("height:" + $data.height + "px")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/develop/uniappProject/CloudVendor/pages/admin/console/console.vue"]]);
wx.createPage(MiniProgramPage);
