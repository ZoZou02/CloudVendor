<template>
	<view class="content">
		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :events="events" :center="center"
			:control="control" :doubleClickZoom="false" :zoom="zoom">
			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
			<tmap-multi-marker :styles="markerStyles" :geometries="markerGeometries" ref="markers" />
		</tmap-map>

		<view class="toolControl">
			<view class="toolItem" id="reload" @click.stop="reload"></view>
		</view>

		<!-- 摊位列表 -->
		<view class="booth-list-container">
			<view class="booth-list-header">
				<text>摊位列表</text>
			</view>
			<scroll-view class="booth-list" scroll-y="true" show-scrollbar="true"
				:style="{ height: 'calc(100% - 72rpx)' }">
				<view class="booth-item" v-for="(booth, index) in allBooths" :key="index" @click="centerOnBooth(booth)">
					<view class="booth-item-left">
						<view class="booth-id">{{ booth.boothId || '无编号' }}</view>
						<view class="booth-category">{{ booth.type || '未分类' }}</view>
					</view>
					<view class="booth-item-right">
						<view class="booth-vendor">{{ booth.boothName || '无商贩信息' }}</view>
						<view class="booth-state" :class="getStateClass(booth.state)">{{ booth.state || '无状态' }}</view>
					</view>
					<view class="booth-item-arrow" @click.stop="showBoothDetail(booth)">
						<view class="arrow-icon"></view>
					</view>
				</view>
				<view class="empty-list" v-if="allBooths.length === 0">
					<text>暂无摊位数据</text>
				</view>
			</scroll-view>
		</view>

		<!-- 标记信息弹窗 -->
		<view class="booth-popup" v-if="showBoothPopup">
			<view class="booth-content">
				<view class="booth-header">
					<view class="booth-title">摊位信息</view>
					<view class="close-button" @click="closeBoothPopup">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path fill="#999"
								d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
						</svg>
					</view>
				</view>
				<view class="booth-details">
					<view class="detail-item">
						<text class="detail-label">摊位编号:</text>
						<text class="detail-value">{{ selectedBooth.boothId || '无' }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">商贩姓名:</text>
						<text class="detail-value">{{ selectedBooth.vendorName || '无' }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">联系电话:</text>
						<text class="detail-value">{{ selectedBooth.phone || '无' }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">经营品类:</text>
						<text class="detail-value">{{ selectedBooth.type || '无' }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">经营状态:</text>
						<text class="detail-value" :class="getStateClass(selectedBooth.state)">
							{{ selectedBooth.state || '无' }}
						</text>
					</view>
				</view>
				<view class="booth-actions">
					<view class="action-button" @click="toBoothDetail(selectedBooth.boothId)">
						摊位详情
					</view>
				</view>
			</view>
		</view>

		<!-- 添加底部导航栏 -->
		<inspector-tab-bar></inspector-tab-bar>
	</view>
</template>

<script>
import { TMap } from '@map-component/vue-tmap';
import { defineComponent, ref, onMounted } from 'vue';
import inspectorTabBar from '@/components/inspectorTabBar.vue';

export default defineComponent({
	components: {
		inspectorTabBar
	},
	setup() {
		// 基本状态和数据
		const token = uni.getStorageSync("inspector_token");
		const center = ref({ lat: 23.106154, lng: 113.281485 });
		const zoom = ref(17);
		const geometries = ref([]);
		const markerGeometries = ref([]);
		const markers = ref();
		const allBooths = ref([]);
		const showBoothPopup = ref(false);
		const selectedBooth = ref({});

		// 获取区域
		function showArea() {
			uni.request({
				url: `${uni.$baseUrl}/admin/showArea`,
				method: 'GET',
				header: {
					'Authorization': token
				},
				success: (res) => {
					if (res.data && res.data.data) {
						// 遍历数组中的每个元素
						res.data.data.forEach(item => {
							let areaData = {
								id: item.areaId,
								paths: item.areaRange.paths,
								properties: {
									title: item.areaName
								},
							};
							geometries.value.push(areaData);
						});
					}
				}
			});
		}

		// 获取摊位信息
		function getBoothInfo() {
			uni.request({
				url: `${uni.$baseUrl}/booth/getBoothList`,
				method: 'GET',
				header: {
					'Authorization': token
				},
				success: (res) => {
					if (res.data && res.data.data) {
						// 添加位置信息到摊位数据中
						allBooths.value = res.data.data.map(booth => {
							// 如果摊位有位置信息，则保留，否则使用默认位置
							if (!booth.location) {
								booth.location = { lat: 23.106154, lng: 113.281485 };
								booth.state = '休息';
							}
							return booth;
						});
						console.log("allBooths", allBooths.value);
						getLocationList();
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
		}

		// 获取其他摊位位置
		function getLocationList() {
			uni.request({
				url: `${uni.$baseUrl}/booth/getLocationList`,
				method: 'GET',
				data: {},
				header: {
					'Authorization': token
				},
				success: (res) => {
					console.log("位置列表", res.data.data);
					const locationList = res.data.data;

					// 将位置信息关联到对应的摊位
					if (locationList && locationList.length > 0) {
						for (let i = 0; i < locationList.length; i++) {
							// 更新摊位的位置信息
							const boothIndex = allBooths.value.findIndex(booth =>
								booth.tlocationId === locationList[i].id
							);

							if (boothIndex !== -1) {
								allBooths.value[boothIndex].location.lat = locationList[i].locationPoint.lat;
								allBooths.value[boothIndex].location.lng = locationList[i].locationPoint.lng;

							}

							markerGeometries.value = [
								...markerGeometries.value,
								{
									id: locationList[i].boothId || 'other' + i,
									styleId: 'other',
									position: locationList[i].locationPoint,
									properties: {
										boothId: locationList[i].boothId
									}
								},
							];

						}

					}
					console.log("更新allBooths", allBooths.value);

				}
			});
		}

		// 获取所有摊位状态
		function getBoothStateList() {
			uni.request({
				url: `${uni.$baseUrl}/admin/boothStateList`,
				method: 'GET',
				header: {
					'Authorization': token
				},
				success: (res) => {
					console.log("摊位状态列表", res.data.data);
					const stateList = res.data.data;

					// 更新摊位状态信息
					if (stateList && stateList.length > 0) {
						for (let i = 0; i < stateList.length; i++) {
							const boothIndex = allBooths.value.findIndex(booth =>
								booth.boothId === stateList[i].booth.boothId
							);

							if (boothIndex !== -1) {
								allBooths.value[boothIndex].state = stateList[i].state.boothState;

								// 更新标记点样式
								const markerIndex = markerGeometries.value.findIndex(marker =>
									marker.id === stateList[i].booth.boothId
								);

								if (markerIndex !== -1) {
									markerGeometries.value[markerIndex].styleId = getMarkerStyleId(stateList[i].state.boothState);
								}
							}
						}

						// 过滤掉非"营业中"和"休息"状态的摊位标记
						markerGeometries.value = markerGeometries.value.filter(marker => {
							const booth = allBooths.value.find(b => b.boothId === marker.id);
							return booth && (booth.state === '营业中' || booth.state === '休息');
						});

						// 过滤并排序摊位，只保留"营业中"和"休息"状态的摊位
						allBooths.value = allBooths.value.filter(booth =>
							booth.state === '营业中' || booth.state === '休息'
						).sort((a, b) => {
							// 营业中的排在前面，休息的排在后面
							if (a.state === '营业中' && b.state !== '营业中') return -1;
							if (a.state !== '营业中' && b.state === '营业中') return 1;
							return 0;
						});
					}
				},
				fail: (err) => {
					console.error('获取摊位状态失败', err);
				}
			});
		}

		// 根据摊位状态获取标记样式ID
		function getMarkerStyleId(state) {
			switch (state) {
				case '营业中': return 'open';
				case '休息': return 'rest';
				case '审核中': return 'review';
				case '停业': return 'closed';
				default: return 'default';
			}
		}

		// 获取状态的CSS类名
		function getStateClass(state) {
			switch (state) {
				case '营业中': return 'state-open';
				case '休息': return 'state-rest';
				case '审核中': return 'state-review';
				case '停业': return 'state-closed';
				default: return '';
			}
		}

		// 标记点点击事件
		function handleMarkerClick(e) {
			const marker = markerGeometries.value.find(item => item.id === e.markerId);
			if (marker && marker.properties && marker.properties.booth) {
				selectedBooth.value = marker.properties.booth;
				showBoothPopup.value = true;
			}
		}

		// 关闭摊位弹窗
		function closeBoothPopup() {
			showBoothPopup.value = false;
		}

		// 刷新地图
		function reload() {
			location.reload();
		}


		// 显示摊位信息弹窗
		function showBoothDetail(booth) {
			if (booth) {
				selectedBooth.value = booth;
				showBoothPopup.value = true;
				// 获取摊位详细信息
				getVendorDetail(booth.boothId);
			}
		}

		// 获取摊主信息
		function getVendorDetail(boothId) {
			if (!boothId) return;

			uni.request({
				url: `${uni.$baseUrl}/admin/boothVendorDetail`,
				method: 'GET',
				data: {
					boothId: boothId
				},
				header: {
					'Authorization': token
				},
				success: (res) => {
					if (res.data && res.data.data) {
						const vendorInfo = res.data.data;
						// 更新已选中摊位的详细信息
						selectedBooth.value = {
							...selectedBooth.value,
							vendorName: vendorInfo.vendorName || '无',
							phone: vendorInfo.phone || '无',
							category: vendorInfo.category || '无'
						};
					}
				},
				fail: (err) => {
					console.error('获取摊主信息失败', err);
					uni.showToast({
						title: '获取摊主信息失败',
						icon: 'none'
					});
				}
			});
		}

		function toBoothDetail(boothId) {
			if (boothId) {
				// 跳转到摊位详情页面
				uni.navigateTo({
					url: `/pages/inspector/boothDetail/boothDetail?boothId=${boothId}`,
					fail(e) {
						console.log("导航错误", e);
					}
				});
			}
		}

		// 改变地图中心到指定摊位
		function centerOnBooth(booth) {
			console.log("指定booth", booth);
			// 只有摊位在营业中状态才改变地图中心
			if (booth.state === '营业中' && booth.location) {
				// 将地图中心移动到摊位位置
				center.value = {
					lat: booth.location.lat,
					lng: booth.location.lng
				};
				// 可能需要设置选中的摊位
				selectedBooth.value = booth;
				zoom.value = 19;
			} else if (booth.state !== '营业中') {
				uni.showToast({
					title: '该摊位当前未营业',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: '该摊位没有位置信息',
					icon: 'none'
				});
			}
		}

		// 添加点击事件处理
		const events = {
			click: (e) => {
				console.log('地图点击位置:', e.latLng);
			}
		};

		// 组件挂载时执行
		onMounted(() => {
			if (token) {
				showArea();
				getBoothInfo();
				getBoothStateList();
				console.log("中心点", center.value);
			} else {
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					success: () => {
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/inspector/login/login'
							});
						}, 1500);
					}
				});
			}
		});

		return {
			token,
			zoom,
			center,
			geometries,
			markerGeometries,
			markers,
			showBoothPopup,
			selectedBooth,
			allBooths,
			events,
			control: {
				zoom: {
					position: 'bottomLeft',
				},
			},
			id: 'polygon-layer',
			styles: {
				drawing: {},
				selected: {},
			},
			markerStyles: {
				open: {
					width: 30,
					height: 30,
					anchor: { x: 15, y: 30 },
					src: '../../../static/myIcon/marker.png',
				},
				rest: {
					width: 30,
					height: 30,
					anchor: { x: 15, y: 30 },
					src: '../../../static/myIcon/marker.png',
				},
				review: {
					width: 30,
					height: 30,
					anchor: { x: 15, y: 30 },
					src: '../../../static/myIcon/marker.png',
				},
				closed: {
					width: 30,
					height: 30,
					anchor: { x: 15, y: 30 },
					src: '../../../static/myIcon/marker.png',
				},
				default: {
					width: 30,
					height: 30,
					anchor: { x: 15, y: 30 },
					src: '../../../static/myIcon/marker.png',
				},
				other: {
					width: 20,
					height: 20,
					anchor: { x: 10, y: 20 },
					src: '../../../static/myIcon/other_marker.png',
				}
			},

			// 方法
			getStateClass,
			handleMarkerClick,
			closeBoothPopup,
			reload,
			showBoothDetail,
			getBoothStateList,
			centerOnBooth,
			toBoothDetail,
			getVendorDetail
		};
	}
});
</script>

<style lang="scss" scoped>
/* 禁止整个页面滑动 */
page {
	overflow: hidden;
	height: 100%;
}

.content {
	height: 100vh;
	width: 100%;
	position: fixed;
	/* 固定整个页面 */
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	/* 防止内容溢出 */
}

.map {
	height: 50vh;
	width: 100%;
	position: relative;
	z-index: 1;
	flex: 0 0 50vh;
	/* 固定高度，不伸缩 */
	overflow: hidden;
	/* 防止地图内容溢出 */
}

.booth-list-container {
	height: calc(50vh - 100rpx);
	width: 100%;
	background-color: #fff;
	z-index: 2;
	box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
	flex: 1;
	/* 让列表容器填充剩余空间 */
	position: relative;
	/* 确保相对定位 */
	overflow: hidden;
	/* 防止内容溢出 */
	padding-bottom: 120rpx;
	/* 添加底部内边距，与导航栏高度一致 */
}

.booth-list-header {
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	background-color: #f8f8f8;
}

.booth-list {
	height: calc(100% - 72rpx - 120rpx);
	/* 减去导航栏的高度120rpx */
}

.booth-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.booth-item-left {
	flex: 3;

	.booth-id {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.booth-category {
		font-size: 24rpx;
		color: #666;
	}
}

.booth-item-right {
	flex: 2;
	text-align: right;

	.booth-vendor {
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}

	.booth-state {
		font-size: 24rpx;

		&.state-open {
			color: #52c41a;
		}

		&.state-rest {
			color: #faad14;
		}

		&.state-review {
			color: #1890ff;
		}

		&.state-closed {
			color: #f5222d;
		}
	}
}

.booth-item-arrow {
	flex: 0 0 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10rpx;

	.arrow-icon {
		width: 16rpx;
		height: 16rpx;
		border-top: 2rpx solid #999;
		border-right: 2rpx solid #999;
		transform: rotate(45deg);
	}
}

.empty-list {
	padding: 100rpx 0;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}

.toolControl {
	position: absolute;
	top: calc(50vh - 60px);
	right: 20px;
	width: 50px;
	z-index: 1001;
	pointer-events: all;
}

.toolItem {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-size: 24px 24px;
	background-position: center;
	background-repeat: no-repeat;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	background-color: #ffffff;
	border: 1px solid #ffffff;

	&:hover {
		border-color: #5199ff;
	}
}

#reload {
	background-image: url('/static/map/reload.png');
}

.booth-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 40rpx;

	.booth-content {
		width: 100%;
		background-color: #ffffff;
		border-radius: 16px;
		overflow: hidden;

		.booth-header {
			position: relative;
			padding: 30rpx;
			border-bottom: 1px solid #f0f0f0;
			display: flex;
			justify-content: center;

			.booth-title {
				font-size: 32rpx;
				font-weight: bold;
			}

			.close-button {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.booth-details {
			padding: 30rpx;

			.detail-item {
				display: flex;
				margin-bottom: 20rpx;

				.detail-label {
					font-size: 28rpx;
					color: #666;
					width: 160rpx;
					flex-shrink: 0;
				}

				.detail-value {
					font-size: 28rpx;
					color: #333;
					flex: 1;

					&.state-open {
						color: #52c41a;
					}

					&.state-rest {
						color: #faad14;
					}

					&.state-review {
						color: #1890ff;
					}

					&.state-closed {
						color: #f5222d;
					}
				}
			}
		}

		.booth-actions {
			padding: 0 30rpx 30rpx;

			.action-button {
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background-color: #5199ff;
				color: #ffffff;
				border-radius: 45rpx;
				font-size: 32rpx;
			}
		}
	}
}

/* 修改 tmap-map 组件样式限制 */
:deep(.tmap-map) {
	height: 100% !important;
	width: 100% !important;
	position: relative !important;
	/* 防止绝对定位导致的布局问题 */
	touch-action: none;
	/* 禁止地图区域的默认触摸行为 */
}
</style>
