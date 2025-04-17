<template>
	<div class="inspector-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入姓名或执法证号" style="width: 300px" clearable />
			<el-select v-model="selectedStreet" placeholder="所属街道" clearable style="width: 180px">
				<el-option v-for="item in streetOptions" :key="item" :label="item" :value="item" />
			</el-select>
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
			<el-button type="success" @click="handleCreate">新增城管</el-button>
		</div>

		<!-- 城管列表表格 -->
		<el-table :data="inspectorList" stripe style="width: 100%">
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="lawEnforcementNumber" label="执法证号" width="120" />
			<el-table-column prop="name" label="姓名" width="100" />
			<el-table-column label="证件照" width="100">
				<template #default="{ row }">
					<el-avatar :src="row.avatar" :size="50" />
				</template>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="80" sortable />
			<el-table-column prop="gender" label="性别" width="80">
				<template #default="{ row }">
					{{ { '1':'男', '2':'女' }[row.gender] || '-' }}
				</template>
			</el-table-column>
			<el-table-column prop="phone" label="联系电话" width="120" />
			<el-table-column prop="street" label="所属街道" width="120" />
			<el-table-column prop="responsibleArea" label="负责区域" show-overflow-tooltip />
			<el-table-column label="操作" width="150" fixed="right">
				<template #default="{ row }">
					<el-button size="small" @click="showDetail(row)">详情</el-button>
					<el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" :title="currentInspector?.name + ' - 详细信息'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="ID">
					{{ currentInspector?.id || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="执法证号">
					{{ currentInspector?.lawEnforcementNumber || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="姓名">
					{{ currentInspector?.name || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="性别">
					{{ { '1':'男', '2':'女' }[currentInspector?.gender] || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="年龄">
					{{ currentInspector?.age || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentInspector?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="所属街道">
					{{ currentInspector?.street || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="入职时间">
					{{ formatTime(currentInspector?.entryDate) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="工作年限">
					{{ currentInspector?.serviceYears || '0' }} 年
				</el-descriptions-item>
				<el-descriptions-item label="负责区域" :span="2">
					{{ currentInspector?.responsibleArea || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="备注信息" :span="2">
					{{ currentInspector?.remark || '无' }}
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
const selectedStreet = ref('')
const inspectorList = ref([])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const detailVisible = ref(false)
const currentInspector = ref(null)

// 街道选项
const streetOptions = ref([
	'朝阳街道', '红山街道', '新城街道',
	'滨江街道', '古东街道', '南城街道'
])

// 方法
const formatTime = (timestamp) => {
	if (!timestamp || !dayjs(timestamp).isValid()) {
		return null
	}
	return dayjs(timestamp).format('YYYY-MM-DD')
}

const showDetail = (row) => {
	currentInspector.value = { ...row }
	detailVisible.value = true
}


const loadData = async () => {
	try {
		// 使用API获取数据
		uni.request({
			url: `${uni.$baseUrl}/admin/inspectorList`,
			method: 'GET',
			header: {
				'Authorization': uni.getStorageSync('admin_token')
			},
			data: {
				// 传递搜索参数
				searchKey: searchKey.value,
				street: selectedStreet.value,
				page: pagination.current,
				size: pagination.size
			},
			success(res) {
				if (res.data.code === 200 && res.data.success) {
					// 数据映射转换
					const apiData = res.data.data || [];
					inspectorList.value = apiData.map(item => ({
						id: item.id,
						lawEnforcementNumber: item.enforcementId,
						name: item.inspectorName,
						avatar: item.inspectorPic || "@image('100x100', '#4A7A7C', 'avatar')",
						gender: item.sex,
						phone: item.phone,
						street: item.tstreetId, // 街道ID，可能需要额外处理转换为街道名称
						// 其他字段可能需要从后端获取或设置默认值
						age: item.age || '-',
						serviceYears: item.serviceYears || 0,
						entryDate: item.entryDate || '',
						responsibleArea: item.responsibleArea || '-',
						remark: item.remark || '-'
					}));
					
					// 设置总数据量，可能需要从响应中获取
					pagination.total = res.data.total || apiData.length;
					
					console.log('城管列表数据获取成功');
				} else {
					uni.showToast({
						title: res.data.message || '获取城管列表失败',
						icon: 'none'
					})
				}
			},
			fail(err) {
				console.error('城管列表获取失败:', err);
				uni.showToast({
					title: '城管列表获取失败',
					icon: 'none'
				})
			}
		})
	} catch (error) {
		console.error('城管数据获取失败:', error);
		uni.showToast({
			title: '城管数据获取失败',
			icon: 'none'
		})
	}
}

const handlePageChange = (page) => {
	pagination.current = page
	loadData()
}

const handleCreate = () => {
	// 创建新城管的逻辑
	currentInspector.value = {
		id: '',
		lawEnforcementNumber: '',
		name: '',
		gender: '1',
		age: 30,
		phone: '',
		street: '',
		serviceYears: 0,
		entryDate: dayjs().format('YYYY-MM-DD'),
		responsibleArea: '',
		remark: ''
	}
	detailVisible.value = true
	// 这里可以改为跳转到详细编辑页面
	// uni.navigateTo({
	//   url: '/pages/admin/inspectorDetail/inspectorDetail'
	// })
}

const handleDelete = (id) => {
	ElMessageBox.confirm('确定删除该城管信息吗？', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		// 实际项目应调用API删除
		inspectorList.value = inspectorList.value.filter(item => item.id !== id)
		ElMessage.success('删除成功')
	}).catch(() => {
		// 用户取消删除
	})
}

const refreshData = () => {
	searchKey.value = '' // 清空搜索关键词
	selectedStreet.value = '' // 清空街道筛选
	pagination.current = 1 // 重置页码
	loadData() // 重新加载数据
}

// 生命周期钩子
onMounted(() => {
	loadData()
})
</script>

<style scoped>
.inspector-management {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: hidden;
}

.search-bar {
	margin-bottom: 20px;
	display: flex;
	gap: 10px;
}

.el-pagination {
	margin-top: 20px;
	text-align: right;
}
</style>