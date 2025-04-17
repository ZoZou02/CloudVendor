<template>
	<div class="apply-management">
		<!-- 搜索栏 -->
		<div class="search-bar">
			<el-input v-model="searchKey" placeholder="请输入申请人姓名或手机号" style="width: 300px" clearable />
			<el-button type="primary" @click="loadData">搜索</el-button>
			<el-button type="primary" @click="refreshData">
				<el-icon><Refresh /></el-icon>
				刷新
			</el-button>
		</div>

		<!-- 申请记录表格 -->
		<el-table :data="applyList" stripe style="width: 100%">
			<el-table-column prop="applicationId" label="申请ID" width="180" />
			<el-table-column prop="applicantName" label="申请人" width="120" />
			<el-table-column prop="phone" label="联系电话" width="150">
				<template #default="{ row }">
					{{ formatPhone(row.phone) }}
				</template>
			</el-table-column>
			<el-table-column prop="boothName" label="摊位名称" width="120" />

			<el-table-column prop="type" label="摊位类型" width="120">
				<template #default="{ row }">
					{{ row.type || '-' }}
				</template>
			</el-table-column>
			<el-table-column prop="applyTime" label="申请时间" width="180">
				<template #default="{ row }">
					{{ formatTime(row.applyTime) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100">
				<template #default="{ row }">
					<el-tag :type="statusTypeMap[row.status]">{{ statusMap[row.status] }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="申请说明" show-overflow-tooltip />
			<el-table-column label="操作" width="200" fixed="right">
				<template #default="{ row }">
					<el-button size="small" @click="showDetail(row)">详情</el-button>
					<el-button v-if="row.status === 'PENDING'" type="success" size="small"
						@click="handleApply(row, 'APPROVED')">通过</el-button>
					<el-button v-if="row.status === 'PENDING'" type="danger" size="small"
						@click="handleApply(row, 'REJECTED')">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination v-model:current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
			@current-change="handlePageChange" />

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" :title="currentApply?.vendorName + ' - 申请详情'" width="600px">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="申请ID">
					{{ currentApply?.applicationId || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="申请人">
					{{ currentApply?.applicantName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="联系电话">
					{{ currentApply?.phone || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位名称">
					{{ currentApply?.boothName || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="摊位类型">
					{{ currentApply?.type || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="申请时间">
					{{ formatTime(currentApply?.applyTime) || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="状态">
					<el-tag :type="statusTypeMap[currentApply?.status]">
						{{ statusMap[currentApply?.status] || '-' }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="申请说明" :span="2">
					{{ currentApply?.description || '-' }}
				</el-descriptions-item>
				<el-descriptions-item v-if="currentApply?.status === 'REJECTED'" label="拒绝理由" :span="2">
					{{ currentApply?.rejectReason || '-' }}
				</el-descriptions-item>
			</el-descriptions>
			<template #footer>
				<el-button @click="detailVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 拒绝理由弹窗 -->
		<el-dialog v-model="rejectVisible" title="拒绝申请" width="500px" :close-on-click-modal="false">
			<el-form :model="rejectForm" ref="rejectFormRef" :rules="rejectRules">
				<el-form-item label="拒绝理由" prop="reason" :label-width="'80px'">
					<el-input 
						v-model="rejectForm.reason" 
						type="textarea" 
						:rows="4" 
						placeholder="请输入拒绝理由（5-200字）" 
						maxlength="200"
						show-word-limit
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="cancelReject">取消</el-button>
				<el-button type="danger" @click="confirmReject" :disabled="!rejectForm.reason.trim()">确认拒绝</el-button>
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
const applyList = ref([])
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0
})

const detailVisible = ref(false)
const currentApply = ref(null)
const rejectVisible = ref(false)
const rejectFormRef = ref(null)
const rejectForm = reactive({
	reason: '',
	applicationId: null
})

// 状态映射
const statusMap = {
	'PENDING': '待审核',
	'APPROVED': '已通过',
	'REJECTED': '已拒绝'
}

const statusTypeMap = {
	'PENDING': 'warning',
	'APPROVED': 'success',
	'REJECTED': 'danger'
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
	currentApply.value = { ...row }
	// 如果是拒绝状态但没有理由，显示默认文本
	if (currentApply.value.status === 'REJECTED' && !currentApply.value.rejectReason) {
		currentApply.value.rejectReason = '无拒绝理由'
	}
	detailVisible.value = true
}

// 生成模拟数据
const generateMockData = () => {
	return mock({
		'list|20': [{
			'applicationId|+1': 10000,
			'vendorName': '@cname',
			'phone': /^1[3-9]\d{9}$/,
			'boothType|1': ['FOOD', 'ACCESSORIES', 'DAILY', 'CLOTHING', 'FLOWERS', 'ELECTRONICS'],
			'applyTime': '@datetime',
			'status|1': ['PENDING', 'APPROVED', 'REJECTED'],
			'description': '@cparagraph(1)',
		}]
	}).list
}

const loadData = async () => {
	try {
		uni.request({
			url: `${uni.$baseUrl}/admin/applicationList`,
			method: 'GET',
			header: {
				'Authorization': uni.getStorageSync('admin_token')
			},
			success(res) {
				console.log('申请列表数据', res.data.data)
				// 如果有搜索关键字，过滤数据
				const filteredData = searchKey.value
					? res.data.data.filter(item => 
						item.vendorName.includes(searchKey.value) || 
						item.phone.includes(searchKey.value)
					)
					: res.data.data

				// 分页处理
				applyList.value = filteredData.slice(
					(pagination.current - 1) * pagination.size,
					pagination.current * pagination.size
				)
				pagination.total = filteredData.length
			},
			fail(err) {
				console.error('申请列表获取失败:', err)
				uni.showToast({
					title: '申请列表获取失败',
					icon: 'none'
				})
			}
		})
	} catch (error) {
		console.error('申请数据获取失败:', error)
		uni.showToast({
			title: '申请数据获取失败',
			icon: 'none'
		})
	}
}

const handlePageChange = (page) => {
	pagination.current = page
	loadData()
}

const handleApply = async (apply, status) => {
	try {
		if (status === 'APPROVED') {
			// 通过申请的逻辑保持不变
			await ElMessageBox.confirm(
				`确定通过该申请吗？`,
				'提示',
				{
					type: 'warning'
				}
			)
			
			uni.request({
				url: `${uni.$baseUrl}/admin/handleApply`,
				method: 'GET',
				header: {
					'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
					'Authorization': uni.getStorageSync('admin_token')
				},
				data: {
					boothId: apply.applicationId,
					status: status,
				},
				success: (res) => {
					if (res.data.success) {
						ElMessage.success('通过成功')
						// 更新本地数据状态
						applyList.value = applyList.value.map(item => {
							if (item.applicationId === apply.applicationId) {
								return { ...item, status }
							}
							return item
						})
					} else {
						ElMessage.error(res.data.message || '操作失败')
					}
				},
				fail: () => {
					ElMessage.error('操作失败')
				}
			})
		} else {
			// 拒绝申请时，显示拒绝理由输入框
			rejectForm.applicationId = apply.applicationId
			rejectForm.reason = ''
			rejectVisible.value = true
		}
	} catch (error) {
		if (error !== 'cancel') {
			ElMessage.error('操作失败')
		}
	}
}

// 修改表单验证规则，加强对理由的验证
const rejectRules = {
	reason: [
		{ required: true, message: '拒绝理由不能为空', trigger: 'blur' },
		{ min: 5, message: '拒绝理由至少5个字符', trigger: 'blur' },
		{ max: 200, message: '拒绝理由最多200个字符', trigger: 'blur' }
	]
}

// 修改确认拒绝的方法
const confirmReject = async () => {
	if (!rejectFormRef.value) return
	
	await rejectFormRef.value.validate(async (valid) => {
		if (valid) {
			try {
				// 检查理由是否为空
				if (!rejectForm.reason.trim()) {
					ElMessage.error('拒绝理由不能为空')
					return
				}

				// 调用后端API
				uni.request({
					url: 'http://localhost:8080/admin/handleApply',
					method: 'POST',
					header: {
						'Authorization': uni.getStorageSync('admin_token'),
						'Content-Type': 'application/json'
					},
					data: {
						applicationId: rejectForm.applicationId,
						status: 'REJECTED',
						rejectReason: rejectForm.reason.trim() // 去除首尾空格
					},
					success: (res) => {
						if (res.data.success) {
							ElMessage.success('已拒绝申请')
							rejectVisible.value = false
							// 重新加载数据
							loadData()
						} else {
							ElMessage.error(res.data.message || '操作失败')
						}
					},
					fail: () => {
						ElMessage.error('操作失败')
					}
				})

				// 注释掉模拟数据的更新
				// applyList.value = applyList.value.map(item => {
				// 	if (item.applicationId === rejectForm.applicationId) {
				// 		return { 
				// 			...item, 
				// 			status: 'REJECTED',
				// 			rejectReason: rejectForm.reason 
				// 		}
				// 	}
				// 	return item
				// })
			} catch (error) {
				console.error('拒绝申请失败:', error)
				ElMessage.error('操作失败')
			}
		} else {
			ElMessage.error('请正确填写拒绝理由')
		}
	})
}

// 添加取消拒绝的方法
const cancelReject = () => {
	rejectFormRef.value?.resetFields()
	rejectVisible.value = false
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
.apply-management {
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
