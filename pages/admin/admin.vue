<template>
	<view class="admin-container">
		<!-- 左侧侧边栏 -->
		<view class="sidebar">
			<view class="logo">管理后台</view>
			<view v-for="(item, index) in menus" :key="index" class="menu-item"
				:class="{ active: activeIndex === index }" @click="switchTab(item, index)">
				{{ item.title }}
			</view>
		</view>

		<!-- 右侧内容区 -->
		<view class="content">
			<!-- 通过动态组件实现页面切换 -->
			<component :is="currentComponent" />
		</view>
	</view>
</template>

<script>
	// 导入子页面组件
	import Overview from '@/pages/admin/overview/overview'
	import Area from '@/pages/admin/area/area'
	import Street from '@/pages/admin/street/street'
	import VendorList from '@/pages/admin/vendorList/vendorList'
	import InspectorList from '@/pages/admin/inspectorList/inspectorList'

	export default {
		data() {
			return {
				activeIndex: 0, // 默认选中总览
				currentComponent: Overview,
				menus: [{
						title: '总览',
						component: 'Overview'
					},
					{
						title: '摊位区域',
						component: 'Area'
					},
					{
						title: '街道管理',
						component: 'Street'
					},
					{
						title: '摊主管理',
						component: 'VendorList'
					},
					{
						title: '城管管理',
						component: 'InspectorList'
					},
				]
			}
		},
		components: {
			Overview,
			Area,
			Street,
			VendorList,
			InspectorList
		},
		methods: {
			switchTab(item, index) {
				this.activeIndex = index
				this.currentComponent = item.component
				// 修改导航栏标题
				uni.setNavigationBarTitle({
					title: item.title
				})
			}
		},
		onLoad() {
			// 初始化默认标题
			uni.setNavigationBarTitle({
				title: this.menus[0].title
			})
		}
	}
</script>

<style scoped>
/* 	::-webkit-scrollbar {
		display: none;
	} */

	.admin-container {
		display: flex;
		height: 100vh;
	}

	.sidebar {
		width: 240px;
		background-color: #304156;
		padding: 20px 0;
	}

	.logo {
		color: #fff;
		font-size: 20px;
		text-align: center;
		padding: 20px 0;
		border-bottom: 1px solid #263445;
	}

	.menu-item {
		color: #bfcbd9;
		padding: 14px 24px;
		cursor: pointer;
		transition: all 0.3s;
	}

	.menu-item:hover {
		background-color: #263445;
	}

	.menu-item.active {
		background-color: #409EFF;
		color: #fff;
	}

	.content {
		flex: 1;
		padding: 0px;
		background-color: #f0f2f5;
		overflow-y: auto;
	}
</style>