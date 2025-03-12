<template>
	<view>
		
		<view class="imageBox">
			<view class="userImage">
				<image :src="imageUrl" mode="widthFix"></image>
			</view>
		</view>
		
		<button @click="chooseImage">选择图片</button>
		<button @click="uploadImage">上传头像</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				imageUrl: '',
				path: "",
				token: ""
			}
		},
		onLoad() {
			// this.getUserInfo()
		},
		onShow() {
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
						this.imageUrl = this.userInfo.vendorPic
						this.token = token
						console.log(this.imageUrl)
					},
					fail: () => {},
					complete: () => {}
				});
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.imageUrl = res.tempFilePaths[0];
						console.log(this.imageUrl)
					}
				})
			},
			uploadImage() {
				uni.uploadFile({
					url: 'http://localhost:8080/vendor/upload', // 上传接口地址
					filePath: this.imageUrl,
					header: {
						'Authorization': this.token,
					},
					name: 'avatar',
					success: (res) => {
						console.log('上传成功:', res);
						uni.navigateBack()
					},
					fail: (err) => {
						console.log('上传失败:', err);
					}
				})
			}
		}
	}
</script>

<style>
	
	.imageBox{
		position: relative;
		text-align: center;
		width: 100%;
		height: 200px;
	}
	
	.userImage {
		/* position: absolute; */
		width: 130px;
		height: 130px;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid white;
		margin: auto;

		image {
			/* left: 100px; */
			width: 100%;
		}
	}
</style>