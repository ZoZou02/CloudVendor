<template>
	<view class="dx-body">
		<dx-table ref="table" :header="tableHeader" :tableParams="tableParams"></dx-table>
	</view>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const tableHeader = reactive({
	tips: '姓氏起源',
});
const tableParams = reactive({
	columnConfig: {
		resizable: true,
	},
	rowConfig: {
		isCurrent: false,
		isHover: true,
		height: 55,
	},
	showOverflow: 'tooltip',
	funcName: 'dx-func-exclusive',
	urls: {
		index: 'admin/familyOrigin/index',
		add: 'admin/familyOrigin/add',
		edit: 'admin/familyOrigin/edit',
		del: 'admin/familyOrigin/del',
		multi: 'admin/familyOrigin/multi',
	},
	columns: [
		{ type: 'checkbox', align: 'center', width: '60px', operator: false },
		{ type: 'seq', field: 'seq', label: '序号', align: 'center', width: '60px', operator: false },
		{
			label: '人物封面',
			field: 'cover',
			value: '',
			render: 'dx-image',
			width: '180px',
			component: {
				name: 'dx-upload',
				props: {
					limit: 1,
				},
			},
			rules: [],
		},
		{
			label: '姓名',
			field: 'xing',
			value: '',
			rules: [],
		},
		{
			label: '内容',
			field: 'content',
			operator: false,
			visible: false,
			component: {
				name: 'dx-tinymce',
			},
			rules: [],
		},
		{
			label: '创建时间',
			field: 'create_date',

			width: '200px',
			form: false,
			formatter: 'dxFormatDate',
		},
		{
			type: 'operate',
			field: 'operate',
			label: '操作',
			align: 'center',
			width: '120px',
			fixed: 'right',
			operator: false,
			buttons: ['edit', 'del'],
			permission: ['dx-func-exclusive/admin/familyOrigin/edit', 'dx-func-exclusive/admin/familyOrigin/del'],
		},
	],
});

const table = ref();
onLoad(() => {
	nextTick(() => {
		// 加载表单数据
		table.value.getTableList();
	});
});
</script>

<style lang="scss"></style>
