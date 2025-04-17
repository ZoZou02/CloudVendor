<template>
	<div class="fine-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入摊主姓名或手机号" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
		</div>

		<!-- 罚款记录表格 -->
		<el-table :data="fineList" stripe style="width: 100%">
			<el-table-column prop="fineId" label="罚款ID" width="180" />
			<el-table-column prop="vendorName" label="摊主姓名" width="120" />
			<el-table-column prop="phone" label="联系电话" width="150">
				<template #default="{ row }">
					{{ formatPhone(row.phone) }}
				</template>
			</el-table-column>
			<el-table-column prop="boothName" label="摊位名称" width="120" />
			<el-table-column prop="fineAmount" label="罚款金额" width="120">
				<template #default="{ row }">
					¥{{ row.fineAmount }}
				</template>
			</el-table-column>
			<el-table-column prop="fineTime" label="罚款时间" width="180">
				<template #default="{ row }">
					{{ formatTime(row.fineTime) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100">
				<template #default="{ row }">
					<el-tag :type="statusTypeMap[row.status]">{{ statusMap[row.status] }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="reason" label="罚款原因" show-overflow-tooltip />
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
		<el-dialog v-model="detailVisible" :title="currentFine?.vendorName + ' - 罚款详情'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="罚款ID">
					{{ currentFine?.fineId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊主姓名">
					{{ currentFine?.vendorName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentFine?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位名称">
					{{ currentFine?.boothName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="罚款金额">
					¥{{ currentFine?.fineAmount || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="罚款时间">
					{{ formatTime(currentFine?.fineTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="状态">
					<el-tag :type="statusTypeMap[currentFine?.status]">
						{{ statusMap[currentFine?.status] || '-' }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="执法人员">
					{{ currentFine?.inspectorName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="罚款原因" :span="2">
					{{ currentFine?.reason || '-' }}
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
const fineList = ref([])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const detailVisible = ref(false)
const currentFine = ref(null)

// 状态映射
const statusMap = {
	'UNPAID': '未缴费',
	'PAID': '已缴费'
}

const statusTypeMap = {
	'UNPAID': 'danger',
	'PAID': 'success'
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
	currentFine.value = { ...row }
	detailVisible.value = true
}

// 生成模拟数据
const generateMockData = () => {
	return mock({
		'list|20': [{
			'fineId|+1': 10000,
			'vendorName': '@cname',
			'phone': /^1[3-9]\d{9}$/,
			'boothName': '@ctitle(3,5)区-@natural(1,100)号摊位',
			'fineAmount|50-500': 50,
			'fineTime': '@datetime',
			'status|1': ['UNPAID', 'PAID'],
			'reason': '@csentence(10,30)',
			'inspectorName': '@cname'
		}]
	}).list
}

const loadData = async () => {
	try {
		uni.request({
			url: `${uni.$baseUrl}/admin/fineList`,
			method: 'GET',
			header: {
				'Authorization': uni.getStorageSync('admin_token')
			},
			success(res) {
				console.log('罚款列表数据', res.data.data)
				// 如果有搜索关键字，过滤数据
				const filteredData = searchKey.value
					? res.data.data.filter(item => 
						item.vendorName.includes(searchKey.value) || 
						item.phone.includes(searchKey.value)
					)
					: res.data.data || generateMockData()

				// 分页处理
				fineList.value = filteredData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = filteredData.length
			},
			fail(err) {
				console.error('罚款列表获取失败:', err)
				// 使用模拟数据
				const mockData = generateMockData()
				fineList.value = mockData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = mockData.length
				
				uni.showToast({
					title: '罚款列表获取失败',
					icon: 'none'
				})
			}
		})
	} catch (error) {
		console.error('罚款数据获取失败:', error)
		// 使用模拟数据
		const mockData = generateMockData()
		fineList.value = mockData.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
		pagination.total = mockData.length
		
		uni.showToast({
			title: '罚款数据获取失败',
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
.fine-management {
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
