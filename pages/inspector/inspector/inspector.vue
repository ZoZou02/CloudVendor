<template>
	<view class="page">
		<view class="top">
			<view class="background"></view>
		</view>

		<view class="user-card">
			<view class="card">
				<view class="top">
					<view class="userImage">
						<image :src="userInfo.inspectorPic" mode="widthFix" />
					</view>
				</view>

				<view class="bottom">
					<view class="left">
						<view class="user-text">
							<view class="user-company">
								{{ token ? userInfo.inspectorName : '点击登录' }}
							</view>
						</view>
						<view class="user-phone">行政执法证号：{{ userInfo.inspectorId }}</view>
						<view class="user-phone">所属街道：{{ userInfo.address }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="boxList">
			<view class="box" @click="ToBooth">
				<image src="../../../static/myIcon/store.png" mode="aspectFit"></image>
				<view class="funcTitle">扫码登记</view>
			</view>

			<view class="box" @click="ToCert">
				<image src="../../../static/myIcon/cert.png" mode="aspectFit"></image>
				<view class="funcTitle">实名认证</view>
			</view>
			<view class="box" @click="ToSetting">
				<image src="../../../static/myIcon/setting.png" mode="aspectFit"></image>
				<view class="funcTitle">设置</view>
			</view>
			<view class="box" @click="ToProfile">
				<image src="../../../static/myIcon/edit.png" mode="aspectFit"></image>
				<view class="funcTitle">个人资料</view>
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
			<view v-if="token" class="btn flex-center" @click="handleLogout">
				退出登录
			</view>
			<view v-else class="btn flex-center" @click="ToLogin">
				登录
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	import type { UniNamespace } from '@dcloudio/uni-app'

	interface UserInfo {
		inspectorId : string | null
		inspectorName : string
		address : string
		inspectorPic : string
		// 其他字段根据实际接口添加
	}

	// 响应式数据
	const token = ref<string>('')
	const userInfo = reactive<UserInfo>({
		inspectorId: null,
		inspectorName: '',
		address: '',
		inspectorPic: '../../../static/avatar/default.png'
	})

	// 生命周期钩子
	onMounted(() => {
		initUserData()
	})

	// 初始化用户数据
	const initUserData = async () => {
		const storedToken = uni.getStorageSync('token')
		if (storedToken) {
			token.value = storedToken
			await fetchUserInfo(storedToken)
			await verifyTokenStatus(storedToken)
		}
	}

	// 获取用户信息
	const fetchUserInfo = async (token : string) => {
		try {
			const res = await uni.request({
				url: `${uni.$baseUrl}/inspector/getInspectorInfo`,
				method: 'GET',
				header: { 'Authorization': token }
			}) as UniNamespace.RequestSuccessCallbackResult

			if (res.data?.data) {
				Object.assign(userInfo, res.data.data)
				userInfo.inspectorPic = res.data.data.inspectorPic
					|| '../../../static/avatar/default.png'
			}
		} catch (error) {
			console.error('获取用户信息失败:', error)
		}
	}

	// 验证 Token 状态
	const verifyTokenStatus = async (token : string) => {
		try {
			const res = await uni.request({
				url: 'http://localhost:8080/inspector/checkTokenStatus',
				method: 'GET',
				header: { 'Authorization': token }
			}) as UniNamespace.RequestSuccessCallbackResult

			if (!res.data?.success) {
				clearUserData()
				uni.showToast({ icon: 'error', title: '登录已过期' })
			}
		} catch (error) {
			console.error('验证Token失败:', error)
		}
	}

	// 清除用户数据
	const clearUserData = () => {
		token.value = ''
		Object.assign(userInfo, {
			inspectorId: null,
			inspectorName: '',
			address: '',
			inspectorPic: '../../../static/avatar/default.png'
		})
		uni.removeStorageSync('token')
	}

	// 退出登录处理
	const handleLogout = () => {
		clearUserData()
		ToIndex()
	}

	// 导航方法
	const ToLogin = () => uni.navigateTo({ url: '/pages/inspector/login/login' })
	const ToIndex = () => uni.reLaunch({ url: '/pages/inspector/index/index' })
	const ToCert = () => uni.navigateTo({ url: '/pages/inspector/certification/certification' })
	const ToSetting = () => uni.navigateTo({ url: '/pages/inspector/setting/setting' })
	const ToBooth = () => uni.navigateTo({ url: '/pages/inspector/booth/booth' })
	const ToProfile = () => uni.navigateTo({ url: '/pages/inspector/editProfile/editProfile' })

	// 下拉刷新处理
	const onPullDownRefresh = () => {
		initUserData().finally(() => uni.stopPullDownRefresh())
	}
</script>

<style lang="scss" scoped>
	/* 保持原有样式不变 */
	.page {
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
				}
			}
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
	}
</style>