<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 商贩信息卡片 -->
		<view class="vendor-card">
			<view class="card">
				<!-- 商贩头像/图片 -->
				<view class="vendor-image-section">
					<image class="vendor-image" :src="vendorPic" mode="aspectFill"></image>
				</view>
				
				<!-- 商贩信息内容 -->
				<view class="vendor-section">
					<view class="vendor-group">
						<view class="vendor-header">
							<view class="header-line"></view>
							<view class="header-text">商贩信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 商贩ID -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">商贩ID</view>
									<view class="vendor-value">{{vendorInfo.vendorId}}</view>
								</view>
							</view>
						</view>
						
						<!-- 商贩名称 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">商贩名称</view>
									<view class="vendor-value">{{vendorInfo.vendorName}}</view>
								</view>
							</view>
						</view>
						
						<!-- 联系电话 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">联系电话</view>
									<view class="vendor-value">{{vendorInfo.phone}}</view>
								</view>
							</view>
						</view>
						
						<!-- 认证状态 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">认证状态</view>
									<view class="vendor-value">{{vendorInfo.certificationStatus || '未认证'}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 摊位信息部分 -->
				<view v-if="boothInfo.boothId" class="booth-section">
					<view class="vendor-group">
						<view class="vendor-header">
							<view class="header-line"></view>
							<view class="header-text">摊位信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 摊位ID -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">摊位ID</view>
									<view class="vendor-value">{{boothInfo.boothId}}</view>
								</view>
							</view>
						</view>
						
						<!-- 摊位名称 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M13 16v5h-2v-5H9l3-3l3 3h-2zm-7 1c0 1.1.9 2 2 2h2v-2H8v-9h8v9h-2v2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">摊位名称</view>
									<view class="vendor-value">{{boothInfo.boothName}}</view>
								</view>
							</view>
						</view>
						
						<!-- 经营类别 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67c0-.84.79-1.43 2.1-1.43c1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81c0 1.79 1.49 2.69 3.66 3.21c1.95.46 2.34 1.15 2.34 1.87c0 .53-.39 1.39-2.1 1.39c-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77c-.01-2.2-1.9-2.96-3.66-3.42z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">经营类别</view>
									<view class="vendor-value">{{boothInfo.type}}</view>
								</view>
							</view>
						</view>
						
						<!-- 营业时间 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">营业时间</view>
									<view class="vendor-value">{{formatTime(boothInfo.startTime)}}~{{formatTime(boothInfo.endTime)}}</view>
								</view>
							</view>
						</view>
						
						<!-- 摊位位置 -->
						<view class="vendor-item">
							<view class="vendor-item-content">
								<view class="vendor-item-left">
									<view class="vendor-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"/>
										</svg>
									</view>
								</view>
								<view class="vendor-item-center">
									<view class="vendor-label">摊位位置</view>
									<view class="vendor-value">{{boothInfo.location || '未设置'}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 无摊位提示 -->
				<view v-else class="no-booth-tip">
					<text>该商贩暂未申请摊位</text>
				</view>
				
				<!-- 操作按钮 -->
				<view class="button-section">
					<button class="action-button" @click="contactVendor">联系商贩</button>
					<button v-if="boothInfo.boothId" class="action-button" @click="viewBoothLocation">查看摊位位置</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vendorPic: "../../../static/avatar/avatar.png",
				vendorInfo: {},
				boothInfo: {},
				vendorId: '',
				token: "",
			}
		},
		onLoad(option) {
			if (option.vendorId) {
				this.vendorId = option.vendorId;
				this.getVendorInfo(this.vendorId);
				this.getBoothInfo(this.vendorId);
			} else {
				uni.showToast({
					icon: "none",
					title: "未获取到商贩ID",
				});
			}
		},
		methods: {
			formatTime(time) {
				return time ? time.substring(0, 5) : '';
			},
			getVendorInfo(vendorId) {
				const token = uni.getStorageSync("inspector_token")
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				
				uni.request({
					url: `${uni.$baseUrl}/vendor/getVendorInfo/${vendorId}`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data.success) {
							this.vendorInfo = res.data.data;
							
							// 设置商贩头像
							if (this.vendorInfo.vendorPic != null && this.vendorInfo.vendorPic != "") {
								this.vendorPic = this.vendorInfo.vendorPic;
							}
							this.token = token;
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.message || "获取商贩信息失败",
							});
						}
					},
					fail: () => {
						uni.showToast({
							icon: "none",
							title: "网络请求失败",
						});
					}
				});
			},
			getBoothInfo(vendorId) {
				const token = uni.getStorageSync("inspector_token")
				
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothByVendorId/${vendorId}`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data.success) {
							this.boothInfo = res.data.data;
						} else {
							console.log("该商贩暂未拥有摊位");
							this.boothInfo = {};
						}
					}
				});
			},
			contactVendor() {
				// 实现联系商贩功能
				if (this.vendorInfo.phone) {
					uni.makePhoneCall({
						phoneNumber: this.vendorInfo.phone,
						fail() {
							uni.showToast({
								title: '拨打电话失败',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: '未获取到联系电话',
						icon: 'none'
					});
				}
			},
			viewBoothLocation() {
				// 跳转到地图查看摊位位置
				if (this.boothInfo.boothId) {
					uni.navigateTo({
						url: `/pages/inspector/map/map?boothId=${this.boothInfo.boothId}`,
						fail(e) {
							console.log("导航错误", e)
						}
					});
				} else {
					uni.showToast({
						title: '未获取到摊位信息',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
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

	.vendor-card {
		padding: 0 30rpx;
		margin-top: -100rpx;
		position: relative;
		z-index: 10;
		
		.card {
			background-color: #fff;
			border-radius: 16px;
			padding: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.vendor-image-section {
				display: flex;
				justify-content: center;
				margin-bottom: 30rpx;
				
				.vendor-image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 90rpx;
					border: 4rpx solid #5199ff;
				}
			}
			
			.vendor-section, .booth-section {
				margin-bottom: 30rpx;
				
				.vendor-group {
					.vendor-header {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 30rpx;
						
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
					
					.vendor-item {
						margin-bottom: 20rpx;
						
						.vendor-item-content {
							display: flex;
							padding: 20rpx 0;
							border-bottom: 1px solid #f5f5f5;
							
							.vendor-item-left {
								width: 80rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								
								.vendor-icon {
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
							
							.vendor-item-center {
								flex: 1;
								
								.vendor-label {
									font-size: 28rpx;
									color: #666;
									margin-bottom: 8rpx;
								}
								
								.vendor-value {
									font-size: 32rpx;
									color: #333;
									word-break: break-all;
								}
							}
						}
						
						&:last-child {
							.vendor-item-content {
								border-bottom: none;
							}
						}
					}
				}
			}
			
			.no-booth-tip {
				text-align: center;
				padding: 30rpx 0;
				color: #999;
				font-size: 28rpx;
			}
			
			.button-section {
				margin-top: 40rpx;
				
				.action-button {
					background-color: #5199ff;
					color: #fff;
					border-radius: 50rpx;
					height: 90rpx;
					line-height: 90rpx;
					font-size: 32rpx;
					margin-bottom: 20rpx;
					border: none;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					&:after {
						border: none;
					}
				}
			}
		}
	}
</style>