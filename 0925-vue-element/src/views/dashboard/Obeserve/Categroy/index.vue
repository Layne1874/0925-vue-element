<template>
	<el-card>
		<div slot="header" class="topline">
			<div class="categroy-header">
				<span>销售额类别占比</span>
				<el-radio-group v-model="radio3" size="small">
					<el-radio-button label="上海"></el-radio-button>
					<el-radio-button label="广州"></el-radio-button>
					<el-radio-button label="深圳"></el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<div class="charts" ref="charts"></div>
	</el-card>
</template>
<script>
import echarts from "echarts";
export default {
	name: "cateGroy",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			radio3: "深圳",
		};
	},
	computed: {},
	watch: {},
	mounted() {
		let myecharts = echarts.init(this.$refs.charts);

		myecharts.setOption({
			tooltip: {
				trigger: "item",
			},
			title: {
				text: "视频",
				subtext: "1048",
				left: "center",
				top: "center",
			},
			series: [
				{
					name: "Access From",
					type: "pie",
					radius: ["40%", "70%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: "#fff",
						borderWidth: 2,
					},
					label: {
						show: true,
						position: "outside",
					},

					labelLine: {
						show: true,
					},
					data: [
						{ value: 1048, name: "Search Engine" },
						{ value: 735, name: "Direct" },
						{ value: 580, name: "Email" },
						{ value: 484, name: "Union Ads" },
						{ value: 300, name: "Video Ads" },
					],
				},
			],
		});
		myecharts.on("mouseover", (params) => {
			//获取与鼠标移上去的那条数据
			const { name, value } = params.data;
			//重新设置标题
			myecharts.setOption({
				title: {
					text: name,
					subtext: value,
				},
			});
		});
	},
	methods: {},
};
</script>
<style lang='less' scoped>
.categroy-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}
.topline {
	border-bottom: 2px solid #e4e7ed;
}
.charts {
	width: 100%;
	height: 300px;
}
</style>