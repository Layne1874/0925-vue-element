<template>
	<div>
		<el-card class="demo-card-inline">
			<el-table border :data="skuList">
				<el-table-column align="center" width="80" prop="prop" label="序号" type="index"></el-table-column>
				<el-table-column align="center" width="120" prop="skuName" label="名称"></el-table-column>
				<el-table-column align="center" width="width" prop="skuDesc" label="描述"></el-table-column>
				<el-table-column align="center" width="width" prop="skuDefaultImg" label="默认图片">
					<template slot-scope="{row}">
						<img :src="row.skuDefaultImg" alt style="width:100px;" />
					</template>
				</el-table-column>
				<el-table-column align="center" width="100" prop="weight" label="重量(kg)"></el-table-column>
				<el-table-column align="center" width="100" prop="price" label="价格(元)"></el-table-column>
				<el-table-column align="center" width="250" prop="prop" label="操作">
					<template slot-scope="{row}">
						<hint-Button
							type="success"
							icon="el-icon-top"
							circle
							title="上架sku"
							style="margin:5px;"
							@click="upsku(row,'up')"
							v-if="row.isSale==1"
						></hint-Button>
						<hint-Button
							type="primary"
							icon="el-icon-bottom"
							circle
							title="下架sku"
							style="margin:5px;"
							@click="upsku(row,'down')"
							v-else
						></hint-Button>

						<el-popover placement="bottom" title="title" width="200" trigger="click" content="该功能敬请期待">
							<hint-Button
								type="primary"
								icon="el-icon-edit"
								circle
								title="编辑sku"
								style="margin:5px;"
								slot="reference"
							></hint-Button>
						</el-popover>

						<hint-Button
							type="info"
							icon="el-icon-info"
							circle
							title="查看sku"
							style="margin:5px;"
							@click="getSkuInfo(row)"
						></hint-Button>

						<el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="50%">
							<!-- -->
							<!-- style="margin: 50px 0 0 40px;" -->

							<el-row>
								<el-col :span="5">名称</el-col>
								<el-col :span="16">{{skuInfo.skuName}}</el-col>
							</el-row>
							<el-row>
								<el-col :span="5">描述</el-col>
								<el-col :span="16">{{skuInfo.skuDesc}}</el-col>
							</el-row>
							<el-row>
								<el-col :span="5">价格</el-col>
								<el-col :span="16">{{skuInfo.price}}</el-col>
							</el-row>
							<el-row>
								<el-col :span="5">平台属性</el-col>
								<el-col :span="16">
									<el-tag
										type="success"
										v-for="(attr) in skuInfo.skuAttrValueList"
										:key="attr.id"
										style="margin:5px 10px 0 0;"
									>{{attr.id}}-{{attr.valueId}}</el-tag>
								</el-col>
							</el-row>

							<el-row>
								<el-col :span="5">商品图片</el-col>
								<el-col :span="16">
									<el-carousel height="400px">
										<el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
											<img :src="item.imgUrl" alt />
										</el-carousel-item>
									</el-carousel>
								</el-col>
							</el-row>
						</el-drawer>

						<el-popconfirm title="确定删除该sku吗" @onConfirm="deleteSku(row)">
							<hint-Button
								type="danger"
								icon="el-icon-delete"
								circle
								title="删除sku"
								style="margin:5px;"
								slot="reference"
							></hint-Button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页器 -->
			<!-- 
			-->
			<el-pagination
				@current-change="getpageList"
				@size-change="handleSizeChange"
				style="margin-top: 20px;"
				:current-page="page"
				:page-sizes="[3, 5, 10]"
				:page-size="limit"
				layout=" prev,pager, next,jumper,->,sizes"
				:total="total"
				align="center"
			></el-pagination>
		</el-card>
	</div>
</template>

<script>
export default {
	name: "skuVue",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			//当前页面
			page: 1,
			//总页数
			total: 1,
			//每一页展示的数据数
			limit: 3,
			//用来收集服务器返回的records
			skuList: [],

			//根据skuid获取skuInfo
			skuInfo: {},

			//控制抽屉
			drawer: false,
		};
	},
	computed: {},
	watch: {},
	mounted() {
		this.getSkuList();
	},
	methods: {
		async getSkuList(pager = 1) {
			this.page = pager;
			const { page, limit } = this;
			let result = await this.$api.sku.reqSkuList(page, limit);
			if (result.code == 200) {
				this.skuList = result.data.records;
				this.total = result.data.total;
			}
		},
		//获取页面列表sku数据
		getpageList(pager) {
			this.page = pager;
			this.getSkuList(this.page);
		},

		//控制每页展示多少条数据
		handleSizeChange(limit) {
			this.limit = limit;
			this.getSkuList();
		},

		//删除某个sku数据
		async deleteSku(sku) {
			try {
				let result = await this.$api.sku.reqdeleteSku(sku.id);
				if (result.code == 200) {
					this.$message({ type: "success", message: "删除sku成功!" });
					this.getSkuList(
						this.skuList.length <= 1 ? this.page - 1 : this.page
					);
				}
			} catch (error) {
				return alert("无法删除该sku" + error);
			}
		},

		//上架|下架某个sku
		async upsku(row, how) {
			if (how == "up") {
				row.isSale = 0;
				let result = await this.$api.sku.reqonSale(row.id);
				console.log(result);
			} else {
				row.isSale = 1;
				let result2 = await this.$api.sku.reqcancelSale(row.id);
				console.log(result2);
			}
		},

		//获取sku
		async getSkuInfo(row) {
			this.drawer = true;

			let result = await this.$api.sku.reqgetSkuById(row.id);
			if (result.code == 200) {
				this.skuInfo = result.data;
			}
		},
	},
};
</script>

<style lang='less' >
.demo-card-inline {
	margin: 30px;
	padding: 10px;
}
.el-row:nth-child(1) {
	margin-top: 20px;
}
.el-row .el-col-5 {
	font-weight: 700;
	font-size: 18px;
	text-align: right;
	color: #333;
}
.el-row .el-col-16 {
	text-align: left;
}
.el-col {
	margin: 10px 10px;
}

.el-carousel__item img {
	width: 100%;
	height: 100%;
}

.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
.el-carousel__button {
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: rgb(109, 207, 190);
}
</style>