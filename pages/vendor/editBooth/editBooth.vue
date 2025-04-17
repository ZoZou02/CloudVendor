<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 编辑摊位卡片 -->
		<view class="booth-edit-card">
			<view class="card">
				<!-- 摊位图片 -->
				<view class="booth-image-section" @click="chooseImage">
					<image class="booth-image" :src="boothPic" mode="aspectFill"></image>
					<view class="image-edit-hint">点击更换图片</view>
				</view>
				
				<!-- 摊位信息表单 -->
				<view class="form-section">
					<view class="form-group">
						<view class="form-header">
							<view class="header-line"></view>
							<view class="header-text">基本信息</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 摊位ID（不可编辑） -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">摊位ID</view>
									<view class="form-value">{{boothInfo.boothId}}</view>
								</view>
							</view>
						</view>
						
						<!-- 摊位名称 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M13 16v5h-2v-5H9l3-3l3 3h-2zm-7 1c0 1.1.9 2 2 2h2v-2H8v-9h8v9h-2v2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">摊位名称</view>
									<input class="form-input" type="text" v-model="boothInfo.boothName" placeholder="请输入摊位名称" />
								</view>
							</view>
						</view>
						
						<!-- 经营类别 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67c0-.84.79-1.43 2.1-1.43c1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81c0 1.79 1.49 2.69 3.66 3.21c1.95.46 2.34 1.15 2.34 1.87c0 .53-.39 1.39-2.1 1.39c-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77c-.01-2.2-1.9-2.96-3.66-3.42z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">经营类别</view>
									<picker @change="bindTypeChange" :value="typeIndex" :range="typeArray" class="form-picker">
										<view class="picker-value">
											<text>{{typeArray[typeIndex]}}</text>
											<view class="picker-arrow">
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
													<path fill="#999" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"/>
												</svg>
											</view>
										</view>
									</picker>
								</view>
							</view>
						</view>
						
						<!-- 描述 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M4 17h16v2H4zm13-7H7v-2h10zm-4 4H7v-2h6zm1-12H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V6l-6-6zm4 18H6V4h7v5h5v11z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">描述</view>
									<textarea class="form-textarea" v-model="boothInfo.description" placeholder="请输入摊位描述"></textarea>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 营业时间分组 -->
					<view class="form-group">
						<view class="form-header">
							<view class="header-line"></view>
							<view class="header-text">营业时间</view>
							<view class="header-line"></view>
						</view>
						
						<!-- 开始时间 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">开始时间</view>
									<picker mode="time" @change="bindStartTimeChange" start="5:00" end="24:00" :value="boothInfo.startTime" class="form-picker">
										<view class="picker-value">
											<text>{{formatTime(boothInfo.startTime)}}</text>
											<view class="picker-arrow">
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
													<path fill="#999" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"/>
												</svg>
											</view>
										</view>
									</picker>
								</view>
							</view>
						</view>
						
						<!-- 结束时间 -->
						<view class="form-item">
							<view class="form-item-content">
								<view class="form-item-left">
									<view class="form-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
											<path fill="#5199ff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/>
										</svg>
									</view>
								</view>
								<view class="form-item-center">
									<view class="form-label">结束时间</view>
									<picker mode="time" @change="bindEndTimeChange" start="5:00" end="24:00" :value="boothInfo.endTime" class="form-picker">
										<view class="picker-value">
											<text>{{formatTime(boothInfo.endTime)}}</text>
											<view class="picker-arrow">
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
													<path fill="#999" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"/>
												</svg>
											</view>
										</view>
									</picker>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 保存按钮 -->
				<view class="button-section">
					<button class="save-button" @click="saveBooth">保存修改</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				boothPic: "../../../static/booth/booth.jpg",
				boothInfo: {},
				token: "",
				typeArray: ['食品类', '饰品类', '日用品类', '纺织服装类', '花卉水果类', '电子产品类'],
				typeIndex: 0,
				startTime: "",
				endTime: "",
			}
		},
		onLoad() {
			this.getBoothInfo()
		},
		methods: {
			formatTime(time) {
				return time ? time.substring(0, 5) : '';
			},
			getBoothInfo() {
				const token = uni.getStorageSync("token")
				console.log("token：" + token)
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				uni.request({
					url: `${uni.$baseUrl}/booth/showBooth`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						console.log(res.data);
						this.boothInfo = res.data.data
						this.token = token

						//摊位照片
						if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
							this.boothPic = this.boothInfo.boothPic
						}

						const index = this.typeArray.findIndex(type => type === this.boothInfo.type)
						if (index !== -1) {
							this.typeIndex = index
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.boothPic = res.tempFilePaths[0];
						console.log(this.boothPic)
					}
				})
			},
			saveBooth() {
				if (this.verifyData()) {
					console.log('摊位信息', this.boothInfo)
					uni.request({
						url: `${uni.$baseUrl}/booth/editBooth`,
						method: 'GET',
						header: {
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
						},
						data: {
							id: this.boothInfo.id,
							boothId: this.boothInfo.boothId,
							boothName: this.boothInfo.boothName,
							boothPic: this.boothInfo.boothPic,
							description: this.boothInfo.description,
							startTime: this.boothInfo.startTime,
							endTime: this.boothInfo.endTime,
							type: this.boothInfo.type,
						},
						header: {
							'Authorization': this.token
						},
						success: () => {
							//创建了摊位信息后再上传摊位照片
							this.uploadImage()
						},
						fail: () => {
							uni.showToast({
								icon: 'error',
								title: '保存失败'
							});
						}
					})
				}
			},
			verifyData() {
				if (!this.boothInfo.boothName) {
					// 验证摊位名称是否为空
					uni.showToast({
						icon: 'error',
						title: '名称未填写!'
					});
					console.log("名称不能为空");
					return false;
				}

				if (!this.boothInfo.description) {
					// 验证描述是否为空
					uni.showToast({
						icon: 'error',
						title: '描述不能为空!'
					})
					console.log("描述不能为空");
					return false;
				}

				if (this.boothInfo.startTime >= this.boothInfo.endTime) {
					// 验证营业开始时间是否早于营业结束时间
					console.log("营业开始时间必须早于营业结束时间");
					uni.showToast({
						icon: 'error',
						title: '营业开始时间必须早于营业结束时间'
					})
					return false;
				}

				// 数据验证通过
				return true;
			},
			bindTypeChange(e) {
				console.log('e', e)
				this.typeIndex = e.detail.value
				this.boothInfo.type = this.typeArray[this.typeIndex]
			},
			bindStartTimeChange(e) {
				this.boothInfo.startTime = e.detail.value
			},
			bindEndTimeChange(e) {
				this.boothInfo.endTime = e.detail.value
			},
			uploadImage() {
				uni.uploadFile({
					url: `${uni.$baseUrl}/booth/uploadBoothPic`, // 上传接口地址
					filePath: this.boothPic,
					header: {
						'Authorization': this.token,
					},
					name: 'boothPic',
					success: (res) => {
						console.log('上传成功:', res);
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					},
					fail: (err) => {
						console.log('上传失败:', err);
						uni.showToast({
							title: '图片上传失败',
							icon: 'error'
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
	}
	
	.top {
		height: 180rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 100rpx;
			width: 100%;
		}
	}
	
	.booth-edit-card {
		padding: 0 30rpx;
		
		.card {
			position: relative;
			bottom: 62px;
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
			padding: 30rpx;
			
			.booth-image-section {
				margin-bottom: 30rpx;
				position: relative;
				
				.booth-image {
					width: 100%;
					height: 380rpx;
					border-radius: 12rpx;
				}
				
				.image-edit-hint {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: rgba(0, 0, 0, 0.6);
					color: #fff;
					padding: 15rpx 30rpx;
					border-radius: 30rpx;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					
					&::before {
						content: '';
						display: inline-block;
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
						background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M5 16.577V19h2.423l7.125-7.125l-2.423-2.423L5 16.577zm13.202-7.355l-1.425-1.424a1.003 1.003 0 0 0-1.418.001l-1.13 1.13l2.423 2.423l1.131-1.132a1 1 0 0 0-.001-1.417l.42-.581z'/%3E%3C/svg%3E");
						background-repeat: no-repeat;
						background-position: center;
						background-size: contain;
					}
				}
			}
			
			.form-section {
				.form-group {
					margin-bottom: 30rpx;
					
					.form-header {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 20rpx;
						
						.header-line {
							flex: 1;
							height: 2rpx;
							background-color: #eeeeee;
						}
						
						.header-text {
							font-size: 28rpx;
							color: #666;
							padding: 0 20rpx;
						}
					}
					
					.form-item {
						padding: 24rpx 0;
						border-bottom: 1px solid #f5f5f5;
						
						&:last-child {
							border-bottom: none;
						}
						
						.form-item-content {
							display: flex;
							
							.form-item-left {
								width: 10%;
								display: flex;
								align-items: flex-start;
								justify-content: center;
								padding-top: 4rpx;
								
								.form-icon {
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
							
							.form-item-center {
								width: 90%;
								padding-left: 20rpx;
								
								.form-label {
									font-size: 26rpx;
									color: #999;
									margin-bottom: 15rpx;
								}
								
								.form-value {
									font-size: 32rpx;
									color: #999;
								}
								
								.form-input {
									font-size: 32rpx;
									color: #333;
									height: 70rpx;
									line-height: 70rpx;
								}
								
								.form-textarea {
									width: 100%;
									height: 120rpx;
									font-size: 30rpx;
									line-height: 1.5;
									color: #333;
								}
								
								.form-picker {
									width: 100%;
									
									.picker-value {
										font-size: 32rpx;
										color: #333;
										display: flex;
										justify-content: space-between;
										align-items: center;
										height: 70rpx;
										
										.picker-arrow {
											color: #999;
										}
									}
								}
							}
						}
					}
				}
			}
			
			.button-section {
				margin-top: 40rpx;
				
				.save-button {
					width: 90%;
					height: 90rpx;
					line-height: 90rpx;
					background-color: #5199ff;
					color: #fff;
					font-size: 32rpx;
					letter-spacing: 2rpx;
					border-radius: 45rpx;
					box-shadow: 0 6rpx 15rpx rgba(81, 153, 255, 0.3);
				}
			}
		}
	}
</style>