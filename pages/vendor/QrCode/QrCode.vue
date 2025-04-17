<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 摊位码卡片 -->
		<view class="qrcode-card" v-if="hasBooth">
			<view class="card" ref="qrcodeCard" id="qrcodeCard">
				<!-- 标题 -->
				<view class="card-header">
					<view class="header-line"></view>
					<view class="header-text">摊位码</view>
					<view class="header-line"></view>
				</view>
				
				<!-- 二维码展示 -->
				<view class="qrcode-section">
					<image class="qrcode-image" :src="QrPic" mode="aspectFill"></image>
					<view class="booth-id">
						<view class="booth-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
								<path fill="#5199ff" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
							</svg>
						</view>
						<text>摊位ID：{{ boothInfo.boothId }}</text>
					</view>
				</view>
				
				<!-- 说明文本 -->
				<view class="qrcode-info">
					<view class="info-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
							<path fill="#5199ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
						</svg>
					</view>
					<text>出示二维码可快速核验摊位身份</text>
				</view>
				
				<!-- 底部按钮 -->
				<view class="button-section">
					<button class="action-button" @click="toBack">返回</button>
					<button class="action-button save-button" @click="saveQrCode">保存</button>
				</view>
			</view>
		</view>
		
		<!-- 隐藏的画布，用于绘制并保存二维码卡片 -->
		<canvas canvas-id="qrcodeCanvas" class="hidden-canvas"></canvas>
		
		<!-- H5平台使用的下载链接 -->
		<a ref="downloadLink" class="hidden-link"></a>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				QrPic:"../../../static/qrCode/GD240520155690.png",
				boothPic: "../../../static/booth/booth.jpg",
				boothBackGround: "../../../static/booth/boothBG.jpg",
				boothInfo: {},
				token: "",
				hasBooth: false,
				canvasWidth: 0,
				canvasHeight: 0,
			}
		},
		onShow() {
			this.getBoothInfo()
		},
		onLoad() {},
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
						// console.log(res.data)
						if (res.data.success) {
							console.log(res.data);
							//摊位信息
							this.boothInfo = res.data.data
							//摊位照片
							if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
								this.boothPic = this.boothInfo.boothPic
							}
							console.log('pic', this.boothPic)
							//token
							this.token = token
							//设置是否拥有摊位
							this.hasBooth = true
						} else {
							console.log("该摊主尚未拥有摊位")
							this.hasBooth = false
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			toEditBooth() {
				uni.navigateTo({
					url: '/pages/vendor/editBooth/editBooth',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toAddBooth() {
				uni.navigateTo({
					url: '/pages/vendor/addBooth/addBooth',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toBack(){
				uni.navigateBack()
			},
			// 保存二维码
			saveQrCode() {
				uni.showLoading({
					title: '准备保存'
				});
				
				// 获取卡片的尺寸信息
				const that = this;
				uni.createSelectorQuery()
					.select('#qrcodeCard')
					.boundingClientRect(data => {
						that.canvasWidth = data.width;
						that.canvasHeight = data.height;
						that.drawQrCodeCard();
					})
					.exec();
			},
			// 绘制二维码卡片到画布上
			drawQrCodeCard() {
				const ctx = uni.createCanvasContext('qrcodeCanvas', this);
				
				// 设置画布大小
				ctx.width = this.canvasWidth;
				ctx.height = this.canvasHeight;
				
				// 外层背景 - 蓝色
				ctx.fillStyle = '#5199ff';
				ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				
				// 内层背景 - 白色
				const padding = 20; // 边框宽度
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(padding, padding, this.canvasWidth - padding * 2, this.canvasHeight - padding * 2);
				
				// 绘制标题
				ctx.setTextAlign('center');
				ctx.setFontSize(18);
				ctx.setFillStyle('#333333');
				ctx.fillText('摊位码', this.canvasWidth / 2, 40);
				
				// 绘制二维码
				ctx.drawImage(this.QrPic, (this.canvasWidth - 225) / 2, 60, 225, 225);
				
				// 绘制摊位ID
				ctx.setTextAlign('center');
				ctx.setFontSize(18);
				ctx.setFillStyle('#333333');
				ctx.fillText(`${this.boothInfo.boothId || ''}`, this.canvasWidth / 2, 310);
				
				// 绘制说明文本
				ctx.setFillStyle('#f8f9fa');
				ctx.fillRect(30, 330, this.canvasWidth - 60, 50);
				ctx.setTextAlign('center');
				ctx.setFontSize(13);
				ctx.setFillStyle('#666666');
				ctx.fillText('出示二维码可快速核验摊位身份', this.canvasWidth / 2, 360);
				
				// 完成绘制并保存
				ctx.draw(false, () => {
					setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: 'qrcodeCanvas',
							success: (res) => {
								uni.hideLoading();
								// 根据平台选择保存方式
								// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY
								this.saveToAlbum(res.tempFilePath);
								// #endif
								
								// #ifdef H5
								this.saveForWeb(res.tempFilePath);
								// #endif
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('画布转图片失败', err);
								uni.showToast({
									title: '生成图片失败',
									icon: 'none'
								});
							}
						}, this);
					}, 300);
				});
			},
			// APP和小程序保存到相册
			saveToAlbum(filePath) {
				// 微信小程序先检查权限
				// #ifdef MP-WEIXIN
				wx.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							wx.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => this.doSaveToAlbum(filePath),
								fail: () => {
									uni.showModal({
										title: '提示',
										content: '需要授权保存到相册',
										success: (result) => {
											if (result.confirm) {
												uni.openSetting();
											}
										}
									});
								}
							});
						} else {
							this.doSaveToAlbum(filePath);
						}
					}
				});
				// #endif
				
				// #ifdef APP-PLUS || MP-ALIPAY
				this.doSaveToAlbum(filePath);
				// #endif
			},
			
			// 真正执行保存到相册的操作
			doSaveToAlbum(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: () => {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('保存失败', err);
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				});
			},
			
			// H5平台通过下载实现
			saveForWeb(base64Path) {
				// 创建下载链接
				const fileName = `摊位码_${this.boothInfo.boothId || '未知'}_${new Date().getTime()}.png`;
				
				// 在H5端，base64已经是图片数据了
				try {
					// 如果是base64格式，需要准备下载链接
					if (base64Path.indexOf('data:image') !== -1) {
						// 创建隐藏的a标签并模拟点击下载
						const link = this.$refs.downloadLink;
						link.href = base64Path;
						link.download = fileName;
						link.click();
						
						uni.showToast({
							title: '图片即将下载',
							icon: 'success'
						});
					} else {
						// 如果不是base64，可能是blob URL或其他格式
						// 此处省略其他格式的处理...
						uni.showToast({
							title: '请长按图片保存',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('H5保存失败', e);
					uni.showToast({
						title: '保存失败，请截图保存',
						icon: 'none'
					});
				}
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
	
	.qrcode-card {
		padding: 0 30rpx;
		
		.card {
			position: relative;
			bottom: 62px;
			background-color: #ffffff;
			border-radius: 15px;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
			padding: 40rpx 30rpx;
			
			.card-header {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 40rpx;
				
				.header-line {
					flex: 1;
					height: 2rpx;
					background-color: #eeeeee;
				}
				
				.header-text {
					font-size: 32rpx;
					color: #333;
					padding: 0 20rpx;
					font-weight: 500;
				}
			}
			
			.qrcode-section {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20rpx 0 40rpx;
				
				.qrcode-image {
					width: 450rpx;
					height: 450rpx;
					border: 1px solid #eee;
					border-radius: 12rpx;
					box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.08);
				}
				
				.booth-id {
					margin-top: 30rpx;
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
					display: flex;
					align-items: center;
					
					.booth-icon {
						margin-right: 10rpx;
						display: flex;
						align-items: center;
					}
				}
			}
			
			.qrcode-info {
				background-color: #f8f9fa;
				padding: 20rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				margin: 20rpx 0;
				
				.info-icon {
					margin-right: 10rpx;
					display: flex;
					align-items: center;
				}
				
				text {
					font-size: 26rpx;
					color: #666;
				}
			}
			
			.button-section {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				
				.action-button {
					width: 45%;
					height: 90rpx;
					line-height: 90rpx;
					background-color: #5199ff;
					color: #fff;
					font-size: 32rpx;
					letter-spacing: 2rpx;
					border-radius: 45rpx;
					box-shadow: 0 6rpx 15rpx rgba(81, 153, 255, 0.3);
				}
				
				.save-button {
					background-color: #32CD32;
				}
			}
		}
	}
	
	.hidden-canvas {
		position: absolute;
		left: -9999px;
		width: 100%;
		height: 100%;
	}
	
	.hidden-link {
		display: none;
	}
</style>