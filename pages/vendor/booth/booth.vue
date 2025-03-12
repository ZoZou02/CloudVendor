<template>
	<view class="content" v-if="hasBooth">
		<view class="btTab">
			<image class="boothImg" :src="boothPic"></image>
		</view>

		<view class="list">

			<view class="row">
				<view class="title left">摊位ID：</view>
				<view class="title right">{{boothInfo.boothId}}</view>
			</view>

			<view class="row">
				<view class="title left">摊位名称：</view>
				<view class="title right">{{boothInfo.boothName}}</view>
			</view>

			<view class="row">
				<view class="title left">经营类别：</view>
				<view class="title right">{{boothInfo.type}}</view>
			</view>

			<view class="row">
				<view class="title left">描述：</view>
				<view class="title right">{{boothInfo.description}}</view>
			</view>

			<view class="row">
				<view class="title left">营业时间：</view>
				<view class="title right">{{formatTime(boothInfo.startTime)}}~{{formatTime(boothInfo.endTime)}}</view>
			</view>

		</view>

		<view class="QrCode">
			<button class="btn flex-center" @click="getQrCode">获取摊位码</button>
		</view>

		<view>
			<button class="btn flex-center" @click="toEditBooth">编辑摊位信息</button>
		</view>
	</view>

	<view class="content" v-else>
		<image class="boothBG" :src="boothBackGround" mode="widthFix"></image>
		<view class="user-card">
			<view class="card">
				<view class="title">欢迎你的加入</view>
				<view class="text">你将获得：</view>
				<view class="text">
					流动商贩的咨询动态
				</view>
				<view class="text">
					合法合规的摆摊地点
				</view>
				<view class="text">
					相关法律法规的公告
				</view>
				<view class="text">
					（点击下方申请摊位加入我们）
				</view>

			</view>

		</view>

		<view>
			<button class="btn flex-center" @click="toAddBooth">申请摊位</button>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				boothPic: "../../../static/booth/booth.jpg",
				boothBackGround: "../../../static/booth/boothBG.jpg",
				boothInfo: {},
				token: "",
				hasBooth: false,
			}
		},
		mounted() {


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
					url: 'http://localhost:8080/booth/showBooth',
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
					fail: () => {

					},
					complete: () => {}
				});
			},
			getQrCode() {


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

			.boothImg {
				display: block;
				width: 100%;
				// height: auto;
			}
		}


		.boothBG {
			position: relative;
			z-index: 1;
			width: 100%;
			display: block;
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
					color: #999;


				}

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
		width: 60%;
		color: white;
		font-size: 1.2em;
		height: 100%;
		box-shadow: 0 1px 2px 0 #3263a3;
		border: 1px solid #4f99ff;
	}

	.user-card {
		height: 170rpx;
		padding: 0 15px;


		.card {
			position: relative;
			bottom: 100px;
			height: 300rpx;
			background-color: white;
			border-radius: 5px;
			z-index: 10;
			box-shadow: 0 1px 2px 0 #e4e7ef;
			background-color: #ffffff;
			border: 1px solid #ffffff;

			.title {
				font-size: 48upx;
				font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
				font-weight: bold;
				color: #333;
				text-align: center;
			}

			.text {
				font-size: 28upx;
				font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
				color: #777;
				text-align: center;
			}

			.top {
				height: 30%;
				position: relative;

				.userImage {
					position: absolute;
					bottom: 24%;
					left: 10%;
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 2px solid white;

					image {
						width: 100%;
					}
				}
			}

			.bottom {
				display: flex;
				height: 70%;

				.left {
					width: 80%;
					height: 100%;
					position: relative;

					.user-text {
						width: 100%;
						font-size: 1.6em;
						padding-left: 80rpx;
						height: 50%;
					}

					.user-phone {
						color: #96a1ae;
						padding-left: 80rpx;
						height: 50%;
						width: 100%;
						font-size: 0.9em;
					}
				}

				.right {
					width: 20%;
					height: 50%;
				}
			}
		}
	}
</style>