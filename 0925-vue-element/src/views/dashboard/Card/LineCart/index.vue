<template>
	<div class="charts" ref="charts"></div>
</template>
<script>
import echarts from "echarts";
export default {
	name: "lineCart",
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
					//让折线平滑
					smooth: true,
					type: "line",
					data: [10, 7, 33, 12, 55, 9],
					//拐点的样式的设置
					itemStyle: {
						opacity: 0,
					},
					//线条的样式
					lineStyle: {
						color: "#efe4fe",
					},
					//填充颜色设置
					areaStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: "#efe4fe", // 0% 处的颜色
								},
								{
									offset: 1,
									color: "#fff", // 100% 处的颜色
								},
							],
							global: false, // 缺省为 false
						},
					},
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