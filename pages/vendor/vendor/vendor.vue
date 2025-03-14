<template>
	<view class="page">

		<view class="top">
			<view class="background"></view>
		</view>

		<view class="user-card">

			<view class="card">

				<view class="top">
					<view class="userImage">
						<image :src="userInfo.vendorPic" mode="widthFix"></image>
					</view>
				</view>

				<view class="bottom">

					<view class="left">

						<view class="user-text">
							<view class="user-company">{{ token ? userInfo.vendorName :'点击登录' }}</view>
						</view>
						<view class="user-phone">用户ID: {{userInfo.vendorId}}</view>
						<view class="user-phone">地区: {{userInfo.address}}</view>
					</view>
				</view>

			</view>

		</view>

		<view class="boxList">
			<view class="box" @click="toBooth">
				<image src="../../../static/myIcon/store.png" mode="aspectFit"></image>
				<view class="funcTitle">我的摊位</view>
			</view>

			<view class="box" @click="toCert">
				<image src="../../../static/myIcon/cert.png" mode="aspectFit"></image>
				<view class="funcTitle">实名认证</view>
			</view>
			<view class="box" @click="toSetting">
				<image src="../../../static/myIcon/setting.png" mode="aspectFit"></image>
				<view class="funcTitle">设置</view>
			</view>
			<view class="box" @click="toProfile">
				<image src="../../../static/myIcon/edit.png" mode="aspectFit"></image>
				<view class="funcTitle">编辑资料</view>
			</view>
			<view class="box">
				<image src="../../../static/myIcon/help.png" mode="aspectFit"></image>
				<view class="funcTitle">帮助</view>
			</view>
			<view class="box">
				<!-- <image src="../../../static/myIcon/cert.png" mode="aspectFit"></image> -->
			</view>
		</view>

		<view class="quit flex-center">
			<view v-if="token" class="btn flex-center" @click="logout">
				退出登录
			</view>
			<view v-if="!token" class="btn flex-center" @click="toLogin">
				登录
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					id: null,
					vendorId: null,
					vendorName: "",
					idNumber: "",
					phone: "",
					address: "",
					registerTime: "",
					loginTime: "",
					sex: "",
					vendorPic: "../../../static/avatar/avatar.png",
					password: ""
				},
				token: ""
			}
		},
		onPullDownRefresh() {
			console.log("开启下拉刷新")
			setTimeout(function() {
				location.reload()
			}, 1000)
		},
		onLoad() {},
		onShow() {
			this.getUserInfo();
			//token不为空
			if (this.token) {
				uni.request({
					url: `${uni.$baseUrl}/vendor/checkTokenStatus`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': this.token
					},
					success: res => {
						if (res.data.success == false) {
							uni.removeStorageSync("token");
							uni.showToast({
								icon: "error",
								title: '登录已过期'
							});
							this.getUserInfo()
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}

		},
		methods: {
			getUserInfo() {
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
					url: `${uni.$baseUrl}/vendor/getVendorInfo`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						console.log(res.data);
						this.userInfo = res.data.data
						if (this.userInfo.vendorPic == "" || this.userInfo.vendorPic == null) {
							this.userInfo.vendorPic = "../../../static/avatar/avatar.png"
						}

						this.token = token
					},
					fail: () => {},
					complete: () => {}
				});
			},
			logout() {
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('token');
				this.toIndex()
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/vendor/login/login'
				})
			},
			toIndex() {
				uni.reLaunch({
					url: '/pages/vendor/index/index'
				})
			},
			toCert() {
				uni.navigateTo({
					url: '/pages/vendor/certification/certification'
				})
			},
			toSetting() {
				uni.navigateTo({
					url: '/pages/vendor/setting/setting'
				})
			},
			toBooth() {
				uni.navigateTo({
					url: '/pages/vendor/booth/booth'
				})
			},
			toProfile() {
				uni.navigateTo({
					url: '/pages/vendor/editProfile/editProfile'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		}
	}

	.icon {
		color: #96a1ae;
		font-size: 40rpx;
	}

	.user-card {
		height: 160rpx;
		padding: 0 15px;
		width: 90%;

		.card {
			position: relative;
			bottom: 62px;
			height: 120px;
			background-color: white;
			border-radius: 5%;
			box-shadow: 0 1px 2px 0 #e4e7ef;

			.top {
				height: 30%;
				position: relative;

				.userImage {
					position: absolute;
					bottom: 15%;
					left: 10%;
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 5px solid white;

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
					height: 90%;
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
						height: 25%;
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

	.list-card {
		padding: 0 15px;

		.card {
			border-radius: 5px;
			position: relative;
			background-color: white;
			box-shadow: 0 1px 2px 0 #e4e7ef;
			border-radius: 5px;
			padding: 5px 30px;

			.item {
				display: flex;
				height: 120rpx;

				.left {
					width: 15%;

					image {
						width: 70rpx;
						height: 70rpx;
					}
				}

				.center {
					width: 65%;
					display: flex;
					align-items: center;
					font-size: 1.1em;
				}

				.right {
					width: 20%;
					justify-content: flex-end;
				}
			}
		}
	}

	.item-bottom-solid {
		border-bottom: 1px solid #d4d6da;
	}

	.quit {
		height: 100rpx;
		margin-top: 50px;

		.btn {
			background-color: #4f99ff;
			border-radius: 30px;
			width: 80%;
			color: white;
			font-size: 1.2em;
			height: 100%;
		}
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.boxList {
		position: relative;
		margin: auto;
		bottom: 30%;
		width: 90%;
		height: 200px;
		border-radius: 5%;
		background-color: #fff;
		box-shadow: 0 1px 2px 0 #e4e7ef;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-content: flex-end;

		.box {
			width: 90px;
			height: 90px;
			text-align: center;

			.funcTitle {
				color: black;
				font-size: 0.7em;
			}

			image {
				width: 30px;
				height: 30px;

			}

		}

	}
</style>