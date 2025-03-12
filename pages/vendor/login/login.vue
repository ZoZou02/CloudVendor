<template>
	<view class="zai-box">
		<image src="../../../static/login.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title">登录</view>
		<view class="zai-form">
			<input class="zai-input" v-model="user.phone" placeholder-class placeholder="请输入手机号" />
			<input class="zai-input" v-model="user.password" placeholder-class password placeholder="请输入密码" />
			<view class="zai-label">忘记密码？</view>

			<button class="zai-btn" @tap="login">立即登录</button>
			<navigator url="../register/register" hover-class="none" class="zai-label">还没有账号？点此注册</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					phone: '',
					password: ''
				},

			}
		},
		onLoad() {

		},
		methods: {
			login() {
				var flag=this.verifyData();
				if(flag){
					uni.request({
						url: 'http://localhost:8080/vendor/login',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
						},
						data: {
							phone: this.user.phone,
							password: this.user.password,
						},
						success: (res) => {
							console.log(res.data)
							if (res.data.data.code === 200) {
								this.getToken();
								uni.showToast({
									icon: "none",
									title: "登录成功！",
								});
							} else {
								uni.showToast({
									icon: "error",
									title: res.data.data,
								});
							}
						},
						fail: () => {
					
						},
						complete: () => {
					
						}
					})
				}
			},
			getToken() {
				uni.request({
					url: 'http://localhost:8080/getToken',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					data: {
						id: this.user.phone,
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.code === 200) {
							uni.setStorageSync("token", res.data.data);
							this.toIndex();
						} else {
							uni.showToast({
								icon: "error",
								title: "获取token失败",
							});
						}
					},
					fail() {

					},
					complete() {

					}
				});
			},
			toRegister() {
				uni.navigateTo({
					url: '/pages/vendor/register/register'
				});
			},
			toBack() {
				uni.navigateBack({
					delta: 1,
				});
			},
			toIndex() {
				uni.reLaunch({
					url: '/pages/vendor/index/index'
				})
			},
			verifyData(){
				var flag = true;
				if (!this.user.phone) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号不能为空'
					});
					return false;
				}
				
				var re11=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				var res = re11.test(this.user.phone)
				if(res==false){
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号有误'
					});
					return false;
				}
				
				if (!this.user.password) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '密码不能为空'
					});
					return false;
				}
				return flag;
			
				
			}
		}
	}
</script>

<style>
	.zai-box {
		padding: 0 100upx;
		position: relative;
	}

	.zai-logo {
		width: 100%;
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

	/*按钮点击效果*/
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