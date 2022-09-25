<template>
	<div class="charts" ref="charts"></div>
</template>
<script>
import echarts from "echarts";
export default {
	name: "progressCart",
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
				min: 0,
				max: 100,
			},
			yAxis: {
				show: false,
				//在y轴均分可以使其横向排列
				type: "category",
			},
			//系列
			series: [
				{
					type: "bar",
					data: [78],
					color: "#c7e7e3",
					barWidth: "40%",
					showBackground: true,
					backgroundStyle: {
						color: "#ccc",
					},
					//文本
					label: {
						show: true,
						formatter: "|",
						position: "right",
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