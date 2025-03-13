<template>
	<view class="zai-box">
		<image src="../../../static/login.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title">城管登录</view>
		<view class="zai-form">
			<input class="zai-input" v-model="user.phone" placeholder-class placeholder="请输入手机号" />
			<input class="zai-input" v-model="user.password" placeholder-class password placeholder="请输入密码" />
			<view class="zai-label">忘记密码？</view>

			<button class="zai-btn" @click="handleLogin">立即登录</button>
			<navigator url="../register/register" hover-class="none" class="zai-label">还没有账号？点此注册</navigator>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from 'vue'
	import type { UniNamespace } from '@dcloudio/uni-app'

	// 响应式数据
	const user = reactive({
		phone: '',
		password: ''
	})

	// 手机号正则验证
	const PHONE_REG = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

	// 表单验证
	const validateForm = () : boolean => {
		if (!user.phone) {
			uni.showToast({ icon: 'none', title: '手机号不能为空' })
			return false
		}

		if (!PHONE_REG.test(user.phone)) {
			uni.showToast({ icon: 'none', title: '手机号格式错误' })
			return false
		}

		if (!user.password) {
			uni.showToast({ icon: 'none', title: '密码不能为空' })
			return false
		}

		return true
	}

	// 获取 Token
	const fetchToken = async () : Promise<boolean> => {
		try {
			const res = await uni.request({
				url: 'http://localhost:8080/getToken',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				},
				data: { id: user.phone }
			}) as UniNamespace.RequestSuccessCallbackResult

			if (res.data?.code === 200) {
				uni.setStorageSync("token", res.data.data)
				return true
			}
			uni.showToast({ icon: 'none', title: '获取token失败' })
			return false
		} catch (error) {
			uni.showToast({ icon: 'none', title: '网络请求异常' })
			return false
		}
	}

	// 登录处理
	const handleLogin = async () => {
		if (!validateForm()) return

		try {
			const loginRes = await uni.request({
				url: 'http://localhost:8080/inspector/login',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				},
				data: user
			}) as UniNamespace.RequestSuccessCallbackResult

			if (loginRes.data?.data?.code === 200) {
				const tokenSuccess = await fetchToken()
				if (tokenSuccess) {
					uni.showToast({ icon: 'success', title: '登录成功' })
					setTimeout(() => {
						uni.reLaunch({ url: '/pages/inspector/index/index' })
					}, 1000)
				}
			} else {
				uni.showToast({ icon: 'none', title: loginRes.data?.data || '登录失败' })
			}
		} catch (error) {
			uni.showToast({ icon: 'none', title: '网络请求失败' })
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
		position: relative;
		background: #ff65a3;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
		z-index: 1001;
	}

	.zai-btn:after {
		border: 0;
	}

	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.toolControl {
		position: absolute;
		top: 500px;
		left: 220px;
		right: 0px;
		margin: auto;
		width: 50px;
		z-index: 2000;
		pointer-events: all;
	}

	.toolItem:hover {
		border-color: #789cff;
	}

	.toolItem {
		width: 30px;
		height: 30px;
		float: left;
		margin: 1px;
		padding: 4px;
		border-radius: 3px;
		background-size: 30px 30px;
		background-position: 4px 4px;
		background-repeat: no-repeat;
		box-shadow: 0 1px 2px 0 #e4e7ef;
		background-color: #ffffff;
		border: 1px solid #ffffff;
	}
</style>