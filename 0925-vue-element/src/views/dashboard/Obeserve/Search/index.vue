<template>
	<div>
		<el-card>
			<div slot="header" class="topline">
				<div class="search-header">
					<span>线上热门搜索</span>

					<el-dropdown>
						<span class="el-dropdown-link">
							<i class="el-icon-more"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>黄金糕</el-dropdown-item>
							<el-dropdown-item>狮子头</el-dropdown-item>
							<el-dropdown-item>螺蛳粉</el-dropdown-item>
							<el-dropdown-item disabled>双皮奶</el-dropdown-item>
							<el-dropdown-item divided>蚵仔煎</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>

			<div>
				<el-row>
					<el-col :span="12">
						<lineCarts></lineCarts>
					</el-col>
					<el-col :span="12">
						<lineCarts></lineCarts>
					</el-col>
				</el-row>
				<!-- table表格 -->
				<!-- :default-sort="{prop: 'date', order: 'descending'}" -->
				<el-table :data="tableData" style="width: 100%;" border>
					<el-table-column label="排名" width="width" type="index"></el-table-column>
					<el-table-column label="搜索关键字" width="width"></el-table-column>
					<el-table-column label="用户数" sortable width="width"></el-table-column>
					<el-table-column label="周涨幅" sortable width="width"></el-table-column>
				</el-table>
				<el-pagination layout="prev, pager, next" :total="50" class="pagination"></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
import lineCarts from "./LineCharts";

export default {
	name: "searchVue",
	components: { lineCarts },
	mixins: [],
	props: {},
	data() {
		return {
			tableData: [{}],
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {},
};
</script>
<style lang='less' scoped>
.search-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}
.topline {
	border-bottom: 2px solid #e4e7ed;
}
.pagination {
	display: inline-block;
	transform: translateX(260px);
}
</style>