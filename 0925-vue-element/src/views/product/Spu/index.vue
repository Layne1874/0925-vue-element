<template>
	<div>
		<!-- 三级分类 -->
		<el-card class="demo-card-inline">
			<categorySelect @pass3Id="pass3Id" :show="showspu"></categorySelect>
		</el-card>

		<el-card class="demo-card-inline" v-show="num==1">
			<el-button
				type="primary"
				icon="el-icon-plus"
				round
				@click="toaddorupdateSpu('add')"
				:disabled="!category3Id"
			>添加SPU</el-button>
			<el-table border style="width: 100%;margin-top: 20px;" :data="records">
				<el-table-column prop="date" label="序号" width="120" type="index"></el-table-column>
				<el-table-column prop="spuName" label="SPU名称" width="180" align="center"></el-table-column>
				<el-table-column prop="description" label="SPU描述" width="width" align="center"></el-table-column>
				<el-table-column prop="prop" label="操作" width="280" align="center">
					<template slot-scope="{row}">
						<hintButton type="success" circle icon="el-icon-plus" title="添加sku" @click="addSku(row)"></hintButton>
						<hintButton
							type="primary"
							circle
							icon="el-icon-edit"
							title="编辑spu"
							@click="toaddorupdateSpu('update',row)"
						></hintButton>
						<el-popover placement="right" width="600" trigger="click">
							<el-table :data="gridData" border>
								<el-table-column width="100" prop="date" label="名称"></el-table-column>
								<el-table-column width="120" prop="name" label="价格"></el-table-column>
								<el-table-column width="150" prop="address" label="重量"></el-table-column>
								<el-table-column width="width" prop="address" label="默认图片"></el-table-column>
							</el-table>
							<hintButton type="info" circle icon="el-icon-info" title="查看spu" slot="reference"></hintButton>
						</el-popover>
						<el-popconfirm title="确定删除该spu吗？" @onConfirm="deleteSpu(row)">
							<hintButton type="danger" circle icon="el-icon-delete" title="删除spu" slot="reference"></hintButton>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页器 -->
			<!-- 
			-->
			<!--  -->
			<el-pagination
				style="margin-top: 10px;"
				@current-change="getpageList"
				@size-change="handleSizeChange"
				:current-page="page"
				:page-sizes="[3, 5, 10]"
				:page-size="limit"
				layout=" prev,pager, next,jumper,->,sizes"
				:total="total"
				align="center"
			></el-pagination>
		</el-card>

		<spuForm v-show="num==2" @backSpu="backSpu" ref="spuForm"></spuForm>
		<skuForm v-show="num==3" @backSpu="backSpu" ref="skuForm"></skuForm>
	</div>
</template>
<script>
//引入子组件
import spuForm from "@/views/product/Spu/spuForm";
import skuForm from "@/views/product/Spu/skuForm";
import { type } from "os";

export default {
	name: "spuVue",
	components: { spuForm, skuForm },
	mixins: [],
	props: [""],
	data() {
		return {
			gridData: [
				{
					date: "2016-05-02",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄",
				},
			],

			//当前页面
			page: 1,
			//总页数
			total: 1,
			//每一页展示的数据数
			limit: 3,
			//用来收集服务器返回的records
			records: [],
			//一级级分类id
			category1Id: "",
			//二级分类id
			category2Id: "",
			//三级分类id
			category3Id: "",
			//切换到哪个组件的标志
			num: 1,
			//控制添加spu按钮||三级分类是否可点击
			showspu: false,
			//给spuform传递的每个spu数据
			spu: {},
		};
	},
	computed: {},
	watch: {},
	mounted() {
		// this.getSpuList();
	},
	methods: {
		//把子组件传过来的3id存起来并向服务器发起求获取spulist
		pass3Id({ cate1id, cate2id, cate3id }) {
			this.category1Id = cate1id;
			this.category2Id = cate2id;
			this.category3Id = cate3id;

			this.getpageList();
		},

		//每一页最多展示的数据数,并发送请求获取数据
		handleSizeChange(limit) {
			this.limit = limit;
			//获取数据
			this.category3Id && this.getpageList();
		},

		//将具体页面数和具体哪个三级分类id的spu数据获取回来
		async getpageList(page = 1) {
			const { limit, category3Id } = this;
			let result = await this.$api.spu.reqgetpageList(
				page,
				limit,
				category3Id
			);
			if (result.code == 200) {
				this.page = result.data.current;
				this.total = result.data.total;
				this.records = result.data.records;
			}
		},

		//获取spulist
		async getSpuList() {
			// let result = await this.$api.spu.reqgetSpubyspuId(2);
			// console.log(result);
			// if (result.code == 200) {
			// 	// this.records = result.data;
			// }
		},

		//删除某个spu
		async deleteSpu(spu) {
			let result = await this.$api.spu.reqgdeleteSpu(spu.id);
			if (result.code == 200) {
				this.$message({ type: "success", message: "已删除该spu" });
				//重新获取spu数据
				if (this.records.length <= 1) {
					this.getpageList(this.page - 1);
				} else {
					this.getpageList(this.page);
				}
			}
		},

		//切换到添加||修改spu的列表
		toaddorupdateSpu(str, row) {
			this.num = 2;
			//控制三级分类无法操作
			this.showspu = !this.showspu;
			if (str == "add") {
				this.$message("新增spu");
				this.$refs.spuForm.getTrademarkList(this.category3Id);
				this.$refs.spuForm.getsaleValue();
			} else {
				this.$message("修改spu");
				//切换到更改spu界面时通知子组件spuform更新updatespu
				// console.log(this.$refs);
				this.$refs.spuForm.initData(row);
				// console.log(this.$refs.spuForm);
			}
		},

		//接收子组件的数据回到主页面
		backSpu(backnum, which) {
			if (which == "update") {
				this.num = backnum;
				//控制三级分类恢复正常操作
				this.showspu = !this.showspu;
				this.getpageList();
				this.$message({ type: "success", message: "更新spu成功" });
			} else if (which == "addsku") {
				this.num = backnum;
				//控制三级分类恢复正常操作
				this.showspu = !this.showspu;
				this.getpageList();
				this.$message({ type: "success", message: "添加sku成功" });
			} else {
				this.num = backnum;
				//控制三级分类恢复正常操作
				this.showspu = !this.showspu;
				this.$message("取消本次操作");
			}
		},

		//添加sku的回调
		addSku(row) {
			this.num = 3;
			//控制三级分类无法操作
			this.showspu = !this.showspu;

			//
			this.$refs.skuForm.findspuData(row);

			const { category1Id, category2Id, category3Id } = this;
			this.$refs.skuForm.getattrInfoList(
				category1Id,
				category2Id,
				category3Id
			);
		},
	},
};
</script>
<style lang='less' scoped>
.demo-card-inline {
	margin: 30px;
	padding: 10px;
}
</style>