<template>
	<div class="user-management">
		<!-- 搜索栏（Element Plus 样式与 Vue2 版本基本一致） -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入姓名或手机号" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
		</div>

		<!-- 表格（Element Plus 的插槽语法保持不变） -->
		<el-table :data="vendorList" stripe style="width: 100%">
			<!-- 各列定义保持不变 -->
			<el-table-column prop="vendorId" label="摊主ID" width="120" />
			<el-table-column prop="vendorName" label="姓名" width="120" />
			<el-table-column label="照片" width="100">
				<template #default="{row}">
					<el-avatar :src="row.vendorPic" />
				</template>
			</el-table-column>
			<el-table-column prop="boothName" label="摊位" />
			<el-table-column label="身份证号" width="180">
				<template #default="{row}">
					{{ formatIdCard(row.idNumber) }}
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
			<el-table-column prop="loginTime" label="最后登录" width="180">
				<template #default="{row}">
					{{ formatTime(row.loginTime) }}
				</template>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="80">
				<template #default="{row}">
					{{ { '1':'男', '2':'女' }[row.sex] || '-' }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" fixed="right">
				<template #default="{row}">
					<el-button size="small" @click="showDetail(row)">详情</el-button>
					<el-button type="danger" size="small" @click="deleteUser(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页（Element Plus 分页属性保持一致） -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" :title="currentVendor?.vendorName + ' - 详细信息'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="摊主ID">
					{{ currentVendor?.vendorId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="姓名">
					{{ currentVendor?.vendorName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="性别">
					{{ { '1':'男', '2':'女' }[currentVendor?.sex] || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="身份证号">
					{{ currentVendor?.idNumber || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentVendor?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位名称">
					{{ currentVendor?.boothName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="注册时间">
					{{ formatTime(currentVendor?.registerTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="最后登录">
					{{ formatTime(currentVendor?.loginTime) || '0' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位状态" :span="2">
					{{ currentVendor?.boothState || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="住址" :span="2">
					{{ currentVendor?.address || '-' }}
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
		reactive,
		onMounted
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import dayjs from 'dayjs'
	import { Refresh } from '@element-plus/icons-vue'

	// 响应式数据（使用组合式API风格）
	const searchKey = ref('')
	const vendorList = ref([])
	const pagination = reactive({
		current: 1,
		size: 10,
		total: 0
	})

	const detailVisible = ref(false)
	const currentVendor = ref({
		vendorId: '',
		vendorName: '',
		sex: '1',
		phone: '',
		vendorPic: '',
		boothName: '',
		idNumber: '',
		address: '',
		registerTime: '',
		loginTime: '',
		boothState: ''
	})

	// 方法（直接写在setup作用域中）
	const formatPhone = (phone) => {
		return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
	}

	const formatIdCard = (idCard) => {
		return idCard.replace(/(\d{3})\d{11}(\d{4})/, '$1***********$2')
	}

	const formatTime = (timestamp) => {
		// 如果 timestamp 为空或无效，直接返回 null（触发 || 回退）
		if (timestamp === null || timestamp === undefined || !dayjs(timestamp).isValid()) {
			return null;
		}
		return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
	};

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

	const showDetail = (row) => {
		currentVendor.value = {
			...row
		}
		detailVisible.value = true
	}


	const loadData = async () => {

		// // 模拟 API 延迟
		// await new Promise(resolve => setTimeout(resolve, 500))

		// // 使用模拟数据
		const mockData = generateAdvancedMock(50)
		// vendorList.value = mockData.slice(
		// 	(pagination.current - 1) * pagination.size,
		// 	pagination.current * pagination.size
		// )
		// pagination.total = mockData.length

		console.log('摊主列表', mockData)

		try {
			uni.request({
				url: `${uni.$baseUrl}/vendor/getVendorList`,
				method: 'GET',
				header: {
					'Authorization': uni.getStorageSync('admin_token')
				},
				success(res) {
					console.log('摊主数据', res.data.data)
					vendorList.value = res.data.data
					pagination.total = res.data.data.length
				}
			})


		} catch (error) {
			console.error('摊主数据获取失败:', error)
			uni.showToast({
				title: '摊主数据获取失败',
				icon: 'none'
			})
		}

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

	const refreshData = () => {
		searchKey.value = '' // 清空搜索关键词
		loadData() // 重新加载数据
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