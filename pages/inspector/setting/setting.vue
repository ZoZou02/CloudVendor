<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 标题 -->
		<view class="page-title">
			<text>系统设置</text>
		</view>
		
		<!-- 设置卡片 -->
		<view class="setting-card">
			<view class="card">
				<!-- 账户设置 -->
				<view class="setting-group">
					<view class="group-header">
						<view class="header-line"></view>
						<view class="header-text">账户设置</view>
						<view class="header-line"></view>
					</view>
					
					<view class="setting-item" @click="toEditProfile">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
								</svg>
							</view>
							<view class="item-text">编辑个人资料</view>
						</view>
						<view class="item-right">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
							</svg>
						</view>
					</view>
					
					<view class="setting-item" @click="toEditAvatar">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
								</svg>
							</view>
							<view class="item-text">修改头像</view>
						</view>
						<view class="item-right">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
							</svg>
						</view>
					</view>
					
					<view class="setting-item" @click="changePassword">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
								</svg>
							</view>
							<view class="item-text">修改密码</view>
						</view>
						<view class="item-right">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
							</svg>
						</view>
					</view>
				</view>
				
				<!-- 系统设置 -->
				<view class="setting-group">
					<view class="group-header">
						<view class="header-line"></view>
						<view class="header-text">系统设置</view>
						<view class="header-line"></view>
					</view>
					
					<view class="setting-item">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
								</svg>
							</view>
							<view class="item-text">消息通知</view>
						</view>
						<view class="item-right">
							<switch color="#5199ff" :checked="notificationEnabled" @change="toggleNotification"/>
						</view>
					</view>
					
					<view class="setting-item">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M13.25 16.74c0 .69-.53 1.26-1.25 1.26c-.7 0-1.26-.56-1.26-1.26c0-.71.56-1.25 1.26-1.25c.71 0 1.25.55 1.25 1.25zM11.99 6c-1.77 0-2.98 1.15-3.43 2.49l1.64.69c.22-.67.74-1.48 1.8-1.48c1.62 0 1.94 1.21 1.85 1.87c-.09.6-.35 1.06-1.04 1.44c-.63.36-1.56.76-2.29 1.81c-.19.28-.39.65-.39 1.18h1.76c0-.93 2.05-1.44 2.05-3.43c0-1.45-.85-2.76-2.56-2.76c-.36 0-.68.06-.94.15l-.17-.57c.5-.24.9-.39 1.43-.39c1.43 0 2.32.76 2.32 2.27c0 .94-.35 1.38-.35 2.28c0 .36.1.73.25 1.01h1.95c-.12-.34-.23-.72-.23-1.1c0-1.53.89-2.2 1.43-2.86c.41-.51.64-1.12.64-1.74c0-1.25-1.06-2.75-3.25-2.75z"/>
								</svg>
							</view>
							<view class="item-text">帮助与反馈</view>
						</view>
						<view class="item-right">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
							</svg>
						</view>
					</view>
					
					<view class="setting-item">
						<view class="item-left">
							<view class="item-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"/>
								</svg>
							</view>
							<view class="item-text">关于我们</view>
						</view>
						<view class="item-right">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
							</svg>
						</view>
					</view>
				</view>
				
				<!-- 退出登录 -->
				<view class="logout-button" @click="logout">
					退出登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				notificationEnabled: true
			}
		},
		methods: {
			toEditProfile() {
				uni.navigateTo({
					url: '/pages/inspector/editProfile/editProfile'
				})
			},
			toEditAvatar() {
				uni.navigateTo({
					url: '/pages/inspector/editAvatar/editAvatar'
				})
			},
			changePassword() {
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				})
			},
			toggleNotification(e) {
				this.notificationEnabled = e.detail.value;
				uni.showToast({
					title: this.notificationEnabled ? '已开启通知' : '已关闭通知',
					icon: 'none'
				})
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('inspector_token');
							uni.reLaunch({
								url: '/pages/inspector/login/login'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
		padding-bottom: 40rpx;
	}

	.top {
		height: 180rpx;
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
	
	.page-title {
		position: relative;
		z-index: 10;
		text-align: center;
		padding: 30rpx 0;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}
	
	.setting-card {
		padding: 0 30rpx;
		
		.card {
			background-color: #fff;
			border-radius: 16px;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.setting-group {
				padding: 30rpx;
				
				.group-header {
					display: flex;
					align-items: center;
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
				
				.setting-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 24rpx 0;
					border-bottom: 1px solid #f5f5f5;
					
					&:last-child {
						border-bottom: none;
					}
					
					.item-left {
						display: flex;
						align-items: center;
						
						.item-icon {
							margin-right: 20rpx;
							display: flex;
							align-items: center;
						}
						
						.item-text {
							font-size: 30rpx;
							color: #333;
						}
					}
					
					.item-right {
						display: flex;
						align-items: center;
					}
				}
			}
			
			.logout-button {
				margin: 30rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background-color: #fff;
				color: #f5222d;
				border: 1px solid #f5222d;
				border-radius: 45rpx;
				font-size: 32rpx;
			}
		}
	}
</style> 