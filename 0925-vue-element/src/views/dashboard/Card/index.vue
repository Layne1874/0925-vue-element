<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="6">
				<el-card>
					<Detail title="总销售额" count="￥ 126560">
						<template slot="charts">
							<span class="first">
								<span>
									<i>周同比 56.67%</i>
									<i class="el el-icon-top"></i>
								</span>
								<span>
									<i>日同比56.67%</i>
									<i class="el el-icon-bottom"></i>
								</span>
							</span>
						</template>
						<template slot="footer">
							<span>
								<i>日销售额￥ 12423</i>
							</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="访问量" count="88460">
						<template slot="charts">
							<LineCart></LineCart>
						</template>
						<template slot="footer">
							<span>
								<i>日访问量￥ 12423</i>
							</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="支付笔数" count="88460">
						<template slot="charts">
							<barCart></barCart>
						</template>
						<template slot="footer">
							<span>
								<i>转化率 64%</i>
							</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="运营活动效果" count="78%">
						<template slot="charts">
							<progressCart></progressCart>
						</template>

						<template slot="footer">
							<span>
								<i>周同比 56.67%</i>
								<i class="el el-icon-top"></i>
							</span>
							<span>
								<i>日同比56.67%</i>
								<i class="el el-icon-bottom"></i>
							</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import Detail from "@/views/dashboard/Card/Detail";
import LineCart from "@/views/dashboard/Card/LineCart";
import barCart from "@/views/dashboard/Card/barCart";
import progressCart from "./progressCart";

export default {
	name: "cardVue",
	components: { Detail, LineCart, barCart, progressCart },
	mixins: [],
	props: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {},
};
</script>
<style lang='less' scoped>
span {
	font-size: 12px;
	&:nth-child(2) {
		margin-left: 25px;
	}
	i {
		&.el-icon-top {
			color: #1aca2c;
			font-weight: 700;
		}
		&.el-icon-bottom {
			color: #c81902;
			font-weight: 700;
		}
	}
}
</style>