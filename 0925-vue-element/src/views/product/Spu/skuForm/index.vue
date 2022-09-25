<template>
	<div>
		<el-card class="demo-card-inline">
			<el-form label-width="100px">
				<el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>

				<el-form-item label="SKU名称">
					<el-input placeholder="SKU名称" size="small" v-model="skuInfo.skuName"></el-input>
				</el-form-item>

				<el-form-item label="价格(元)">
					<el-input-number v-model="skuInfo.price" :min="1" :max="9999" label="价格"></el-input-number>
				</el-form-item>

				<el-form-item label="重量(kg)">
					<el-input-number v-model="skuInfo.weight" :min="1" :max="9999" label="重量"></el-input-number>
				</el-form-item>

				<el-form-item label="规格描述">
					<el-input placeholder="规格描述" size="small" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
				</el-form-item>

				<el-form-item label="平台属性">
					<el-form :inline="true" style="margin-left: 20px;" label-width="80px">
						<el-form-item
							:label="attr.attrName"
							class="select"
							v-for="attr in attrInfoList"
							:key="attr.id"
						>
							<el-select placeholder="请选择" value v-model="attr.attrIdAndValueId">
								<el-option
									:label="attrinfo.valueName"
									:value="`${attr.id}:${attrinfo.id}`"
									v-for="attrinfo in attr.attrValueList"
									:key="attrinfo.id"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</el-form-item>

				<el-form-item label="销售属性">
					<el-form :inline="true" style="margin-left: 20px;" label-width="80px">
						<el-form-item
							:label="sale.saleAttrName"
							class="select"
							v-for="sale in spuSaleAttrList"
							:key="sale.id"
						>
							<el-select placeholder="请选择" value v-model="sale.attrIdAndValueId">
								<el-option
									:label="salevalue.saleAttrValueName"
									:value="`${sale.id}:${salevalue.id}`"
									v-for="salevalue in  sale.spuSaleAttrValueList "
									:key="salevalue.id"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</el-form-item>

				<el-form-item label="图片列表">
					<el-table border :data="spuImageList" @selection-change="handleSelectionChange">
						<!-- `checked` 为 true 或 false -->
						<el-table-column label="选择图片" type="selection" align="center"></el-table-column>
						<el-table-column label="图片" prop align="center">
							<template slot-scope="{row}">
								<img :src="row.imgUrl" alt style="width: 100px;" />
							</template>
						</el-table-column>
						<el-table-column label="名称" prop="imgName" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="{row}">
								<el-button type="success" icon="el-icon-check" round v-if="row.isDefault==1">默认</el-button>
								<el-button type="primary" round @click="setDefault(row)" v-else>设置默认</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" round @click="saveskuInfo">保存</el-button>
					<el-button round @click="backSpu">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { type } from "os";

export default {
	name: "skuForm",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			//spu
			spu: {},

			skuInfo: {
				skuName: "",
				skuDesc: "",
				price: 0,
				category3Id: 0,
				skuDefaultImg: "",
				spuId: 0,
				tmId: 0,
				weight: "",
				isSale: 0,
				skuAttrValueList: [
					{
						attrId: 0,
						attrName: "",
						id: 0,
						skuId: 0,
						valueId: 0,
						valueName: "",
					},
				],
				skuImageList: [
					{
						id: 0,
						imgName: "",
						imgUrl: "",
						isDefault: "",
						skuId: 0,
						spuImgId: 0,
					},
				],
				skuSaleAttrValueList: [
					{
						id: 0,
						saleAttrId: 0,
						saleAttrName: "string",
						saleAttrValueId: 0,
						saleAttrValueName: "string",
						skuId: 0,
						spuId: 0,
					},
				],
			},
			//存储spu图片数据
			spuImageList: [],

			//存储spu销售属性
			spuSaleAttrList: [],

			// 存储平台属性的数据
			attrInfoList: [],

			//收集勾选的图片的数组
			//收集图片的字段
			imageList: [],
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {
		//取消添加sku||返回展示spu数据的主页面
		backSpu() {
			this.$emit("backSpu", 1);
			//置空data
			Object.assign(this._data, this.$options.data());
		},

		////获取spu添加sku
		async findspuData(spu) {
			// let result1 = await this.$api.spu.reqfindspuByid(spuId);
			// if (result1.code == 200) {
			// 	this.spuByid = result1.data;
			// }

			this.spu = spu;
			this.skuInfo.category3Id = spu.category3Id;
			this.skuInfo.spuId = spu.id;
			this.skuInfo.tmId = spu.tmId;

			//获取spu图片
			let result2 = await this.$api.spu.reqspuImageList(spu.id);
			if (result2.code == 200) {
				this.spuImageList = result2.data;
			}

			//获取spu销售属性
			let result3 = await this.$api.spu.reqspuSaleAttrList(spu.id);
			if (result3.code == 200) {
				this.spuSaleAttrList = result3.data;
			}
		},

		//获取平台属性
		async getattrInfoList(category1Id, category2Id, category3Id) {
			let result = await this.$api.spu.reqAttrInfoList(
				category1Id,
				category2Id,
				category3Id
			);
			if (result.code == 200) {
				this.attrInfoList = result.data;
			}
		},

		//勾选表格某一行的回调
		handleSelectionChange(img) {
			this.imageList = img;
		},

		//设置默认图片的回调
		setDefault(row) {
			this.spuImageList.forEach((item) => {
				// item.flag = false;

				this.$set(item, "isDefault", 0);
			});
			this.$set(row, "isDefault", 1);
			//收集默认图片的地址
			this.skuInfo.skuDefaultImg = row.imgUrl;
		},

		//保存按钮，提交给服务器的最终数据，新增sku
		async saveskuInfo() {
			const { skuInfo, imageList, attrInfoList, spuSaleAttrList } = this;

			// //整理数据
			skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
				if (item.attrIdAndValueId) {
					const [attrId, valueId] = item.attrIdAndValueId.split(":");
					prev.push({ attrId, valueId });
				}
				return prev; //表示把每一次的返回值赋值给skuInfo.skuAttrValueList
			}, []); //[]空数组表示设定的初始值为一个空数组

			//整理skuSaleAttrValueList
			skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce(
				(prev, item) => {
					if (item.attrIdAndValueId) {
						const [saleAttrId, saleAttrValueId] =
							item.attrIdAndValueId.split(":");
						prev.push({ saleAttrId, saleAttrValueId });
					}
					return prev;
				},
				[]
			);

			// console.log(imageList);
			//整理图片数据
			skuInfo.skuImageList = imageList.map((item) => {
				return {
					id: item.id,
					imgName: item.imgName,
					imgUrl: item.imgUrl,
					isDefault: item.isDefault,
					spuId: item.spuId,
				};
			});
			// 发请求，把skuInfo提交给服务器
			let result = await this.$api.spu.reqAddSku(skuInfo);
			if (result.code == 200) {
				this.$emit("backSpu", 1, "addsku");
				//置空data
				Object.assign(this._data, this.$options.data());
			}
		},
	},
};
</script>
<style lang='less' scoped>
.demo-card-inline {
	margin: 30px;
	padding: 10px;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
.select /deep/ .el-form-item__label {
	font-size: 8px !important;
	color: #97a8be;
	margin-bottom: 10px;
}
</style>