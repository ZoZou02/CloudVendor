<template>
	<view>
		<button type="default" @click="show">按钮</button>
 		<tmap-map class="map" mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" >

 		</tmap-map>
		<view class="toolControl" @click="reflash">
			<view class="toolItem" id="save" @click.stop="reflash"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			show(){
				console.log("按钮！")
			},
			reflash(){
				location.reload()
			}
		}
	}
</script>

<style lang="scss" scoped>

	.map{
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
	
	.areaNameItem{
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

 	// .areaSave:hover {
 	// 	border-color: #789cff;
 	// }


 	.toolControl {
 		position: absolute;
 		top: 40px;
 		left: 0px;
 		right: 0px;
 		margin: auto;
 		width: 50px;
 		z-index: 1001;
		// pointer-events: all;
 	}

 	.toolItem:hover {
 		border-color: #789cff;
 	}

</style>
