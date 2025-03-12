<template>
	<view class="changeInfo">
		<view class="nav-box">
			<view class="title">编辑个人资料</view>
		</view>
		<view class="box">
			<view class="img-box">
				<image class="img" :src="vendorPic" @click="chooseImage" mode="widthFix"></image>
				<view class="text">点击更换头像</view>
			</view>
		</view>


		<view class="info-box">

			<view class="text-box">
				<view class="left">用户ID</view>
				<view type="text" class="right">{{userInfo.vendorId}}</view>
			</view>

			<view class="text-box">
				<view class="left">姓名</view>
				<view type="text" class="right">{{userInfo.vendorName}}</view>
			</view>

			<!-- 			<view class="uni-list">
				<view class="text-box">
					<view class="left">性别</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="sexIndex" :range="array">
							<view class="right">{{array[sexIndex]}}</view>
						</picker>
					</view>
				</view>
			</view> -->
			<view class="uni-list">
				<view class="text-box">
					<view class="left">性别</view>
					<radio-group @change="sexChange">
						<label class="sexLabel" v-for="(item, index) in array" :key="item.value">
							<radio :value="item.value" :checked="index === sexIndex" />
							{{item.name}}
						</label>
					</radio-group>
				</view>
			</view>

			<view class="text-box">
				<view class="left">手机</view>
				<view class="iconfont iconchangyongicon- icon-box"></view>
				<input type="text" class="rightInput" v-model="userInfo.phone" />
			</view>

			<view class="text-box">
				<view class="left">联系地址</view>
				<view class="iconfont iconchangyongicon- icon-box"></view>
				<input type="text" class="rightInput" v-model="userInfo.address" />
			</view>
		</view>
		<view class="quit flex-center">
			<view class="btn flex-center" @click="save">
				点击保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vendorPic: "../../../static/avatar/avatar.png",
				userInfo: {},
				array: [{
						value: '0',
						name: '未知',
					},
					{
						value: '1',
						name: '男',
					},
					{
						value: '2',
						name: '女',
					}
				],
				sexIndex: 0,
				token: "",
				time: "",
				sex: ""
			}
		},
		onLoad() {
			this.getUserInfo()
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

						//性别数据转换
						if (this.userInfo.sex === '1') {
							this.sex = "男"
						} else if (this.userInfo.sex === '2') {
							this.sex = "女"
						} else {
							this.sex = "未知"
						}
						this.sexIndex = parseInt(this.userInfo.sex)
						console.log('user', this.userInfo)

						//头像
						if (this.userInfo.vendorPic != null && this.userInfo.vendorPic != "") {
							this.vendorPic=this.userInfo.vendorPic
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
						this.vendorPic = res.tempFilePaths[0];
						console.log(this.vendorPic)
					}
				})
			},
			save() {
				var flag=this.verifyData();
				if(flag){
					this.uploadImage()
					uni.request({
						url: 'http://localhost:8080/vendor/editVendorInfo',
						method: 'GET',
						header: {
							'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
						},
						data: {
							vendorId: this.userInfo.vendorId,
							vendorName: this.userInfo.vendorName,
							phone: this.userInfo.phone,
							address: this.userInfo.address,
							sex: this.sexIndex,
							// vendorPic: this.userInfo.vendorPic
						},
						header: {
							'Authorization': this.token
						},
						success: () => {},
						fail: () => {},
						complete: () => {}
					})
				}
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.sexIndex = e.detail.value
			},
			sexChange(e) {
				console.log('性别', e)
				this.sexIndex = parseInt(e.detail.value)
			},
			uploadImage() {
				uni.uploadFile({
					url: 'http://localhost:8080/vendor/upload', // 上传接口地址
					filePath: this.vendorPic,
					header: {
						'Authorization': this.token,
					},
					name: 'avatar',
					success: (res) => {
						console.log('上传成功:', res);
						uni.navigateBack({
							delta:1
						})
					},
					fail: (err) => {
						console.log('上传失败:', err);
					}
				})
			},
			verifyData(){
				var flag=true;
				if (!this.userInfo.phone) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号不能为空'
					});
					return false;
				}
				
				var re11 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				var res = re11.test(this.userInfo.phone)
				if (res == false) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '手机号有误'
					});
					return false;
				}
				
				if (!this.userInfo.address) {
					flag = false;
					uni.showToast({
						icon: 'none',
						title: '地址不能为空'
					});
					return false;
				}
				return flag
			}
			
			
		},

	}
</script>

<style>
	.changeInfo {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	.nav-box {
		height: 50px;
		position: relative;
		margin: 0 auto;
		padding-top: 30px;
	}

	.title {
		text-align: center;
		color: #FFFFFF;
		font-size: 18px;
	}

	.icon-nav {
		position: absolute;
		top: 30px;
		left: 10px;
		color: #FFFFFF;
	}

	.box {
		width: 100%;
		height: 150px;
		margin: 0 auto;
		border-top: 1px solid #333333;
		border-bottom: 1px solid #333333;
	}

	.img-box {
		text-align: center;
	}

	.img {
		margin-top: 20px;
		width: 20%;
		/* height: 70px; */
		border-radius: 50%;
	}

	.userImage {
		bottom: 24%;
		left: 10%;
		width: 130px;
		height: 130px;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid white;

		image {
			width: 100%;
		}
	}

	.text {
		margin-top: 13px;
		color: #000000;
		font-size: 13px;
	}

	.info-box {
		padding: 0 10px;
	}

	.text-box {
		width: 100%;
		height: 52px;
		line-height: 52px;
	}

	.left {
		float: left;
		font-size: 15px;
		color: #000000;
		margin-left: 10px;
	}

	.right {
		width: 200px;
		height: 30px;
		margin-left: 100px;
		/* margin-top: 10px; */
		font-size: 15px;
		margin-right: 10px;
		color: #000000;
	}

	.rightInput {
		width: 200px;
		height: 50px;
		margin-left: 100px;
		/* margin-top: 10px; */
		font-size: 15px;
		margin-right: 10px;
		color: #000000;
	}

	.icon-box {
		float: right;
		font-size: 15px;
		color: #cecece;
		width: 10px;
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

	.sexLabel {
		margin-left: 20px;
	}
</style>