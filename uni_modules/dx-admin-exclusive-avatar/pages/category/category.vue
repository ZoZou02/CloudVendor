<template>
	<view class="dx-body">
		<dx-table ref="table" :header="tableHeader" :tableParams="tableParams"></dx-table>
	</view>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const tableHeader = reactive({
	tips: '分类管理',
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
		index: 'admin/category/index',
		add: 'admin/category/add',
		edit: 'admin/category/edit',
		del: 'admin/category/del',
		multi: 'admin/category/multi',
	},
	columns: [
		{ type: 'checkbox', align: 'center', width: '60px', operator: false },
		{ type: 'seq', field: 'seq', label: '序号', align: 'center', width: '60px', operator: false },
		{
			label: '分类名称',
			field: 'name',
			value: '',
			rules: [],
		},
		{
			label: '排序',
			field: 'sort',
			value: 0,
			width: '100px',
			component: {
				name: 'el-input',
				props: {
					type: 'number',
					placeholder: '请输入排序',
					clearable: true,
				},
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
			label: '更新时间',
			field: 'update_date',

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
			permission: ['dx-func-exclusive/admin/category/edit', 'dx-func-exclusive/admin/category/del'],
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
