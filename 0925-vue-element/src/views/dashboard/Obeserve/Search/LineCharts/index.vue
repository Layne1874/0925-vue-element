<template>
	<div>
		<div class="header">
			<span class="hright">搜索用户数</span>
			<i class="el-icon-warning-outline"></i>
		</div>
		<div class="main">
			<span class="main-title">123456</span>
			<span class="main-content">
				17.1
				<i class="el-icon-caret-top" style="color: greenyellow"></i>
				<i class="el-icon-caret-bottom" style="color: red"></i>
			</span>
		</div>
		<div class="footer">
			<div class="charts" ref="charts"></div>
		</div>
	</div>
</template>
<script>
import echarts from "echarts";

export default {
	name: "lineCarts",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			tableData: [{}],
		};
	},
	computed: {},
	watch: {},
	mounted() {
		let mycharts = echarts.init(this.$refs.charts);

		mycharts.setOption({
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
.header {
	display: flex;
	align-items: center;
	.hright {
		margin-right: 20px;
	}
	.el-icon-warning-outline {
		color: #ccc;
	}
}
.main {
	margin-top: 10px;
	.main-title {
		margin-right: 30px;
	}
	.main-content {
		margin-right: 30px;
	}
}
.footer {
	.charts {
		width: 100%;
		height: 50px;
	}
}
</style>