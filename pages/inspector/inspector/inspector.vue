<template>
	<view class="page">
		<view class="top">
			<view class="background"></view>
		</view>

		<view class="user-card">
			<view class="card">
				<view class="top-section">
					<view class="userImage">
						<image :src="userInfo.inspectorPic || '../../../static/avatar/avatar.png'" mode="aspectFill"></image>
					</view>
				</view>

				<view class="bottom-section">
					<view class="info-section">
						<view class="user-name">
							<view class="name-text">{{ token ? userInfo.inspectorName : '点击登录' }}</view>
						</view>
						<view class="user-id">ID: {{userInfo.inspectorId || '未登录'}}</view>
						<!-- <view class="user-phone">电话: {{userInfo.phone || '未登录'}}</view> -->
					</view>
				</view>
			</view>
		</view>

		<view class="function-grid">

			<view class="function-box" @click="token ? toVendorList() : toLogin()">
				<view class="function-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
						<path fill="#5199ff" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/>
					</svg>
				</view>
				<view class="function-title">商贩管理</view>
			</view>

			<view class="function-box" @click="token ? toMessage() : toLogin()">
				<view class="function-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.586l-3.707 3.707A1 1 0 0 1 6 17v-3H5a3 3 0 0 1-3-3V5zm20 4v6c0 1-.6 3-3 3h-1v3c0 .333-.2 1-1 1c-.203 0-.368-.043-.5-.113L12.613 18H9l3-3h3c1.333 0 4-.8 4-4V6c1 0 3 .6 3 3z" fill="#5199ff"/></g></svg>
				</view>
				<view class="function-title">通知</view>
			</view>
			
			<view class="function-box" @click="token ? toEditProfile() : toLogin()">
				<view class="function-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
						<path fill="#5199ff" d="M5 16.577V19h2.423l7.125-7.125l-2.423-2.423L5 16.577zm13.202-7.355l-1.425-1.424a1.003 1.003 0 0 0-1.418.001l-1.13 1.13l2.423 2.423l1.131-1.132a1 1 0 0 0-.001-1.417l.42-.581z"/>
					</svg>
				</view>
				<view class="function-title">编辑资料</view>
			</view>
		
			

		</view>

		<view class="logout-section">
			<view v-if="token" class="logout-button" @click="handleLogout">
				退出登录
			</view>
			<view v-if="!token" class="login-button" @click="toLogin">
				登录
			</view>
		</view>
		
		<inspector-tab-bar></inspector-tab-bar>
	</view>
</template>

<script>
	import inspectorTabBar from '@/components/inspectorTabBar.vue'
	
	export default {
		components: {
			inspectorTabBar
		},
		data() {
			return {
				token: '',
				userInfo: {
					inspectorId: null,
					inspectorName: '',
					phone: '',
					inspectorPic: '../../../static/avatar/default.png'
				}
			}
		},
		onShow() {
			this.initUserData();
		},
		onLoad() {
			this.initUserData();
		},
		methods: {
			initUserData() {
				const token = uni.getStorageSync('inspector_token');
				if (token) {
					this.token = token;
					console.log("token",token)
					this.fetchUserInfo(token);
				}
			},
			fetchUserInfo(token) {
				uni.request({
					url: `${uni.$baseUrl}/inspector/getInspectorInfo`,
					method: 'GET',
					header: { 'Authorization': token },
					success: (res) => {
						if (res.data?.data) {
							this.userInfo = res.data.data;
							if (!this.userInfo.inspectorPic) {
								this.userInfo.inspectorPic = '../../../static/avatar/default.png';
							}
						}
						console.log("城管信息",this.userInfo)
					},
					fail: (error) => {
						console.error('获取用户信息失败:', error);
					}
				});
			},
			clearUserData() {
				this.token = '';
				this.userInfo = {
					inspectorId: null,
					inspectorName: '',
					phone: '',
					inspectorPic: '../../../static/avatar/default.png'
				};
				uni.removeStorageSync('inspector_token');
			},
			handleLogout() {
				this.clearUserData();
				this.toIndex();
			},
			toLogin() {
				uni.navigateTo({ url: '/pages/inspector/login/login' });
			},
			toIndex() {
				uni.reLaunch({ url: '/pages/inspector/index/index' });
			},
			toVendorList() {
				uni.navigateTo({ url: '/pages/inspector/vendorList/vendorList' });
			},
			toMap() {
				uni.navigateTo({ url: '/pages/inspector/map/map' });
			},
			toBoothReview() {
				uni.navigateTo({ url: '/pages/inspector/boothReview/boothReview' });
			},
			toSetting() {
				uni.navigateTo({ url: '/pages/inspector/setting/setting' });
			},
			toEditProfile() {
				uni.navigateTo({ url: '/pages/inspector/editProfile/editProfile' });
			},
			toScanCode() {
				uni.navigateTo({ url: '/pages/inspector/scanQrCode/scanQrCode' });
			},
			toViolation() {
				uni.navigateTo({ url: '/pages/inspector/violation/violation' });
			},
			toMessage(){
				uni.navigateTo({ url: '/pages/inspector/message/message' });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
		padding-bottom: 100rpx; /* 为自定义tabBar预留空间 */
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

	.user-card {
		padding: 0 30rpx;
		
		.card {
			position: relative;
			margin-top: -150rpx;
			background-color: #ffffff;
			border-radius: 16px;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
			padding: 30rpx;
			
			.top-section {
				display: flex;
				justify-content: center;
				margin-bottom: 20rpx;
				
				.userImage {
					width: 160rpx;
					height: 160rpx;
					overflow: hidden;
					border-radius: 80rpx;
					border: 4rpx solid #5199ff;
					
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			
			.bottom-section {
				text-align: center;
				
				.info-section {
					margin-bottom: 20rpx;
					
					.user-name {
						margin-bottom: 10rpx;
						
						.name-text {
							font-size: 36rpx;
							font-weight: bold;
							color: #333;
						}
					}
					
					.user-id, .user-phone {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 8rpx;
					}
				}
			}
		}
	}

	.function-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 30rpx;
		justify-content: space-around;
		margin-top: 20rpx;
		
		.function-box {
			width: 31%;
			background-color: #fff;
			border-radius: 16px;
			padding: 30rpx 20rpx;
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
			
			.function-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 100rpx;
				background-color: rgba(81, 153, 255, 0.1);
				border-radius: 50%;
				margin-bottom: 20rpx;
			}
			
			.function-title {
				font-size: 28rpx;
				color: #333;
				text-align: center;
			}
		}
	}

	.logout-section {
		padding: 0 30rpx;
		margin-top: 40rpx;
		
		.logout-button, .login-button {
			background-color: #fff;
			color: #f5222d;
			border: 1px solid #f5222d;
			border-radius: 45rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 32rpx;
		}
		
		.login-button {
			background-color: #5199ff;
			color: #fff;
			border: none;
		}
	}
</style>