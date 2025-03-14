<template>
	<view>
		<view class="top">
			<view class="background"></view>
		</view>

		<view class="user-card">

			<view class="card">

				<view class="top">
					<image class="boothIcon" src="../../../static/myIcon/marker.png" mode="widthFix"></image>
				</view>

				<view class="bottom">
					<view class="left">
						<view class="user-text">
							<view class="user-company">{{boothInfo.boothName}}</view>
							<image v-if="boothState.boothState==='营业中'" src="../../../static/myIcon/operate.png" mode="widthFix"></image>
							<image v-else src="../../../static/myIcon/break.png" mode="widthFix"></image>
						</view>
						<view class="user-phone">摊位ID：{{boothInfo.boothId}}</view>
						<view class="user-phone">营业时间：{{boothInfo.startTime}}~{{boothInfo.endTime}}</view>
					</view>
				</view>

			</view>
			
		</view>
		
		<view class="other-card">
			
				<view class="title">其他摊位</view>
			
			<view v-for="booth in boothList" class="card">
						
				<view class="bottom">
					<view class="left">
						<view class="user-text">
							<view class="user-company">{{booth.boothName}}</view>
						</view>
						<view class="user-phone">摊位ID：{{booth.boothId}}</view>
						<view class="user-phone">营业时间：{{booth.startTime}}~{{booth.endTime}}</view>
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
				boothPic: "../../../static/booth/booth.jpg",
				boothInfo: {},
				boothState: {},
				boothList: {},
				token: "",
				startTime: "",
				endTime: "",
			}
		},
		onPullDownRefresh() {
			console.log("开启下拉刷新")
			setTimeout(function() {
				// uni.stopPullDownRefresh();
				window.location.reload()
			}, 1000)
		},
		onShow() {},
		onLoad() {
			this.getBoothInfo()
		},
		methods: {
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
						console.log("摊位信息", res.data);
						this.boothInfo = res.data.data
						this.token = token
						//获取摊位状态
						this.getBoothState()
						
						//获取其他摊位
						this.getBoothList()

						//摊位照片
						if (this.boothInfo.boothPic != null && this.boothInfo.boothPic != "") {
							this.boothPic = this.boothInfo.boothPic
						}


					},
					fail: () => {},
					complete: () => {}
				});
			},
			getBoothState() {
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothState`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': this.token
					},
					success: (res) => {
						this.boothState=res.data.data
						console.log("摊位状态",res.data)

					}
				})
			},
			getBoothList(){
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothList`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': this.token
					},
					success: (res) => {	
						// const list = res.data.data
						
						// for(let i = 0;i<list.length;i++ ){
						// 	if(list[i].id!=this.boothInfo.id){
						// 		// this.boothList=[...this.boothList,list[i]]
						// 	}
						// }
						
						// this.boothList=res.data.data
						const list = res.data.data;
						this.boothList = list.filter(item => item.id !== this.boothInfo.id);
						console.log("摊位列表", this.boothList);
						console.log("摊位列表",res.data.data)
					
					}
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '/page/Vendor/login/login'
				});
			},
		},
	}
</script>

<style lang="scss">
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

	.user-card {
		height: 160rpx;
		padding: 0 15px;
		width: 90%;

		.card {
			position: relative;
			bottom: 62px;
			height: 150px;
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

				.boothIcon {
					position: absolute;
					bottom: 15%;
					left: 5%;
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
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
						
						image{
							bottom: 30px;
							left: 200px;
							width: 30px;
						}
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
	
	.other-card {
		margin-top: 30px;
		height: 500px;
		padding: 0 15px;
		width: 90%;
		

		.title{
			position: relative;
			top: 0;
			left: 100px;
			font-size: 1.2em;
			height: 20%;
		}

		.card {
			margin-top: 5px;
			margin-bottom: 10px;
			position: relative;
			bottom: 62px;
			height: 100px;
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

				.boothIcon {
					position: absolute;
					bottom: 15%;
					left: 5%;
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
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
						
						image{
							bottom: 30px;
							left: 200px;
							width: 30px;
						}
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
</style>