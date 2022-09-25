<template>
	<div class="charts" ref="charts"></div>
</template>
<script>
import echarts from "echarts";
export default {
	name: "barCart",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	mounted() {
		//初始化echarts实例
		let lineCharts = echarts.init(this.$refs.charts);
		//配置数据
		lineCharts.setOption({
			xAxis: {
				show: false,
				type: "category",
			},
			yAxis: {
				show: false,
			},
			//系列
			series: [
				{
					type: "bar",
					data: [10, 7, 33, 12, 55, 9, 40, 48, 68],
					color: "#c7e7e3",
				},
			],
			//布局调试
			grid: {
				left: 0,
				top: 0,
				right: 10,
				bottom: 10,
			},
		});
	},

	methods: {},
};
</script>
<style lang='less' scoped>
.charts {
	width: 100%;
	height: 100%;
}
</style>