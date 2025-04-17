<template>
	<view class="content">

		<view class="btTab">
			<image class="boothImg" :src="boothSamplePic" @click="chooseImage">
			</image>
		</view>

		<view class="list">

			<!-- 			<view class="row">
				<view class="title left">摊位ID：</view>
				<view class="title right" style="color: #999;">{{boothInfo.boothId}}</view>
			</view> -->

			<view class="row">
				<label class="title left" for="name">摊位名称：</label>
				<input class="title right" type="text" v-model="boothInfo.boothName" id="name" />
			</view>

			<view class="row">
				<view class="title left">经营类别：</view>
				<picker @change="bindTypeChange" :value="typeIndex" :range="typeArray">
					<view class="title right">{{typeArray[typeIndex]}}<uni-icons type="right"></uni-icons></view>
				</picker>
			</view>

			<view class="row">
				<view class="title left">描述：</view>
				<input class="title right" type="text" v-model="boothInfo.description" />
			</view>

			<view class="row">
				<view class="title left">营业开始时间：</view>
				<picker mode="time" @change="bindStartTimeChange" start="5:00" end="24:00" :value="boothInfo.startTime">
					<view class="right">{{boothInfo.startTime}}<uni-icons type="right"></uni-icons></view>
				</picker>
			</view>
			<view class="row">
				<view class="title left">营业结束时间：</view>
				<picker mode="time" @change="bindEndTimeChange" start="5:00" end="24:00" :value="boothInfo.endTime">
					<view class="right">{{boothInfo.endTime}}<uni-icons type="right"></uni-icons></view>
				</picker>
			</view>


		</view>
		<view>
			<button class="btn flex-center" @click="saveBooth">保存修改</button>
		</view>
	</view>
</template>

<script>
	var that;
	export default {
		data() {
			return {
				boothSamplePic: "../../../static/booth/booth.jpg",
				boothInfo: {
					id: "",
					boothId: "",
					boothName: "",
					boothPic: "",
					description: "",
					startTime: "",
					endTime: "",
					type: ""
				},
				token: "",
				typeArray: ['食品类', '饰品类', '日用品类', '纺织服装类', '花卉水果类', '电子产品类'],
				typeIndex: 0,
			}
		},
		onLoad() {
			this.token = uni.getStorageSync("token")
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.boothSamplePic = res.tempFilePaths[0];
						console.log(this.boothSamplePic)
					}
				})
			},
			saveBooth() {
				if(this.verifyData()){
					console.log('摊位信息', this.boothInfo)
					uni.request({
						url: `${uni.$baseUrl}/booth/addBooth`,
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
							//返回
							this.toIndex()
						},
						fail: () => {},
						complete: () => {}
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
						title: '时间有误！'
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
				// console.log('typeindex',this.typeIndex)
			},
			bindStartTimeChange(e) {
				// console.log('e',e)
				// this.time=e.detail.value
				this.boothInfo.startTime = e.detail.value
			},
			bindEndTimeChange(e) {
				// console.log('e',e)
				// this.time=e.detail.value
				this.boothInfo.endTime = e.detail.value
			},
			uploadImage(){
				uni.uploadFile({
					url: 'http://localhost:8080/booth/uploadBoothPic', // 上传
					filePath: this.boothSamplePic,
					header: {
						'Authorization': this.token,
					},
					name: 'boothPic',
					success: (res) => {
						console.log('上传成功:', res);
					},
					fail: (err) => {
						console.log('上传失败:', err);
					}
				})
				
			},
			toBooth() {
				uni.navigateTo({
					url: '/pages/vendor/booth/booth',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
			toIndex() {
				uni.navigateTo({
					url: '/pages/vendor/index/index',
					fail(e) {
						console.log("错误", e)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		// background-color: #fff;
		padding-bottom: 20upx;

		.btTab {
			position: relative;
			z-index: 1;
			width: 100%;
			height: 250px;
			background-color: #fff;
		}

		.boothImg {
			display: block;
			width: 100%;
			// height: auto;
		}

		.list {
			position: relative;
			width: 96%;
			padding-left: 4%;
			background-color: #fff;
			margin-bottom: 20upx;

			.row {
				widows: 100%;
				min-height: 90upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: solid 1upx #eee;

				&:last-child {
					border-bottom: none;
				}

				.title {
					font-size: 36upx;
					color: #333;
				}

				.left {

					margin-left: 20px;

				}

				.right {
					margin-right: 20px;
					color: #333;
					text-align: right;


				}

				// .right {
				// 	display: flex;
				// 	align-items: center;
				// 	color: #999;

				// 	.tis {
				// 		font-size: 26upx;
				// 		margin-right: 5upx;
				// 		max-height: 120upx;

				// 		.userImage {
				// 			// position: absolute;
				// 			bottom: 24%;
				// 			left: 10%;
				// 			width: 130rpx;
				// 			height: 130rpx;
				// 			overflow: hidden;
				// 			border-radius: 50%;
				// 			border: 2px solid white;

				// 			image {
				// 				width: 100%;
				// 			}
				// 		}
				// 	}

				// 	.icon {
				// 		width: 40upx;
				// 		color: #cecece;
				// 	}
				// }

			}
		}
	}

	.option {
		display: flex;
		/* margin-top: 4%; */
		margin-left: 30upx;
		padding-bottom: 30upx;
		border-bottom: #cecece solid 0.5upx;
	}

	.msg-left {
		flex: 5;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.msg-right {
		flex: 2;
		display: flex;
		justify-content: center;
		text-align: center;
		margin-right: 15upx;
		border-bottom: #000000 solid 0.5upx;
	}

	.IdImg {
		display: block;
		margin-left: 10%;
		margin-bottom: 10px;
		width: 80%;
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn {
		margin-top: 10px;
		background-color: #4f99ff;
		border-radius: 30px;
		width: 80%;
		color: white;
		font-size: 1.2em;
		height: 100%;
	}

	input[required]::after {
		content: "*";
		color: red;
		margin-left: 2px;
	}
</style>