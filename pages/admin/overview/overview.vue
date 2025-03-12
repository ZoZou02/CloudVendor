<template>
	<view class="overview">
		<!-- 顶部信息栏 -->
		<div class="top-info">
			<div class="info-item">
				<span class="label">当前时间：</span>
				<span class="value">{{ currentTime }}</span>
			</div>
			<div class="info-item">
				<span class="label">摊位总数：</span>
				<span class="value">{{ chartData.operatingCount+chartData.closedCount }}</span>
			</div>
			<div class="info-item">
				<span class="label">在线摊位：</span>
				<span class="value">{{ chartData.operatingCount }}</span>
			</div>
			<div class="info-item">
				<span class="label">当前位置：</span>
				<span class="value">{{ weather.location }}</span>
			</div>
			<div class="info-item">
				<span class="label">天气：</span>
				<span class="value">{{ weather.condition }}</span>
			</div>
			<div class="info-item">
				<span class="label">气温：</span>
				<span class="value">{{ weather.temperature }}°C</span>
			</div>
		</div>

		<!-- 图表容器使用网格布局 -->
		<div class="chart-container">
			<div ref="typeChart" class="chart"></div>
			<div ref="statusChart" class="chart"></div>
			<div ref="ageChart" class="chart"></div>
			<div ref="registerChart" class="chart"></div>
			<div class="chart map-container">
				<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="mapcenter"
					:control="control" :doubleClickZoom="false">
					<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
					<tmap-multi-label :id="lid" :styles="lstyles" :geometries="Labelgeometries" />
					<tmap-multi-marker :styles="markerStyles" :geometries="markerGeometries" ref="markers" />
				</tmap-map>
			</div>
		</div>
	</view>
</template>

<script>
	import * as echarts from 'echarts'
	import {
		TMap
	} from '@map-component/vue-tmap'
	import {
		defineComponent,
		onMounted,
		ref,
		shallowRef
	} from 'vue'

	export default {
		data() {
			return {
				charts: [],
				currentTime: '',
				timer: null,
				// 地图相关数据
				mapcenter: {
					lat: 23.106154,
					lng: 113.281485
				},
				control: {},
				id: 'area',
				lid: 'label',
				styles: {},
				lstyles: {
					label: {
						color: '#089cff',
						strokeColor: '#ffffff',
						size: 18,
						offset: {
							x: 0,
							y: 0
						},
						angle: 0,
						alignment: 'center',
						verticalAlignment: 'middle',
					},
				},
				geometries: [],
				Labelgeometries: [],
				markerStyles: {},
				markerGeometries: [],
				// 新增天气相关数据
				weather: {
					location: '--',
					temperature: '--',
					condition: '--'
				},
				chartData: {
					stallLocations: [], // 摊位位置数据
					stallTypes: [{
							type: '食品类',
							count: 100
						},
						{
							type: '饰品类',
							count: 28
						},
						{
							type: '日用品类',
							count: 20
						},
						{
							type: '纺织服装类',
							count: 20
						},
						{
							type: '花卉水果类',
							count: 30
						},
						{
							type: '电子产品类',
							count: 10
						},
					],
					operatingCount: 65,
					closedCount: 15,
					ageRanges: [{
							range: '18-25',
							count: 12
						},
						{
							range: '26-35',
							count: 35
						},
						{
							range: '36-45',
							count: 18
						}
					],
					registerTrend: [{
							month: '2024-01',
							count: 10
						},
						{
							month: '2024-02',
							count: 22
						},
						{
							month: '2024-03',
							count: 30
						}
					]
				}
			}
		},
		mounted() {
			this.initCharts()
			this.startTimer()
			this.fetchWeatherData()
			this.showArea() // 加载地图区域数据
			this.getLocationList()
		},
		methods: {
			// 更新当前时间
			startTimer() {
				this.updateTime()
				this.timer = setInterval(this.updateTime, 1000)
			},
			updateTime() {
				const now = new Date()
				this.currentTime = now.toLocaleString('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				})
			},
			// 初始化图表
			async initCharts() {
				await this.fetchData()

				// 依次初始化图表
				this.initTypeChart()
				this.initStatusChart()
				this.initAgeChart()
				this.initRegisterChart()

				// 监听窗口变化自动调整
				window.addEventListener('resize', this.resizeCharts)
			},

			// 数据请求接口
			async fetchData() {
				try {
					const res = await uni.request({
						url: 'http://localhost:8080/admin/overview',
						method: 'GET',
						header: {
							'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTkxMDQzIiwiZXhwIjoxNzQxODMzNTkyfQ.OByvihkMd089xe2FBOip6952TReFXiDvVLAVESZF-qA'
						},
						timeout: 5000
					})

					console.log('总览', res.data.data)
					this.chartData = {
						...this.chartData,
						...res.data.data
					}


				} catch (error) {
					console.error('数据加载失败，使用默认数据:', error)
					uni.showToast({
						title: '数据加载失败，展示示例数据',
						icon: 'none',
						duration: 2000
					})
				}
			},

			// 天气数据获取接口
			async fetchWeatherData() {
				try {
					const res = await uni.request({
						url: 'https://api.seniverse.com/v3/weather/now.json',
						method: 'GET',
						data: {
							key: 'SYKB4YInwABIY_jOM',
							location: 'guangzhou',
							language: 'zh-Hans',
							unit: 'c'
						}
					})

					if (res.data.results && res.data.results[0]) {
						const weatherData = res.data.results[0]
						this.weather = {
							location: weatherData.location.name,
							temperature: weatherData.now.temperature,
							condition: weatherData.now.text
						}
					}
				} catch (error) {
					console.error('天气数据获取失败:', error)
					uni.showToast({
						title: '天气数据获取失败',
						icon: 'none'
					})
				}
			},

			// 摊位类型分布（饼图）
			initTypeChart() {
				const chart = echarts.init(this.$refs.typeChart)
				chart.setOption({
					title: {
						text: '摊位类型分布',
						left: 'center'
					},
					tooltip: {
						trigger: 'item'
					},
					series: [{
						type: 'pie',
						data: this.chartData.stallTypes.map(item => ({
							value: item.count,
							name: item.type
						}))
					}]
				})
				this.charts.push(chart)
			},

			// 运营状态占比（饼图）
			initStatusChart() {
				const chart = echarts.init(this.$refs.statusChart)
				chart.setOption({
					title: {
						text: '运营状态',
						left: 'center'
					},
					tooltip: {
						trigger: 'item'
					},
					series: [{
						type: 'pie',
						data: [{
								value: this.chartData.operatingCount,
								name: '营业中'
							},
							{
								value: this.chartData.closedCount,
								name: '已关闭'
							}
						]
					}]
				})
				this.charts.push(chart)
			},

			// 年龄分布（柱状图）
			initAgeChart() {
				const chart = echarts.init(this.$refs.ageChart)
				chart.setOption({
					title: {
						text: '摊主年龄分布',
						left: 'center'
					},
					tooltip: {
						trigger: 'item'
					},
					xAxis: {
						type: 'category',
						data: this.chartData.ageRanges.map(item => item.range)
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						type: 'bar',
						data: this.chartData.ageRanges.map(item => item.count),
						itemStyle: {
							color: '#36a3f7'
						}
					}]
				})
				this.charts.push(chart)
			},

			// 注册趋势（折线图）
			initRegisterChart() {
				const chart = echarts.init(this.$refs.registerChart)
				chart.setOption({
					title: {
						text: '注册趋势',
						left: 'center'
					},
					tooltip: {
						trigger: 'item'
					},
					xAxis: {
						type: 'category',
						data: this.chartData.registerTrend.map(item => item.month)
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						type: 'line',
						data: this.chartData.registerTrend.map(item => item.count),
						smooth: true
					}]
				})
				this.charts.push(chart)
			},

			// 统一调整尺寸
			resizeCharts() {
				this.charts.forEach(chart => chart.resize())
			},

			// 获取区域数据
			async showArea() {
				try {
					const res = await uni.request({
						url: 'http://localhost:8080/admin/showArea',
						method: 'GET',
						header: {
							'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTkxMDQzIiwiZXhwIjoxNzQxODMzNTkyfQ.OByvihkMd089xe2FBOip6952TReFXiDvVLAVESZF-qA'
						}
					})

					if (res.data.data) {
						// 处理区域数据
						res.data.data.forEach(item => {
							this.geometries.push({
								id: item.areaId,
								paths: item.areaRange.paths,
								properties: {
									title: item.areaName
								},
							})

							// 处理标签数据
							const polygonPt = item.areaRange.paths.map(path => [path.lat, path.lng])
							polygonPt.push(polygonPt[0])

							this.Labelgeometries.push({
								id: item.areaId,
								styleId: 'label',
								position: {
									lat: polygonPt[0][0],
									lng: polygonPt[0][1]
								},
								content: item.areaName,
								properties: {
									title: 'label',
								},
							})
						})
					}
				} catch (error) {
					console.error('加载区域数据失败:', error)
					uni.showToast({
						title: '加载区域数据失败',
						icon: 'none'
					})
				}
			},

			//获取摊位经营位置
			async getLocationList() {
				try {
					const res = await uni.request({
						url: 'http://localhost:8080/booth/getLocationList',
						method: 'GET',
						header: {
							'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTkxMDQzIiwiZXhwIjoxNzQxODMzNTkyfQ.OByvihkMd089xe2FBOip6952TReFXiDvVLAVESZF-qA'
						}
					})

					if (res.data.data) {
						console.log("位置列表", res.data.data);
						const locationList = res.data.data
						for (let i = 0; i < locationList.length; i++) {

							// this.markerGeometries = [
							// 	{
							// 		id: 'other',
							// 		styleId: 'other',
							// 		position: locationList[i].locationPoint,
							// 	},
							// ]

							this.markerGeometries.push({
								id: 'other',
								styleId: 'other',
								position: locationList[i].locationPoint,
							})



						}
					}

					console.log('markers', this.markerGeometries)

				} catch (error) {
					console.error('加载摊位位置数据失败:', error)
					uni.showToast({
						title: '加载摊位位置数据失败',
						icon: 'none'
					})
				}





			},
		},

		// 销毁时移除监听
		beforeDestroy() {
			window.removeEventListener('resize', this.resizeCharts)
			this.charts.forEach(chart => chart.dispose())
			if (this.timer) {
				clearInterval(this.timer)
			}
		}
	}
</script>

<style>
	/* H5 专用样式 */
	/* 必须使用 px 单位 */
	.overview {
		padding: 20px;
		background: #f5f7fa;
	}

	.top-info {
		display: flex;
		justify-content: flex-end;
		gap: 20px;
		margin-bottom: 20px;
		padding: 15px;
		background: #fff;
		border-radius: 8px;
	}

	.info-item {
		display: flex;
		align-items: center;
	}

	.info-item .label {
		color: #666;
		margin-right: 8px;
	}

	.info-item .value {
		color: #333;
		font-weight: bold;
	}

	.chart-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.chart {
		width: 100%;
		height: 300px;
		/* 固定高度 */
		background: #fff;
		border-radius: 8px;
		padding: 15px;
		box-sizing: border-box;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.map-container {
		grid-column: span 2;
		height: 400px;
		position: relative;
		overflow: hidden;
	}
</style>