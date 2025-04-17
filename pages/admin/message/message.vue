<template>
	<view class="message-container">
		<view class="message-layout">
			<!-- 左侧接收者列表 -->
			<view class="recipient-panel">
				<view class="panel-header">
					<text class="panel-title">接收者</text>
					<view class="refresh-btn" @click="refreshData">
						<text class="refresh-icon">↻</text>
					</view>
				</view>
				<view class="recipient-tabs">
					<view class="tab-item" 
						v-for="(item, index) in recipientTypeOptions" 
						:key="index"
						:class="{ active: recipientTypeIndex === index }"
						@click="switchRecipientType(index)">
						{{ item }}
					</view>
				</view>
				
				<!-- 摊主列表 -->
				<view class="recipient-list" v-if="recipientTypeIndex === 0">
					<view class="search-box">
						<input class="search-input" type="text" v-model="vendorSearchKey" placeholder="搜索摊主" />
					</view>
					<scroll-view class="scroll-list" scroll-y>
						<view class="list-item" 
							v-for="(item, index) in filteredVendors" 
							:key="index"
							:class="{ active: selectedVendorIndex === index }"
							@click="selectVendor(index)">
							<view class="vendor-name">{{ item.vendorName }}</view>
							<view class="booth-info">
								<text class="user-id">ID: {{ item.vendorId }}</text>
								<text class="booth-name">{{ item.boothName || '无摊位' }}</text>
							</view>
						</view>
						<view class="empty-tip" v-if="filteredVendors.length === 0">暂无数据</view>
					</scroll-view>
				</view>
				
				<!-- 城管列表 -->
				<view class="recipient-list" v-if="recipientTypeIndex === 1">
					<view class="search-box">
						<input class="search-input" type="text" v-model="inspectorSearchKey" placeholder="搜索城管" />
					</view>
					<scroll-view class="scroll-list" scroll-y>
						<view class="list-item" 
							v-for="(item, index) in filteredInspectors" 
							:key="index"
							:class="{ active: selectedInspectorIndex === index }"
							@click="selectInspector(index)">
							<view class="vendor-name">{{ item.inspectorName }}</view>
							<view class="booth-info">
								<text class="user-id">ID: {{ item.inspectorId }}</text>
								<!-- <text class="booth-name">{{ item.street || '未分配街道' }}</text> -->
							</view>
						</view>
						<view class="empty-tip" v-if="filteredInspectors.length === 0">暂无数据</view>
					</scroll-view>
				</view>
			</view>
			
			<!-- 右侧消息编辑区 -->
			<view class="message-edit-panel">
				<view class="panel-header">
					<text class="panel-title">编辑消息</text>
				</view>
				
				<view class="message-form">
					<!-- 消息类型选择 -->
					<view class="form-item">
						<view class="form-label">消息类型</view>
						<view class="form-content">
							<picker @change="typeChange" :value="typeIndex" :range="typeOptions">
								<view class="picker-item">
									{{ typeOptions[typeIndex] }}
								</view>
							</picker>
						</view>
					</view>
					
					<!-- 消息名称 -->
					<view class="form-item">
						<view class="form-label">消息名称</view>
						<view class="form-content">
							<input class="input" v-model="form.name" placeholder="请输入消息名称" />
						</view>
					</view>
					
					<!-- 接收者信息展示 -->
					<view class="form-item">
						<view class="form-label">接收者</view>
						<view class="form-content recipient-display">
							<text class="recipient-type">{{ recipientTypeOptions[recipientTypeIndex] }}：</text>
							<text class="recipient-name" v-if="recipientTypeIndex === 0 && selectedVendorIndex !== -1">
								{{ vendors[selectedVendorIndex]?.vendorName || '未选择' }}
							</text>
							<text class="recipient-name" v-if="recipientTypeIndex === 1 && selectedInspectorIndex !== -1">
								{{ inspectors[selectedInspectorIndex]?.inspectorName || '未选择' }}
							</text>
						</view>
					</view>
					
					<!-- 消息内容 -->
					<view class="form-item">
						<view class="form-label">消息内容</view>
						<view class="form-content">
							<textarea class="textarea" v-model="form.content" placeholder="请输入消息内容" />
						</view>
					</view>
					
					<!-- 提交按钮 -->
					<view class="form-actions">
						<button class="btn-primary" @click="handleSubmit">发送消息</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const typeOptions = ref(['系统消息', '警告消息', '其他消息'])
const typeValues = ref(['system', 'warning', 'other'])
const typeIndex = ref(0)

// 接收者类型选项
const recipientTypeOptions = ref(['摊主', '城管'])
const recipientTypeIndex = ref(0)

// 摊主列表
const vendors = ref([])
const selectedVendorIndex = ref(-1)
const vendorSearchKey = ref('')

// 城管列表
const inspectors = ref([])
const selectedInspectorIndex = ref(-1)
const inspectorSearchKey = ref('')

// 表单数据
const form = reactive({
	userId: null,
	inspectorId: null,
	name: '系统消息',
	type: 'system',
	content: ''
})

// 加载状态
const loading = ref(false)

// 计算属性
// 过滤后的摊主列表
const filteredVendors = computed(() => {
	if (!vendorSearchKey.value) return vendors.value
	return vendors.value.filter(item => 
		item.vendorName?.includes(vendorSearchKey.value) || 
		(item.boothName && item.boothName.includes(vendorSearchKey.value))
	)
})

// 过滤后的城管列表
const filteredInspectors = computed(() => {
	if (!inspectorSearchKey.value) return inspectors.value
	return inspectors.value.filter(item => item.inspectorName?.includes(inspectorSearchKey.value))
})

// 方法
// 统一数据加载方法
const loadData = async () => {
	try {
		uni.showLoading({
			title: '加载中'
		})
		// 加载所有接收者数据
		loadVendors()
		loadInspectors()
		// 加载摊位信息
		loadBoothList()
	} catch (error) {
		console.error('数据加载失败:', error)
		uni.showToast({
			title: '数据加载失败',
			icon: 'none'
		})
	} finally {
		uni.hideLoading()
	}
}

// 刷新数据
const refreshData = () => {
	// 清空搜索关键词
	vendorSearchKey.value = ''
	inspectorSearchKey.value = ''
	// 重新加载数据
	loadData()
}

// 加载摊位列表
const loadBoothList = () => {
	uni.request({
		url: `${uni.$baseUrl}/booth/getBoothList`,
		method: 'GET',
		header: {
			'Authorization': uni.getStorageSync('admin_token')
		},
		success: (res) => {
			if (res.data.code === 200 && res.data.data) {
				console.log('摊位列表',res.data.data)
				// 将摊位信息转换为映射表
				const tempMap = {}
				res.data.data.forEach(booth => {
					tempMap[booth.boothId] = booth
				})
				
				// 更新摊主列表中的摊位信息
				updateVendorsWithBoothInfo(tempMap)
			} else {
				console.error('获取摊位列表失败:', res.data.message)
			}
		},
		fail: (err) => {
			console.error('获取摊位列表请求失败:', err)
		}
	})
}

// 更新摊主列表中的摊位信息
const updateVendorsWithBoothInfo = (boothsMap) => {
	// 确保摊主列表和摊位映射都已加载
	if (vendors.value.length === 0 || !boothsMap || Object.keys(boothsMap).length === 0) {
		return
	}
	
	// 获取每个摊主对应的摊位
	vendors.value = vendors.value.map(vendor => {
		// 查找该摊主拥有的摊位
		const booth = Object.values(boothsMap).find(b => b.tvendorId === vendor.vendorId)
		return {
			...vendor,
			boothId: booth?.boothId || null,
			boothName: booth?.boothName || null
		}
	})
}

// 加载摊主列表
const loadVendors = () => {
	uni.request({
		url: `${uni.$baseUrl}/vendor/getVendorList`,
		method: 'GET',
		header: {
			'Authorization': uni.getStorageSync('admin_token')
		},
		success: (res) => {
			if (res.data.code === 200) {
				vendors.value = res.data.data.map(vendor => ({
					...vendor,
					boothId: null,
					boothName: null
				}))
				console.log('摊主列表', vendors.value)
			} else {
				uni.showToast({
					title: '获取摊主列表失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		}
	})
}

// 加载城管列表
const loadInspectors = () => {
	uni.request({
		url: `${uni.$baseUrl}/admin/inspectorList`,
		method: 'GET',
		header: {
			'Authorization': uni.getStorageSync('admin_token')
		},
		success: (res) => {
			if (res.data.code === 200) {
				inspectors.value = res.data.data
				console.log('城管列表', inspectors.value)
			} else {
				uni.showToast({
					title: '获取城管列表失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		}
	})
}

// 消息类型改变
const typeChange = (e) => {
	typeIndex.value = e.detail.value
	form.type = typeValues.value[typeIndex.value]
	
	// 更新默认名称
	if (typeIndex.value === 0) {
		form.name = '系统消息'
	} else if (typeIndex.value === 1) {
		form.name = '警告消息'
	} else if (typeIndex.value === 2) {
		form.name = '其他消息'
	}
}

// 切换接收者类型
const switchRecipientType = (index) => {
	recipientTypeIndex.value = index
	
	// 重置所有接收者ID
	form.userId = null
	form.inspectorId = null
	
	// 重置选中状态
	selectedVendorIndex.value = -1
	selectedInspectorIndex.value = -1
}

// 选择摊主
const selectVendor = (index) => {
	selectedVendorIndex.value = index
	form.userId = filteredVendors.value[index].vendorId
}

// 选择城管
const selectInspector = (index) => {
	selectedInspectorIndex.value = index
	form.inspectorId = filteredInspectors.value[index].inspectorId
}

// 提交表单
const handleSubmit = () => {
	// 表单验证
	if (!form.content || form.content.trim() === '') {
		uni.showToast({
			title: '消息内容不能为空',
			icon: 'none'
		})
		return
	}
	
	// 检查是否选择了接收者
	if (!form.userId && !form.inspectorId) {
		uni.showToast({
			title: '请选择接收者',
			icon: 'none'
		})
		return
	}
	
	// 防止重复提交
	if (loading.value) return
	loading.value = true
	
	uni.showLoading({
		title: '发送中'
	})
	
	// 发送请求
	uni.request({
		url: uni.$baseUrl + '/admin/send',
		method: 'POST',
		header: {
			'Content-Type': 'application/json',
			'Authorization': uni.getStorageSync('admin_token')
		},
		data: form,
		success: (res) => {
			if (res.data.code === 200) {
				uni.showToast({
					title: '发送成功',
					icon: 'success'
				})
				// 重置表单内容
				form.content = ''
			} else {
				uni.showToast({
					title: res.data.message || '发送失败',
					icon: 'none'
				})
			}
		},
		fail: () => {
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		},
		complete: () => {
			uni.hideLoading()
			loading.value = false
		}
	})
}

// 生命周期钩子
onMounted(() => {
	loadData()
})
</script>

<style scoped>
	.message-container {
		padding: 20px;
		background-color: #f0f2f5;
		min-height: 100vh;
	}
	
	.message-layout {
		display: flex;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		height: calc(100vh - 40px);
	}
	
	/* 左侧接收者列表样式 */
	.recipient-panel {
		width: 280px;
		border-right: 1px solid #ebeef5;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.panel-header {
		padding: 16px 20px;
		border-bottom: 1px solid #ebeef5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.panel-title {
		font-size: 18px;
		font-weight: 500;
		color: #303133;
	}
	
	.recipient-tabs {
		display: flex;
		border-bottom: 1px solid #ebeef5;
	}
	
	.tab-item {
		flex: 1;
		text-align: center;
		padding: 12px 0;
		cursor: pointer;
		font-size: 14px;
		color: #606266;
		border-bottom: 2px solid transparent;
	}
	
	.tab-item.active {
		color: #409EFF;
		border-bottom-color: #409EFF;
	}
	
	.recipient-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.search-box {
		padding: 10px;
	}
	
	.search-input {
		width: 100%;
		height: 36px;
		padding: 0 10px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		box-sizing: border-box;
		font-size: 14px;
	}
	
	.scroll-list {
		flex: 1;
		overflow-y: auto;
	}
	
	.list-item {
		padding: 12px 20px;
		cursor: pointer;
		font-size: 14px;
		color: #606266;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.list-item:hover {
		background-color: #f5f7fa;
	}
	
	.list-item.active {
		background-color: #ecf5ff;
		color: #409EFF;
	}
	
	.empty-tip {
		text-align: center;
		color: #909399;
		padding: 20px;
		font-size: 14px;
	}
	
	/* 右侧消息编辑区样式 */
	.message-edit-panel {
		flex: 1;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	
	.message-form {
		padding: 20px;
		flex: 1;
		overflow-y: auto;
	}
	
	.form-item {
		margin-bottom: 20px;
	}
	
	.form-label {
		font-size: 14px;
		color: #606266;
		margin-bottom: 8px;
	}
	
	.form-content {
		position: relative;
	}
	
	.input, .picker-item {
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding: 0 12px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #fff;
		font-size: 14px;
		color: #606266;
		box-sizing: border-box;
	}
	
	.textarea {
		width: 100%;
		height: 200px;
		padding: 8px 12px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #fff;
		font-size: 14px;
		color: #606266;
		box-sizing: border-box;
	}
	
	.recipient-display {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 12px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #f5f7fa;
	}
	
	.recipient-type {
		color: #606266;
		margin-right: 4px;
	}
	
	.recipient-name {
		color: #409EFF;
		font-weight: bold;
	}
	
	.form-actions {
		margin-top: 30px;
		text-align: center;
	}
	
	.btn-primary {
		padding: 10px 20px;
		background-color: #409EFF;
		color: #fff;
		border-radius: 4px;
		font-size: 14px;
		border: none;
		min-width: 120px;
	}
	
	.refresh-btn {
		width: 30px;
		height: 30px;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: #409EFF;
		background-color: #ecf5ff;
	}
	
	.refresh-btn:hover {
		background-color: #d9ecff;
	}
	
	.refresh-icon {
		font-size: 18px;
		font-weight: bold;
	}
	
	.vendor-name {
		font-weight: bold;
	}
	
	.booth-info {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #909399;
		margin-top: 3px;
	}
	
	.user-id {
		color: #909399;
	}
	
	.booth-name {
		color: #409EFF;
	}
</style> 