<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 个人资料卡片 -->
		<view class="profile-card">
			<view class="card">
				<!-- 头像部分 -->
				<view class="avatar-section">
					<view class="avatar-container" @click="chooseImage">
						<image class="avatar-image" :src="inspectorPic" mode="aspectFill"></image>
						<view class="avatar-edit-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="#ffffff" d="M5 16.577V19h2.423l7.125-7.125l-2.423-2.423L5 16.577zm13.202-7.355l-1.425-1.424a1.003 1.003 0 0 0-1.418.001l-1.13 1.13l2.423 2.423l1.131-1.132a1 1 0 0 0-.001-1.417l.42-.581z"/>
							</svg>
						</view>
					</view>
				</view>
				
				<!-- 表单内容 -->
				<view class="form-section">
					<!-- 表单项分组 -->
					<view class="form-group">
						<view class="form-header">
							<view class="header-line"></view>
							<view class="header-text">基本信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 用户ID -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">用户ID</view>
									<view class="form-value">{{userInfo.inspectorId}}</view>
								</view>
							</view>
						</view>
						
						<!-- 姓名 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">姓名</view>
									<view class="form-value">{{userInfo.inspectorName}}</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 可编辑信息分组 -->
					<view class="form-group">
						<view class="form-header">
							<view class="header-line"></view>
							<view class="header-text">其他信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 性别 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M17.5 9.5C17.5 6.46 15.04 4 12 4S6.5 6.46 6.5 9.5a5.495 5.495 0 0 0 4.5 5.39v2.61h-2v2h2v2h2v-2h2v-2h-2v-2.61c2.5-.43 4.5-2.56 4.5-5.39zm-9 0C8.5 7.57 10.07 6 12 6s3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">性别</view>
									<view class="form-radio-group">
										<radio-group @change="sexChange" class="radio-group">
											<label class="radio-label" v-for="(item, index) in array" :key="item.value">
												<radio :value="item.value" :checked="index === sexIndex" color="#5199ff" />
												<text class="radio-text">{{item.name}}</text>
											</label>
										</radio-group>
									</view>
								</view>
							</view>
						</view>
						
						<!-- 手机 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-7-3h4v-2h-4v2z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">手机</view>
									<input type="text" class="form-input" v-model="userInfo.phone" placeholder="请输入手机号码" />
								</view>
							</view>
						</view>
						
						<!-- 联系地址 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">联系地址</view>
									<input type="text" class="form-input" v-model="userInfo.address" placeholder="请输入联系地址" />
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 保存按钮 -->
				<view class="button-section">
					<button class="save-button" @click="save">保存修改</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inspectorPic: "../../../static/avatar/avatar.png",
				userInfo: {},
				array: [{
						value: '0',
						name: '未知',
					},
					{
						value: '1',
						name: '男',
					},
					{
						value: '2',
						name: '女',
					}
				],
				sexIndex: 0,
				token: "",
				time: "",
				sex: ""
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				const token = uni.getStorageSync("inspector_token")
				console.log("token：" + token)
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				uni.request({
					url: `${uni.$baseUrl}/inspector/getInspectorInfo`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						console.log(res.data);
						this.userInfo = res.data.data
						this.token = token

						//性别数据转换
						if (this.userInfo.sex === '1') {
							this.sex = "男"
						} else if (this.userInfo.sex === '2') {
							this.sex = "女"
						} else {
							this.sex = "未知"
						}
						this.sexIndex = parseInt(this.userInfo.sex)
						console.log('user', this.userInfo)

						//头像
						if (this.userInfo.inspectorPic != null && this.userInfo.inspectorPic != "") {
							this.inspectorPic = this.userInfo.inspectorPic
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			sexChange(e) {
				console.log(e)
				this.sexIndex = e.detail.value
				if (this.sexIndex === '1') {
					this.sex = "男"
				} else if (this.sexIndex === '2') {
					this.sex = "女"
				} else {
					this.sex = "未知"
				}
			},
			chooseImage() {
				uni.navigateTo({
					url: '/pages/inspector/editAvatar/editAvatar'
				})
			},
			verifyData() {
				if (!this.userInfo.phone) {
					uni.showToast({
						icon: 'none',
						title: '手机号不能为空'
					})
					return false
				}
				const phoneReg = /^1[3-9]\d{9}$/
				if (!phoneReg.test(this.userInfo.phone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					})
					return false
				}
				if (!this.userInfo.address) {
					uni.showToast({
						icon: 'none',
						title: '联系地址不能为空'
					})
					return false
				}
				return true
			},
			uploadImage() {
				if (this.inspectorPic !== "../../../static/avatar/avatar.png") {
					uni.uploadFile({
						url: `${uni.$baseUrl}/inspector/upload`, // 上传接口地址
						filePath: this.inspectorPic,
						name: 'avatar',
						header: {
							'Authorization': this.token,
						},
						success: (res) => {
							console.log('上传成功:', res);
						},
						fail: (err) => {
							console.log('上传失败:', err);
						}
					})
				}
			},
			save() {
				var flag = this.verifyData();
				if (flag) {
					this.uploadImage()
					uni.request({
						url: `${uni.$baseUrl}/inspector/editInspectorInfo`,
						method: 'GET',
						header: {
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
						},
						data: {
							inspectorId: this.userInfo.inspectorId,
							inspectorName: this.userInfo.inspectorName,
							phone: this.userInfo.phone,
							address: this.userInfo.address,
							sex: this.sexIndex,
						},
						header: {
							'Authorization': this.token
						},
						success: (res) => {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							// 返回上一页
							setTimeout(() => {
								uni.navigateBack();
							}, 1000)
						},
						fail: (err) => {
							console.error(err);
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
	}
	
	.top {
		height: 250rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 180rpx;
			width: 100%;
			box-shadow: 0 4rpx 12rpx rgba(81, 153, 255, 0.2);
		}
	}
	
	.profile-card {
		padding: 0 30rpx;
		
		.card {
			position: relative;
			bottom: 62px;
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.08);
			padding: 30rpx;
		}
	}
	
	.avatar-section {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;
		
		.avatar-container {
			position: relative;
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
			
			.avatar-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			
			.avatar-edit-icon {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				background-color: rgba(0, 0, 0, 0.5);
				height: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	
	.form-section {
		margin-top: 20rpx;
	}
	
	.form-group {
		margin-bottom: 40rpx;
		
		.form-header {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			.header-line {
				flex: 1;
				height: 2rpx;
				background-color: #eeeeee;
			}
			
			.header-text {
				padding: 0 20rpx;
				font-size: 28rpx;
				color: #666;
			}
		}
	}
	
	.form-item {
		margin-bottom: 30rpx;
		
		.form-item-content {
			display: flex;
			padding: 20rpx 0;
			
			.form-item-left {
				width: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				
				.form-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					color: #5199ff;
				}
			}
			
			.form-item-center {
				flex: 1;
				
				.form-label {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				.form-value {
					font-size: 30rpx;
					color: #999;
				}
				
				.form-input {
					border-bottom: 1px solid #eee;
					font-size: 30rpx;
					padding: 10rpx 0;
				}
				
				.form-radio-group {
					display: flex;
					
					.radio-label {
						display: flex;
						align-items: center;
						margin-right: 30rpx;
						
						.radio-text {
							font-size: 28rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
	
	.button-section {
		margin-top: 60rpx;
		
		.save-button {
			background-color: #5199ff;
			color: #fff;
			padding: 20rpx;
			border-radius: 50rpx;
			font-size: 32rpx;
			box-shadow: 0 6rpx 12rpx rgba(81, 153, 255, 0.2);
			border: none;
			width: 90%;
			margin: 0 auto;
		}
	}
</style>
