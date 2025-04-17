<template>
	<view class="inspector-detail-container">
		<view class="header">
			<view class="title">城管详情</view>
			<button class="back-btn" @click="goBack">返回</button>
		</view>
		
		<view class="detail-card">
			<!-- 基本信息 -->
			<view class="card-section">
				<view class="section-title">基本信息</view>
				<view class="basic-info">
					<view class="avatar-container">
						<image class="avatar" :src="inspectorInfo.avatar || '/static/default_avatar.png'" mode="aspectFill"></image>
					</view>
					<view class="info-list">
						<view class="info-item">
							<view class="label">姓名：</view>
							<view class="value">{{inspectorInfo.name}}</view>
						</view>
						<view class="info-item">
							<view class="label">性别：</view>
							<view class="value">{{inspectorInfo.gender === 'male' ? '男' : '女'}}</view>
						</view>
						<view class="info-item">
							<view class="label">工号：</view>
							<view class="value">{{inspectorInfo.jobNumber}}</view>
						</view>
						<view class="info-item">
							<view class="label">手机号：</view>
							<view class="value">{{inspectorInfo.phone}}</view>
						</view>
						<view class="info-item">
							<view class="label">身份证号：</view>
							<view class="value">{{inspectorInfo.idCard}}</view>
						</view>
						<view class="info-item">
							<view class="label">注册时间：</view>
							<view class="value">{{inspectorInfo.registerTime}}</view>
						</view>
						<view class="info-item">
							<view class="label">状态：</view>
							<view class="value status" :class="inspectorInfo.status">
								{{statusText[inspectorInfo.status]}}
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 工作区域 -->
			<view class="card-section">
				<view class="section-title">工作区域</view>
				<view class="area-list">
					<view 
						v-for="(area, index) in inspectorInfo.areas" 
						:key="index"
						class="area-item"
					>
						<view class="area-name">{{area.name}}</view>
						<view class="area-streets">
							<view class="street-label">负责街道：</view>
							<view class="street-list">
								<text v-for="(street, sIndex) in area.streets" :key="sIndex" class="street-item">
									{{street}}{{sIndex < area.streets.length - 1 ? '、' : ''}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 工作记录 -->
			<view class="card-section">
				<view class="section-title">工作记录</view>
				<view class="tabs">
					<view 
						v-for="(tab, index) in tabs" 
						:key="index" 
						class="tab-item"
						:class="{ active: activeTabIndex === index }"
						@click="switchTab(index)"
					>
						{{tab.name}}
					</view>
				</view>
				
				<!-- 巡检记录 -->
				<view v-if="activeTabIndex === 0">
					<view v-if="inspectorInfo.inspections && inspectorInfo.inspections.length > 0">
						<view 
							v-for="(item, index) in inspectorInfo.inspections" 
							:key="index"
							class="record-item"
						>
							<view class="record-time">{{item.time}}</view>
							<view class="record-content">
								<view class="record-title">{{item.area}} - {{item.street}}</view>
								<view class="record-desc">巡检摊位数: {{item.boothCount}} 个</view>
								<view class="record-duration">巡检时长: {{item.duration}} 分钟</view>
							</view>
						</view>
					</view>
					<view v-else class="no-data">暂无巡检记录</view>
				</view>
				
				<!-- 处罚记录 -->
				<view v-if="activeTabIndex === 1">
					<view v-if="inspectorInfo.violations && inspectorInfo.violations.length > 0">
						<view 
							v-for="(item, index) in inspectorInfo.violations" 
							:key="index"
							class="record-item"
						>
							<view class="record-time">{{item.time}}</view>
							<view class="record-content">
								<view class="record-title">{{item.title}}</view>
								<view class="record-desc">{{item.description}}</view>
								<view class="record-info">摊位编号: {{item.boothNumber}}</view>
								<view class="record-info">摊主: {{item.vendorName}}</view>
								<view class="record-fine">罚款: ¥{{item.fine}}</view>
							</view>
						</view>
					</view>
					<view v-else class="no-data">暂无处罚记录</view>
				</view>
				
				<!-- 工作统计 -->
				<view v-if="activeTabIndex === 2">
					<view class="stats-container">
						<view class="stats-item">
							<view class="stats-value">{{inspectorInfo.stats.totalInspections}}</view>
							<view class="stats-label">总巡检次数</view>
						</view>
						<view class="stats-item">
							<view class="stats-value">{{inspectorInfo.stats.totalViolations}}</view>
							<view class="stats-label">总处罚次数</view>
						</view>
						<view class="stats-item">
							<view class="stats-value">{{inspectorInfo.stats.totalHours}}h</view>
							<view class="stats-label">总工作时长</view>
						</view>
						<view class="stats-item">
							<view class="stats-value">¥{{inspectorInfo.stats.totalFines}}</view>
							<view class="stats-label">总罚款金额</view>
						</view>
					</view>
					
					<view class="chart-container">
						<!-- 实际项目中应使用图表组件 -->
						<view class="chart-placeholder">
							工作数据图表（需集成图表组件）
						</view>
					</view>
				</view>
			</view>
			
			<!-- 操作 -->
			<view class="card-section">
				<view class="section-title">操作</view>
				<view class="operation-buttons">
					<button class="operation-btn edit" @click="editInspector">编辑信息</button>
					<button class="operation-btn" :class="inspectorInfo.status === 'active' ? 'disable' : 'enable'" @click="toggleStatus">
						{{inspectorInfo.status === 'active' ? '禁用账号' : '启用账号'}}
					</button>
					<button class="operation-btn contact" @click="contactInspector">联系城管</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inspectorId: '',
				activeTabIndex: 0,
				tabs: [
					{ name: '巡检记录' },
					{ name: '处罚记录' },
					{ name: '工作统计' }
				],
				inspectorInfo: {
					id: 'I10001',
					name: '李四',
					gender: 'male',
					jobNumber: 'CG0123',
					phone: '13900139000',
					idCard: '3601XXXXXXXX5678',
					registerTime: '2023-07-20 14:30:00',
					status: 'active',  // active, inactive
					avatar: '/static/inspector_avatar.jpg',
					areas: [
						{
							name: '东湖区',
							streets: ['解放路', '中山路', '民主路']
						},
						{
							name: '西湖区',
							streets: ['人民路', '和平路']
						}
					],
					inspections: [
						{
							time: '2023-10-15 09:30:00',
							area: '东湖区',
							street: '解放路',
							boothCount: 12,
							duration: 45
						},
						{
							time: '2023-10-14 14:20:00',
							area: '东湖区',
							street: '中山路',
							boothCount: 8,
							duration: 30
						},
						{
							time: '2023-10-13 10:00:00',
							area: '西湖区',
							street: '人民路',
							boothCount: 15,
							duration: 60
						}
					],
					violations: [
						{
							time: '2023-10-15 10:20:00',
							title: '占道经营',
							description: '摊位超出划定范围，占用人行道',
							boothNumber: 'A-123',
							vendorName: '张三',
							fine: '200'
						},
						{
							time: '2023-10-14 15:10:00',
							title: '无证经营',
							description: '未取得营业执照进行经营活动',
							boothNumber: 'B-056',
							vendorName: '王五',
							fine: '500'
						}
					],
					stats: {
						totalInspections: 45,
						totalViolations: 12,
						totalHours: 80,
						totalFines: 3500
					}
				},
				statusText: {
					'active': '在职',
					'inactive': '离职'
				}
			}
		},
		onLoad(options) {
			if(options.id) {
				this.inspectorId = options.id
				// 实际项目中应通过API获取城管详情
				// this.loadInspectorDetail()
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			
			loadInspectorDetail() {
				// 模拟API请求获取城管详情
				uni.showLoading({
					title: '加载中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					// 实际项目中应从API获取数据
					// this.inspectorInfo = res.data
				}, 1000)
			},
			
			switchTab(index) {
				this.activeTabIndex = index
			},
			
			editInspector() {
				// 跳转到编辑页面
				uni.navigateTo({
					url: `/pages/admin/editInspector/editInspector?id=${this.inspectorInfo.id}`
				})
			},
			
			toggleStatus() {
				const newStatus = this.inspectorInfo.status === 'active' ? 'inactive' : 'active'
				const actionText = newStatus === 'active' ? '启用' : '禁用'
				
				uni.showModal({
					title: '确认操作',
					content: `确定要${actionText}该城管账号吗？`,
					success: (res) => {
						if(res.confirm) {
							// 实际项目中应调用API更新状态
							uni.showLoading({
								title: '处理中...'
							})
							
							setTimeout(() => {
								uni.hideLoading()
								this.inspectorInfo.status = newStatus
								uni.showToast({
									title: `${actionText}成功`,
									icon: 'success'
								})
							}, 1000)
						}
					}
				})
			},
			
			contactInspector() {
				uni.showActionSheet({
					itemList: ['拨打电话', '发送短信'],
					success: (res) => {
						if(res.tapIndex === 0) {
							// 拨打电话
							uni.makePhoneCall({
								phoneNumber: this.inspectorInfo.phone,
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
	.inspector-detail-container {
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
	
	.area-list {
		margin-top: 10px;
	}
	
	.area-item {
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 15px;
		margin-bottom: 15px;
	}
	
	.area-name {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 10px;
	}
	
	.area-streets {
		display: flex;
	}
	
	.street-label {
		color: #606266;
		margin-right: 10px;
		flex-shrink: 0;
	}
	
	.street-list {
		flex: 1;
	}
	
	.street-item {
		color: #303133;
	}
	
	.tabs {
		display: flex;
		border-bottom: 1px solid #ebeef5;
		margin-bottom: 20px;
	}
	
	.tab-item {
		padding: 10px 20px;
		cursor: pointer;
		color: #606266;
		position: relative;
	}
	
	.tab-item.active {
		color: #409EFF;
	}
	
	.tab-item.active:after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background-color: #409EFF;
	}
	
	.record-item {
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 15px;
		margin-bottom: 15px;
	}
	
	.record-time {
		color: #909399;
		font-size: 14px;
		margin-bottom: 8px;
	}
	
	.record-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 5px;
	}
	
	.record-desc, .record-duration, .record-info {
		color: #606266;
		margin-bottom: 5px;
	}
	
	.record-fine {
		color: #f56c6c;
	}
	
	.no-data {
		color: #909399;
		font-style: italic;
		padding: 20px 0;
		text-align: center;
	}
	
	.stats-container {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10px;
	}
	
	.stats-item {
		width: 25%;
		padding: 0 10px;
		box-sizing: border-box;
		margin-bottom: 20px;
		text-align: center;
	}
	
	.stats-value {
		font-size: 24px;
		font-weight: bold;
		color: #409EFF;
		margin-bottom: 5px;
	}
	
	.stats-label {
		color: #606266;
		font-size: 14px;
	}
	
	.chart-container {
		margin-top: 20px;
	}
	
	.chart-placeholder {
		height: 300px;
		background-color: #f5f7fa;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #909399;
		border-radius: 4px;
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