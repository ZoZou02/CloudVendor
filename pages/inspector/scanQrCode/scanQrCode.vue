<template>
	<view class="page-container">
		<!-- 扫码区域 -->
		<view class="scanner-container">
			<view id="qr-reader"></view>
			
			<!-- 扫描框和动画线 -->
			<view class="scan-frame"></view>
			<view class="scan-line"></view>
			
			
			<view class="scan-tips">
				<text class="tips-text">将二维码放入框内，即可自动扫描</text>
			</view>
		</view>
	</view>
</template>

<script>
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'

export default {
	data() {
		return {
			html5QrCode: null,
			token: ""
		}
	},
	onLoad() {
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
		
		// 页面加载完成后初始化扫码器
		this.$nextTick(() => {
			this.initScanner();
		});
	},
	onUnload() {
		this.stopScanning();
	},
	methods: {
		// 初始化扫码器
		async initScanner() {
			try {
				const cameras = await Html5Qrcode.getCameras()
				if (cameras.length > 0) {
					this.html5QrCode = new Html5Qrcode("qr-reader")
					this.startScanning()
				}
			} catch (err) {
				uni.showToast({
					title: '无法访问摄像头，请检查权限设置',
					icon: 'none',
					duration: 2000
				})
			}
		},
		
		// 开始扫描
		startScanning() {
			this.html5QrCode.start({
					facingMode: "environment"
				}, {
					fps: 10,
					qrbox: {
						width: 500,
						height: 500
					},
				},
				this.handleScanResult
			).catch(err => console.error('扫描启动失败:', err))
		},
		
		// 处理扫描结果
		handleScanResult(decodedText, decodedResult) {
			this.stopScanning()
			console.log(`扫描结果: ${decodedText}`)
			
			// 从原来的processQrCode函数中保留业务逻辑部分
			try {
				// 解析二维码内容
				let boothData;
				try {
					boothData = JSON.parse(decodedText);
				} catch (e) {
					// 如果不是JSON格式，直接作为ID处理
					console.log("非JSON格式，直接作为ID处理");
					boothData = { boothId: decodedText };
				}
				
				// 验证摊位ID
				if (boothData && boothData.boothId) {
					console.log("获取到摊位ID:", boothData.boothId);
					this.getBoothInfo(boothData.boothId);
				} else {
					throw new Error('无效的二维码内容');
				}
			} catch (error) {
				console.error('处理二维码内容失败:', error);
				uni.showToast({
					title: '无效的摊位码',
					icon: 'none',
					duration: 2000
				});
				
				// 延迟后重新开始扫描
				setTimeout(() => {
					this.initScanner();
				}, 2000);
			}
		},
		
		// 停止扫描
		stopScanning() {
			this.html5QrCode?.stop().then(() => {
				console.log('扫描已停止')
			}).catch(err => console.error('停止失败:', err))
		},
		
		// 获取摊位信息
		getBoothInfo(boothId) {
			uni.showLoading({
				title: '获取摊位信息'
			});
			
			console.log("请求摊位信息，ID:", boothId);
			
			uni.request({
				url: `${uni.$baseUrl}/admin/boothDetail`,
				method: 'GET',
				data: {
					boothId: boothId
				},
				header: {
					'Authorization': this.token
				},
				success: res => {
					uni.hideLoading();
					console.log('摊位信息返回:', res.data);
					
					if (res.data && res.data.success) {
						// 跳转到摊位详情页
						uni.navigateTo({
							url: `/pages/inspector/boothDetail/boothDetail?boothId=${boothId}`,
							fail(e) {
								console.log("导航错误", e);
								uni.showToast({
									title: '页面跳转失败',
									icon: 'none'
								});
								// 重新开始扫描
								setTimeout(() => {
									this.initScanner();
								}, 2000);
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg || '未找到摊位信息',
							icon: 'none',
							duration: 2000
						});
						// 重新开始扫描
						setTimeout(() => {
							this.initScanner();
						}, 2000);
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('获取摊位信息失败:', err);
					uni.showToast({
						title: '获取摊位信息失败',
						icon: 'none',
						duration: 2000
					});
					// 重新开始扫描
					setTimeout(() => {
						this.initScanner();
					}, 2000);
				}
			});
		},
		
		// 返回上一页
		goBack() {
			this.stopScanning();
			uni.navigateBack();
		}
	}
}
</script>

<style>
/* 基础样式 */
.page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #000;
}

/* 扫码区域 */
.scanner-container {
	flex: 1;
	position: relative;
	overflow: hidden;
}

#qr-reader {
	width: 100% !important;
	height: 100% !important;
	position: relative !important;
	z-index: 1;
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
}

/* 去除html5-qrcode默认UI */
#qr-reader__dashboard {
	display: none !important;
}

#qr-reader__scan_region_highlight {
	position: absolute !important;
	z-index: 9 !important;
}



/* 隐藏或修改qr-shaded-region */
/* :deep(#qr-shaded-region) {
	display: none !important;
	position: absolute; border-width: 36.5px 90px; border-style: solid; border-color: rgba(0, 0, 0, 0.48); box-sizing: border-box; inset: 0px;
} */

#qr-reader__scan_region {
	width: 100% !important;
	height: 100% !important;
	background: transparent !important;
	position: absolute !important;
	top: 0 !important;
	left: 0 !important;
}

/* 确保视频显示 */
#qr-reader video {
	width: 100% !important;
	height: 100% !important;
	object-fit: cover !important;
	position: absolute !important;
	top: 0 !important;
	left: 0 !important;
	z-index: 2 !important;
}

/* 扫描框和动画 */
.scan-frame {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 250px;
	height: 250px;
	border: 2px solid #5199ff;
	border-radius: 12px;
	box-shadow: 0 0 0 3px rgba(81, 153, 255, 0.3);
	z-index: 10;
	pointer-events: none;
}

.scan-line {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 230px;
	height: 2px;
	background-color: #5199ff;
	transform: translateX(-50%);
	animation: scanAnimation 2s infinite ease-in-out;
	z-index: 11;
	pointer-events: none;
}

@keyframes scanAnimation {
	0% {
		transform: translate(-50%, -120px);
	}
	50% {
		transform: translate(-50%, 120px);
	}
	100% {
		transform: translate(-50%, -120px);
	}
}

.scan-tips {
	position: absolute;
	bottom: 180px; /* 调整位置在控件上方 */
	left: 0;
	width: 100%;
	text-align: center;
	z-index: 12;
}

.tips-text {
	color: #FFFFFF;
	font-size: 14px;
}

/* 将浮动控制区居中对齐 */
.upload-btn {
	position: absolute;
	bottom: 100px;
	z-index: 2000;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	left: 50%;
	transform: translateX(-50%);
	width: 120px;
	height: 30px;
}

.file-upload input[type="file"] {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}

/* 优化按钮样式使其更明显 */
.upload-icon {
	color: white;
	font-size: 16px;
	background-color: rgba(81, 153, 255, 0.9);
	padding: 12px 25px;
	border-radius: 30px;
	display: inline-block;
	box-shadow: 0 3px 0px 0 #3f87d3;
	border: 1px solid #53a6ff;
}

/* 移动端优化 */
@media (max-width: 480px) {
	.floating-controls {
		padding: 15px;
	}
}
</style>
