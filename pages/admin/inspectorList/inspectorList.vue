<template>
	<div class="officer-management">
		<!-- 搜索栏 -->
		<div class="search-header">
			<div class="search-group">
				<el-input v-model="searchParams.keyword" placeholder="姓名/手机/执法证号" clearable style="width: 220px" />
				<el-select v-model="searchParams.street" placeholder="所属街道" clearable style="width: 180px">
					<el-option v-for="item in streetOptions" :key="item" :label="item" :value="item" />
				</el-select>
				<el-button type="primary" @click="loadData">搜索</el-button>
			</div>
			<div class="action-group">
				<el-button type="success" @click="handleCreate">新增城管</el-button>
				<el-button @click="exportExcel">导出表格</el-button>
			</div>
		</div>

		<!-- 数据表格 -->
		<el-table :data="officerData" border highlight-current-row style="margin-top: 15px">
			<el-table-column type="selection" width="45" />
			<el-table-column prop="lawEnforcementNumber" label="执法证号" width="160" />
			<el-table-column prop="name" label="姓名" width="120" />
			<el-table-column label="证件照" width="110">
				<template #default="{ row }">
					<el-image :src="row.avatar" :preview-src-list="[row.avatar]" fit="cover"
						style="width:80px;height:80px">
						<template #error>
							<div class="image-error">加载失败</div>
						</template>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="80" sortable />
			<el-table-column prop="gender" label="性别" width="80">
				<template #default="{ row }">
					{{ { '1':'男', '2':'女' }[row.gender] || '-' }}
				</template>
			</el-table-column>
			<el-table-column prop="phone" label="联系电话" width="130" />
			<el-table-column prop="street" label="所属街道" show-overflow-tooltip />
			<el-table-column prop="serviceYears" label="工作年限" width="100" sortable />
			<el-table-column label="操作" width="150" fixed="right">
				<template #default="{ row }">
					<el-button link type="primary" @click="showDetail(row)">详情</el-button>
					<el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-wrapper">
			<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size"
				:total="pagination.total" layout="total, prev, pager, next, jumper"
				@current-change="handlePageChange" />
		</div>

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" :title="currentOfficer?.name + ' - 详细信息'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="执法证号">
					{{ currentOfficer?.lawEnforcementNumber || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="姓名">
					{{ currentOfficer?.name || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="性别">
					{{ { '1':'男', '2':'女' }[currentOfficer?.gender] || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="年龄">
					{{ currentOfficer?.age || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentOfficer?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="所属街道">
					{{ currentOfficer?.street || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="入职时间">
					{{ currentOfficer?.entryDate || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="工作年限">
					{{ currentOfficer?.serviceYears || '0' }} 年
				</el-descriptions-item>
				<el-descriptions-item label="负责区域" :span="2">
					{{ currentOfficer?.responsibleArea || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="备注信息" :span="2">
					{{ currentOfficer?.remark || '无' }}
				</el-descriptions-item>
			</el-descriptions>
			<template #footer>
				<el-button @click="detailVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		mock
	} from 'mockjs'

	// 响应式数据
	const streetOptions = ref([
		'朝阳街道', '红山街道', '新城街道',
		'滨江街道', '古东街道', '南城街道'
	])

	const pagination = reactive({
		current: 1,
		size: 10,
		total: 0
	})

	const searchParams = reactive({
		keyword: '',
		street: ''
	})

	const officerData = ref([])
	const detailVisible = ref(false)
	const currentOfficer = ref({
		lawEnforcementNumber: '',
		name: '',
		gender: '1',
		age: 0,
		phone: '',
		street: '',
		serviceYears: 0,
		entryDate: '',
		responsibleArea: '',
		remark: ''
	})

	// 方法声明
	const generateMockData = () => {
		return mock({
			'list|80': [{
				'id|+1': 1000,
				'lawEnforcementNumber': /[A-Z]{2}\d{6}/,
				'name': '@cname',
				'avatar': "@image('200x200', '#4A7A7C', 'avatar')",
				'age|22-55': 1,
				'gender|1': ['1', '2'],
				'phone': /^1[3-9]\d{9}$/,
				'street|1': streetOptions.value,
				'serviceYears|0-20': 1,
				'entryDate': '@date("yyyy-MM-dd")',
				'responsibleArea': '@ctitle(6,10)',
				'remark': '@csentence(0,20)'
			}]
		}).list
	}

	const loadData = () => {
		const allData = generateMockData()
		officerData.value = allData.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
		pagination.total = allData.length
	}

	const handleCreate = () => {
		currentOfficer.value = {
			lawEnforcementNumber: '',
			name: '',
			gender: '1',
			age: 0,
			phone: '',
			street: '',
			serviceYears: 0,
			entryDate: '',
			responsibleArea: '',
			remark: ''
		}
		detailVisible.value = true
	}

	// const exportExcel = () => {
	// 	import('xlsx').then(({
	// 		utils,
	// 		writeFile
	// 	}) => {
	// 		const ws = utils.json_to_sheet(officerData.value)
	// 		const wb = utils.book_new()
	// 		utils.book_append_sheet(wb, ws, '城管数据')
	// 		writeFile(wb, `城管信息_${new Date().toLocaleDateString()}.xlsx`)
	// 	})
	// }

	const handlePageChange = (page) => {
		pagination.current = page
		loadData()
	}

	const showDetail = (row) => {
		currentOfficer.value = {
			...row
		}
		detailVisible.value = true
	}

	const handleDelete = (id) => {
		ElMessageBox.confirm('确定删除该城管信息吗？', '警告', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			officerData.value = officerData.value.filter(item => item.id !== id)
			ElMessage.success('删除成功')
		}).catch(() => {})
	}

	// 初始化加载
	loadData()
</script>

<style scoped>
	.officer-management {
		padding: 20px;
		background: #fff;
		border-radius: 8px;
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
	}

	.search-group {
		display: flex;
		gap: 10px;
	}

	.action-group {
		display: flex;
		gap: 12px;
	}

	.pagination-wrapper {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}

	.image-error {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f7fa;
		color: #909399;
		font-size: 12px;
	}
</style>