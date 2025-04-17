 <template>
 	<view v-if="hasBooth===true && boothState === '休息'" class="content">
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :events="events" :center="center"
 			:control="control" :doubleClickZoom="false">
 			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
 			<tmap-multi-marker :styles="markerStyles" :geometries="markerGeometries" ref="markers" />
 		</tmap-map>
 		<view class="toolControl">
 			<view class="toolItem" id="reload" @click.stop="reload"></view>
 		</view>

 		<view class="operate" :class="{'operateOn': inArea}" @click.stop="inArea?operate():operateToast()">
 			出摊
 		</view>
 	</view>

 	<view v-else-if="hasBooth===true && boothState === '营业中'" class="content">
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="center" :control="control"
 			:doubleClickZoom="false">
 			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
 			<tmap-multi-marker :styles="markerStyles" :geometries="markerGeometries" ref="markers" />
 		</tmap-map>
 		<view class="toolControl">
 			<view class="toolItem" id="reload" @click.stop="reload"></view>
 		</view>
 		<view class="closed" @click.stop="closed">
 			休息
 		</view>
 	</view>
	
	<view v-else-if="hasBooth===true && boothState === '审核'" class="content">
		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="center" :control="control"
			:doubleClickZoom="false">
			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
		</tmap-map>
		<view class="toolControl">
			<view class="toolItem" id="reload" @click.stop="reload"></view>
		</view>
		<view class="review-tip">摊位信息正在审核中，请耐心等待...</view>
		<view class="review-btn" @click.stop="toBooth()">查看详情</view>
	</view>
	
	<view v-else-if="hasBooth===true && boothState === '停业'" class="content">
		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="center" :control="control"
			:doubleClickZoom="false">
			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
		</tmap-map>
		<view class="toolControl">
			<view class="toolItem" id="reload" @click.stop="reload"></view>
		</view>
		<view class="stop-tip">您的摊位已被停业</view>
		<view class="review-btn" @click.stop="toBooth()">查看详情</view>
	</view>
 	
 	<view v-else class="content">
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="center" :control="control"
 			:doubleClickZoom="false">
 			<tmap-multi-polygon :id="id" :styles="styles" :geometries="geometries" />
 		</tmap-map>
 		<view class="toolControl">
 			<view class="toolItem" id="reload" @click.stop="reload"></view>
 		</view>
 		<view class="closed" @click.stop="token ? toBooth() : toLogin()">
 			{{token ? '申请摊位' : '登录'}}
 		</view>
 	</view>
	
	
 </template>

 <script lang="ts">
	import { TMap } from '@map-component/vue-tmap';
	import { defineComponent, onMounted, ref, watch } from 'vue';
	import { booleanPointInPolygon, point, polygon } from '@turf/turf';

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
			const token = uni.getStorageSync("token")

			const center = ref({ lat: 23.106154, lng: 113.281485 });
			const geometries = ref([
			]);
			const inArea = ref(false)
			const inAreaId = ref()
			const boothState = ref('')

			// const markerPoint = ref({ lat: 23.106154, lng: 113.281485 });
			//初始化
			let paths = [
				{ lat: 23.106154, lng: 113.281485 },
				{ lat: 23.106154, lng: 113.281485 },
			];

			//摊位信息
			const boothInfo = ref({});
			const hasBooth = ref(false);


			//点击地图获取坐标,将标记点移动到点击处
			const mark = (e : unknown) => {
				console.log('坐标', e.latLng);
				paths[1] = e.latLng;
				markerGeometries.value[0].position=e.latLng
				// markerPoint.value = e.latLng;
				markers.value.moveAlong(
					{
						booth: {
							path: paths.map((p) => new window.TMap.LatLng(p.lat, p.lng)),
							speed: 25000000000,
						},
					},
					{
						autoRotation: false,
					},
				);
				// console.log('makers', markers.value)
				// console.log('标记点', markerGeometries.value);
				// console.log('区域', geometries.value);

				//判断位置是否在规定区域内
				//构造点
				const pt = point([e.latLng.lat, e.latLng.lng])
				console.log('pt', pt)
				checkArea(pt)

			};
			//获取区域
			function showArea() {
				const token = uni.getStorageSync("token")
				console.log("token：" + token)
				uni.request({
					url: `${uni.$baseUrl}/admin/showArea`,
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
					url: `${uni.$baseUrl}/booth/showBooth`,
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
							if(hasBooth.value){
								getBoothState();
								// getLoction();
								getBoothLocation();
								console.log("摊位状态",boothState.value)
							}
							
							getLocationList();
							
						} else {
							console.log("该摊主尚未拥有摊位")
							hasBooth.value = false
							uni.showToast({
								icon:'error',
								title:'请申请摊位'
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
					url: `${uni.$baseUrl}/booth/getBoothState`,
					method: 'GET',
					data: {},
					header: {
						'Authorization': token
					},
					success: (res) => {
						// 获取摊位状态并设置
						boothState.value = res.data.data.boothState
						console.log("摊位状态:", boothState.value)
					}
				})
			};
			//获取摊位经营位置，只有在经营中生效
			function getBoothLocation() {
				uni.request({
					url: `${uni.$baseUrl}/booth/getBoothLocation`,
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
						
						center.value.lat=res.data.data.locationPoint.lat;
						center.value.lng=res.data.data.locationPoint.lng;

						//构造点
						const pt = point([markerGeometries.value[0].position.lat, markerGeometries.value[0].position.lng])
						console.log('pt', pt)
						
						checkArea(pt)
						console.log("中心点center", center)
					}

				})
			};
			//获取其他摊位
			function getBoothList() {
				uni.request({
					url:`${uni.$baseUrl}/booth/getBoothList`,
					method:'GET',
					data: {
					},
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("摊位列表",res.data.data);
					}
					
				})
			};
			//获取其他摊位位置
			function getLocationList() {
				uni.request({
					url:`${uni.$baseUrl}/booth/getLocationList`,
					method:'GET',
					data: {
					},
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("位置列表",res.data.data);
						console.log("当前摊位位置id",boothInfo.value.tlocationId);
						const locationList=res.data.data
						for(let i = 0 ;i < locationList.length;i++){
							if(locationList[i].id != boothInfo.value.tlocationId){
								markerGeometries.value=[
									...markerGeometries.value,
									{
										id: 'other',
										styleId: 'other',
										position: locationList[i].locationPoint,
									},
								]
							}
						}
						
					}
					
				})
			};
			//获取当前定位\
			function getLoction() {
				console.log("获取定位")
				uni.getLocation({
					type: 'wgs84',
					success: function (res) {
						console.log('当前位置：' + res);
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						
						center.value.lat=res.latitude;
						center.value.lng=res.longitude;
						
						markerGeometries.value[0].position.lat = res.latitude;
						markerGeometries.value[0].position.lng = res.longitude;
						
						
					}
				});
			};
			function checkArea(pt:any){
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
				console.log("hasBooth.value",hasBooth.value)
				console.log("中心点", center.value);


			});

			return {
				token,
				//摊位信息
				boothInfo,
				hasBooth,
				boothState,
				//地图事件
				events: {
					click: mark,
				},
				markers,
				markerStyles: {
					booth: {
						width: 40,
						height: 40,
						anchor: { x: 16, y: 32 },
						src: '../../../static/myIcon/marker.png',
					},
					other:{
						width: 20,
						height: 20,
						anchor: { x: 16, y: 32 },
						src: '../../../static/myIcon/other_marker.png',
					}
				},
				markerGeometries,
				center,
				control: {//地图控件
					zoom: {}
				},
				inArea,

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
						url: `${uni.$baseUrl}/booth/operate`,
						method: 'POST',
						header: {
							'content-type': 'application/json',
							'Authorization': token
						},
						data: locationData,
						success: () => {
							center.value=markerGeometries.value[0].position
							boothState.value="营业中"
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
						url: `${uni.$baseUrl}/booth/closed`,
						method: 'GET',
						header: {
							'Authorization': token
						},
						data: {},
						success: () => {
							// location.reload()
							boothState.value="休息"
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
				toLogin() {
					uni.navigateTo({
						url: '/pages/vendor/login/login',
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

 	.review-tip {
 		position: absolute;
 		text-align: center;
 		padding: 10px;
 		color: #ff9900;
 		font-size: 0.9em;
 		background-color: #f8f8f8;
 		border-radius: 8px;
 		width: 80%;
 		z-index: 2000;
 		left: 50%;
 		top: 50%;
 		transform: translate(-50%, -50%);
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 	}
 	
 	.review-btn {
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
 		box-shadow: 0 3px 0px 0 #ff9900;
 		background-color: #ffaa00;
 		border: 1px solid #ffc266;
 	}

 	.stop-tip {
 		position: absolute;
 		text-align: center;
 		padding: 10px;
 		color: #ff3333;
 		font-size: 0.9em;
 		background-color: #f8f8f8;
 		border-radius: 8px;
 		width: 80%;
 		z-index: 2000;
 		left: 50%;
 		top: 50%;
 		transform: translate(-50%, -50%);
 		box-shadow: 0 1px 2px 0 #e4e7ef;
 	}
 </style>