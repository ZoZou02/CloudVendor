<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 摊位信息卡片 -->
		<view v-if="hasBooth" class="booth-card">
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
									<view class="booth-value">{{boothInfo.boothId}}</view>
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
									<view class="booth-value">{{boothInfo.boothName}}</view>
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
									<view class="booth-value">{{boothInfo.type}}</view>
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
									<view class="booth-value booth-description">{{boothInfo.description}}</view>
								</view>
							</view>
						</view>
						
						<!-- 营业时间 -->
						<view class="booth-item">
							<view class="booth-item-content">
								<view class="booth-item-left">
									<view class="booth-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
										</svg>
									</view>
								</view>
								<view class="booth-item-center">
									<view class="booth-label">营业时间</view>
									<view class="booth-value">{{formatTime(boothInfo.startTime)}}~{{formatTime(boothInfo.endTime)}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 审核状态提示 -->
				<view v-if="boothState.boothState === '审核'" class="review-tip">
					<text>摊位信息正在审核中，请耐心等待...</text>
				</view>
				
				<view v-if="boothState.boothState === '驳回'" class="reject-container">
					<view class="reject-tip">
						<text>很抱歉，您的申请未通过审核</text>
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="button-section" v-if="boothState.boothState !== '审核'">
					<button v-if="boothState.boothState !== '驳回'" class="action-button" @click="getQrCode">获取摊位码</button>
					<button class="action-button" :class="{'primary-button': boothState.boothState === '驳回'}" @click="toEditBooth">
						{{boothState.boothState === '驳回' ? '重新申请' : '编辑摊位'}}
					</button>
				</view>
			</view>
		</view>
		
		<!-- 无摊位时的欢迎卡片 -->
		<view v-else class="booth-card">
			<view class="card welcome-card">
				<view class="welcome-title">欢迎加入</view>
				
				<view class="welcome-section">
					<view class="welcome-header">
						<view class="header-line"></view>
						<view class="header-text">您将获得</view>
						<view class="header-line"></view>
					</view>
					
					<view class="benefit-item">
						<view class="benefit-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
								<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
							</svg>
						</view>
						<view class="benefit-text">流动商贩的咨询动态</view>
					</view>
					
					<view class="benefit-item">
						<view class="benefit-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
								<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
							</svg>
						</view>
						<view class="benefit-text">合法合规的摆摊地点</view>
					</view>
					
					<view class="benefit-item">
						<view class="benefit-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
								<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
							</svg>
						</view>
						<view class="benefit-text">相关法律法规的公告</view>
					</view>
				</view>
				
				<view class="button-section">
					<button class="action-button primary-button" @click="toAddBooth">申请摊位</button>
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
				boothBackGround: "../../../static/booth/boothBG.jpg",
				boothInfo: {},
				boothState: {},
				token: "",
				hasBooth: false,
			}
		},
		onLoad() {
			this.getBoothInfo(),
			this.getBoothState()
		},
		methods: {
			formatTime(time) {
				return time ? time.substring(0, 5) : '';
			},
			getBoothState() {
				const token = uni.getStorageSync("token")

				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothState`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: (res) => {
						this.boothState=res.data.data
						console.log("摊位状态", this.boothState)
					}
				})
			},
			getBoothInfo() {
				const token = uni.getStorageSync("token")
				console.log("token：" + token)
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				uni.request({
					url: `${uni.$baseUrl}/booth/showBooth`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						if (res.data.success) {
							console.log(res.data);
							//摊位信息
							this.boothInfo = res.data.data
							//摊位照片
							if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
								this.boothPic = this.boothInfo.boothPic
							}
							console.log('pic', this.boothPic)
							//token
							this.token = token
							//设置是否拥有摊位
							this.hasBooth = true
						} else {
							console.log("该摊主尚未拥有摊位")
							this.hasBooth = false
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getQrCode() {
				uni.navigateTo({
					url: '/pages/vendor/QrCode/QrCode',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toEditBooth() {
				uni.navigateTo({
					url: '/pages/vendor/editBooth/editBooth',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toAddBooth() {
				uni.navigateTo({
					url: '/pages/vendor/addBooth/addBooth',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/vendor/login/login',
					fail(e) {
						console.log("错误", e)
					}
				})
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
			
			&.welcome-card {
				padding-top: 40rpx;
			}
			
			.booth-image-section {
				margin-bottom: 30rpx;
				
				.booth-image {
					width: 100%;
					height: 380rpx;
					border-radius: 12rpx;
				}
			}
			
			.welcome-title {
				font-size: 40rpx;
				color: #333;
				text-align: center;
				font-weight: 600;
				margin-bottom: 40rpx;
			}
			
			.booth-section, .welcome-section {
				.booth-group {
					margin-bottom: 30rpx;
					
					.booth-header, .welcome-header {
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
								}
								
								.booth-description {
									line-height: 1.5;
								}
							}
						}
					}
				}
				
				.benefit-item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					
					.benefit-icon {
						margin-right: 15rpx;
						display: flex;
						align-items: center;
					}
					
					.benefit-text {
						font-size: 30rpx;
						color: #666;
					}
				}
			}
			
			.review-tip {
				margin-top: 20rpx;
				text-align: center;
				padding: 20rpx;
				color: #ff9900;
				font-size: 28rpx;
				background-color: #fffbf0;
				border-radius: 8rpx;
			}
			
			.reject-container {
				margin-top: 20rpx;
				text-align: center;
				padding: 20rpx;
				color: #ff4d4f;
				font-size: 28rpx;
				background-color: #fff1f0;
				border-radius: 8rpx;
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
					
					&.primary-button {
						background-color: #5199ff;
						color: #fff;
						box-shadow: 0 6rpx 15rpx rgba(81, 153, 255, 0.3);
					}
				}
				
				button:only-child {
					width: 80%;
				}
			}
		}
	}
</style>