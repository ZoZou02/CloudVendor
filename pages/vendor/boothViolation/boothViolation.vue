<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>

		<!-- 标题 -->
		<view class="page-title">
			<text>摊位违规记录</text>
		</view>

		<!-- 内容区 -->
		<view class="content-card">
			<view class="booth-info" v-if="boothInfo">
				<view class="booth-number">摊位号：{{ boothInfo.boothNumber || '-' }}</view>
				<view class="booth-address">地址：{{ boothInfo.area }} {{ boothInfo.street }}</view>
				<view class="booth-business">经营类别：{{ boothInfo.businessType || '-' }}</view>
			</view>

			<!-- 违规记录列表 -->
			<view class="violation-list">
				<view class="section-title">
					<view class="title-line"></view>
					<view class="title-text">违规记录</view>
					<view class="title-line"></view>
				</view>

				<view v-if="violationList.length > 0">
					<view v-for="(item, index) in violationList" :key="index" class="violation-item"
						@click="showDetail(item)">
						<view class="violation-time">{{ formatTime(item.recordTime) }}</view>
						<view class="violation-content">
							<view class="violation-title">{{ item.violation }}</view>
							<view class="violation-desc">{{ item.violationDescription }}</view>
							<view class="violation-points">扣除积分: {{ item.deductionPoints }}</view>
							<view class="violation-status" :class="getStatusClass(item.appealStatus)">
								{{ getStatusText(item.appealStatus) }}
							</view>
						</view>
						<view class="violation-arrow">
							<text class="arrow-icon">></text>
						</view>
					</view>
				</view>
				<view v-else class="no-data">
					<image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无违规记录</text>
				</view>
			</view>
		</view>

		<!-- 详情弹窗 -->
		<uni-popup ref="detailPopup" type="center">
			<view class="detail-popup">
				<view class="popup-header">
					<text class="popup-title">违规详情</text>
					<text class="popup-close" @click="closeDetail">×</text>
				</view>
				<view class="popup-content">
					<view class="detail-item">
						<view class="detail-label">违规类型</view>
						<view class="detail-value">{{ currentViolation.violation || '-' }}</view>
					</view>
					<view class="detail-item">
						<view class="detail-label">违规时间</view>
						<view class="detail-value">{{ formatTime(currentViolation.recordTime) || '-' }}</view>
					</view>
					<view class="detail-item">
						<view class="detail-label">扣除积分</view>
						<view class="detail-value">{{ currentViolation.deductionPoints || '-' }}</view>
					</view>
					<view class="detail-item">
						<view class="detail-label">申诉状态</view>
						<view class="detail-value" :class="getStatusClass(currentViolation.appealStatus)">
							{{ getStatusText(currentViolation.appealStatus) || '-' }}
						</view>
					</view>
					<view class="detail-item full">
						<view class="detail-label">违规描述</view>
						<view class="detail-value">{{ currentViolation.violationDescription || '-' }}</view>
					</view>
					<view class="detail-item full" v-if="currentViolation.violationPic">
						<view class="detail-label">违规照片</view>
						<view class="detail-value">
							<image class="violation-image" :src="currentViolation.violationPic" mode="aspectFit"
								@click="previewImage(currentViolation.violationPic)"></image>
						</view>
					</view>
					<view class="detail-item full" v-if="currentViolation.appealReason">
						<view class="detail-label">申诉理由</view>
						<view class="detail-value">{{ currentViolation.appealReason }}</view>
					</view>
					<view class="detail-item full" v-if="currentViolation.appealResponse">
						<view class="detail-label">申诉回复</view>
						<view class="detail-value">{{ currentViolation.appealResponse }}</view>
					</view>
					<view class="detail-item" v-if="currentViolation.appealTime">
						<view class="detail-label">申诉时间</view>
						<view class="detail-value">{{ formatTime(currentViolation.appealTime) }}</view>
					</view>
				</view>
				<view class="popup-footer" v-if="currentViolation.appealStatus === 'none'">
					<button class="appeal-button" @click="goToAppeal">申诉</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			token: '',
			boothId: '',
			boothInfo: null,
			violationList: [],
			currentViolation: {},
			statusMap: {
				'pending': '待处理',
				'approved': '已通过',
				'rejected': '已驳回',
				'none': '未申诉'
			}
		}
	},
	onLoad() {

		// 获取当前登录的摊主token
		const token = uni.getStorageSync("token");
		if (token) {
			this.token = token;
			this.getBoothInfo();
			this.getViolationList();
		} else {
			uni.showToast({
				icon: "none",
				title: "请先登录"
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	},
	methods: {
		getBoothInfo() {
			uni.request({
				url: `${uni.$baseUrl}/booth/getBoothInfo/${this.boothId}`,
				method: 'GET',
				header: {
					'Authorization': this.token
				},
				success: res => {
					if (res.data.success) {
						this.boothInfo = res.data.data;
					} else {
						uni.showToast({
							icon: "none",
							title: "获取摊位信息失败"
						});
					}
				},
				fail: () => {
					uni.showToast({
						icon: "none",
						title: "网络请求失败"
					});
				}
			});
		},
		getViolationList() {
			uni.showLoading({
				title: '加载中'
			});

			uni.request({
				url: `${uni.$baseUrl}/booth/getViolationRecords`,
				method: 'GET',
				header: {
					'Authorization': this.token
				},
				success: res => {
					uni.hideLoading();
					if (res.data.success) {
						this.violationList = res.data.data;
					} else {
						this.violationList = [];
						uni.showToast({
							icon: "none",
							title: "获取违规记录失败"
						});
					}
				},
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: "网络请求失败"
					});
				}
			});
		},
		formatTime(timestamp) {
			if (!timestamp) return '-';

			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			const hours = ('0' + date.getHours()).slice(-2);
			const minutes = ('0' + date.getMinutes()).slice(-2);

			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
		getStatusText(status) {
			return this.statusMap[status] || '未知';
		},
		getStatusClass(status) {
			switch (status) {
				case 'pending': return 'status-pending';
				case 'approved': return 'status-approved';
				case 'rejected': return 'status-rejected';
				case 'none': return 'status-none';
				default: return '';
			}
		},
		showDetail(item) {
			this.currentViolation = item;
			this.$refs.detailPopup.open();
		},
		closeDetail() {
			this.$refs.detailPopup.close();
		},
		previewImage(url) {
			uni.previewImage({
				urls: [url],
				current: 0
			});
		},
		goToAppeal() {
			uni.navigateTo({
				url: `/pages/vendor/appeal/appeal?recordId=${this.currentViolation.recordId}`
			});
		}
	}
}
</script>

<style lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
}

.top {
	position: relative;
	height: 200rpx;

	.background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100%;
		background: linear-gradient(to bottom, #4f99ff, #7cb9ff);
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		z-index: 1;
	}
}

.page-title {
	position: absolute;
	top: 80rpx;
	left: 0;
	right: 0;
	text-align: center;
	z-index: 2;

	text {
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}
}

.content-card {
	position: relative;
	z-index: 3;
	margin: -60rpx 30rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.booth-info {
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 12rpx;
	margin-bottom: 30rpx;

	.booth-number {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.booth-address,
	.booth-business {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 6rpx;
	}
}

.section-title {
	display: flex;
	align-items: center;
	margin: 20rpx 0 30rpx;

	.title-line {
		flex: 1;
		height: 1px;
		background-color: #eaeaea;
	}

	.title-text {
		margin: 0 20rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}
}

.violation-item {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
	background-color: #fff;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);

	.violation-time {
		width: 180rpx;
		font-size: 24rpx;
		color: #999;
		flex-shrink: 0;
	}

	.violation-content {
		flex: 1;
		padding-right: 20rpx;

		.violation-title {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 10rpx;
		}

		.violation-desc {
			font-size: 26rpx;
			color: #666;
			margin-bottom: 16rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.violation-points {
			font-size: 26rpx;
			color: #ff6b6b;
			margin-bottom: 6rpx;
		}

		.violation-status {
			display: inline-block;
			font-size: 24rpx;
			padding: 4rpx 16rpx;
			border-radius: 30rpx;

			&.status-pending {
				background-color: #fff8e6;
				color: #f0c148;
			}

			&.status-approved {
				background-color: #e9f7ec;
				color: #52c41a;
			}

			&.status-rejected {
				background-color: #fff2f0;
				color: #ff6b6b;
			}

			&.status-none {
				background-color: #f0f0f0;
				color: #999;
			}
		}
	}

	.violation-arrow {
		width: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ccc;
	}
}

.no-data {
	padding: 100rpx 0;
	text-align: center;

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
}

.detail-popup {
	width: 600rpx;
	background-color: #fff;
	border-radius: 16rpx;
	overflow: hidden;

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #f0f0f0;

		.popup-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.popup-close {
			font-size: 40rpx;
			color: #999;
			padding: 0 10rpx;
		}
	}

	.popup-content {
		max-height: 700rpx;
		overflow-y: auto;
		padding: 20rpx 30rpx;

		.detail-item {
			display: flex;
			margin-bottom: 20rpx;

			&.full {
				flex-direction: column;
			}

			.detail-label {
				width: 160rpx;
				font-size: 28rpx;
				color: #666;
				flex-shrink: 0;
				margin-bottom: 10rpx;
			}

			.detail-value {
				flex: 1;
				font-size: 28rpx;
				color: #333;

				&.status-pending {
					color: #f0c148;
				}

				&.status-approved {
					color: #52c41a;
				}

				&.status-rejected {
					color: #ff6b6b;
				}

				&.status-none {
					color: #999;
				}
			}

			.violation-image {
				width: 100%;
				height: 300rpx;
				border-radius: 8rpx;
			}
		}
	}

	.popup-footer {
		padding: 20rpx 30rpx;
		border-top: 1px solid #f0f0f0;
		display: flex;
		justify-content: flex-end;

		.appeal-button {
			background-color: #4f99ff;
			color: #fff;
			font-size: 28rpx;
			padding: 10rpx 40rpx;
			border-radius: 100rpx;
		}
	}
}
</style>