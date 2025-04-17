<template>
	<div class="login-container">
		<div class="login-header">
			<img src="@/static/login.png" class="login-logo" />
			<h1 class="login-title">城管登录</h1>
		</div>

		<el-form ref="loginForm" :model="user" :rules="rules" class="login-form">
			<el-form-item prop="phone">
				<el-input v-model="user.phone" placeholder="请输入手机号" size="large" clearable>
					<template #prefix>
						<el-icon>
							<iphone />
						</el-icon>
					</template>
				</el-input>
			</el-form-item>

			<el-form-item prop="password">
				<el-input v-model="user.password" placeholder="请输入密码" type="password" size="large" show-password>
					<template #prefix>
						<el-icon>
							<lock />
						</el-icon>
					</template>
				</el-input>
			</el-form-item>

			<div class="forget-password">
				<el-link type="info" @click="toForget">忘记密码？</el-link>
			</div>

			<el-button type="primary" size="large" class="login-btn" @click="handleLogin" :loading="loading">
				立即登录
			</el-button>

			<div class="register-link">
				<el-link type="primary" @click="toRegister">
					还没有账号？点此注册
				</el-link>
			</div>
		</el-form>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		ElMessage
	} from 'element-plus'
	import {
		Iphone,
		Lock
	} from '@element-plus/icons-vue'
	// import { BASE_URL } from '@/config/config.js'

	const loginForm = ref(null)
	const loading = ref(false)

	const user = ref({
		phone: '',
		password: ''
	})

	const rules = {
		phone: [{
				required: true,
				message: '手机号不能为空',
				trigger: 'blur'
			},
			{
				pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
				message: '手机号格式不正确',
				trigger: 'blur'
			}
		],
		password: [{
			required: true,
			message: '密码不能为空',
			trigger: 'blur'
		}]
	}

	const handleLogin = async () => {
		try {
			// 手动触发表单验证
			const valid = await loginForm.value.validate()
			if (!valid) return

			loading.value = true



			const res = await uni.request({
				url: `${uni.$baseUrl}/inspector/login`,
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					phone: user.value.phone,
					password: user.value.password
				}
			})

			if (res.data.data.code === 200) {
				ElMessage.success('登录成功')
				await getToken()
			} else {
				ElMessage.error(res.data.data || '登录失败')
			}
		} catch (error) {
			ElMessage.error(error.message || '请求失败')

		} finally {
			loading.value = false
		}
	}

	// 获取Token
	const getToken = async () => {
		try {
			const res = await uni.request({
				url: `${uni.$baseUrl}/getToken`,
				header: {
					'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				},
				method: 'POST',
				data: {
					id: user.value.phone
				}
			})

			console.log(user.value.phone)
			console.log(res)

			if (res.data.code === 200) {
				uni.setStorageSync("inspector_token", res.data.data)
				toIndex()
			} else {
				ElMessage.error('获取token失败')
			}
		} catch (error) {
			ElMessage.error('token请求失败')
		}
	}

	// 页面跳转方法
	const toRegister = () => uni.navigateTo({
		url: '/pages/inspector/register/register'
	})
	const toForget = () => uni.navigateTo({
		url: '/pages/forget/forget'
	})
	const toIndex = () => uni.reLaunch({
		url: '/pages/inspector/index/index'
	})
</script>

<style scoped>
	.login-container {
		padding: 20px;
		/* min-height: 100vh; */
		background: #f5f7fa;
	}

	.login-header {
		text-align: center;
		margin-top: 60px;
	}

	.login-logo {
		width: 200px;
		height: 100px;
	}

	.login-title {
		margin-top: 20px;
		color: #409eff;
		font-size: 24px;
	}

	.login-form {
		margin-top: 40px;
		padding: 0 20px;
	}

	.forget-password {
		margin: 10px 0;
		text-align: right;
	}

	.login-btn {
		width: 100%;
		margin-top: 20px;
		font-size: 16px;
	}

	.register-link {
		margin-top: 30px;
		text-align: center;
	}

	/* 移动端适配 */
	@media (max-width: 768px) {
		.login-form {
			padding: 0 10px;
		}

		.login-title {
			font-size: 20px;
		}

		.el-form-item {
			margin-bottom: 20px;
		}
	}
</style>