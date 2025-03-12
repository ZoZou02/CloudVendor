 <template>
 	<view class="content">
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="mapcenter" :control="control"
 			:doubleClickZoom="false">
 			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
 			<tmap-multi-label :id="lid" :styles="lstyles" :geometries="Labelgeometries" />
 			<tmap-multi-marker :styles="markerStyles" :geometries="markerGeometries" ref="markers" />
 		</tmap-map>
 	</view>
 </template>

 <script lang="ts">
	import { TMap } from '@map-component/vue-tmap';
	import { defineComponent, onMounted, ref, shallowRef } from 'vue';
	import { booleanPointInPolygon, point, center, polygon } from '@turf/turf';

	export default defineComponent({
		name: 'polygon-editor',
		methods: {
		},
		data() {
			return {
			}
		},
		onload() {

		},
		oncreated() {

		},

		setup() {
			//标记
			const markers = ref();
			const markerGeometries = ref([
				{
					id: 'booth',
					styleId: 'booth',
					position: { lat: 23.106154, lng: 113.281485 },
				},
			])
			let token = '';
			const mapcenter = ref({ lat: 23.106154, lng: 113.281485 });
			const geometries = ref([
			]);
			const Labelgeometries = ref([]);
			const isOperate = ref(false)
			const inArea = ref(false)
			const inAreaId = ref()
			const lstyles = shallowRef({
				label: {
					color: '#089cff', // 颜色属性
					strokeColor: '#ffffff',
					size: 18, // 文字大小属性
					offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
					angle: 0, // 文字旋转属性
					alignment: 'center', // 文字水平对齐属性
					verticalAlignment: 'middle', // 文字垂直对齐属性
				},
			});
			//摊位信息
			const boothInfo = ref({});
			const hasBooth = ref(false);
			//获取token
			function getToken() {
				uni.request({
					url: 'http://localhost:8080/getToken',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					data: {
						id: 13232191043,
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.code === 200) {
							uni.setStorageSync("token", res.data.data);
							token = res.data.data
						} else {
							uni.showToast({
								icon: "error",
								title: "获取token失败",
							});
						}
					},
					fail() {

					},
					complete() {

					}
				});
			}
			getToken()

			//获取区域
			function showArea() {
				const getToken = uni.getStorageSync("token")
				console.log("token：" + getToken)
				token = getToken
				uni.request({
					url: 'http://localhost:8080/admin/showArea',
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("传入数据:", res.data.data)
						// geometries.value=null

						// 遍历数组中的每个元素
						res.data.data.forEach(item => {
							let areaData = {
								id: item.areaId,
								paths: item.areaRange.paths,
								properties: {
									title: item.areaName
								},
							};
							console.log("读取区域", areaData.properties);
							geometries.value.push(areaData);
						});
						//标签
						res.data.data.forEach((item : { areaId : any; areaRange : { paths : any; }; areaName : any; }) => {

							const polygonPt = item.areaRange.paths.map((path : { lat : any; lng : any; }) => [path.lat, path.lng]);
							// 添加首个坐标以闭合环
							polygonPt.push(polygonPt[0]);
							const poly = polygon([polygonPt]);

							// let centr = centroid(poly);
							//获取多边形中点坐标
							let centr = center(poly);
							// console.log('centeroid',centr.geometry.coordinates);
							// console.log('paths',item.streetArea.paths[0]);
							let centrPath = { 'lat': centr.geometry.coordinates[0], 'lng': centr.geometry.coordinates[1] };



							let labelData = {
								id: item.areaId,
								styleId: 'label',
								position: centrPath,
								content: item.areaName,
								properties: {
									title: 'label',
								},
							};
							// console.log("读取区域", labelData.properties);
							Labelgeometries.value.push(labelData);
							console.log('标签', Labelgeometries.value)
						});


					}
				})
			};
			//获取摊位信息
			function getBoothInfo() {
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
					success: (res) => {
						if (res.data.success) {
							console.log(res.data);
							//摊位信息
							boothInfo.value = res.data.data
							console.log('boothInfo', boothInfo.value)

							//设置是否拥有摊位
							hasBooth.value = true
							if (hasBooth.value) {
								getBoothState();
								// getLoction();
								getBoothLocation();
								console.log("摊位状态", isOperate.value)
							}

							getLocationList();

						} else {
							console.log("该摊主尚未拥有摊位")
							hasBooth.value = false
							uni.showToast({
								icon: 'error',
								title: '请申请摊位'
							})
						}
					},
					fail: () => {

					},
					complete: () => { }
				});
			};
			//获取摊位状态
			function getBoothState() {
				uni.request({
					url: 'http://localhost:8080/booth/getBoothState',
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: (res) => {
						if (res.data.data.boothState === "营业中") {
							isOperate.value = true
							//营业中获取摊位定位
							// getBoothLocation()
						}

						console.log(res.data)

					}
				})
			};
			//获取摊位经营位置，只有在经营中生效
			function getBoothLocation() {
				uni.request({
					url: 'http://localhost:8080/booth/getBoothLocation',
					method: 'GET',
					data: {
					},
					header: {
						'Authorization': token
					},
					success: (res) => {
						// console.log(res.data.data);

						markerGeometries.value[0].position.lat = res.data.data.locationPoint.lat;
						markerGeometries.value[0].position.lng = res.data.data.locationPoint.lng;

						mapcenter.value.lat = res.data.data.locationPoint.lat;
						mapcenter.value.lng = res.data.data.locationPoint.lng;

						//构造点
						const pt = point([markerGeometries.value[0].position.lat, markerGeometries.value[0].position.lng])
						console.log('pt', pt)

						checkArea(pt)
						console.log("center", markerGeometries.value[0])
					}

				})
			};
			//获取其他摊位
			function getBoothList() {
				uni.request({
					url: 'http://localhost:8080/booth/getBoothList',
					method: 'GET',
					data: {
					},
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("摊位列表", res.data.data);
					}

				})
			};
			//获取其他摊位位置
			function getLocationList() {
				uni.request({
					url: 'http://localhost:8080/booth/getLocationList',
					method: 'GET',
					data: {
					},
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("位置列表", res.data.data);
						const locationList = res.data.data
						for (let i = 0; i < locationList.length; i++) {

							markerGeometries.value = [
								...markerGeometries.value,
								{
									id: 'other',
									styleId: 'other',
									position: locationList[i].locationPoint,
								},
							]

						}

					}

				})
			};
			function checkArea(pt : any) {
				for (let i = 0; i < geometries.value.length; i++) {
					//构造多边形
					const polygonPt = geometries.value[i].paths.map((path : { lat : any; lng : any; }) => [path.lat, path.lng]);
					// 添加首个坐标以闭合环
					polygonPt.push(polygonPt[0]);
					console.log('polygonPt', polygonPt)
					const poly = polygon([polygonPt]);
					//只需要存在一个区域即可
					inArea.value = false;
					if (booleanPointInPolygon(pt, poly)) {
						inArea.value = true;
						console.log('所在区域ID', geometries.value[i].id)
						inAreaId.value = geometries.value[i].id
						break;
					}
				}


			}


			onMounted(() => {

				showArea();
				getBoothInfo();
				getBoothList();

				console.log("hasBooth.value", hasBooth.value)

			});

			return {
				lid: 'label-layer',
				lstyles,
				Labelgeometries,
				//摊位信息
				boothInfo,
				hasBooth,
				markers,
				markerStyles: {
					booth: {
						width: 20,
						height: 20,
						anchor: { x: 16, y: 32 },
						src: 'http://localhost:3000/static/myIcon/other_marker.png',
					},
					other: {
						width: 20,
						height: 20,
						anchor: { x: 16, y: 32 },
						src: 'http://localhost:3000/static/myIcon/other_marker.png',
					}
				},
				markerGeometries,
				mapcenter,
				control: {//地图控件
					zoom: {}
				},
				isOperate,
				inArea,
				inAreaId,

				id: 'polygon-layer',
				styles: {
					drawing: {
						// color: '#3a8e92', // 面填充色
						// showBorder: true, // 是否显示拔起面的边线
						// borderColor: '#00FFFF', // 边线颜色
						// borderWidth: 1,
					},
					selected: {
						// color: '#3a8e92', // 面填充色
						// showBorder: true, // 是否显示拔起面的边线
						// borderColor: '#00FFFF', // 边线颜色
						// borderWidth: 1,
					},
				},
				styles1: {
					default: {
						color: '#3a8e92', // 面填充色
						showBorder: true, // 是否显示拔起面的边线
						borderColor: '#00FFFF', // 边线颜色
						borderWidth: 1,
					},
				},
				geometries,

				reload() {
					location.reload()
				},
				operate() {
					console.log('出摊')
					// console.log('maekerPoint', markerPoint.value)
					console.log('maekerPoint', markerGeometries.value[0].position)

					const locationData = {
						'location': markerGeometries.value[0].position,
						// 'location': markerPoint.value,
						'areaId': inAreaId.value,
						'boothId': boothInfo.value.boothId
					}

					uni.request({
						url: 'http://localhost:8080/booth/operate',
						method: 'POST',
						header: {
							'content-type': 'application/json',
							'Authorization': token
						},
						data: locationData,
						success: () => {
							mapcenter.value = markerGeometries.value[0].position
							isOperate.value = true
							uni.showToast({
								icon: 'success',
								title: '成功出摊'
							})
							// setTimeout(()=>{
							// 	location.reload()
							// },500)

						}
					})

					//出摊
				},
				closed() {
					console.log("休息")
					uni.request({
						url: 'http://localhost:8080/booth/closed',
						method: 'GET',
						header: {
							'Authorization': token
						},
						data: {},
						success: () => {
							// location.reload()
							isOperate.value = false
							uni.showToast({
								icon: 'success',
								title: '已经休息'
							})
						}
					})
				},
				operateToast() {
					console.log('未在规定区域')
					uni.showToast({
						icon: 'error',
						title: '未在摆摊区域',
					})
				},
				toBooth() {
					uni.navigateTo({
						url: '/pages/vendor/booth/booth',
						fail(e) {
							console.log("错误", e)
						}
					})
				},

			};
		},
	});
 </script>

 <style lang="scss" scoped>
 	.ctrl {
 		position: absolute;
 		top: 0;
 		left: 0;
 		// z-index: 1001;
 		display: flex;
 		align-items: center;
 	}

 	.map {
 		position: absolute;
 		z-index: 1;
 	}

 	.toolItem {
 		width: 30px;
 		height: 30px;
 		float: left;
 		margin: 1px;
 		padding: 4px;
 		border-radius: 3px;
 		background-size: 30px 30px;
 		background-position: 4px 4px;
 		background-repeat: no-repeat;
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 		background-color: #ffffff;
 		border: 1px solid #ffffff;
 	}

 	.cover {
 		position: absolute;
 		width: 115px;
 		height: 30px;
 		float: left;
 		margin-top: 45px;
 		padding: 4px;
 		border-radius: 3px;
 		background-size: 30px 30px;
 		background-position: 4px 4px;
 		background-repeat: no-repeat;
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 		background-color: #ffffff;
 		border: 1px solid #ffffff;
 		// z-index: 3;
 	}

 	.areaName {
 		position: absolute;
 		top: 85px;
 		left: 0px;
 		right: 0px;
 		margin: auto;
 		width: 248px;
 		// z-index: 1001;
 		background-color: #ffffff;
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 	}

 	.areaNameItem {
 		text-align: center;
 		width: 80px;
 		height: 30px;
 		float: left;
 		margin-top: 7px;
 		margin-left: 1px;
 		padding: 4px;
 	}


 	.nameInput {
 		float: left;
 		margin-top: 1px;
 		padding: 4px;
 		border-radius: 3px;
 		background-size: 30px 30px;
 		background-position: 4px 4px;
 		background-repeat: no-repeat;
 		background-color: #ffffff;
 		border: 1px solid #cecece;
 		width: 140px;
 		height: 30px;
 	}

 	.areaSave {
 		width: 30px;
 		height: 30px;
 		float: left;
 		margin: 1px;
 		padding: 4px;
 		border-radius: 3px;
 		background-size: 30px 30px;
 		background-position: 4px 4px;
 		background-repeat: no-repeat;
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 		background-color: #ffffff;
 		border: 1px solid #ffffff;
 	}


 	.toolControl {
 		position: absolute;
 		top: 500px;
 		left: 220px;
 		right: 0px;
 		margin: auto;
 		width: 50px;
 		z-index: 1001;
 		pointer-events: all;
 	}

 	.toolItem:hover {
 		border-color: #789cff;
 	}


 	.active {
 		border-color: #d5dff2;
 		background-color: #d5dff2;
 	}

 	.operate {
 		position: absolute;
 		z-index: 2000;
 		text-align: center;
 		color: #000000;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 		bottom: 30px;
 		left: 50%;
 		transform: translateX(-50%);
 		width: 100px;
 		height: 30px;
 		border-radius: 30px;
 		padding: 4px;
 		box-shadow: 0 3px 0px 0 #b0b0b0;
 		background-color: #e5e5e5;
 		border: 1px solid #ffffff;
 		// pointer-events: all;
 	}

 	.closed {
 		position: absolute;
 		z-index: 2000;
 		text-align: center;
 		color: #FFF;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 		bottom: 30px;
 		left: 50%;
 		transform: translateX(-50%);
 		width: 100px;
 		height: 30px;
 		border-radius: 30px;
 		padding: 4px;
 		box-shadow: 0 3px 0px 0 #a1413c;
 		background-color: #f4665c;
 		border: 1px solid #f49a88;
 		// pointer-events: all;
 	}

 	.operateOn {
 		color: #ffffff;
 		box-shadow: 0 3px 0px 0 #3f87d3;
 		background-color: #4f99ff;
 		border: 1px solid #53a6ff;
 	}

 	#polygon {
 		background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/polygon.png');
 	}

 	#edit {
 		background-image: url('@/static/map/polygon.png');
 	}

 	#del {
 		background-image: url('@/static/map/del.png');
 	}

 	#add {
 		background-image: url('@/static/map/add.png');
 	}

 	#save {
 		background-image: url('@/static/map/save.png');
 	}

 	#stop {
 		background-image: url('@/static/map/stop.png');
 	}

 	#view {
 		background-image: url('@/static/map/view.png');
 	}

 	#rectangle {
 		background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/rectangle.png');
 	}

 	#reload {
 		background-image: url('@/static/map/reload.png');
 	}
 </style>