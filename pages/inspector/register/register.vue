<template>
	<div class="register-container">
		<div class="register-header">
			<img src="@/static/register.png" class="register-logo" />
			<h1 class="register-title">城管注册</h1>
		</div>

		<el-form ref="registerForm" :model="user" :rules="rules" class="register-form">
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

			<el-form-item prop="repeatPassword">
				<el-input v-model="user.repeatPassword" placeholder="请再次输入密码" type="password" size="large"
					show-password>
					<template #prefix>
						<el-icon>
							<lock />
						</el-icon>
					</template>
				</el-input>
			</el-form-item>

			<el-button type="primary" size="large" class="register-btn" @click="handleRegister" :loading="loading">
				立即注册
			</el-button>

			<div class="login-link">
				<el-link type="primary" @click="toLogin">
					已有账号？点此登录
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

	const registerForm = ref(null)
	const loading = ref(false)

	const user = ref({
		phone: '',
		password: '',
		repeatPassword: ''
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
		}],
		repeatPassword: [{
				required: true,
				message: '请再次输入密码',
				trigger: 'blur'
			},
			{
				validator: (rule, value, callback) => {
					if (value !== user.value.password) {
						callback(new Error('两次输入的密码不一致'))
					} else {
						callback()
					}
				},
				trigger: 'blur'
			}
		]
	}

	const handleRegister = async () => {
		try {
			// 手动触发表单验证
			const valid = await registerForm.value.validate()
			if (!valid) return

			loading.value = true

			const res = await uni.request({
				url: `${uni.$baseUrl}/inspector/register`,
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					phone: user.value.phone,
					password: user.value.password
				}
			})

			if (res.data.data === "注册成功") {
				ElMessage.success('注册成功')
				setTimeout(() => {
					toLogin()
				}, 1000)
			} else {
				ElMessage.error(res.data.data || '注册失败')
			}
		} catch (error) {
			ElMessage.error(error.message || '请求失败')
		} finally {
			loading.value = false
		}
	}

	// 页面跳转方法
	const toLogin = () => uni.navigateTo({
		url: '/pages/inspector/login/login'
	})
</script>

<style scoped>
	.register-container {
		padding: 20px;
		background: #f5f7fa;
	}

	.register-header {
		text-align: center;
		margin-top: 60px;
	}

	.register-logo {
		width: 200px;
		height: 100px;
	}

	.register-title {
		margin-top: 20px;
		color: #409eff;
		font-size: 24px;
	}

	.register-form {
		margin-top: 40px;
		padding: 0 20px;
	}

	.register-btn {
		width: 100%;
		margin-top: 20px;
		font-size: 16px;
	}

	.login-link {
		margin-top: 30px;
		text-align: center;
	}

	/* 移动端适配 */
	@media (max-width: 768px) {
		.register-form {
			padding: 0 10px;
		}

		.register-title {
			font-size: 20px;
		}

		.el-form-item {
			margin-bottom: 20px;
		}
	}
</style>