<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 标题 -->
		<view class="page-title">
			<text>违规登记</text>
		</view>
		
		<!-- 违规登记表单 -->
		<view class="violation-card">
			<view class="card">
				<view class="form-group">
					<view class="group-header">
						<view class="header-line"></view>
						<view class="header-text">基本信息</view>
						<view class="header-line"></view>
					</view>
					
					<!-- 商贩信息选择 -->
					<view class="form-item">
						<view class="item-label">商贩信息</view>
						<view class="item-content">
							<view class="vendor-selector" @click="selectVendor">
								<view class="selector-text">{{ selectedVendor ? selectedVendor.vendorName : '点击选择商贩' }}</view>
								<view class="selector-icon">
									<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
										<path fill="#cccccc" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
									</svg>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 摊位信息 -->
					<view class="form-item" v-if="selectedVendor">
						<view class="item-label">摊位信息</view>
						<view class="item-content">
							<view class="booth-info">
								<view class="booth-id">摊位ID: {{ boothInfo.boothId || '暂无摊位' }}</view>
								<view class="booth-name" v-if="boothInfo.boothId">名称: {{ boothInfo.boothName || '未知' }}</view>
								<view class="booth-type" v-if="boothInfo.boothId">类型: {{ boothInfo.type || '未知' }}</view>
							</view>
						</view>
					</view>
					
					<!-- 违规类型 -->
					<view class="form-item">
						<view class="item-label">违规类型</view>
						<view class="item-content">
							<picker @change="violationTypeChange" :value="violationTypeIndex" :range="violationTypes">
								<view class="picker-value">
									{{ violationTypes[violationTypeIndex] }}
								</view>
							</picker>
						</view>
					</view>
					
					<!-- 违规时间 -->
					<view class="form-item">
						<view class="item-label">违规时间</view>
						<view class="item-content">
							<picker mode="datetime" :value="violationDateTime" @change="dateTimeChange">
								<view class="picker-value">
									{{ violationDateTime }}
								</view>
							</picker>
						</view>
					</view>
				</view>
				
				<!-- 违规详情 -->
				<view class="form-group">
					<view class="group-header">
						<view class="header-line"></view>
						<view class="header-text">违规详情</view>
						<view class="header-line"></view>
					</view>
					
					<!-- 违规描述 -->
					<view class="form-item">
						<view class="item-label">违规描述</view>
						<view class="item-content">
							<textarea v-model="violationDescription" placeholder="请详细描述违规情况..." />
						</view>
					</view>
					
					<!-- 违规图片 -->
					<view class="form-item">
						<view class="item-label">违规图片</view>
						<view class="item-content">
							<view class="image-uploader">
								<view class="image-list">
									<view class="image-item" v-for="(image, index) in violationImages" :key="index">
										<image :src="image" mode="aspectFill"></image>
										<view class="delete-icon" @click="removeImage(index)">
											<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
												<path fill="#ffffff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
											</svg>
										</view>
									</view>
									<view class="add-image" @click="chooseImage" v-if="violationImages.length < 3">
										<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
											<path fill="#cccccc" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
										</svg>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 扣分 -->
					<view class="form-item">
						<view class="item-label">扣分</view>
						<view class="item-content">
							<picker @change="penaltyPointsChange" :value="penaltyPointsIndex" :range="penaltyPointsOptions">
								<view class="picker-value penalty-points-picker">
									{{ penaltyPointsOptions[penaltyPointsIndex] }}
								</view>
							</picker>
						</view>
					</view>
				</view>
				
				<!-- 提交按钮 -->
				<view class="submit-button" @click="submitViolation">
					提交登记
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				selectedVendor: null,
				boothInfo: {},
				violationTypes: ['无证经营', '食品安全问题', '占道经营', '卫生不达标', '噪音扰民', '其他'],
				violationTypeIndex: 0,
				violationDateTime: this.formatDateTime(new Date()),
				violationDescription: '',
				violationImages: [],
				penaltyPointsOptions: ['1分', '2分', '3分', '5分', '10分'],
				penaltyPointsIndex: 0,
				loading: false,
				violationPaths: []
			}
		},
		onLoad(options) {
			this.checkLogin();
			this.getUserInfo();
			
			// 如果是从摊位详情页跳转过来，自动填充摊位和商贩信息
			// if (options.fromBooth && options.boothId && options.vendorId) {
				// 创建商贩信息
				this.selectedVendor = {
					vendorId: options.vendorId,
					vendorName: decodeURIComponent(options.vendorName || '')
				};
				
				// 填充摊位信息
				this.boothInfo = {
					id: options.id,
					boothId: options.boothId,
					boothName: decodeURIComponent(options.boothName || ''),
					type: decodeURIComponent(options.boothType || '')
				};

			// }
			console.log("传入摊位信息", this.boothInfo);

		},
		methods: {
			checkLogin() {
				const token = uni.getStorageSync("inspector_token");
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录"
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
					return;
				}
				this.token = token;
			},
			getUserInfo() {
				uni.request({
					url: `${uni.$baseUrl}/inspector/getInspectorInfo`,
					method: 'GET',
					header: {
						'Authorization': this.token
					},
					success: res => {
						if (res.data.success) {
							console.log("城管信息获取成功", res.data.data);
							// 保存城管信息到本地
							uni.setStorageSync("inspector_info", res.data.data);
						} else {
							console.log("城管信息获取失败");
						}
					},
					fail: () => {
						console.log("城管信息请求失败");
					}
				});
			},
			formatDate(date) {
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2);
				const day = ('0' + date.getDate()).slice(-2);
				return `${year}-${month}-${day}`;
			},
			formatDateTime(date) {
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2);
				const day = ('0' + date.getDate()).slice(-2);
				const hours = ('0' + date.getHours()).slice(-2);
				const minutes = ('0' + date.getMinutes()).slice(-2);
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			},
			selectVendor() {
				uni.navigateTo({
					url: '/pages/inspector/vendorList/vendorList?select=true',
					events: {
						// 获取被选中的商贩信息
						selectVendor: (vendor) => {
							this.selectedVendor = vendor;
							this.getBoothInfo(vendor.vendorId);
						}
					}
				});
			},
			getBoothInfo(vendorId) {
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothByVendorId/${vendorId}`,
					method: 'GET',
					header: {
						'Authorization': this.token
					},
					success: res => {
						if (res.data.success) {
							this.boothInfo = res.data.data;
						} else {
							console.log("该商贩暂未拥有摊位");
							this.boothInfo = {};
						}
					}
				});
			},
			violationTypeChange(e) {
				this.violationTypeIndex = e.detail.value;
			},
			dateChange(e) {
				this.violationDate = e.detail.value;
			},
			dateTimeChange(e) {
				this.violationDateTime = e.detail.value;
			},
			penaltyPointsChange(e) {
				this.penaltyPointsIndex = e.detail.value;
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.violationImages.push(res.tempFilePaths[0]);
						console.log("违规图片", this.violationImages);
					}
				});
			},
			removeImage(index) {
				this.violationImages.splice(index, 1);
			},
			validateForm() {
				if (!this.selectedVendor) {
					uni.showToast({
						icon: "none",
						title: "请选择商贩"
					});
					return false;
				}
				
				if (!this.violationDescription) {
					uni.showToast({
						icon: "none",
						title: "请描述违规情况"
					});
					return false;
				}
				
				return true;
			},
			submitViolation() {
				if (!this.validateForm()) {
					return;
				}
				
				this.loading = true;
				
				// 获取扣分值（去掉"分"字）
				const penaltyPoints = parseInt(this.penaltyPointsOptions[this.penaltyPointsIndex]);
				
				// 获取当前登录的城管ID
				const inspectorInfo = uni.getStorageSync("inspector_info");
				const inspectorId = parseInt(inspectorInfo ? inspectorInfo.id : null);
				
				if (!inspectorId) {
					uni.showToast({
						icon: "none",
						title: "未获取到城管ID信息"
					});
					this.loading = false;
					return;
				}
				console.log("城管ID", inspectorId);
				
				// 格式化记录时间为ISO 8601格式
				const formatISOTime = (dateTimeStr) => {
					// 将 "2024-05-20 10:30" 转为 "2024-05-20T10:30:00"
					const [datePart, timePart] = dateTimeStr.split(' ');
					return `${datePart}T${timePart}:00`;
				};
				
				// 生成违规记录ID，使用时间戳
				const now = new Date();
				const violationId = 'Vio' + now.getTime();
				
				// 获取摊位和城管的ID（整数类型）
				const boothId = this.boothInfo.id; // 已经是整数类型
				const inspId = inspectorId; // 已经是整数类型
				
				console.log("提交数据检查:", {
					tBoothId: boothId,
					tInspectorId: inspId,
					violation: this.violationTypes[this.violationTypeIndex],
					violationDescription: this.violationDescription,
					deductionPoints: penaltyPoints,
					recordId: violationId
				});
				
				// 提交违规记录
				uni.request({
					url: `${uni.$baseUrl}/inspector/violation`,
					method: 'POST',
					header: {
						'Authorization': this.token,
						'content-type': 'application/json'
					},
					data: {
						tBoothId: boothId,
						violation: this.violationTypes[this.violationTypeIndex],
						violationDescription: this.violationDescription,
						deductionPoints: penaltyPoints,
						tInspectorId: inspId,
						recordTime: formatISOTime(this.violationDateTime),
						recordId: violationId
					},
					success: res => {
						console.log("后端响应数据:", res.data);
						if (res.data.success) {
							// 记录创建成功后，上传图片（如果有）
							if (this.violationImages.length > 0) {
								// 只上传第一张图片
								this.uploadViolationImage(this.violationImages[0], violationId);
								console.log("上传违规图片", this.violationImages[0]);
								console.log("上传违规图片ID", violationId);
							}
							
							uni.showToast({
								title: '违规登记成功',
								icon: 'success'
							});
							
							// 返回上一页
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						} else {
							uni.showToast({
								title: res.data.message || '提交失败',
								icon: 'none'
							});
						}
						this.loading = false;
					},
					fail: err => {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						});
						this.loading = false;
						console.log('提交失败:', err);
					}
				});
			},
			uploadViolationImage(imagePath, violationId) {
				uni.uploadFile({
					url: `${uni.$baseUrl}/inspector/uploadViolationImages`,
					filePath: imagePath,
					header: {
						'Authorization': this.token,
					},
					name: 'violationImage',
					formData: {
						'recordId': violationId
					},
					success: (res) => {
						console.log('上传成功:', res);
					},
					fail: (err) => {
						console.log('上传失败:', err);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f7f7f7;
		padding-bottom: 40rpx;
	}

	.top {
		height: 180rpx;
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
	
	.page-title {
		position: relative;
		z-index: 10;
		text-align: center;
		padding: 30rpx 0;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}
	
	.violation-card {
		padding: 0 30rpx;
		
		.card {
			background-color: #fff;
			border-radius: 16px;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.form-group {
				padding: 30rpx;
				
				.group-header {
					display: flex;
					align-items: center;
					margin-bottom: 30rpx;
					
					.header-line {
						flex: 1;
						height: 1px;
						background-color: #eaeaea;
					}
					
					.header-text {
						margin: 0 20rpx;
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
					}
				}
				
				.form-item {
					margin-bottom: 30rpx;
					
					.item-label {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 10rpx;
					}
					
					.item-content {
						.vendor-selector {
							display: flex;
							justify-content: space-between;
							align-items: center;
							background-color: #f9f9f9;
							padding: 20rpx;
							border-radius: 10rpx;
							
							.selector-text {
								font-size: 28rpx;
								color: #333;
							}
						}
						
						.booth-info {
							background-color: #f9f9f9;
							padding: 20rpx;
							border-radius: 10rpx;
							
							.booth-id, .booth-name, .booth-type {
								font-size: 28rpx;
								color: #333;
								margin-bottom: 10rpx;
							}
						}
						
						picker {
							width: 100%;
							
							.picker-value {
								background-color: #f9f9f9;
								padding: 20rpx;
								border-radius: 10rpx;
								font-size: 28rpx;
								color: #333;
							}
							
							.penalty-points-picker {
								background-color: #eef6ff;
								border: 1px solid #d6e8fc;
								color: #5199ff;
								font-weight: bold;
								display: flex;
								justify-content: center;
								text-align: center;
							}
						}
						
						input, textarea {
							background-color: #f9f9f9;
							padding: 20rpx;
							border-radius: 10rpx;
							font-size: 28rpx;
							width: 100%;
							box-sizing: border-box;
						}
						
						textarea {
							height: 200rpx;
						}
						
						.image-uploader {
							.image-list {
								display: flex;
								flex-wrap: wrap;
								
								.image-item {
									width: 200rpx;
									height: 200rpx;
									margin-right: 20rpx;
									margin-bottom: 20rpx;
									position: relative;
									
									image {
										width: 100%;
										height: 100%;
										border-radius: 10rpx;
									}
									
									.delete-icon {
										position: absolute;
										top: 10rpx;
										right: 10rpx;
										width: 40rpx;
										height: 40rpx;
										background-color: rgba(0, 0, 0, 0.5);
										border-radius: 20rpx;
										display: flex;
										justify-content: center;
										align-items: center;
									}
								}
								
								.add-image {
									width: 200rpx;
									height: 200rpx;
									background-color: #f5f5f5;
									display: flex;
									justify-content: center;
									align-items: center;
									border-radius: 10rpx;
								}
							}
						}
					}
				}
			}
			
			.submit-button {
				margin: 0 30rpx 30rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background-color: #5199ff;
				color: #fff;
				border-radius: 45rpx;
				font-size: 32rpx;
			}
		}
	}
</style> 