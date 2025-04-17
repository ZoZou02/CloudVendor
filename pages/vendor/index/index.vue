<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>

		<!-- 用户信息卡片 -->
		<view class="booth-card">
			<view class="card">
				<view class="booth-content">

					
					<view class="booth-name-row">
						<view class="icon-container">
							<image class="booth-icon" src="../../../static/myIcon/marker.png" mode="widthFix"></image>
						</view>
						<view class="name-container">
							<view class="booth-name">{{ boothInfo.boothName }}</view>
							<view class="status-tag">
								<image v-if="boothState.boothState === '营业中'" src="../../../static/myIcon/operate.png"
									mode="widthFix"></image>
								<image v-else src="../../../static/myIcon/break.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
					
					<view v-if="boothState.boothState === '审核'" class="review-tip">
						<text>摊位信息审核中...</text>
					</view>
					<view class="booth-info" v-else>
						<view class="info-item">
							<view class="info-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
								</svg>
							</view>
							<view class="info-text">摊位ID：{{ boothInfo.boothId }}</view>
						</view>
						<view class="info-item">
							<view class="info-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
								</svg>
							</view>
							<view class="info-text">营业时间：{{ formatTime(boothInfo.startTime) }}~{{ formatTime(boothInfo.endTime) }}</view>
						</view>
						<view class="info-item">
							<view class="info-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z"/>
								</svg>
							</view>
							<view class="info-text">摊位分数：<text :style="{ color: getScoreColor(boothState.boothPoint) }">{{ boothState.boothPoint || '暂无' }}</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 其他摊位列表 -->
		<view class="other-booths">
			<view class="section-header">
				<view class="header-line"></view>
				<view class="header-text">其他摊位</view>
				<view class="header-line"></view>
			</view>

			<view class="booth-list">
				<view v-for="booth in boothList" class="booth-item">
					<view class="booth-name">{{ booth.boothName }}</view>
					<view class="booth-details">
						<view class="detail-item">
							<view class="detail-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
								</svg>
							</view>
							<view class="detail-text">摊位ID：{{ booth.boothId }}</view>
						</view>
						<view class="detail-item">
							<view class="detail-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
								</svg>
							</view>
							<view class="detail-text">营业时间：{{ formatTime(booth.startTime) }}~{{ formatTime(booth.endTime) }}</view>
						</view>

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
			boothPic: "../../../static/booth/booth.jpg",
			boothInfo: {},
			boothState: {},
			boothList: {},
			token: "",
			startTime: "",
			endTime: "",
		}
	},
	onPullDownRefresh() {
		console.log("开启下拉刷新")
		setTimeout(function () {
			// uni.stopPullDownRefresh();
			window.location.reload()
		}, 1000)
	},
	onShow() { },
	onLoad() {
		// 检查inspector_token和token是否存在
		const inspector_token = uni.getStorageSync("inspector_token")
		const token = uni.getStorageSync("token")
		
		// 只有当存在inspector_token且不存在token时才跳转到城管端
		if (inspector_token && !token) {
			uni.reLaunch({
				url: '/pages/inspector/index/index'
			})
			return
		}
		
		// 如果摊主token为空，跳转到登录页面
		if (!token) {
			uni.navigateTo({
				url: '/pages/vendor/login/login'
			})
			return
		}
		
		this.getBoothInfo()
	},
	methods: {
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
					console.log("摊位信息", res.data);
					this.boothInfo = res.data.data
					this.token = token
					//获取摊位状态
					this.getBoothState()

					//获取其他摊位
					this.getBoothList()

					//摊位照片
					if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
						this.boothPic = this.boothInfo.boothPic
					}


				},
				fail: () => { },
				complete: () => { }
			});
		},
		getBoothState() {
			uni.request({
				url: `${uni.$baseUrl}/booth/getBoothState`,
				method: 'GET',
				data: {},
				header: {
					'Authorization': this.token
				},
				success: (res) => {
					this.boothState = res.data.data
					console.log("摊位状态", res.data)

				}
			})
		},
		getBoothList() {
			uni.request({
				url: `${uni.$baseUrl}/booth/getBoothList`,
				method: 'GET',
				data: {},
				header: {
					'Authorization': this.token
				},
				success: (res) => {
					// const list = res.data.data

					// for(let i = 0;i<list.length;i++ ){
					// 	if(list[i].id!=this.boothInfo.id){
					// 		// this.boothList=[...this.boothList,list[i]]
					// 	}
					// }

					// this.boothList=res.data.data
					const list = res.data.data;
					this.boothList = list.filter(item => item.id !== this.boothInfo.id);
					console.log("摊位列表", this.boothList);
					console.log("摊位列表", res.data.data)

				}
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/page/Vendor/login/login'
			});
		},
		getScoreColor(score) {
			if (!score || isNaN(score)) {
				return '#666666'; // 默认颜色
			}
			
			score = Number(score);
			if (score >= 80) {
				return '#4caf50'; // 绿色，优秀
			} else if (score >= 60) {
				return '#ff9800'; // 橙色，合格
			} else {
				return '#f44336'; // 红色，不合格
			}
		},
		formatTime(timeString) {
			if (!timeString) return '';
			// 如果时间格式为 HH:mm:ss，截取前5位只保留时和分
			if (timeString.length >= 5) {
				return timeString.substring(0, 5);
			}
			return timeString;
		},
	},
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

.booth-card {
	padding: 0 30rpx;
	
	.card {
		position: relative;
		bottom: 62px;
		background-color: #ffffff;
		border-radius: 15px;
		box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 30rpx;
		
		.booth-content {
			margin-top: 10rpx;
			
			.booth-header {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;
				
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
			
			.booth-name-row {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				
				.icon-container {
					margin-right: 20rpx;
					display: flex;
					align-items: center;
					
					.booth-icon {
						width: 100rpx;
						height: 100rpx;
					}
				}
				
				.name-container {
					display: flex;
					align-items: center;
					
					.booth-name {
						font-size: 38rpx;
						font-weight: 600;
						color: #333;
					}
					
					.status-tag {
						display: flex;
						align-items: center;
						margin-left: 20rpx;
						
						image {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}
			}
			
			.review-tip {
				margin: 20rpx 0;
				text-align: center;
				padding: 15rpx;
				color: #ff9900;
				font-size: 28rpx;
				background-color: #fffbf0;
				border-radius: 8rpx;
			}
			
			.booth-info {
				margin-top: 20rpx;
				
				.info-item {
					display: flex;
					align-items: center;
					margin-bottom: 15rpx;
					
					.info-icon {
						margin-right: 15rpx;
						display: flex;
						align-items: center;
					}
					
					.info-text {
						font-size: 28rpx;
						color: #666;
					}
				}
			}
		}
	}
}

.other-booths {
	padding: 0 30rpx;
	margin-top: -80rpx;
	
	.section-header {
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
			font-size: 32rpx;
			color: #333;
			font-weight: 600;
			padding: 0 20rpx;
		}
	}
	
	.booth-list {
		.booth-item {
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.05);
			padding: 25rpx;
			margin-bottom: 20rpx;
			
			.booth-name {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 15rpx;
			}
			
			.booth-details {
				.detail-item {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					.detail-icon {
						margin-right: 10rpx;
						display: flex;
						align-items: center;
					}
					
					.detail-text {
						font-size: 26rpx;
						color: #666;
					}
				}
			}
		}
	}
}
</style>
