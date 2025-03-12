<template>
	<tmap-map mapKey="MQLBZ-BI73U-BG3VJ-GKB55-SSEH6-NPBPW" :events="events" :center="center" :zoom="zoom"
		:doubleClickZoom="doubleClickZoom" :control="control">
	</tmap-map>
</template>

<script lang="ts">
	import { defineComponent, ref } from 'vue';

	export default defineComponent({
		name: 'HomePage',
		setup() {
			const center = ref({ lat: 23.106154, lng: 113.281485 });
			const zoom = ref(16);
			const doubleClickZoom = ref(false);
			const print = (e : unknown) => {
				console.log(e);
			};
			return {
				events: {
					dblclick: print,
				},
				center,
				zoom,
				doubleClickZoom,
				control: {
					scale: {},
					zoom: {
						position: 'bottomRight',
					},
				},
			};
		},
	});
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}

	// 隐藏头部导航栏
	// /* #ifdef H5 */
	// uni-page-head {
	// 	display: none;
	// }

	/* #endif */
</style>