<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 搜索框 -->
		<view class="search-container">
			<view class="search-box">
				<view class="search-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
						<path fill="#999" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/>
					</svg>
				</view>
				<input type="text" class="search-input" placeholder="搜索商贩..." v-model="searchQuery" @input="filterVendors"/>
			</view>
		</view>
		
		<!-- 筛选选项 -->
		<view class="filter-options">
			<view class="filter-item" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
				全部
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'certified' }" @click="setFilter('certified')">
				已认证
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'uncertified' }" @click="setFilter('uncertified')">
				未认证
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'hasBooth' }" @click="setFilter('hasBooth')">
				有摊位
			</view>
		</view>
		
		<!-- 商贩列表 -->
		<view class="vendor-list">
			<view class="section-header">
				<view class="header-line"></view>
				<view class="header-text">商贩列表</view>
				<view class="header-line"></view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="filteredVendors.length === 0" class="empty-state">
				<view class="empty-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24">
						<path fill="#cccccc" d="M9.172 16.242a.997.997 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414L10 13.586l-2.828-2.829a1 1 0 0 0-1.414 1.414l3.414 3.414z"/>
						<path fill="#cccccc" d="M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20zm0-2a8 8 0 1 1 0-16a8 8 0 0 1 0 16z"/>
					</svg>
				</view>
				<view class="empty-text">没有找到符合条件的商贩</view>
			</view>
			
			<!-- 商贩卡片列表 -->
			<view v-else>
				<view v-for="(vendor, index) in filteredVendors" :key="index" class="vendor-card" @click="viewVendorDetail(vendor.vendorId)">
					<view class="vendor-avatar">
						<image class="avatar-image" :src="vendor.vendorPic || '../../../static/avatar/avatar.png'" mode="aspectFill"></image>
					</view>
					<view class="vendor-info">
						<view class="vendor-name">{{vendor.vendorName}}</view>
						<view class="vendor-details">
							<view class="vendor-id">ID: {{vendor.vendorId}}</view>
							<view class="vendor-phone">电话: {{vendor.phone}}</view>
						</view>
					</view>
					<view class="vendor-status">
						<view class="status-tag" :class="{ 'certified': vendor.certificationStatus === '已认证', 'uncertified': vendor.certificationStatus !== '已认证' }">
							{{vendor.certificationStatus || '未认证'}}
						</view>
						<view v-if="vendor.hasBooth" class="status-tag has-booth">有摊位</view>
					</view>
					<view class="vendor-arrow">
						<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
							<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
						</svg>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vendors: [], // 存储所有商贩数据
				filteredVendors: [], // 筛选后的商贩数据
				searchQuery: '', // 搜索关键词
				currentFilter: 'all', // 当前筛选条件: all/certified/uncertified/hasBooth
				token: '',
				isSelectMode: false
			}
		},
		onLoad(option) {
			this.getVendorsList();
			// 检查是否是选择模式
			this.isSelectMode = option && option.select === 'true';
		},
		onPullDownRefresh() {
			this.getVendorsList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			getVendorsList() {
				const token = uni.getStorageSync("inspector_token");
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				
				uni.showLoading({
					title: '加载中...'
				});
				
				uni.request({
					url: `${uni.$baseUrl}/vendor/getAllVendors`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: res => {
						uni.hideLoading();
						if (res.data.success) {
							this.vendors = res.data.data;
							// 初始化筛选结果
							this.applyFilters();
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.message || "获取商贩列表失败",
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: "网络请求失败",
						});
					}
				});
			},
			filterVendors() {
				// 应用搜索和筛选条件
				this.applyFilters();
			},
			setFilter(filter) {
				this.currentFilter = filter;
				this.applyFilters();
			},
			applyFilters() {
				// 应用搜索和筛选逻辑
				let results = [...this.vendors];
				
				// 应用搜索关键词
				if (this.searchQuery.trim()) {
					const query = this.searchQuery.toLowerCase();
					results = results.filter(vendor => 
						vendor.vendorName.toLowerCase().includes(query) || 
						vendor.vendorId.toString().includes(query) ||
						(vendor.phone && vendor.phone.includes(query))
					);
				}
				
				// 应用筛选条件
				switch(this.currentFilter) {
					case 'certified':
						results = results.filter(vendor => vendor.certificationStatus === '已认证');
						break;
					case 'uncertified':
						results = results.filter(vendor => vendor.certificationStatus !== '已认证');
						break;
					case 'hasBooth':
						results = results.filter(vendor => vendor.hasBooth);
						break;
					// 'all' 不需要额外筛选
				}
				
				this.filteredVendors = results;
			},
			viewVendorDetail(vendorId) {
				if (this.isSelectMode) {
					// 在选择模式下，获取商贩详细信息并返回
					const selectedVendor = this.vendors.find(v => v.vendorId === vendorId);
					if (selectedVendor) {
						const eventChannel = this.getOpenerEventChannel();
						eventChannel.emit('selectVendor', selectedVendor);
						uni.navigateBack();
					}
					return;
				}
				
				// 普通模式下，跳转到商贩详情页
				uni.navigateTo({
					url: `/pages/inspector/vendorDetail/vendorDetail?vendorId=${vendorId}`,
					fail(e) {
						console.log("导航错误", e)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
		padding-bottom: 30rpx;
	}

	.top {
		height: 250rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 180rpx;
			width: 100%;
			box-shadow: 0 4rpx 12rpx rgba(81, 153, 255, 0.2);
		}
	}
	
	.search-container {
		padding: 0 30rpx;
		margin-top: -120rpx;
		position: relative;
		z-index: 10;
		
		.search-box {
			background-color: #fff;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.search-icon {
				margin-right: 20rpx;
			}
			
			.search-input {
				flex: 1;
				height: 60rpx;
				font-size: 28rpx;
			}
		}
	}
	
	.filter-options {
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
		
		.filter-item {
			padding: 15rpx 30rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
			background-color: #f0f0f0;
			color: #666;
			
			&.active {
				background-color: #5199ff;
				color: #fff;
			}
		}
	}
	
	.vendor-list {
		padding: 0 30rpx;
		
		.section-header {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 20rpx 0 40rpx;
			
			.header-line {
				flex: 1;
				height: 1px;
				background-color: #eaeaea;
			}
			
			.header-text {
				margin: 0 20rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
			}
		}
		
		.empty-state {
			padding: 100rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			.empty-icon {
				margin-bottom: 30rpx;
			}
			
			.empty-text {
				color: #999;
				font-size: 28rpx;
			}
		}
		
		.vendor-card {
			background-color: #fff;
			border-radius: 16px;
			padding: 30rpx;
			margin-bottom: 30rpx;
			display: flex;
			align-items: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
			
			.vendor-avatar {
				width: 120rpx;
				height: 120rpx;
				margin-right: 30rpx;
				
				.avatar-image {
					width: 100%;
					height: 100%;
					border-radius: 60rpx;
				}
			}
			
			.vendor-info {
				flex: 1;
				
				.vendor-name {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				
				.vendor-details {
					font-size: 24rpx;
					color: #999;
					
					.vendor-id, .vendor-phone {
						margin-bottom: 6rpx;
					}
				}
			}
			
			.vendor-status {
				margin-right: 20rpx;
				
				.status-tag {
					font-size: 22rpx;
					padding: 6rpx 16rpx;
					border-radius: 20rpx;
					margin-bottom: 10rpx;
					text-align: center;
					
					&.certified {
						background-color: #e6f7e6;
						color: #52c41a;
					}
					
					&.uncertified {
						background-color: #fff2e8;
						color: #fa8c16;
					}
					
					&.has-booth {
						background-color: #e6f7ff;
						color: #1890ff;
					}
				}
			}
			
			.vendor-arrow {
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style> 