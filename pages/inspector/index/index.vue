<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
			<view class="header-content">
				<view class="header-left">
					<text class="header-title">城市管理</text>
					<text class="header-date">{{currentDate}}</text>
				</view>
				<!-- 添加定位按钮 -->
				<view class="location-btn" @click="getLocation">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
						<path fill="#ffffff" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z"/>
					</svg>
					<text>{{locationText}}</text>
				</view>
			</view>
		</view>

		<!-- 工作数据统计 -->
		<view class="stats-section">
			<view class="stats-card">
				<view class="stats-item">
					<text class="stats-number">{{stats.vendors || 0}}</text>
					<text class="stats-label">商贩总数</text>
				</view>
				<view class="stats-divider"></view>
				<view class="stats-item">
					<text class="stats-number">{{stats.violations || 0}}</text>
					<text class="stats-label">本月违规</text>
				</view>
				<!-- <view class="stats-divider"></view>
				<view class="stats-item">
					<text class="stats-number">{{stats.scans || 0}}</text>
					<text class="stats-label">今日巡查</text>
				</view> -->
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="function-menu">
			<view class="section-header">
				<view class="header-line"></view>
				<view class="header-text">管理功能</view>
				<view class="header-line"></view>
			</view>

			<view class="menu-grid">
				<view class="menu-item" @click="toScanCode">
					<view class="menu-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="#5199ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 18v2h-2m2-6h-1l-2 2m-1 2h-2v2M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0v1h1v-1zm3-7h.001M7 7h.001M7 17h.001"/></svg>
					</view>
					<view class="menu-text">扫码检查</view>
				</view>
				<view class="menu-item" @click="toVendorList">
					<view class="menu-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
							<path fill="#5199ff" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/>
						</svg>
					</view>
					<view class="menu-text">商贩管理</view>
				</view>

				<!-- <view class="menu-item" @click="toMessage">
					<view class="menu-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.586l-3.707 3.707A1 1 0 0 1 6 17v-3H5a3 3 0 0 1-3-3V5zm20 4v6c0 1-.6 3-3 3h-1v3c0 .333-.2 1-1 1c-.203 0-.368-.043-.5-.113L12.613 18H9l3-3h3c1.333 0 4-.8 4-4V6c1 0 3 .6 3 3z" fill="#5199ff"/></g></svg>
	
					</view>
					<view class="menu-text">通知</view>
				</view> -->
				<view class="menu-item" @click="toViolation">
					<view class="menu-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
							<path fill="#5199ff" d="M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3zm-6.02-5L8.5 5.48L10.57 11H6.43zm15.16.59l-8.09 8.09L9.83 16l-1.41 1.41l5.09 5.09L23 13l-1.41-1.41z"/>
						</svg>
					</view>
					<view class="menu-text">违规登记</view>
				</view>
			</view>
		</view>

		<!-- 附近商贩 -->
		<view class="nearby-section">
			<view class="section-header">
				<view class="header-line"></view>
				<view class="header-text">附近摊位</view>
				<view class="header-line"></view>
			</view>

			<view class="nearby-vendors">
				<view v-if="nearbyBooths.length === 0" class="empty-message">
					附近暂无摊位信息
				</view>
				<scroll-view v-else scroll-x="true" class="nearby-scroll">
					<view class="nearby-items">
						<view v-for="(booth, index) in nearbyBooths" :key="index" class="nearby-vendor" @click="toBoothDetail(booth.boothId)">
							<image class="vendor-image" :src="booth.boothPic || '../../../static/avatar/avatar.png'" mode="aspectFill"></image>
							<view class="vendor-info">
								<view class="vendor-name">{{booth.boothName || '无名摊位'}}</view>
								<view class="vendor-state" :class="getStateClass(booth.state)">{{booth.state || '休息'}}</view>
								<view v-if="booth.distance > 0" class="vendor-distance">{{formatDistance(booth.distance)}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="view-more" @click="toMap">
					<text>查看地图</text>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
						<path fill="#5199ff" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 添加底部导航栏 -->
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
				inspectorPic: "../../../static/avatar/avatar.png",
				userInfo: {},
				token: "",
				currentDate: "",
				stats: {
					vendors: 0,
					violations: 0,
					scans: 0
				},
				taskList: [], // 今日任务列表
				nearbyBooths: [], // 附近摊位列表
				locationText: "定位", // 定位信息文本
				currentLocation: null // 当前位置信息
			}
		},
		onPullDownRefresh() {
			console.log("开启下拉刷新")
			setTimeout(function () {
				window.location.reload()
			}, 1000)
		},
		onShow() {
			this.getUserInfo()
			this.getStats()
			this.getNearbyBooths()
			this.getTasks()
		},
		onLoad() {
			this.getUserInfo()
			this.getStats()
			// 检查是否有位置信息缓存
			const cachedLocation = uni.getStorageSync('inspector_location');
			if (cachedLocation) {
				// 如果有缓存的位置信息，并且缓存时间不超过30分钟，则更新locationText
				const now = new Date().getTime();
				const cacheTime = cachedLocation.timestamp;
				if (now - cacheTime < 30 * 60 * 1000) { // 30分钟缓存有效期
					this.locationText = "已定位";
					this.currentLocation = {
						latitude: cachedLocation.latitude,
						longitude: cachedLocation.longitude
					};
				}
			}
			this.getNearbyBooths()
			this.getTasks()
			this.formatDate()
		},
		methods: {
			formatDate() {
				const now = new Date()
				const year = now.getFullYear()
				const month = now.getMonth() + 1
				const day = now.getDate()
				const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				const weekday = weekdays[now.getDay()]
				this.currentDate = `${year}年${month}月${day}日 ${weekday}`
			},
			getUserInfo() {
				const token = uni.getStorageSync("inspector_token")
				console.log("token：" + token)
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				uni.request({
					url: `${uni.$baseUrl}/inspector/getInspectorInfo`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						console.log(res.data);
						this.userInfo = res.data.data
						this.token = token

						//头像
						if (this.userInfo.inspectorPic != null && this.userInfo.inspectorPic != "") {
							this.inspectorPic = this.userInfo.inspectorPic
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getStats() {
				// 这里可以从后端获取统计数据，这里先模拟数据
				this.stats = {
					vendors: 126,
					violations: 8,
					scans: 15
				}
				
				// 如果有接口，可以使用如下方式请求数据
				// const token = uni.getStorageSync("inspector_token")
				// if (!token) return
				// uni.request({
				//   url: `${uni.$baseUrl}/inspector/getStats`,
				//   method: 'GET',
				//   header: {
				//     'Authorization': token
				//   },
				//   success: res => {
				//     if (res.data.code === 200) {
				//       this.stats = res.data.data
				//     }
				//   }
				// })
			},
			getTasks() {
				// 这里可以从后端获取任务列表，这里先模拟数据
				this.taskList = [
					{
						id: 1,
						title: '巡查中心广场区域',
						location: '中心广场',
						time: '09:00-11:00',
						completed: true
					},
					{
						id: 2,
						title: '协助新商贩办理证件',
						location: '行政服务中心',
						time: '14:00-15:00',
						completed: false
					},
					{
						id: 3,
						title: '检查夜市摊位合规情况',
						location: '夜市美食街',
						time: '19:00-21:00',
						completed: false
					}
				]
			},
			getNearbyBooths() {
				// 获取附近摊位信息
				const token = uni.getStorageSync("inspector_token");
				if (!token) return;
				
				// 获取缓存中的位置信息
				const cachedLocation = uni.getStorageSync('inspector_location');
				
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothList`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						if (res.data && res.data.data) {
							// 添加位置信息到摊位数据中
							this.nearbyBooths = res.data.data.map(booth => {
								// 如果摊位有位置信息，则保留，否则使用默认位置
								if (!booth.location) {
									booth.location = { lat: 23.106154, lng: 113.281485 };
									booth.state = '休息';
								}
								
								// 如果有当前位置信息，计算与摊位的距离
								if (cachedLocation) {
									booth.distance = this.calculateDistance(
										cachedLocation.latitude,
										cachedLocation.longitude,
										booth.location.lat,
										booth.location.lng
									);
								} else {
									booth.distance = 0;
								}
								
								return booth;
							});
							
							// 获取摊位状态
							this.getBoothStateList();
						} else {
							uni.showToast({
								title: res.data.message || '获取摊位数据失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('请求失败', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},
			
			getBoothStateList() {
				const token = uni.getStorageSync("inspector_token")
				if (!token) return
				
				uni.request({
					url: `${uni.$baseUrl}/admin/boothStateList`,
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						const stateList = res.data.data;
						
						// 更新摊位状态信息
						if (stateList && stateList.length > 0) {
							for (let i = 0; i < stateList.length; i++) {
								const boothIndex = this.nearbyBooths.findIndex(booth =>
									booth.boothId === stateList[i].booth.boothId
								);
								
								if (boothIndex !== -1) {
									this.nearbyBooths[boothIndex].state = stateList[i].state.boothState;
								}
							}
							
							// 过滤并排序摊位，只保留"营业中"和"休息"状态的摊位
							this.nearbyBooths = this.nearbyBooths.filter(booth =>
								booth.state === '营业中' || booth.state === '休息'
							).sort((a, b) => {
								// 先按状态排序：营业中的排在前面，休息的排在后面
								if (a.state === '营业中' && b.state !== '营业中') return -1;
								if (a.state !== '营业中' && b.state === '营业中') return 1;
								
								// 如果状态相同，按距离排序
								return a.distance - b.distance;
							});
							
							// 限制显示数量
							this.nearbyBooths = this.nearbyBooths.slice(0, 5);
							console.log("nearbyBooths", this.nearbyBooths);
						}
					},
					fail: (err) => {
						console.error('获取摊位状态失败', err);
					}
				});
			},
			
			// 根据经纬度计算两点之间的距离（米）
			calculateDistance(lat1, lng1, lat2, lng2) {
				const EARTH_RADIUS = 6378137.0; // 地球半径，单位：米
				const getRad = (d) => d * Math.PI / 180.0;
				
				const radLat1 = getRad(lat1);
				const radLat2 = getRad(lat2);
				const a = radLat1 - radLat2;
				const b = getRad(lng1) - getRad(lng2);
				
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + 
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)));
				s = s * EARTH_RADIUS;
				s = Math.round(s);
				
				return s;
			},
			
			getStateClass(state) {
				switch (state) {
					case '营业中': return 'state-open';
					case '休息': return 'state-rest';
					case '审核中': return 'state-review';
					case '停业': return 'state-closed';
					default: return '';
				}
			},
			
			toBoothDetail(boothId) {
				if (boothId) {
					// 跳转到摊位详情页面
					uni.navigateTo({
						url: `/pages/inspector/boothDetail/boothDetail?boothId=${boothId}`,
						fail(e) {
							console.log("导航错误", e);
						}
					});
				}
			},
			toVendorDetail(id) {
				uni.navigateTo({
					url: `/pages/inspector/vendorDetail/vendorDetail?id=${id}`
				})
			},
			toEditProfile() {
				uni.navigateTo({
					url: '/pages/inspector/editProfile/editProfile'
				})
			},
			toScanCode() {
				uni.navigateTo({
					url: '/pages/inspector/scanQrCode/scanQrCode'
				})
			},
			toMap() {
				uni.navigateTo({
					url: '/pages/inspector/map/map'
				})
			},
			toVendorList() {
				uni.navigateTo({
					url: '/pages/inspector/vendorList/vendorList',
					fail(e) {
						console.log("导航错误", e)
					}
				});
			},
			toBoothReview() {
				uni.navigateTo({
					url: '/pages/inspector/boothReview/boothReview',
					fail(e) {
						console.log("导航错误", e)
					}
				});
			},
			toMessage() {
				uni.navigateTo({
					url: '/pages/inspector/message/message',
					fail(e) {
						console.log("导航错误", e)
					}
				});
			},
			toViolation() {
				uni.navigateTo({
					url: '/pages/inspector/violation/violation',
					fail(e) {
						console.log("导航错误", e)
					}
				});
			},
			handleTaskClick(task) {
				// 处理任务点击事件
				uni.showModal({
					title: '任务详情',
					content: `${task.title}\n地点：${task.location}\n时间：${task.time}\n状态：${task.completed ? '已完成' : '未完成'}`,
					confirmText: task.completed ? '确定' : '标记完成',
					success: (res) => {
						if (res.confirm && !task.completed) {
							// 标记任务完成
							const index = this.taskList.findIndex(t => t.id === task.id)
							if (index !== -1) {
								this.taskList[index].completed = true
								uni.showToast({
									title: '任务已标记完成',
									icon: 'success'
								})
							}
						}
					}
				})
			},
			getLocation() {
				// 显示加载中
				uni.showLoading({
					title: '获取位置中...'
				});
				
				// Web端直接尝试获取位置
				uni.getLocation({
					type: 'wgs84', // 使用国测局坐标系
					success: (res) => {
						console.log('获取位置成功:', res);
						this.currentLocation = {
							latitude: res.latitude,
							longitude: res.longitude
						};
						
						// 逆地理编码获取位置详细信息
						this.getLocationDetail(res.latitude, res.longitude);
					},
					fail: (err) => {
						console.error('获取位置失败:', err);
						uni.hideLoading();
						// Web端获取位置失败处理
						uni.showModal({
							title: '定位失败',
							content: '获取位置信息失败，请检查浏览器定位权限或允许网站获取位置',
							confirmText: '知道了',
							showCancel: false,
							success: () => {
								this.locationText = "定位失败";
							}
						});
					}
				});
			},
			
			getLocationDetail(latitude, longitude) {
				// 使用腾讯地图逆地理编码（仅示例，需要配置对应的SDK）
				this.locationText = "附近摊位";
				uni.hideLoading();
				
				// 将当前位置保存到本地，可用于后续操作
				uni.setStorageSync('inspector_location', {
					latitude: latitude,
					longitude: longitude,
					timestamp: new Date().getTime()
				});
				
				// 获取最新的附近摊位
				this.getNearbyBooths();
				
				// 显示位置信息提示
				uni.showToast({
					title: '位置已更新',
					icon: 'success',
					duration: 1500
				});
			},
			formatDistance(distance) {
				if (distance < 1000) {
					return distance + "米";
				} else {
					return (distance / 1000).toFixed(1) + "公里";
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
		padding-bottom: 100rpx; /* 为自定义tabBar预留空间 */
	}

	.top {
		height: 200rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 200rpx;
			width: 100%;
			box-shadow: 0 4rpx 12rpx rgba(81, 153, 255, 0.2);
		}
		
		.header-content {
			position: relative;
			padding: 40rpx 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			
			.header-left {
				display: flex;
				flex-direction: column;
				
				.header-title {
					color: #ffffff;
					font-size: 40rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				
				.header-date {
					color: rgba(255, 255, 255, 0.9);
					font-size: 26rpx;
				}
			}
			
			.location-btn {
				display: flex;
				align-items: center;
				background-color: rgba(255, 255, 255, 0.2);
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				color: #ffffff;
				font-size: 24rpx;
				box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
				
				svg {
					margin-right: 8rpx;
				}
				
				text {
					max-width: 120rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	
	.stats-section {
		padding: 0 30rpx;
		margin-top: -40rpx;
		margin-bottom: 30rpx;
		
		.stats-card {
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.08);
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			
			.stats-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.stats-number {
					font-size: 42rpx;
					font-weight: bold;
					color: #5199ff;
					margin-bottom: 10rpx;
				}
				
				.stats-label {
					font-size: 24rpx;
					color: #666;
				}
			}
			
			.stats-divider {
				width: 2rpx;
				background-color: #f0f0f0;
				margin: 0 10rpx;
			}
		}
	}

	.section-header {
		display: flex;
		align-items: center;
		margin: 30rpx 0;
		
		.header-line {
			flex: 1;
			height: 2rpx;
			background-color: #eeeeee;
		}
		
		.header-text {
			padding: 0 30rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.function-menu {
		padding: 0 30rpx;
		
		.menu-grid {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			
			.menu-item {
				width: 30%;
				background-color: #fff;
				border-radius: 15px;
				box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.05);
				padding: 30rpx;
				margin-bottom: 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.menu-icon {
					margin-bottom: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100rpx;
					height: 100rpx;
					background-color: rgba(81, 153, 255, 0.1);
					border-radius: 50%;
				}
				
				.menu-text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
	
	.task-section {
		padding: 0 30rpx;
		
		.task-list {
			background-color: #fff;
			border-radius: 15px;
			box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.05);
			padding: 20rpx;
			
			.empty-message {
				text-align: center;
				padding: 40rpx 0;
				color: #999;
				font-size: 28rpx;
			}
			
			.task-item {
				display: flex;
				align-items: center;
				padding: 20rpx;
				border-bottom: 1px solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.task-status {
					margin-right: 20rpx;
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					background-color: #f0f0f0;
					display: flex;
					justify-content: center;
					align-items: center;
					
					&.task-completed {
						background-color: #5199ff;
					}
					
					.status-dot {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: #ffffff;
					}
				}
				
				.task-content {
					flex: 1;
					
					.task-title {
						font-size: 30rpx;
						color: #333;
						margin-bottom: 10rpx;
					}
					
					.task-info {
						display: flex;
						font-size: 24rpx;
						color: #999;
						
						.task-location, .task-time {
							display: flex;
							align-items: center;
							margin-right: 30rpx;
							
							svg {
								margin-right: 4rpx;
							}
						}
					}
				}
				
				.task-arrow {
					display: flex;
					align-items: center;
				}
			}
		}
	}
	
	.nearby-section {
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		
		.nearby-vendors {
			background-color: #fff;
			border-radius: 15px;
			box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.05);
			padding: 20rpx;
			
			.empty-message {
				text-align: center;
				padding: 40rpx 0;
				color: #999;
				font-size: 28rpx;
			}
			
			.nearby-scroll {
				white-space: nowrap;
				
				.nearby-items {
					display: inline-flex;
					padding: 10rpx 0;
					
					.nearby-vendor {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-right: 30rpx;
						width: 150rpx;
						
						.vendor-image {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
							margin-bottom: 15rpx;
							border: 2rpx solid #f0f0f0;
						}
						
						.vendor-info {
							text-align: center;
							width: 100%;
							
							.vendor-name {
								font-size: 26rpx;
								color: #333;
								margin-bottom: 10rpx;
								width: 100%;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							
							.vendor-state {
								font-size: 20rpx;
								display: inline-block;
								padding: 2rpx 10rpx;
								border-radius: 10rpx;
								background-color: #f0f0f0;
								margin-top: 5rpx;
								
								&.state-open {
									background-color: #52c41a;
									color: #ffffff;
								}
								
								&.state-rest {
									background-color: #faad14;
									color: #ffffff;
								}
								
								&.state-review {
									background-color: #1890ff;
									color: #ffffff;
								}
								
								&.state-closed {
									background-color: #f5222d;
									color: #ffffff;
								}
							}
							
							.vendor-distance {
								font-size: 20rpx;
								color: #999;
								margin-top: 5rpx;
							}
						}
					}
				}
			}
			
			.view-more {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 20rpx 0 10rpx;
				font-size: 26rpx;
				color: #5199ff;
				border-top: 1px solid #f5f5f5;
				margin-top: 10rpx;
				
				svg {
					margin-left: 5rpx;
				}
			}
		}
	}
</style>
