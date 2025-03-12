<template>
	<view class="dx-body">
		<dx-table ref="table" :header="tableHeader" :tableParams="tableParams"></dx-table>
	</view>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const tableHeader = reactive({
	tips: '素材管理',
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
		index: 'admin/material/index',
		add: 'admin/material/add',
		edit: 'admin/material/edit',
		del: 'admin/material/del',
		multi: 'admin/material/multi',
	},
	columns: [
		{ type: 'checkbox', align: 'center', width: '60px', operator: false },
		{ type: 'seq', field: 'seq', label: '序号', align: 'center', width: '60px', operator: false },
		{
			label: '名称',
			field: 'name',
			value: '',
			rules: [],
		},
		{
			label: '分类',
			field: 'category_id',
			operator: false,
			formatter({ row }: any) {
				return row.category.name;
			},
			component: {
				name: 'dx-tree-select',
				props: {
					url: 'admin/category/list',
					label: 'name',
					nodeKey: '_id',
					funcName: 'dx-func-exclusive',
					params: {
						order: 'sort',
						sort: 'asc',
					},
				},
			},
			rules: [
				{
					required: true,
					message: '分类不能为空',
				},
			],
		},
		{
			label: '类型',
			field: 'type',
			value: 0,
			width: '90px',
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '专属头像', value: 0 },
					{ label: '姓氏头像', value: 1 },
				],
			},
			formatter({ cellValue }: any) {
				return cellValue === 0 ? '专属头像' : '姓氏头像';
			},
			rules: [],
		},
		{
			label: '封面',
			field: 'cover',
			value: '',
			render: 'dx-image',
			width: '80px',
			component: {
				name: 'dx-upload',
				props: {
					limit: 1,
				},
			},
			rules: [],
		},
		{
			label: '素材',
			field: 'image',
			value: '',
			render: 'dx-image',
			width: '80px',
			component: {
				name: 'dx-upload',
				props: {
					limit: 1,
				},
			},
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
			label: '名字颜色',
			field: 'color',
			value: '#000000',
			rules: [],
			component: {
				name: 'dx-color-picker',
			},
		},
		{
			label: '名字x轴(375px)',
			field: 'x',
			value: '',
			rules: [],
			component: {
				name: 'el-input',
				props:{
					type:'number'
				}
			},
		},
		{
			label: '名字y轴(375px)',
			field: 'y',
			value: '',
			rules: [],
			component: {
				name: 'el-input',
				props:{
					type:'number'
				}
			},
		},
		{
			label: '创建时间',
			field: 'create_date',
			width: '190px',
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
			permission: ['dx-func-exclusive/admin/material/edit', 'dx-func-exclusive/admin/material/del'],
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
