<template>
	<div class="violation-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入摊主姓名或违规记录ID" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
		</div>

		<!-- 违规记录表格 -->
		<el-table :data="violationList" stripe style="width: 100%">
			<el-table-column prop="recordId" label="违规记录ID" width="180" />
			<el-table-column prop="violation" label="违规类型" width="120" />
			<el-table-column prop="recordTime" label="违规时间" width="180">
				<template #default="{ row }">
					{{ formatTime(row.recordTime) }}
				</template>
			</el-table-column>
			<el-table-column prop="deductionPoints" label="扣除积分" width="100" />
			<el-table-column prop="appealStatus" label="申诉状态" width="120">
				<template #default="{ row }">
					<el-tag :type="statusTypeMap[row.appealStatus]">{{ statusMap[row.appealStatus] }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="violationDescription" label="违规描述" show-overflow-tooltip />
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
		<el-dialog v-model="detailVisible" title="违规记录详情" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="违规记录ID">
					{{ currentViolation?.recordId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="违规类型">
					{{ currentViolation?.violation || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="违规时间">
					{{ formatTime(currentViolation?.recordTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="扣除积分">
					{{ currentViolation?.deductionPoints || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="申诉状态">
					<el-tag :type="statusTypeMap[currentViolation?.appealStatus]">
						{{ statusMap[currentViolation?.appealStatus] || '-' }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="摊位ID">
					{{ currentViolation?.tBoothId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="违规描述" :span="2">
					{{ currentViolation?.violationDescription || '-' }}
				</el-descriptions-item>
				<el-descriptions-item v-if="currentViolation?.violationPic" label="违规照片" :span="2">
					<el-image 
						style="width: 100%; max-height: 300px" 
						:src="currentViolation.violationPic" 
						:preview-src-list="[currentViolation.violationPic]"
						fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item v-if="currentViolation?.appealReason" label="申诉理由" :span="2">
					{{ currentViolation?.appealReason || '-' }}
				</el-descriptions-item>
				<el-descriptions-item v-if="currentViolation?.appealResponse" label="申诉回复" :span="2">
					{{ currentViolation?.appealResponse || '-' }}
				</el-descriptions-item>
				<el-descriptions-item v-if="currentViolation?.appealTime" label="申诉时间" :span="2">
					{{ formatTime(currentViolation?.appealTime) || '-' }}
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
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { Refresh } from '@element-plus/icons-vue'
// 引入mockjs
import { mock } from 'mockjs'

// 响应式数据
const searchKey = ref('')
const violationList = ref([])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const detailVisible = ref(false)
const currentViolation = ref(null)

// 状态映射
const statusMap = {
	'pending': '待处理',
	'approved': '已通过',
	'rejected': '已驳回',
	'none': '未申诉'
}

const statusTypeMap = {
	'pending': 'warning',
	'approved': 'success',
	'rejected': 'danger',
	'none': 'info'
}

// 方法
const formatTime = (timestamp) => {
	if (!timestamp || !dayjs(timestamp).isValid()) {
		return null
	}
	return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

const showDetail = (row) => {
	currentViolation.value = { ...row }
	detailVisible.value = true
}

// 生成模拟数据
const generateMockData = () => {
	return mock({
		'list|20': [{
			'id|+1': 1,
			'recordId': 'Vio@natural(1000000000000, 9999999999999)',
			'recordTime': '@datetime',
			'violation|1': ['无证经营', '占道经营', '食品安全问题', '卫生不达标', '超时经营'],
			'violationPic': '@boolean(3, 7)' ? '../../../static/violation/violation_@id.jpg' : null,
			'deductionPoints|1-5': 1,
			'violationDescription': '@csentence(10,30)',
			'appealStatus|1': ['pending', 'approved', 'rejected', 'none'],
			'appealReason': '@boolean(3, 7)' ? '@csentence(10,50)' : null,
			'appealResponse': '@boolean(2, 8)' ? '@csentence(10,50)' : null,
			'appealTime': '@boolean(3, 7)' ? '@datetime' : null,
			'tInspectorId|1-10': 1,
			'tBoothId|1-100': 1
		}]
	}).list
}

const loadData = async () => {
	try {
		uni.request({
			url: `${uni.$baseUrl}/admin/allViolationRecords`,
			method: 'GET',
			header: {
				'Authorization': uni.getStorageSync('admin_token')
			},
			success(res) {
				console.log('违规记录数据', res.data.data)
				// 如果有搜索关键字，过滤数据
				const filteredData = searchKey.value
					? res.data.data.filter(item => 
						(item.recordId && item.recordId.includes(searchKey.value))
					)
					: res.data.data || generateMockData()

				// 分页处理
				violationList.value = filteredData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = filteredData.length
			},
			fail(err) {
				console.error('违规记录获取失败:', err)
				// 使用模拟数据
				const mockData = generateMockData()
				violationList.value = mockData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = mockData.length
				
				uni.showToast({
					title: '违规记录获取失败',
					icon: 'none'
				})
			}
		})
	} catch (error) {
		console.error('违规记录获取失败:', error)
		// 使用模拟数据
		const mockData = generateMockData()
		violationList.value = mockData.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
		pagination.total = mockData.length
		
		uni.showToast({
			title: '违规记录获取失败',
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
.violation-management {
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