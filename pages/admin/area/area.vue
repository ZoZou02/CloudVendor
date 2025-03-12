 <template>
 	<view class="content">
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :center="mapcenter">
 			<tmap-multi-polygon v-if="actionMode === 0" :id="id" :styles="styles" :geometries="geometries" />
 			<tmap-polygon-editor v-else ref="editor" :id="id" :styles="styles" v-model="geometries"
 				:action-mode="actionMode" @select="onSelect" @error="onError" />
 			<tmap-multi-label :id="lid" :styles="lstyles" :geometries="Labelgeometries" />
 			<view class="toolControl">
 				<view class="toolItem" :class="{'active': actionMode==0}" id="view" @click.stop="changeColor(0)">
 				</view>
 				<view class="toolItem" :class="{'active': actionMode==1}" id="edit" @click.stop="changeColor(1)">
 				</view>
 				<view class="toolItem" :class="{'active': actionMode==2}" id="add" @click.stop="changeColor(2)"></view>
 				<view v-if="actionMode === 1" class="areaSave" id="save" @click.stop="update"></view>
 				<view v-if="actionMode === 1" class="toolItem" id="del" @click.stop="del"></view>
 				<view v-if="actionMode === 2" class="areaSave" id="save" @click.stop="save"></view>
 				<view class="toolItem" id="stop" @click.stop="stop"></view>
 			</view>

 			<view v-if="actionMode === 1&&selectd === 1" class="areaName">
 				<div class="areaNameItem">区域名称：</div>
 				<input type="text" class="nameInput" v-model="updateName" @click="stop" />
 			</view>
 		</tmap-map>
 	</view>
 </template>

 <script lang="ts">
	import { TMap } from '@map-component/vue-tmap';
	import { defineComponent, ref, watch, shallowRef } from 'vue';
	import { centroid, polygon, center, point, booleanPointInPolygon } from '@turf/turf';

	export default defineComponent({
		name: 'polygon-editor',
		methods: {
		},
		data() {
			return {
			}
		},
		onload() {
			// this.showArea()
		},
		oncreated() {

		},

		setup() {
			const selectd = ref(0);
			// let sid : any;
			const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMjMyMTkxMDQzIiwiZXhwIjoxNzQxODMzNTkyfQ.OByvihkMd089xe2FBOip6952TReFXiDvVLAVESZF-qA';
			const editor = ref();
			const mapcenter = ref({ lat: 23.106154, lng: 113.281485 });
			const geometries = ref([]);               //摊位区域范围
			const streetGeometries = ref([]);         //街道范围
			const updateName = ref();
			const actionMode = ref(0);
			let tempGeometries;
			const selectGeometries = ref();

			const Labelgeometries = ref([]);
			const lstyles = shallowRef({
				label: {
					color: '#ff5500', // 颜色属性
					strokeColor: '#ffffff',
					size: 18, // 文字大小属性
					offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
					angle: 0, // 文字旋转属性
					alignment: 'center', // 文字水平对齐属性
					verticalAlignment: 'middle', // 文字垂直对齐属性
				},
			});

			const newGeometries =
				{
					id: '', // 多边形图形数据的标志信息
					styleId: 'polygon', // 样式id
					paths: [
					], // 多边形的位置信息
					properties: {
						// 多边形的属性数据
						title: '',
					},
				};

			function showArea() {
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
						res.data.data.forEach((item : { areaId : any; areaRange : { paths : any; }; areaName : any; }) => {
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
			showArea()
			// actionMode.value=0
			function showStreet() {
				uni.request({
					url: 'http://localhost:8080/street/showArea',
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						console.log("传入数据:", res.data.data)
						// geometries.value=null

						// 遍历数组中的每个元素
						res.data.data.forEach((item : { streetId : any; streetArea : { paths : any; }; }) => {
							let areaData = {
								id: item.streetId,
								styleId: item.streetId,
								paths: item.streetArea.paths,
								properties: {
									title: item.streetId
								},
							};
							// console.log("读取区域", areaData.properties);
							streetGeometries.value.push(areaData);
						});
						console.log('street', streetGeometries.value)
						//标签
						// 			res.data.data.forEach((item : { streetId : any; streetArea : { paths : any[]; }; streetName : any; }) => {

						// 				const polygonPt = item.streetArea.paths.map((path : { lat : any; lng : any; }) => [path.lat, path.lng]);
						// 				// 添加首个坐标以闭合环
						// 				polygonPt.push(polygonPt[0]);
						// 				const poly = polygon([polygonPt]);

						// 				// let centr = centroid(poly);
						// 				let centr = center(poly);
						// 				// console.log('centeroid',centr.geometry.coordinates);
						// 				// console.log('paths',item.streetArea.paths[0]);
						// 				let centrPath = { 'lat': centr.geometry.coordinates[0], 'lng': centr.geometry.coordinates[1] };


						// 				let labelData = {
						// 					id: item.streetId,
						// 					styleId: 'label',
						// 					position: centrPath,
						// 					content: item.streetName,
						// 					properties: {
						// 						title: 'label',
						// 					},
						// 				};
						// 				// console.log("读取区域", labelData.properties);
						// 				Labelgeometries.value.push(labelData);
						// 			});
					}
				})
			};
			showStreet();

			watch(
				() => geometries.value,
				() => {
					// console.log('watch', geometries.value);
					console.log('paths', geometries.value);
					console.log("多边形数量", geometries.value.length)
				},
				// () => updateName,
				// ()=>{
				// 	console.log("updateName",updateName)
				// }
			);
			return {
				lid: 'label-layer',
				lstyles,
				Labelgeometries,
				selectd,
				tempGeometries,
				selectGeometries,
				streetGeometries,
				updateName,
				// sid,
				mapcenter,
				editor,
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
				actionMode,
				select: () => {
					if (editor.value?.select) {
						editor.value.select();
					}
				},
				stop: () => {
					if (editor.value?.stop) {
						// selectd.value=0
						editor.value.stop();
					}
				},
				split: () => {
					if (editor.value?.split) {
						editor.value.split();
					}
				},
				union: () => {
					if (editor.value?.union) {
						editor.value.union();
					}
				},
				del: () => {
					uni.showModal({
						title: '确认删除?',
						confirmText: '删除',
						confirmColor: '#e06c75',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm && editor.value?.delete) {
								//后台数据删除
								uni.request({
									url: 'http://localhost:8080/admin/deleteArea',
									method: 'POST',
									header: {
										'content-type': 'application/json',
										'Authorization': token
									},
									data: selectGeometries.value,
									success: () => {
										uni.showToast({
											icon: 'success',
											title: '删除成功'
										})
									}
								})
								//切换回预览模式
								actionMode.value = 0
								//页面数据删除

								// 查找要删除的区域在数组中的索引
								const indexToRemoveArea = geometries.value.findIndex(obj => obj.id === selectGeometries.value.id);

								// 如果找到了要删除的区域，则删除它
								if (indexToRemoveArea !== -1) {
									geometries.value.splice(indexToRemoveArea, 1);
								}
								// 查找要删除的标签在数组中的索引
								const indexToRemoveLabel = Labelgeometries.value.findIndex(obj => obj.id === selectGeometries.value.id);

								// 如果找到了要删除的标签，则删除它
								if (indexToRemoveLabel !== -1) {
									Labelgeometries.value.splice(indexToRemoveLabel, 1);
									Labelgeometries.value = [
										...Labelgeometries.value
									];
									console.log("标签", Labelgeometries.value)
								}

							}
						}
					})

				},
				save() {
					console.log('save', geometries.value)
					// geometries.value.push(newGeometries)
					uni.showModal({
						title: '区域信息',
						content: '',
						editable: true,//是否显示输入框
						placeholderText: '请输入区域名称',//输入框提示内容
						confirmText: '保存',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								console.log('输入的内容：', res.content);
								// 一个一个区域进行添加
								console.log("最新多边形1", geometries.value[geometries.value.length - 1])


								//设置中间变量传参,弥补新的多边形没有title,只传一个数据
								const addGeometries = geometries.value[geometries.value.length - 1]
								newGeometries.id = addGeometries.id
								newGeometries.styleId = addGeometries.styleId
								newGeometries.paths = addGeometries.paths
								newGeometries.properties.title = res.content

								//修改页面数据
								geometries.value.pop()
								geometries.value.push(newGeometries)

								//添加标签
								const polygonPt = newGeometries.paths.map((path : { lat : any; lng : any; }) => [path.lat, path.lng]);
								// 添加首个坐标以闭合环
								polygonPt.push(polygonPt[0]);
								const poly = polygon([polygonPt]);

								// let centr = centroid(poly);
								//获取多边形中点坐标
								let centr = center(poly);
								let centrPath = { 'lat': centr.geometry.coordinates[0], 'lng': centr.geometry.coordinates[1] };

								let labelData = {
									id: newGeometries.id,
									styleId: 'label',
									position: centrPath,
									content: newGeometries.properties.title,
									properties: {
										title: 'label',
									},
								};
								// console.log("读取区域", labelData.properties);
								Labelgeometries.value = [
									...Labelgeometries.value,
									labelData
								];
								// Labelgeometries.value.push(labelData);
								console.log('标签', Labelgeometries.value)


								//识别所在街道
								//构造点
								const pt = point([centrPath.lat, centrPath.lng])
								console.log('pt', pt)

								for (let i = 0; i < streetGeometries.value.length; i++) {
									//构造多边形
									const polygonPt = streetGeometries.value[i].paths.map((path : { lat : any; lng : any; }) => [path.lat, path.lng]);
									// 添加首个坐标以闭合环
									polygonPt.push(polygonPt[0]);
									console.log('polygonPt', polygonPt)
									const poly = polygon([polygonPt]);
									//只需要存在一个区域即可
									// isOperate.value = false;
									if (booleanPointInPolygon(pt, poly)) {
										console.log('所属街道', streetGeometries.value[i])
										newGeometries.styleId = streetGeometries.value[i].id
										// isOperate.value = true;
										break;
									}
								}

								uni.request({
									url: 'http://localhost:8080/admin/addArea',
									method: 'POST',
									header: {
										'content-type': 'application/json',
										'Authorization': token
									},
									data: newGeometries,
									success: () => {
										uni.showToast({
											icon: 'success',
											title: "保存成功！"
										})

									},
									fail: () => {

									},
									complete: () => {
										//切换回预览模式，刷新数据
										actionMode.value = 0
									}

								})

							}
						}
					});
				},
				update() {
					//获取输入框更新的名称
					selectGeometries.value.properties.title = updateName.value

					//更新页面区域数据
					// 找到要修改的对象的索引
					const indexToModify = geometries.value.findIndex(obj => obj.id === selectGeometries.value.id);

					// 如果找到了要修改的对象，则修改它的属性
					if (indexToModify !== -1) {
						geometries.value[indexToModify].properties.title = updateName.value;
					}


					console.log(selectGeometries.value)
					uni.request({
						url: 'http://localhost:8080/admin/editArea',
						method: 'POST',
						header: {
							'content-type': 'application/json',
							'Authorization': token
						},
						data: selectGeometries.value,
						success: () => {
							uni.showToast({
								icon: 'success',
								title: "更新成功！"
							})

						},
						fail: () => {

						},
						complete: () => {
							//切换回预览模式，刷新数据
							actionMode.value = 0
						}

					})
				},
				onSelect: (e : TMap.PolygonGeometry) => {
					if (e) {
						selectd.value = 1
					}
					console.log('选中print', e);
					console.log('选中paths', geometries.value)
					selectGeometries.value = e[0]
					// console.log('选中selectGeometries', selectGeometries);
					tempGeometries = e[0]
					console.log('temp', tempGeometries)
					updateName.value = tempGeometries.properties.title
					// console.log('选中updateName', updateName);
					// console.log('选中selectGeometries', selectGeometries);
				},
				onError: (e : Record<string, string>) => {
					console.log('未知print', e);
				},
				changeColor(e : any) { //修改点击工具的样式
					// updateName.value="未选择区域"
					selectd.value = 0
					actionMode.value = e
				},



			};
		},
	});
 </script>

 <style lang="scss" scoped>
 	::-webkit-scrollbar {
 		display: none;
 	}

 	.ctrl {
 		position: absolute;
 		top: 0;
 		left: 0;
 		z-index: 1001;
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
 		z-index: 3;
 	}

 	.areaName {
 		position: absolute;
 		top: 85px;
 		left: 0px;
 		right: 0px;
 		margin: auto;
 		width: 248px;
 		z-index: 1001;
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

 	.areaSave:hover {
 		border-color: #789cff;
 	}


 	.toolControl {
 		position: absolute;
 		top: 40px;
 		left: 0px;
 		right: 0px;
 		margin: auto;
 		width: 252px;
 		z-index: 1001;
 	}

 	.toolItem:hover {
 		border-color: #789cff;
 	}


 	.active {
 		border-color: #d5dff2;
 		background-color: #d5dff2;
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
 </style>