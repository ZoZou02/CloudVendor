<template>
	<view class="zai-box">
		<image src="../../../static/register.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title">城管注册</view>
		<view class="zai-form">
			<input class="zai-input" v-model="phone" placeholder-class placeholder="请输入手机号" />
			<input class="zai-input" v-model="password" placeholder-class password placeholder="请输入密码" />
			<input class="zai-input" v-model="repeatPassword" placeholder-class password placeholder="请再输入一次密码" />
			<button class="zai-btn" type="primary" @click="handleRegister">立即注册</button>
			<navigator url="../login/login" open-type='navigate' hover-class="none" class="zai-label">
				已有账号，点此去登录
			</navigator>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { UniNamespace } from '@dcloudio/uni-app'

	// 响应式数据
	const phone = ref('')
	const password = ref('')
	const repeatPassword = ref('')

	// 手机号正则验证
	const validatePhone = (phone : string) : boolean => {
		const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
		return reg.test(phone)
	}

	// 表单验证
	const validateForm = () : boolean => {
		if (!phone.value) {
			uni.showToast({ icon: 'none', title: '手机号不能为空' })
			return false
		}

		if (!validatePhone(phone.value)) {
			uni.showToast({ icon: 'none', title: '手机号格式错误' })
			return false
		}

		if (!password.value) {
			uni.showToast({ icon: 'none', title: '密码不能为空' })
			return false
		}

		if (password.value !== repeatPassword.value) {
			uni.showToast({ icon: 'none', title: '两次密码不一致' })
			return false
		}

		return true
	}

	// 注册处理
	const handleRegister = async () => {
		if (!validateForm()) return

		try {
			const res = await uni.request({
				url: `${uni.$baseUrl}/inspector/register`,
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				},
				data: {
					phone: phone.value,
					password: password.value
				}
			}) as UniNamespace.RequestSuccessCallbackResult

			if (res.data?.data === '注册成功') {
				uni.showToast({ icon: 'success', title: '注册成功' })
				setTimeout(() => {
					uni.navigateTo({ url: '/pages/inspector/login/login' })
				}, 1000)
			} else {
				uni.showToast({ icon: 'none', title: res.data?.data || '注册失败' })
			}
		} catch (error) {
			uni.showToast({ icon: 'none', title: '请求失败，请稍后重试' })
		}
	}
</script>

<style>
	/* 保持原有样式不变 */
	.zai-box {
		padding: 0 100upx;
		position: relative;
	}

	.zai-logo {
		width: 100%;
		height: 310upx;
	}

	.zai-title {
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}

	.zai-form {
		margin-top: 300upx;
	}

	.zai-input {
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.zai-btn {
		background: #ff65a3;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
		margin-top: 60upx;
	}

	.zai-btn:after {
		border: 0;
	}

	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}
</style>