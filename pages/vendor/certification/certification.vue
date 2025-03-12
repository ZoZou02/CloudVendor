<template>
	<view v-if="!isCert" class="content">
		<view class="list">
			<view class="row">
				<view class="title">姓名：</view>
				<input class="title" placeholder="请输入真实姓名" v-model="vendorName" />
			</view>

			<view class="row">
				<view class="title">身份证：</view>
				<input class="title" type="number" placeholder="请输入身份证号码" v-model="idNumber" />
			</view>

		</view>

		<image class="IdImg" :src="this.frontUrl" mode="widthFix" @tap="chooseFront()"></image>
		<image class="IdImg" :src="this.backUrl" mode="widthFix" @tap="chooseBack()"></image>

		<view>
			<button class="btn flex-center" @click="getIDCard()">认证身份信息</button>
		</view>
	</view>

	<view v-else class="content">
		<view class="list">
			<view class="row">
				<view class="title">姓名：</view>
				<input class="title" placeholder="请输入真实姓名" v-model="vendorName" />
			</view>

			<view class="row">
				<view class="title">身份证：</view>
				<input class="title" type="number" placeholder="请输入身份证号码" v-model="idNumber" />
			</view>

		</view>
		<view>
			<button class="btn flex-center" @click="reCert">更换实名</button>
		</view>
	</view>

</template>

<script>
	import {
		ref
	} from 'vue';
	var that;
	export default {
		data() {
			return {
				frontUrl: "../../../static/IdCard/frontIdCard.png",
				backUrl: "../../../static/IdCard/backIdCard.png",
				title: 'input',
				idNumber: "",
				vendorName: "",
				token: "",
				isCert: false,
				uploadFront: false,
				uploadBack: false,
			}
		},
		onLoad() {
			that = this;
			this.getCertification();

		},
		methods: {
			getIDCard() {
				var flag = this.verifyData();

				if (flag) {
					console.log("==")
					//百度名片识别接口处理开始
					uni.showLoading({
						mask: true,
						title: "识别中，请等待"
					});
					//此处可接入API进行实名认证
					uni.request({
						url: 'http://localhost:8080/vendor/vendorCertification',
						method: 'GET',
						data: {
							vendorName: this.vendorName,
							idNumber: this.idNumber,
						},
						header: {
							'Authorization': this.token
						},
						success: res => {
							uni.showToast({
								icon: 'success',
								title: '实名认证成功！'
							});

							setTimeout(function() {
								uni.navigateBack();
							}, 1000);
						},
						fail: () => {},
						complete: () => {}
					});
				}


			},
			reCert() {
				this.vendorName = '';
				this.idNumber = '';
				this.isCert = false;
				this.uploadBack = false;
				this.uploadFront = false;
				console.log("vendorname", this.vendorName);
				console.log("idNumber", this.idNumber);
				console.log("isCert", this.isCert);
			},
			//获取用户的实名信息（姓名和身份证号）
			getCertification() {
				this.token = uni.getStorageSync("token")
				uni.request({
					url: 'http://localhost:8080/vendor/getVendorInfo',
					method: 'GET',
					data: {},
					header: {
						'Authorization': this.token
					},
					success: res => {
						this.vendorName = res.data.data.vendorName
						this.idNumber = res.data.data.idNumber
						if (this.vendorName === '未实名认证') {
							this.isCert = false
							this.vendorName=''
						} else {
							this.isCert = true
						}
						console.log("idnumber", this.idNumber)
						console.log("vendorName", this.vendorName)
					},
					fail: () => {},
					complete: () => {}
				})
			},
			//校验输入的数据
			verifyData() {
				var flag = true;
				if (!this.vendorName) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '姓名不能为空'
					});
					return false;
				}
				if (!this.idNumber) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '身份证号不能为空'
					});
					return false;
				}
				var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
				var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
				var res = (re15.test(this.idNumber) || re18.test(this.idNumber));
				if (res == false) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '身份证号填写有误'
					});
					return false;
				}
				if (!this.uploadFront) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '请上传身份证含照片一面'
					});
					return false;
				}
				if (!this.uploadBack) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '请上传身份证含国徽一面'
					});
					return false;
				}
				return flag;

			},
			chooseFront() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.frontUrl = res.tempFilePaths[0];
						this.uploadFront = true;
					}
				})
			},
			chooseBack() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.backUrl = res.tempFilePaths[0];
						this.uploadBack = true;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		// background-color: #fff;
		padding-bottom: 20upx;

		.list {
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

				.right {
					display: flex;
					align-items: center;
					color: #999;

					.tis {
						font-size: 26upx;
						margin-right: 5upx;
						max-height: 120upx;

						.userImage {
							// position: absolute;
							bottom: 24%;
							left: 10%;
							width: 130rpx;
							height: 130rpx;
							overflow: hidden;
							border-radius: 50%;
							border: 2px solid white;

							image {
								width: 100%;
							}
						}
					}

					.icon {
						width: 40upx;
						color: #cecece;
					}
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
		background-color: #4f99ff;
		border-radius: 30px;
		width: 80%;
		color: white;
		font-size: 1.2em;
		height: 100%;
	}
</style>