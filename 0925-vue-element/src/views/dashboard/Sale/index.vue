<template>
	<div>
		<el-card class="box-card" style="margin:10px 0">
			<div slot="header" class="clearfix">
				<!--  -->
				<!-- 左侧内容 -->
				<el-tabs class="tab" v-model="activeName">
					<el-tab-pane label="销售额" name="sale"></el-tab-pane>
					<el-tab-pane label="访问量" name="visite"></el-tab-pane>
				</el-tabs>

				<!-- 右侧内容 -->
				<div class="right">
					<span @click="setDay">今年</span>
					<span @click="setWeek">本周</span>
					<span @click="setMonth">本月</span>
					<span @click="setYear">本年</span>
					<!-- 日历 -->
					<!-- v-model="value1" -->
					<el-date-picker class="date" v-model="date" type="daterange" range-separator="-"
						start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd">
					</el-date-picker>
				</div>
			</div>

			<div>
				<el-row :gutter="10">
					<el-col :span="17">
						<div class="charts" ref="charts"></div>
					</el-col>
					<el-col :span="7" class="content">
						<h3>门店{{title}}排名</h3>
						<ul>
							<li>
								<span class="index">1</span>
								<span>Apple</span>
								<span>123456</span>
							</li>
							<li>
								<span class="index">2</span>
								<span>Lancome</span>
								<span>123456</span>

							</li>
							<li>
								<span class="index">3</span>
								<span>Dior</span>
								<span>123456</span>

							</li>
							<li>
								<span>4</span>
								<span>肯德基</span>
								<span>123456</span>

							</li>
							<li>
								<span>5</span>
								<span>麦当劳</span>
								<span>123456</span>
							</li>
							<li>
								<span>6</span>
								<span>沃尔玛</span>
								<span>123456</span>
							</li>
							<li>
								<span>7</span>
								<span>Huawei</span>
								<span>123456</span>
							</li>
						</ul>
					</el-col>
				</el-row>
			</div>
		</el-card>
	</div>
</template>
<script>
import echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
	name: "saleVue",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			activeName: "sale",
			myecharts: null,
			//收集日历的数据
			date: [],
		};
	},
	computed: {
		title() {

			return this.activeName == "sale" ? "销售额" : "访问量";
		},

		...mapState({
			listState: (state) => state.home.list,
			// listState: (state) => state.home,
		}),
	},

	mounted() {
		this.myecharts = echarts.init(this.$refs.charts);

		this.myecharts.setOption({
			title: { text: this.title + "趋势" },

			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true,
			},
			xAxis: [
				{
					type: "category",
					data: [],
					axisTick: {
						alignWithLabel: true,
					},
				},
			],
			yAxis: [
				{
					type: "value",
				},
			],
			series: [
				{
					name: "Direct",
					type: "bar",
					barWidth: "60%",
					data: [],
					color: "#c4b7d7",
				},
			],
		});
	},
	watch: {
		// immediate: true,
		title() {
			this.myecharts.setOption({
				title: { text: this.title + "趋势" },
				xAxis: {
					data:
						this.title == "销售额"
							? this.listState.orderFullYearAxis
							: this.listState.userFullYearAxis,
				},
				series: [
					{
						name: "Direct",
						type: "bar",
						barWidth: "60%",
						data:
							this.title == "销售额"
								? this.listState.orderFullYear
								: this.listState.userFullYear,
						color: "#c4b7d7",
					},
				],
			});
		},
		listState() {
			this.myecharts.setOption({
				title: { text: this.title + "趋势" },

				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				xAxis: [
					{
						type: "category",
						data: this.listState.orderFullYearAxis,
						axisTick: {
							alignWithLabel: true,
						},
					},
				],
				yAxis: [
					{
						type: "value",
					},
				],
				series: [
					{
						name: "Direct",
						type: "bar",
						barWidth: "60%",
						data: this.listState.orderFullYear,
						color: "#c4b7d7",
					},
				],
			});
		},
	},
	methods: {
		//本天
		setDay() {
			const day = dayjs().format("YYYY-MM-DD");
			this.date = [day, day];
		},
		//本周
		setWeek() {
			const start = dayjs().day(1).format("YYYY-MM-DD");
			const end = dayjs().day(7).format("YYYY-MM-DD");
			this.date = [start, end];
		},
		//本月
		setMonth() {
			const start = dayjs().startOf("month").format("YYYY-MM-DD");
			const end = dayjs().endOf("month").format("YYYY-MM-DD");
			this.date = [start, end];
		},
		//本年
		setYear() {
			const start = dayjs().startOf("year").format("YYYY-MM-DD");
			const end = dayjs().endOf("year").format("YYYY-MM-DD");
			this.date = [start, end];
		},
	},
};
</script>
<style lang='less' scoped>
.clearfix {
	position: relative;
	display: flex;
	justify-content: space-between;
}

.tab {
	width: 100%;
}

.right {
	position: absolute;
	right: 0;

	span {
		margin: 0 15px;
	}

	.date {
		width: 250px;
		margin: 0 20px;
	}
}

.charts {
	width: 100%;
	height: 300px;
}

.content {
	ul {
		list-style: none;
		width: 100%;
		height: 300px;
		padding: 0;

		li {
			padding-bottom: 35px;
			height: 8%;

			span {
				&:nth-child(2) {
					margin-left: 20px;
				}

				&:nth-child(3) {
					position: absolute;
					right: 20px;
				}

				&.index {
					display: inline-block;
					width: 16px;
					height: 16px;
					text-align: center;
					background-color: black;
					border-radius: 50%;
					color: #fff;
				}
			}
		}
	}
}
</style>