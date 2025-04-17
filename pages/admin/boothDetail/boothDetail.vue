<template>
	<view class="booth-detail-container">
		<view class="header">
			<view class="title">摊位详情</view>
			<button class="back-btn" @click="goBack">返回</button>
		</view>
		
		<view class="detail-card">
			<view class="card-section">
				<view class="section-title">基本信息</view>
				<view class="info-item">
					<view class="label">摊位ID：</view>
					<view class="value">{{boothInfo.id}}</view>
				</view>
				<view class="info-item">
					<view class="label">摊位编号：</view>
					<view class="value">{{boothInfo.boothNumber}}</view>
				</view>
				<view class="info-item">
					<view class="label">所属区域：</view>
					<view class="value">{{boothInfo.area}}</view>
				</view>
				<view class="info-item">
					<view class="label">所属街道：</view>
					<view class="value">{{boothInfo.street}}</view>
				</view>
				<view class="info-item">
					<view class="label">创建时间：</view>
					<view class="value">{{boothInfo.createTime}}</view>
				</view>
				<view class="info-item">
					<view class="label">状态：</view>
					<view class="value status" :class="boothInfo.status">
						{{statusText[boothInfo.status]}}
					</view>
				</view>
			</view>
			
			<view class="card-section">
				<view class="section-title">摊主信息</view>
				<view class="info-item" v-if="boothInfo.vendor">
					<view class="label">摊主姓名：</view>
					<view class="value">{{boothInfo.vendor.name}}</view>
				</view>
				<view class="info-item" v-if="boothInfo.vendor">
					<view class="label">联系电话：</view>
					<view class="value">{{boothInfo.vendor.phone}}</view>
				</view>
				<view class="info-item" v-if="boothInfo.vendor">
					<view class="label">身份证号：</view>
					<view class="value">{{boothInfo.vendor.idCard}}</view>
				</view>
				<view class="no-data" v-else>暂无摊主信息</view>
			</view>
			
			<view class="card-section">
				<view class="section-title">摊位信息</view>
				<view class="info-item">
					<view class="label">经营类型：</view>
					<view class="value">{{boothInfo.businessType}}</view>
				</view>
				<view class="info-item">
					<view class="label">摊位面积：</view>
					<view class="value">{{boothInfo.area}} 平方米</view>
				</view>
				<view class="info-item">
					<view class="label">摊位月租：</view>
					<view class="value">¥{{boothInfo.monthlyRent}}</view>
				</view>
				<view class="info-item map-container">
					<view class="label">位置信息：</view>
					<view class="map">
						<!-- 地图组件 -->
						<image class="map-image" src="/static/map_placeholder.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			
			<view class="card-section">
				<view class="section-title">摊位照片</view>
				<view class="photo-list">
					<image 
						v-for="(photo, index) in boothInfo.photos" 
						:key="index" 
						class="photo-item" 
						:src="photo" 
						mode="aspectFill"
						@click="previewImage(index)"
					></image>
				</view>
			</view>
			
			<view class="card-section">
				<view class="section-title">操作</view>
				<view class="operation-buttons">
					<button class="operation-btn edit" @click="editBooth">编辑信息</button>
					<button class="operation-btn" :class="boothInfo.status === 'active' ? 'disable' : 'enable'" @click="toggleStatus">
						{{boothInfo.status === 'active' ? '禁用摊位' : '启用摊位'}}
					</button>
					<button class="operation-btn view-violations" @click="viewViolations">查看违规记录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				boothId: '',
				boothInfo: {
					id: 'B12345',
					boothNumber: 'A-123',
					area: '东湖区',
					street: '解放路',
					createTime: '2023-09-10 10:00:00',
					status: 'active', // active, inactive, pending
					vendor: {
						name: '张三',
						phone: '13800138000',
						idCard: '3601XXXXXXXX1234'
					},
					businessType: '水果蔬菜',
					area: '10',
					monthlyRent: '1200',
					location: {
						latitude: 30.5,
						longitude: 114.3
					},
					photos: [
						'/static/booth_sample1.jpg',
						'/static/booth_sample2.jpg',
						'/static/booth_sample3.jpg'
					]
				},
				statusText: {
					'active': '运营中',
					'inactive': '已停用',
					'pending': '审核中'
				}
			}
		},
		onLoad(options) {
			if(options.id) {
				this.boothId = options.id
				// 实际项目中应通过API获取摊位详情
				// this.loadBoothDetail()
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			
			loadBoothDetail() {
				// 模拟API请求获取摊位详情
				uni.showLoading({
					title: '加载中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					// 实际项目中应从API获取数据
					// this.boothInfo = res.data
				}, 1000)
			},
			
			editBooth() {
				// 跳转到编辑页面
				uni.navigateTo({
					url: `/pages/admin/editBooth/editBooth?id=${this.boothInfo.id}`
				})
			},
			
			toggleStatus() {
				const newStatus = this.boothInfo.status === 'active' ? 'inactive' : 'active'
				const actionText = newStatus === 'active' ? '启用' : '禁用'
				
				uni.showModal({
					title: '确认操作',
					content: `确定要${actionText}该摊位吗？`,
					success: (res) => {
						if(res.confirm) {
							// 实际项目中应调用API更新状态
							uni.showLoading({
								title: '处理中...'
							})
							
							setTimeout(() => {
								uni.hideLoading()
								this.boothInfo.status = newStatus
								uni.showToast({
									title: `${actionText}成功`,
									icon: 'success'
								})
							}, 1000)
						}
					}
				})
			},
			
			viewViolations() {
				// 跳转到违规记录页面
				uni.navigateTo({
					url: `/pages/admin/fineList/fineList?boothId=${this.boothInfo.id}`
				})
			},
			
			previewImage(index) {
				uni.previewImage({
					current: this.boothInfo.photos[index],
					urls: this.boothInfo.photos
				})
			}
		}
	}
</script>

<style>
	.booth-detail-container {
		padding: 20px;
		background-color: #f0f2f5;
		min-height: 100vh;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	
	.title {
		font-size: 22px;
		font-weight: bold;
		color: #303133;
	}
	
	.back-btn {
		background-color: #909399;
		color: #fff;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
	}
	
	.detail-card {
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	
	.card-section {
		padding: 20px;
		border-bottom: 1px solid #ebeef5;
	}
	
	.card-section:last-child {
		border-bottom: none;
	}
	
	.section-title {
		font-size: 18px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ebeef5;
	}
	
	.info-item {
		display: flex;
		margin-bottom: 15px;
	}
	
	.label {
		width: 100px;
		color: #606266;
		flex-shrink: 0;
	}
	
	.value {
		flex: 1;
		color: #303133;
	}
	
	.status {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 10px;
		font-size: 14px;
	}
	
	.active {
		background-color: #67c23a;
		color: #fff;
	}
	
	.inactive {
		background-color: #909399;
		color: #fff;
	}
	
	.pending {
		background-color: #e6a23c;
		color: #fff;
	}
	
	.no-data {
		color: #909399;
		font-style: italic;
	}
	
	.map-container {
		display: block;
	}
	
	.map {
		margin-top: 10px;
		height: 200px;
		width: 100%;
		background-color: #f5f7fa;
		overflow: hidden;
		border-radius: 4px;
	}
	
	.map-image {
		width: 100%;
		height: 100%;
	}
	
	.photo-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -5px;
	}
	
	.photo-item {
		width: calc(33.33% - 10px);
		height: 100px;
		margin: 5px;
		border-radius: 4px;
		background-color: #f5f7fa;
	}
	
	.operation-buttons {
		display: flex;
		flex-wrap: wrap;
	}
	
	.operation-btn {
		margin-right: 15px;
		margin-bottom: 10px;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		color: #fff;
	}
	
	.edit {
		background-color: #409EFF;
	}
	
	.disable {
		background-color: #f56c6c;
	}
	
	.enable {
		background-color: #67c23a;
	}
	
	.view-violations {
		background-color: #e6a23c;
	}
</style> 