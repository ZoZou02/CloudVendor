<template>
	<div class="container">
		<div class="location-card">
			<h2>浏览器定位系统</h2>

			<div class="status-area">
				<div v-if="position" class="position-info">
					<p>📍 当前位置：</p>
					<pre>{{ position }}</pre>
				</div>
				<div v-if="error" class="error-info">
					<p>❌ 错误信息：</p>
					<pre>{{ error }}</pre>
				</div>
				<div v-if="!isSupported" class="unsupported-warning">
					当前浏览器不支持地理定位功能
				</div>
			</div>

			<div class="btn-group">
				<button @click="getLocation" :disabled="isLoading">
					{{ isLoading ? '定位中...' : '获取当前位置' }}
				</button>
				<button @click="toggleWatch" :class="{ 'active': isWatching }">
					{{ isWatching ? '停止持续定位' : '开启持续定位' }}
				</button>
			</div>

			<div class="logs">
				<div v-for="(log, index) in logs" :key="index" class="log-item">
					[{{ log.time }}] {{ log.message }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount
	} from 'vue'

	const position = ref(null)
	const error = ref(null)
	const isSupported = ref(true)
	const isLoading = ref(false)
	const isWatching = ref(false)
	const watchId = ref(null)
	const logs = ref([])

	// 定位配置
	const options = {
		enableHighAccuracy: true, // 高精度模式
		timeout: 10000, // 超时时间10秒
		maximumAge: 30000 // 最大缓存时间30秒
	}

	// 添加日志
	const addLog = (message) => {
		logs.value.push({
			time: new Date().toLocaleTimeString(),
			message
		})
		// 保持最多50条日志
		if (logs.value.length > 50) logs.value.shift()
	}

	// 获取位置
	const getLocation = async () => {
		if (!navigator.geolocation) {
			isSupported.value = false
			return
		}

		try {
			isLoading.value = true
			error.value = null
			addLog('开始获取位置...')

			const pos = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, options)
			})

			position.value = {
				latitude: pos.coords.latitude.toFixed(6),
				longitude: pos.coords.longitude.toFixed(6),
				accuracy: pos.coords.accuracy + '米',
				altitude: pos.coords.altitude || '未提供',
				speed: pos.coords.speed || '未提供',
				timestamp: new Date(pos.timestamp).toLocaleString()
			}
			addLog('位置获取成功')
		} catch (err) {
			handleError(err)
		} finally {
			isLoading.value = false
		}
	}

	// 持续定位
	const toggleWatch = () => {
		if (!isWatching.value) {
			watchId.value = navigator.geolocation.watchPosition(
				pos => {
					position.value = {
						latitude: pos.coords.latitude.toFixed(6),
						longitude: pos.coords.longitude.toFixed(6),
						accuracy: pos.coords.accuracy + '米',
						timestamp: new Date(pos.timestamp).toLocaleString()
					}
					addLog('持续定位更新')
				},
				handleError,
				options
			)
			isWatching.value = true
			addLog('开启持续定位')
		} else {
			navigator.geolocation.clearWatch(watchId.value)
			isWatching.value = false
			addLog('停止持续定位')
		}
	}

	// 错误处理
	const handleError = (err) => {
		error.value = {
			code: err.code,
			message: getErrorMessage(err.code),
			details: err.message
		}
		addLog(`定位失败: ${error.value.message}`)
	}

	const getErrorMessage = (code) => {
		const errors = {
			1: '用户拒绝了位置请求',
			2: '无法获取位置信息',
			3: '请求超时'
		}
		return errors[code] || '未知错误'
	}

	// 生命周期
	onMounted(() => {
		if (!navigator.geolocation) {
			isSupported.value = false
			addLog('浏览器不支持地理定位')
		}
	})

	onBeforeUnmount(() => {
		if (isWatching.value) {
			navigator.geolocation.clearWatch(watchId.value)
		}
	})
</script>

<style scoped>
	.container {
		padding: 20px;
		min-height: 100vh;
		background: #f0f3f7;
	}

	.location-card {
		max-width: 600px;
		margin: 0 auto;
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #2c3e50;
		margin-bottom: 20px;
		text-align: center;
	}

	.status-area {
		margin: 20px 0;
		background: #f8f9fa;
		border-radius: 8px;
		padding: 15px;
	}

	.position-info,
	.error-info {
		margin: 10px 0;
	}

	pre {
		white-space: pre-wrap;
		background: rgba(0, 0, 0, 0.05);
		padding: 10px;
		border-radius: 6px;
		font-family: monospace;
	}

	.btn-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: 20px 0;
	}

	button {
		padding: 12px;
		border: none;
		border-radius: 8px;
		background: #009DDC;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	button:disabled {
		background: #cccccc;
		cursor: not-allowed;
	}

	button.active {
		background: #ff4757;
	}

	.logs {
		margin-top: 20px;
		border-top: 1px solid #eee;
		padding-top: 15px;
		max-height: 200px;
		overflow-y: auto;
	}

	.log-item {
		padding: 8px;
		font-size: 0.9em;
		color: #666;
		border-bottom: 1px solid #eee;
	}

	.unsupported-warning {
		color: #ff4757;
		padding: 10px;
		background: rgba(255, 71, 87, 0.1);
		border-radius: 6px;
		text-align: center;
	}
</style>