<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row" style="height: 80px;" @click="toAvatar">
					<view class="title">头像</view>
					<view class="right">
						<view class="tis">
							<view class="userImage">
								<image :src="userInfo.vendorPic" mode="widthFix"></image>
							</view>
						</view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">用户ID</view>
					<view class="right">
						<view class="tis">{{userInfo.vendorId}}</view><uni-icons type="right" color="#ffffff"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">姓名</view>
					<view class="right">
						<view class="tis">{{userInfo.vendorName}}</view><uni-icons type="right"
							color="#ffffff"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="right">
						<view class="tis">{{sex}}</view><uni-icons type="right" color="#ffffff"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">联系地址</view>
					<view class="right">
						<view class="tis">{{userInfo.address}}</view><uni-icons type="right" color="#ffffff"></uni-icons>
					</view>
				</view>
<!-- 				<view class="row" @click="toEdit">
					<view class="title">编辑个人资料</view>
					<view class="right">
						<view class="tis"></view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view> -->
			</view>
			<view class="list">
				<view class="row">
					<view class="title">通知提醒</view>
					<view class="right">
						<view class="tis"></view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">版本升级</view>
					<view class="right">
						<view class="tis">v1.0.0</view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">清除缓存</view>
					<view class="right">
						<view class="tis"></view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view>
				<view class="row">
					<view class="title">问题反馈</view>
					<view class="right">
						<view class="tis"></view><uni-icons type="right" color="#cecece"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				token: "",
				time: "",
				sex:""
			};
		},
		onShow() {
			this.getUserInfo();
		},
		onLoad(options) {

			// // 检查本地存储中是否已经执行过刷新操作
			// const hasRefreshed = localStorage.getItem('hasRefreshed');

			// // 如果未执行过刷新操作，则执行刷新逻辑
			// if (!hasRefreshed) {
			// 	// 执行刷新逻辑
			// 	location.reload();

			// 	// 标记已经执行过刷新操作
			// 	localStorage.setItem('hasRefreshed', true);
			// }
		},
		onPullDownRefresh() {
			console.log("开启下拉刷新")
			setTimeout(function() {
				location.reload()
			}, 1000)
		},
		methods: {
			toEdit(){
				uni.navigateTo({
					url:'/pages/vendor/editProfile/editProfile'
				})
			},
			toAvatar() {
				uni.navigateTo({
					url: "/pages/vendor/editAvatar/editAvatar",
				})
			},
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},
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
					url: 'http://localhost:8080/vendor/getVendorInfo',
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: res => {
						console.log(res.data);
						this.userInfo = res.data.data
						this.token = token
						if(this.userInfo.sex==='1'){
							this.sex="男"
						}else if(this.userInfo.sex==='2'){
							this.sex="女"
						}else{
							this.sex="未知"
						}
						// location.reload()
					},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.icon {
		font-size: 30upx;

	}

	.content {
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
					font-size: 32upx;
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

						// image {
						// 	width: 150upx;
						// 	height: 150upx;
						// 	border-radius: 100%;
						// 	margin: 10upx 0;

						// }

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
</style>