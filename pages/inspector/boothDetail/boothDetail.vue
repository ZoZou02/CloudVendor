<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 摊位信息卡片 -->
		<view class="booth-card">
			<view class="card">
				<!-- 摊位头像/图片 -->
				<view class="booth-image-section">
					<image class="booth-image" :src="boothPic" mode="aspectFill"></image>
				</view>
				
				<!-- 摊位信息内容 -->
				<view class="booth-section">
					<view class="booth-group">
						<view class="booth-header">
							<view class="header-line"></view>
							<view class="header-text">摊位信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 摊位ID -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">摊位ID</view>
									<view class="booth-value">{{boothInfo.booth.boothId}}</view>
								</view>
							</view>
						</view>
						
						<!-- 摊位名称 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M13 16v5h-2v-5H9l3-3l3 3h-2zm-7 1c0 1.1.9 2 2 2h2v-2H8v-9h8v9h-2v2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">摊位名称</view>
									<view class="booth-value">{{boothInfo.booth.boothName}}</view>
								</view>
							</view>
						</view>
						
						<!-- 经营类别 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67c0-.84.79-1.43 2.1-1.43c1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81c0 1.79 1.49 2.69 3.66 3.21c1.95.46 2.34 1.15 2.34 1.87c0 .53-.39 1.39-2.1 1.39c-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77c-.01-2.2-1.9-2.96-3.66-3.42z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">经营类别</view>
									<view class="booth-value">{{boothInfo.booth.type}}</view>
								</view>
							</view>
						</view>
						
						<!-- 描述 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 17h16v2H4zm13-7H7v-2h10zm-4 4H7v-2h6zm1-12H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V6l-6-6zm4 18H6V4h7v5h5v11z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">描述</view>
									<view class="booth-value booth-description">{{boothInfo.booth.description}}</view>
								</view>
							</view>
						</view>
						
						<!-- 营业时间 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">营业时间</view>
									<view class="booth-value">{{formatTime(boothInfo.booth.startTime)}}~{{formatTime(boothInfo.booth.endTime)}}</view>
								</view>
							</view>
						</view>
						
						<!-- 商贩信息 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">商贩姓名</view>
									<view class="booth-value">{{vendorInfo.vendorName || '未知'}}</view>
								</view>
							</view>
						</view>
						
						<!-- 联系电话 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">联系电话</view>
									<view class="booth-value">{{vendorInfo.phone || '未知'}}</view>
								</view>
							</view>
						</view>
						
						<!-- 摊位状态 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">摊位状态</view>
									<view class="booth-value" :class="{
										'status-approved': boothInfo.state && boothInfo.state.boothState === '通过',
										'status-pending': boothInfo.state && boothInfo.state.boothState === '审核',
										'status-rejected': boothInfo.state && boothInfo.state.boothState === '驳回'
									}">{{boothInfo.state && boothInfo.state.boothState || '未知'}}</view>
								</view>
							</view>
						</view>
						
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="button-section">
					<button class="action-button" @click="contactVendor">联系商贩</button>
					<button class="action-button" @click="registerViolation">违规登记</button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				boothPic: "../../../static/booth/booth.jpg",
				boothInfo: {
					state: {},
					booth: {}
				},
				vendorInfo: {},
				boothId: null,
				showRejectReason: false,
				rejectReason: "",
			}
		},
		onLoad(options) {
			if (options.boothId) {
				this.boothId = options.boothId;
				this.getBoothInfo();
			} else {
				uni.showToast({
					icon: "none",
					title: "未获取到摊位ID",
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		methods: {
			formatTime(time) {
				return time ? time.substring(0, 5) : '';
			},
			getBoothInfo() {
				const token = uni.getStorageSync("inspector_token");
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				
				uni.request({
					url: `${uni.$baseUrl}/admin/boothDetail`,
					method: 'GET',
					data: {
						boothId: this.boothId
					},
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data.success) {
							this.boothInfo = res.data.data;
							console.log("摊位信息", this.boothInfo);
							// 获取摊位照片
							if (this.boothInfo.booth.boothPic != null && this.boothInfo.booth.boothPic != "") {
								this.boothPic = this.boothInfo.booth.boothPic;
							}
							
							// 获取商贩信息
							this.getVendorInfo(this.boothInfo.vendorId);
							// 通过摊位ID获取摊主信息
							this.getVendorDetail();
						} else {
							uni.showToast({
								icon: "none",
								title: "获取摊位信息失败",
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
			getVendorInfo(vendorId) {
				if (!vendorId) return;
				
				const token = uni.getStorageSync("inspector_token");
				uni.request({
					url: `${uni.$baseUrl}/vendor/getVendorById/${vendorId}`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data.success) {
							this.vendorInfo = res.data.data;
						}
					}
				});
			},
			// 通过摊位ID获取摊主信息
			getVendorDetail() {
				if (!this.boothId) return;
				
				const token = uni.getStorageSync("inspector_token");
				uni.request({
					url: `${uni.$baseUrl}/admin/boothVendorDetail`,
					method: 'GET',
					data: {
						boothId: this.boothId
					},
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data && res.data.data) {
							const vendorInfo = res.data.data;
							this.vendorInfo = {
								...this.vendorInfo,
								vendorName: vendorInfo.vendorName || '无',
								phone: vendorInfo.phone || '无',
								category: vendorInfo.category || '无'
							};
						}
					},
					fail: err => {
						console.error('获取摊主信息失败', err);
						uni.showToast({
							title: '获取摊主信息失败',
							icon: 'none'
						});
					}
				});
			},
			contactVendor() {
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
			viewLocation() {
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
						title: '未获取到摊位位置信息',
						icon: 'none'
					});
				}
			},
			registerViolation() {
				// 跳转到违规登记页面并传递摊位信息
				if (this.boothInfo.booth && this.boothInfo.booth.boothId) {
					uni.navigateTo({
						url: `/pages/inspector/violation/violation?fromBooth=true&id=${this.boothInfo.booth.id}&boothId=${this.boothInfo.booth.boothId}&boothName=${encodeURIComponent(this.boothInfo.booth.boothName || '')}&vendorId=${this.boothInfo.vendorId || ''}&vendorName=${encodeURIComponent(this.vendorInfo.vendorName || '')}&boothType=${encodeURIComponent(this.boothInfo.booth.type || '')}`,
						fail(e) {
							console.log("导航错误", e)
						}
					});
				} else {
					uni.showToast({
						title: '未获取到完整摊位信息',
						icon: 'none'
					});
				}
			},
			toggleRejectReason() {
				this.showRejectReason = !this.showRejectReason;
			},
			approveBooth() {
				const token = uni.getStorageSync("inspector_token");
				uni.showModal({
					title: '确认通过',
					content: '确定要通过该摊位申请吗？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: `${uni.$baseUrl}/booth/approveBooth/${this.boothId}`,
								method: 'POST',
								header: {
									'Authorization': token
								},
								success: result => {
									if (result.data.success) {
										uni.showToast({
											title: '已通过申请',
											icon: 'success'
										});
										setTimeout(() => {
											this.getBoothInfo();
										}, 1500);
									} else {
										uni.showToast({
											title: result.data.message || '操作失败',
											icon: 'none'
										});
									}
								},
								fail: () => {
									uni.showToast({
										title: '网络请求失败',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
	}
	
	.top {
		height: 180rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 100rpx;
			width: 100%;
		}
	}
	
	.booth-card {
		padding: 0 30rpx;
		
		.card {
			position: relative;
			bottom: 62px;
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
			padding: 30rpx;
			
			.booth-image-section {
				margin-bottom: 30rpx;
				
				.booth-image {
					width: 100%;
					height: 380rpx;
					border-radius: 12rpx;
				}
			}
			
			.booth-section {
				.booth-group {
					margin-bottom: 30rpx;
					
					.booth-header {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 20rpx;
						
						.header-line {
							flex: 1;
							height: 2rpx;
							background-color: #eeeeee;
						}
						
						.header-text {
							font-size: 28rpx;
							color: #666;
							padding: 0 20rpx;
						}
					}
					
					.booth-item {
						padding: 24rpx 0;
						border-bottom: 1px solid #f5f5f5;
						
						&:last-child {
							border-bottom: none;
						}
						
						.booth-item-content {
							display: flex;
							
							.booth-item-left {
								width: 10%;
								display: flex;
								align-items: center;
								justify-content: center;
								
								.booth-icon {
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
							
							.booth-item-center {
								width: 90%;
								padding-left: 20rpx;
								
								.booth-label {
									font-size: 26rpx;
									color: #999;
									margin-bottom: 10rpx;
								}
								
								.booth-value {
									font-size: 32rpx;
									color: #333;
									font-weight: 500;
									
									&.status-approved {
										color: #52c41a;
									}
									
									&.status-pending {
										color: #faad14;
									}
									
									&.status-rejected {
										color: #f5222d;
									}
								}
								
								.booth-description {
									line-height: 1.5;
								}
							}
						}
					}
				}
			}
			
			.button-section {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-around;
				
				.action-button {
					width: 45%;
					height: 90rpx;
					line-height: 90rpx;
					background-color: #5199ff;
					color: #fff;
					font-size: 30rpx;
					border-radius: 45rpx;
					text-align: center;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				}
			}
			
			.review-section {
				margin-top: 40rpx;
				border-top: 1px solid #f0f0f0;
				padding-top: 30rpx;
				
				.review-header {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 20rpx;
					
					.header-line {
						flex: 1;
						height: 2rpx;
						background-color: #eeeeee;
					}
					
					.header-text {
						font-size: 28rpx;
						color: #666;
						padding: 0 20rpx;
					}
				}
				
				.review-form {
					.review-message {
						padding: 20rpx;
						background-color: #f6f6f6;
						border-radius: 8rpx;
						text-align: center;
						margin-bottom: 20rpx;
						
						text {
							font-size: 28rpx;
							color: #666;
						}
					}
					
					.reject-reason {
						margin: 20rpx 0;
						
						.reason-label {
							font-size: 28rpx;
							color: #666;
							margin-bottom: 10rpx;
							display: block;
						}
						
						.reason-input {
							width: 100%;
							height: 180rpx;
							background-color: #f9f9f9;
							border-radius: 8rpx;
							padding: 20rpx;
							font-size: 28rpx;
							box-sizing: border-box;
						}
					}
					
					.review-buttons {
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;
						
						.approve-button, .reject-button {
							width: 48%;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
							border-radius: 40rpx;
							font-size: 28rpx;
						}
						
						.approve-button {
							background-color: #52c41a;
							color: #fff;
						}
						
						.reject-button {
							background-color: #f5f5f5;
							color: #ff4d4f;
							border: 1px solid #ff4d4f;
							
							&.active {
								background-color: #fff1f0;
							}
						}
					}
					
					.submit-reject {
						width: 100%;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						border-radius: 40rpx;
						font-size: 28rpx;
						margin-top: 20rpx;
						background-color: #ff4d4f;
						color: #fff;
					}
				}
			}
		}
	}
</style> 