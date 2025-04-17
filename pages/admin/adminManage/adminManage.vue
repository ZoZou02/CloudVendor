<template>
	<div class="admin-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入管理员用户名" style="width: 300px" clearable />
			<el-button type="primary" @click="searchAdmin">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
			<el-button type="success" @click="showAddModal">新增管理员</el-button>
		</div>
		
		<!-- 管理员表格 -->
		<el-table :data="adminList" stripe style="width: 100%">
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="username" label="用户名" width="150" />
			<el-table-column prop="role" label="角色" width="120" />
			<el-table-column prop="createTime" label="创建时间" width="180" />
			<el-table-column label="操作" width="150" fixed="right">
				<template #default="{ row }">
					<el-button size="small" type="primary" @click="editAdmin(row)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteAdmin(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />
		
		<!-- 添加/编辑管理员弹窗 -->
		<el-dialog v-model="showModal" :title="editingAdmin ? '编辑管理员' : '添加管理员'" width="500px">
			<el-form :model="formData" label-width="80px">
				<el-form-item label="用户名">
					<el-input v-model="formData.username" placeholder="请输入用户名" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="formData.password" type="password" placeholder="请输入密码" />
					<div class="hint" v-if="editingAdmin">留空表示不修改密码</div>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
						<el-option v-for="item in roles" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="showModal = false">取消</el-button>
				<el-button type="primary" @click="saveAdmin">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { Refresh } from '@element-plus/icons-vue'

// 响应式数据
const searchKey = ref('')
const adminList = ref([
	{ id: 1, username: 'admin', role: '超级管理员', createTime: '2023-10-15 10:00:00' },
	{ id: 2, username: 'manager', role: '区域管理员', createTime: '2023-10-16 14:30:00' }
])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const showModal = ref(false)
const editingAdmin = ref(null)
const formData = reactive({
	username: '',
	password: '',
	role: ''
})
const roles = ref(['超级管理员', '区域管理员', '审核员'])

// 方法声明
const showAddModal = () => {
	editingAdmin.value = null
	formData.username = ''
	formData.password = ''
	formData.role = ''
	showModal.value = true
}

const editAdmin = (admin) => {
	editingAdmin.value = admin
	formData.username = admin.username
	formData.password = '' // 不回显密码
	formData.role = admin.role
	showModal.value = true
}

const deleteAdmin = (admin) => {
	ElMessageBox.confirm(
		`确定要删除管理员"${admin.username}"吗？`,
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}
	).then(() => {
		// 实际项目应调用API删除
		const index = adminList.value.findIndex(item => item.id === admin.id)
		if (index !== -1) {
			adminList.value.splice(index, 1)
			updatePagination()
		}
		ElMessage.success('删除成功')
	}).catch(() => {})
}

const saveAdmin = () => {
	// 表单验证
	if (!formData.username || !formData.role || (!editingAdmin.value && !formData.password)) {
		ElMessage.warning('请填写完整信息')
		return
	}
	
	// 模拟保存操作
	if (editingAdmin.value) {
		// 编辑已有管理员
		const index = adminList.value.findIndex(item => item.id === editingAdmin.value.id)
		if (index !== -1) {
			adminList.value[index] = {
				...editingAdmin.value,
				username: formData.username,
				role: formData.role
			}
		}
	} else {
		// 添加新管理员
		adminList.value.push({
			id: adminList.value.length > 0 ? Math.max(...adminList.value.map(item => item.id)) + 1 : 1,
			username: formData.username,
			role: formData.role,
			createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
		})
		updatePagination()
	}
	
	showModal.value = false
	ElMessage.success('保存成功')
}

const searchAdmin = () => {
	if (searchKey.value) {
		const filteredList = adminList.value.filter(item => 
			item.username.includes(searchKey.value) ||
			item.role.includes(searchKey.value)
		)
		pagination.total = filteredList.length
		adminList.value = filteredList.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
	} else {
		loadData()
	}
}

const handlePageChange = (page) => {
	pagination.current = page
	loadData()
}

const refreshData = () => {
	searchKey.value = ''
	loadData()
}

const loadData = () => {
	// 实际项目应从API获取数据
	// 这里使用模拟数据
	const mockAdmins = [
		{ id: 1, username: 'admin', role: '超级管理员', createTime: '2023-10-15 10:00:00' },
		{ id: 2, username: 'manager', role: '区域管理员', createTime: '2023-10-16 14:30:00' },
		{ id: 3, username: 'reviewer', role: '审核员', createTime: '2023-10-17 09:15:00' }
	]
	
	adminList.value = mockAdmins.slice(
		(pagination.current - 1) * pagination.size,
		pagination.current * pagination.size
	)
	pagination.total = mockAdmins.length
}

const updatePagination = () => {
	pagination.total = adminList.value.length
	loadData()
}

// 初始化加载
onMounted(() => {
	loadData()
})
</script>

<style scoped>
.admin-management {
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

.hint {
	font-size: 12px;
	color: #909399;
	margin-top: 4px;
}
</style> 