<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index" 
      class="tab-item" 
      :class="{ active: currentPath === item.pagePath }"
      @click="navigateTo(item.pagePath)"
    >
      <view class="icon">
        <image :src="currentPath === item.pagePath ? item.selectedIcon : item.icon"></image>
      </view>
      <view class="text" :class="{ active: currentPath === item.pagePath }">{{ item.text }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPath: '',
      tabList: [
        {
          pagePath: '/pages/inspector/index/index',
          text: '首页',
          icon: '/static/tabbar/home.png',
          selectedIcon: '/static/tabbar/home-active.png'
        },
        {
          pagePath: '/pages/inspector/map/map',
          text: '地图',
          icon: '/static/tabbar/map.png',
          selectedIcon: '/static/tabbar/map-active.png'
        },
        {
          pagePath: '/pages/inspector/inspector/inspector',
          text: '我的',
          icon: '/static/tabbar/my.png',
          selectedIcon: '/static/tabbar/my-active.png'
        }
      ]
    }
  },
  mounted() {
    // 获取当前页面路径
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    this.currentPath = '/' + currentPage.route;
  },
  methods: {
    navigateTo(path) {
      if (this.currentPath === path) return;
      
      // 记录新路径
      this.currentPath = path;
      
      // 跳转到选中的页面
      uni.reLaunch({
        url: path
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #ffffff;
  display: flex;
  border-top: 1rpx solid #f0f0f0;
  z-index: 99;
  
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .icon {
      width: 58rpx;
      height: 58rpx;
      margin-bottom: 4rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .text {
      font-size: 24rpx;
      color: #999999;
      
      &.active {
        color: #4f99ff;
      }
    }
  }
}
</style> 