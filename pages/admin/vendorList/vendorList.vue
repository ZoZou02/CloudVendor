<template>
	<div class="user-management">
		<!-- 搜索栏（Element Plus 样式与 Vue2 版本基本一致） -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入姓名或手机号" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
		</div>

		<!-- 表格（Element Plus 的插槽语法保持不变） -->
		<el-table :data="vendorList" stripe style="width: 100%">
			<!-- 各列定义保持不变 -->
			<el-table-column prop="vendorId" label="摊主ID" width="120" />
			<el-table-column prop="name" label="姓名" width="120" />
			<el-table-column label="照片" width="100">
				<template #default="{row}">
					<el-avatar :src="row.avatar" />
				</template>
			</el-table-column>
			<el-table-column prop="stallName" label="摊位" />
			<el-table-column label="身份证号" width="180">
				<template #default="{row}">
					{{ formatIdCard(row.idCard) }}
				</template>
			</el-table-column>
			<el-table-column label="手机号" width="150">
				<template #default="{row}">
					{{ formatPhone(row.phone) }}
				</template>
			</el-table-column>
			<el-table-column prop="address" label="住址" show-overflow-tooltip />
			<el-table-column prop="registerTime" label="注册时间" width="180">
				<template #default="{row}">
					{{ formatTime(row.registerTime) }}
				</template>
			</el-table-column>
			<el-table-column prop="lastLogin" label="最后登录" width="180">
				<template #default="{row}">
					{{ formatTime(row.lastLogin) }}
				</template>
			</el-table-column>
			<el-table-column prop="gender" label="性别" width="80">
				<template #default="{row}">
					{{ row.gender === 1 ? '男' : '女' }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" fixed="right">
				<template #default="{row}">
					<el-button size="small" @click="viewDetail(row)">详情</el-button>
					<el-button type="danger" size="small" @click="deleteUser(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页（Element Plus 分页属性保持一致） -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import dayjs from 'dayjs'

	// 响应式数据（使用组合式API风格）
	const searchKey = ref('')
	const vendorList = ref([])
	const pagination = reactive({
		current: 1,
		size: 10,
		total: 0
	})

	// 方法（直接写在setup作用域中）
	const formatPhone = (phone) => {
		return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
	}

	const formatIdCard = (idCard) => {
		return idCard.replace(/(\d{3})\d{11}(\d{4})/, '$1***********$2')
	}

	const formatTime = (timestamp) => {
		return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
	}

	// 模拟数据
	// 更真实的模拟数据生成
	import {
		mock
	} from 'mockjs'

	const generateAdvancedMock = () => {
		return mock({
			'list|50': [{
				'vendorId|+1': 10000,
				'name': '@cname',
				'avatar': "@image('100x100', '#4A7A7C', 'avatar')",
				'stallName': '@ctitle(3,5)区-@natural(1,100)号摊位',
				'idCard': /^110[0-9]{4}19[8-9][0-9]{5}[0-9]{3}[0-9Xx]$/,
				'phone': /^1[3-9]\d{9}$/,
				'address': '@county(true)',
				'registerTime': '@datetime',
				'lastLogin': '@datetime',
				'gender|1': [0, 1]
			}]
		}).list
	}


	const loadData = async () => {

		// 模拟 API 延迟
		await new Promise(resolve => setTimeout(resolve, 500))

		// 使用模拟数据
		const mockData = generateAdvancedMock(50)
		vendorList.value = mockData.slice(
			(pagination.current - 1) * pagination.size,
			pagination.current * pagination.size
		)
		pagination.total = mockData.length

		console.log('摊主列表', mockData)

	}

	const handlePageChange = (page) => {
		pagination.current = page
		loadData()
	}

	const deleteUser = async (user) => {
		try {
			await ElMessageBox.confirm(
				`确定删除 ${user.name} 吗？`,
				'提示', {
					type: 'warning'
				}
			)
			await http.delete(`/api/vendors/${user.vendorId}`)
			ElMessage.success('删除成功')
			loadData()
		} catch (error) {
			if (error !== 'cancel') {
				ElMessage.error('删除失败')
			}
		}
	}

	// 生命周期钩子
	onMounted(() => {
		loadData()
	})
</script>

<!-- 样式部分保持不变 -->
<style scoped>
	.container {
		height: 100vh;
		display: flex;
	}

	.user-management {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		padding: 20px;
		overflow: hidden;
	}

	.table-wrapper {
		flex: 1;
		min-height: 0;
		overflow: auto;
	}

	.pagination {
		margin-top: 16px;
		flex-shrink: 0;
	}


	.search-bar {
		margin-bottom: 20px;
	}

	.el-pagination {
		margin-top: 20px;
		text-align: right;
	}
</style>