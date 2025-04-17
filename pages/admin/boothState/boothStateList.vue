<template>
	<div class="booth-state-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入摊位名称或摊主姓名" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
		</div>

		<!-- 摊位状态表格 -->
		<el-table :data="boothList" stripe style="width: 100%">
			<el-table-column prop="boothId" label="摊位ID" width="120" />
			<el-table-column prop="boothName" label="摊位名称" width="150" />
			<el-table-column prop="vendorName" label="摊主姓名" width="120" />
			<el-table-column prop="phone" label="联系电话" width="150">
				<template #default="{ row }">
					{{ formatPhone(row.phone) }}
				</template>
			</el-table-column>
			<el-table-column prop="areaName" label="所属区域" width="120" />
			<el-table-column prop="streetName" label="所属街道" width="120" />
			<el-table-column prop="boothType" label="摊位类型" width="120">
				<template #default="{ row }">
					{{ typeMap[row.boothType] || row.boothType }}
				</template>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100">
				<template #default="{ row }">
					<el-tag :type="stateTypeMap[row.state]">{{ stateMap[row.state] }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="lastOperateTime" label="最后营业时间" width="180">
				<template #default="{ row }">
					{{ formatTime(row.lastOperateTime) }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template #default="{ row }">
					<el-button size="small" @click="showDetail(row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" :title="currentBooth?.boothName + ' - 详细信息'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="摊位ID">
					{{ currentBooth?.boothId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位名称">
					{{ currentBooth?.boothName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊主姓名">
					{{ currentBooth?.vendorName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentBooth?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="所属区域">
					{{ currentBooth?.areaName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="所属街道">
					{{ currentBooth?.streetName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位类型">
					{{ typeMap[currentBooth?.boothType] || currentBooth?.boothType || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="状态">
					<el-tag :type="stateTypeMap[currentBooth?.state]">
						{{ stateMap[currentBooth?.state] || '-' }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="最后营业时间">
					{{ formatTime(currentBooth?.lastOperateTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="创建时间">
					{{ formatTime(currentBooth?.createTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="位置信息" :span="2">
					{{ currentBooth?.location || '-' }}
				</el-descriptions-item>
			</el-descriptions>
			<template #footer>
				<el-button @click="detailVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { Refresh } from '@element-plus/icons-vue'
// 引入mockjs
import { mock } from 'mockjs'

// 响应式数据
const searchKey = ref('')
const boothList = ref([])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const detailVisible = ref(false)
const currentBooth = ref(null)

// 状态映射
const stateMap = {
	'OPERATING': '营业中',
	'CLOSED': '已关闭',
	'SUSPENDED': '已暂停',
	'PENDING': '待审批'
}

const stateTypeMap = {
	'OPERATING': 'success',
	'CLOSED': 'info',
	'SUSPENDED': 'warning',
	'PENDING': 'danger'
}

const typeMap = {
	'FOOD': '食品类',
	'ACCESSORIES': '饰品类',
	'DAILY': '日用品类',
	'CLOTHING': '纺织服装类',
	'FLOWERS': '花卉水果类',
	'ELECTRONICS': '电子产品类'
}

// 方法
const formatPhone = (phone) => {
	return phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const formatTime = (timestamp) => {
	if (!timestamp || !dayjs(timestamp).isValid()) {
		return null
	}
	return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

const showDetail = (row) => {
	currentBooth.value = { ...row }
	detailVisible.value = true
}

// 生成模拟数据
const generateMockData = () => {
	return mock({
		'list|20': [{
			'boothId|+1': 10000,
			'boothName': '@ctitle(3,5)区-@natural(1,100)号摊位',
			'vendorName': '@cname',
			'phone': /^1[3-9]\d{9}$/,
			'areaName': '@ctitle(2,4)区',
			'streetName': '@ctitle(2,3)街道',
			'boothType|1': ['FOOD', 'ACCESSORIES', 'DAILY', 'CLOTHING', 'FLOWERS', 'ELECTRONICS'],
			'state|1': ['OPERATING', 'CLOSED', 'SUSPENDED', 'PENDING'],
			'lastOperateTime': '@datetime',
			'createTime': '@datetime',
			'location': '@county(true)'
		}]
	}).list
}

const loadData = async () => {
	try {
		uni.request({
			url: `${uni.$baseUrl}/admin/boothStateList`,
			method: 'GET',
			header: {
				'Authorization': uni.getStorageSync('admin_token')
			},
			success(res) {
				console.log('摊位状态列表数据', res.data.data)
				// 如果有搜索关键字，过滤数据
				const filteredData = searchKey.value
					? res.data.data.filter(item => 
						item.boothName.includes(searchKey.value) || 
						item.vendorName.includes(searchKey.value)
					)
					: res.data.data || generateMockData()

				// 分页处理
				boothList.value = filteredData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = filteredData.length
			},
			fail(err) {
				console.error('摊位状态列表获取失败:', err)
				// 使用模拟数据
				const mockData = generateMockData()
				boothList.value = mockData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = mockData.length
				
				uni.showToast({
					title: '摊位状态列表获取失败',
					icon: 'none'
				})
			}
		})
	} catch (error) {
		console.error('摊位状态数据获取失败:', error)
		// 使用模拟数据
		const mockData = generateMockData()
		boothList.value = mockData.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
		pagination.total = mockData.length
		
		uni.showToast({
			title: '摊位状态数据获取失败',
			icon: 'none'
		})
	}
}

const handlePageChange = (page) => {
	pagination.current = page
	loadData()
}

const refreshData = () => {
	searchKey.value = '' // 清空搜索关键词
	loadData() // 重新加载数据
}

// 生命周期钩子
onMounted(() => {
	loadData()
})
</script>

<style scoped>
.booth-state-management {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: hidden;
}

.search-bar {
	margin-bottom: 20px;
}

.el-pagination {
	margin-top: 20px;
	text-align: right;
}
</style> 