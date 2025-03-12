<template>
	<view class="zai-box">
		<image src="../../../static/register.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title">注册</view>
		<view class="zai-form">
			<input class="zai-input" v-model="phone" placeholder-class placeholder="请输入手机号" />
			<input class="zai-input" v-model="password" placeholder-class password placeholder="请输入密码" />
			<input class="zai-input" v-model="repeatpassword" placeholder-class password placeholder="请再输入一次密码" />
			<!-- <button class="zai-btn">立即注册</button> -->
			<button class="zai-btn" type="primary" @click="register">立即注册</button>
			<navigator url="../login/login" open-type='navigate' hover-class="none" class="zai-label">已有账号，点此去登录
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				password: '',
				repeatpassword: ''
			}
		},
		methods: {
			//返回上级页面
			toBack() {
				uni.navigateBack({
					delta: 1,
				});
			},
			register() {
				var flag=this.verifyData();
				if(flag){
					uni.request({
						url: 'http://localhost:8080/vendor/register',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
						},
						data: {
							phone: this.phone,
							password: this.password,
						},
						success: (res) => {
							uni.showToast({
								icon: "none",
								title: res.data.data
							})
							if (res.data.data === "注册成功") {
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/vendor/login/login'
									})
								}, 1000);
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/vendor/login/login'
				})
			},
			verifyData() {
				var flag = true;
				if (!this.phone) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号不能为空'
					});
					return false;
				}

				var re11 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				var res = re11.test(this.phone)
				if (res == false) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号有误'
					});
					return false;
				}
				
				if (!this.password) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '密码不能为空'
					});
					return false;
				}
				
				if (!this.repeatpassword) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '请再输入一次密码'
					});
					return false;
				}
				
				if (this.password != this.repeatpassword) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '两次密码不一致'
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

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}
</style>