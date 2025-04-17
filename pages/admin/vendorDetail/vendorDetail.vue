<template>
	<view class="vendor-detail-container">
		<view class="header">
			<view class="title">摊主详情</view>
			<button class="back-btn" @click="goBack">返回</button>
		</view>
		
		<view class="detail-card">
			<!-- 基本信息 -->
			<view class="card-section">
				<view class="section-title">基本信息</view>
				<view class="basic-info">
					<view class="avatar-container">
						<image class="avatar" :src="vendorInfo.avatar || '/static/default_avatar.png'" mode="aspectFill"></image>
					</view>
					<view class="info-list">
						<view class="info-item">
							<view class="label">姓名：</view>
							<view class="value">{{vendorInfo.name}}</view>
						</view>
						<view class="info-item">
							<view class="label">性别：</view>
							<view class="value">{{vendorInfo.gender === 'male' ? '男' : '女'}}</view>
						</view>
						<view class="info-item">
							<view class="label">手机号：</view>
							<view class="value">{{vendorInfo.phone}}</view>
						</view>
						<view class="info-item">
							<view class="label">身份证号：</view>
							<view class="value">{{vendorInfo.idCard}}</view>
						</view>
						<view class="info-item">
							<view class="label">注册时间：</view>
							<view class="value">{{vendorInfo.registerTime}}</view>
						</view>
						<view class="info-item">
							<view class="label">认证状态：</view>
							<view class="value" :class="'cert-' + vendorInfo.certStatus">
								{{certStatusText[vendorInfo.certStatus]}}
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 认证资料 -->
			<view class="card-section">
				<view class="section-title">认证资料</view>
				<view class="cert-photos">
					<view class="cert-photo-item">
						<view class="photo-title">身份证正面</view>
						<image class="cert-photo" :src="vendorInfo.idCardFront" mode="aspectFill" @click="previewImage(vendorInfo.idCardFront)"></image>
					</view>
					<view class="cert-photo-item">
						<view class="photo-title">身份证反面</view>
						<image class="cert-photo" :src="vendorInfo.idCardBack" mode="aspectFill" @click="previewImage(vendorInfo.idCardBack)"></image>
					</view>
					<view class="cert-photo-item">
						<view class="photo-title">手持身份证</view>
						<image class="cert-photo" :src="vendorInfo.idCardHold" mode="aspectFill" @click="previewImage(vendorInfo.idCardHold)"></image>
					</view>
				</view>
			</view>
			
			<!-- 摊位信息 -->
			<view class="card-section">
				<view class="section-title">摊位信息</view>
				<view v-if="vendorInfo.booths && vendorInfo.booths.length > 0">
					<view 
						v-for="(booth, index) in vendorInfo.booths" 
						:key="index"
						class="booth-item"
						@click="viewBoothDetail(booth.id)"
					>
						<view class="booth-info">
							<view class="booth-name">{{booth.boothNumber}}</view>
							<view class="booth-status" :class="booth.status">
								{{statusText[booth.status]}}
							</view>
						</view>
						<view class="booth-detail">
							<view class="booth-location">{{booth.area}} - {{booth.street}}</view>
							<view class="booth-business">{{booth.businessType}}</view>
						</view>
						<view class="booth-arrow">
							<text class="arrow-icon">></text>
						</view>
					</view>
				</view>
				<view v-else class="no-booth">
					该摊主暂无摊位信息
				</view>
			</view>
			
			<!-- 违规记录 -->
			<view class="card-section">
				<view class="section-title">违规记录</view>
				<view v-if="vendorInfo.violations && vendorInfo.violations.length > 0">
					<view 
						v-for="(violation, index) in vendorInfo.violations" 
						:key="index"
						class="violation-item"
					>
						<view class="violation-time">{{violation.time}}</view>
						<view class="violation-content">
							<view class="violation-title">{{violation.title}}</view>
							<view class="violation-desc">{{violation.description}}</view>
							<view class="violation-booth">摊位: {{violation.boothNumber}}</view>
							<view class="violation-fine">罚款: ¥{{violation.fine}}</view>
						</view>
					</view>
				</view>
				<view v-else class="no-violation">
					该摊主暂无违规记录
				</view>
			</view>
			
			<!-- 操作 -->
			<view class="card-section">
				<view class="section-title">操作</view>
				<view class="operation-buttons">
					<button class="operation-btn edit" @click="editVendor">编辑信息</button>
					<button class="operation-btn" :class="vendorInfo.status === 'active' ? 'disable' : 'enable'" @click="toggleStatus">
						{{vendorInfo.status === 'active' ? '禁用账号' : '启用账号'}}
					</button>
					<button class="operation-btn contact" @click="contactVendor">联系摊主</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vendorId: '',
				vendorInfo: {
					id: 'V10001',
					name: '张三',
					gender: 'male',
					phone: '13800138000',
					idCard: '3601XXXXXXXX1234',
					registerTime: '2023-08-15 09:30:00',
					certStatus: 'certified',  // certified, pending, rejected
					status: 'active',  // active, disabled
					avatar: '/static/avatar_sample.jpg',
					idCardFront: '/static/id_front_sample.jpg',
					idCardBack: '/static/id_back_sample.jpg',
					idCardHold: '/static/id_hold_sample.jpg',
					booths: [
						{
							id: 'B12345',
							boothNumber: 'A-123',
							area: '东湖区',
							street: '解放路',
							businessType: '水果蔬菜',
							status: 'active'
						},
						{
							id: 'B12346',
							boothNumber: 'B-056',
							area: '西湖区',
							street: '中山路',
							businessType: '小吃',
							status: 'inactive'
						}
					],
					violations: [
						{
							time: '2023-10-10 14:20:00',
							title: '占道经营',
							description: '摊位超出划定范围，占用人行道',
							boothNumber: 'A-123',
							fine: '200'
						},
						{
							time: '2023-09-25 10:15:00',
							title: '卫生问题',
							description: '摊位周围垃圾未及时清理',
							boothNumber: 'A-123',
							fine: '100'
						}
					]
				},
				certStatusText: {
					'certified': '已认证',
					'pending': '审核中',
					'rejected': '未通过'
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
				this.vendorId = options.id
				// 实际项目中应通过API获取摊主详情
				// this.loadVendorDetail()
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			
			loadVendorDetail() {
				// 模拟API请求获取摊主详情
				uni.showLoading({
					title: '加载中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					// 实际项目中应从API获取数据
					// this.vendorInfo = res.data
				}, 1000)
			},
			
			viewBoothDetail(boothId) {
				// 跳转到摊位详情页
				uni.navigateTo({
					url: `/pages/admin/boothDetail/boothDetail?id=${boothId}`
				})
			},
			
			previewImage(url) {
				uni.previewImage({
					current: url,
					urls: [this.vendorInfo.idCardFront, this.vendorInfo.idCardBack, this.vendorInfo.idCardHold]
				})
			},
			
			editVendor() {
				// 跳转到编辑页面
				uni.navigateTo({
					url: `/pages/admin/editVendor/editVendor?id=${this.vendorInfo.id}`
				})
			},
			
			toggleStatus() {
				const newStatus = this.vendorInfo.status === 'active' ? 'disabled' : 'active'
				const actionText = newStatus === 'active' ? '启用' : '禁用'
				
				uni.showModal({
					title: '确认操作',
					content: `确定要${actionText}该摊主账号吗？`,
					success: (res) => {
						if(res.confirm) {
							// 实际项目中应调用API更新状态
							uni.showLoading({
								title: '处理中...'
							})
							
							setTimeout(() => {
								uni.hideLoading()
								this.vendorInfo.status = newStatus
								uni.showToast({
									title: `${actionText}成功`,
									icon: 'success'
								})
							}, 1000)
						}
					}
				})
			},
			
			contactVendor() {
				uni.showActionSheet({
					itemList: ['拨打电话', '发送短信'],
					success: (res) => {
						if(res.tapIndex === 0) {
							// 拨打电话
							uni.makePhoneCall({
								phoneNumber: this.vendorInfo.phone,
								fail: () => {
									uni.showToast({
										title: '拨打电话失败',
										icon: 'none'
									})
								}
							})
						} else if(res.tapIndex === 1) {
							// 发送短信
							uni.showToast({
								title: '发送短信功能暂未实现',
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.vendor-detail-container {
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
	
	.basic-info {
		display: flex;
	}
	
	.avatar-container {
		margin-right: 20px;
	}
	
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #f5f7fa;
	}
	
	.info-list {
		flex: 1;
	}
	
	.info-item {
		display: flex;
		margin-bottom: 10px;
	}
	
	.label {
		width: 80px;
		color: #606266;
		flex-shrink: 0;
	}
	
	.value {
		flex: 1;
		color: #303133;
	}
	
	.cert-certified {
		color: #67c23a;
	}
	
	.cert-pending {
		color: #e6a23c;
	}
	
	.cert-rejected {
		color: #f56c6c;
	}
	
	.cert-photos {
		display: flex;
		flex-wrap: wrap;
	}
	
	.cert-photo-item {
		width: 33.33%;
		padding: 0 10px;
		box-sizing: border-box;
		margin-bottom: 15px;
	}
	
	.photo-title {
		margin-bottom: 8px;
		color: #606266;
		font-size: 14px;
	}
	
	.cert-photo {
		width: 100%;
		height: 150px;
		background-color: #f5f7fa;
		border-radius: 4px;
	}
	
	.booth-item {
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 15px;
		margin-bottom: 15px;
		display: flex;
		align-items: center;
	}
	
	.booth-info {
		flex: 1;
	}
	
	.booth-name {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 5px;
	}
	
	.booth-status {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 12px;
		margin-top: 5px;
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
	
	.booth-detail {
		flex: 2;
		color: #606266;
		font-size: 14px;
	}
	
	.booth-location {
		margin-bottom: 5px;
	}
	
	.booth-arrow {
		width: 20px;
		color: #909399;
		text-align: right;
	}
	
	.no-booth, .no-violation {
		color: #909399;
		font-style: italic;
		padding: 20px 0;
		text-align: center;
	}
	
	.violation-item {
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 15px;
		margin-bottom: 15px;
	}
	
	.violation-time {
		color: #909399;
		font-size: 14px;
		margin-bottom: 8px;
	}
	
	.violation-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 5px;
	}
	
	.violation-desc {
		color: #606266;
		margin-bottom: 8px;
	}
	
	.violation-booth, .violation-fine {
		color: #606266;
		font-size: 14px;
		margin-top: 5px;
	}
	
	.violation-fine {
		color: #f56c6c;
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
	
	.contact {
		background-color: #909399;
	}
</style> 