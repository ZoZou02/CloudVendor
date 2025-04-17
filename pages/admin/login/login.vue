<template>
	<view class="login-container">
		<view class="login-box">
			<view class="logo">商贩管理系统</view>
			<view class="title">管理员登录</view>
			<view class="input-group">
				<input class="input-item" type="text" v-model="username" placeholder="请输入用户名" />
			</view>
			<view class="input-group">
				<input class="input-item" type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<button class="login-btn" @click="handleLogin">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			handleLogin() {
				// 这里简单示范，实际应连接后端验证
				if(!this.username || !this.password) {
					uni.showToast({
						title: '用户名和密码不能为空',
						icon: 'none'
					})
					return
				}
				
				// 模拟登录请求
				uni.showLoading({
					title: '登录中...'
				})
				
				// 实际项目中应该调用API进行用户验证
				setTimeout(() => {
					uni.hideLoading()
					// 假设登录成功，存储用户信息
					const adminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTAxMDAwIiwiZXhwIjoxNzQ0OTAyMzEwfQ.csCCuXD7M7v1xBEWcEIS1-PqKDjIU0Tb-07egLZxkbA'
					
					uni.setStorageSync('admin_token', adminToken)
					uni.setStorageSync('adminInfo', {
						username: this.username,
						role: 'admin',
						token: adminToken
					})
					
					// 跳转到管理页面
					uni.reLaunch({
						url: '/pages/admin/admin'
					})
				}, 1500)
			}
		}
	}
</script>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #f0f2f5;
	}
	
	.login-box {
		width: 400px;
		padding: 40px;
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.logo {
		font-size: 28px;
		color: #409EFF;
		text-align: center;
		margin-bottom: 30px;
		font-weight: bold;
	}
	
	.title {
		font-size: 24px;
		color: #303133;
		text-align: center;
		margin-bottom: 30px;
	}
	
	.input-group {
		margin-bottom: 20px;
	}
	
	.input-item {
		width: 100%;
		height: 50px;
		padding: 0 15px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
	}
	
	.login-btn {
		width: 100%;
		height: 50px;
		background-color: #409EFF;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		margin-top: 10px;
	}
</style> 