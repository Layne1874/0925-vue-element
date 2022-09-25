<template>
	<div>
		<el-card class="demo-card-inline">
			<el-form ref="form" label-width="80px">
				<el-form-item label="SPU名称">
					<el-input v-model="updateSpu.spuName"></el-input>
				</el-form-item>

				<el-form-item label="品牌">
					<el-select placeholder="请选择品牌" value v-model="updateSpu.tmId">
						<el-option
							:label="trad.tmName"
							:value="trad.id"
							v-for="(trad) in trademarkList"
							:key="trad.id"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="spu描述">
					<el-input type="textarea" placeholder="spu描述" rows="4" v-model="updateSpu.description"></el-input>
				</el-form-item>

				<el-form-item label="上传照片">
					<!-- 
					-->
					<el-upload
						action="/dev-api/admin/product/fileUpload"
						:file-list="spuImageList"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handlepostSuccess"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<!--  -->
						<img width="100%" :src="dialogImageUrl" alt />
						<!--  -->
					</el-dialog>
				</el-form-item>

				<el-form-item label="销售属性">
					<el-select
						:placeholder="`选择销售属性`"
						style="margin:0 20px 20px 0;"
						value
						v-model="attrIdAndAttrName"
					>
						<el-option
							:label="sale.name"
							:value="`${sale.id}:${sale.name}`"
							v-for="(sale) in saleValue"
							:key="sale.id"
						></el-option>
					</el-select>
					<el-button
						type="primary"
						icon="el-icon-plus"
						round
						style="margin-left: 20px;"
						@click="addSalevalue"
					>添加销售属性</el-button>
				</el-form-item>

				<el-form-item>
					<el-table border :data="updateSpu.spuSaleAttrList">
						<el-table-column prop="prop" label="序号" type="index" align="center" width="120"></el-table-column>
						<el-table-column prop="saleAttrName" label="属性名" align="center" width="width"></el-table-column>
						<el-table-column prop="prop" label="属性值列表" align="center" width="width">
							<template slot-scope="{row,$index}">
								<el-tag
									type="success"
									v-for="(tag,index) in row.spuSaleAttrValueList"
									:key="index"
									style="margin: 0 5px;"
									closable
									:disable-transitions="false"
									@close="removeTag(row,index)"
								>{{tag.saleAttrValueName}}</el-tag>
								<!--  -->
								<el-input
									class="input-new-tag"
									v-if="row.flag"
									v-model="row.inputValue"
									ref="saveTagInput"
									size="small"
									@blur="handleInputConfirm(row)"
									@keyup.enter.native="$event.target.blur"
								></el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(row,$index)">添加</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="prop" label="操作" align="center" width="width">
							<template slot-scope="{row,$index}">
								<el-button type="danger" icon="el-icon-delete" circle @click="deleterow(row,$index)"></el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" round @click="updateoraddSpu">保存</el-button>
					<el-button round @click="backSpu">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";

export default {
	name: "spuForm",
	components: {},
	mixins: [],
	props: [],
	data() {
		return {
			//要上传到服务器的spu
			updateSpu: {
				category3Id: 0,
				description: "",
				spuName: "",
				id: 0,
				spuImageList: [
					{
						id: 0,
						imgName: "",
						imgUrl: "",
						spuId: 0,
					},
				],
				spuSaleAttrList: [
					{
						baseSaleAttrId: 0,
						id: 0,
						saleAttrName: "",
						spuId: 0,
						spuSaleAttrValueList: [
							{
								baseSaleAttrId: 0,
								id: 0,
								isChecked: "",
								saleAttrName: "",
								saleAttrValueName: "",
								spuId: 0,
							},
						],
					},
				],
				tmId: "",
			},

			//存储品牌数据列表
			trademarkList: [],

			//品牌名称
			tmName: "",
			//存储销售属性的数据
			saleValue: [],

			//存储spu图片的数据
			spuImageList: [],

			//跟预览图片相关 数据
			dialogImageUrl: "",
			dialogVisible: false,

			//用来绑定销售属性id和name
			attrIdAndAttrName: "",

			//销售属性列表
			saleList: [],

			//跟tag标签有关的数据
			inputVisible: false,
			inputValue: "",
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {
		//取消添加spu||返回展示spu数据的主页面
		backSpu() {
			this.$emit("backSpu", 1);
			//置空data
			Object.assign(this._data, this.$options.data());
		},

		//初始化要上传到服务器的spu数据
		async initData(spu) {
			this.getTrademarkList();
			this.getsaleValue();

			let result1 = await this.$api.spu.reqgetSpubyspuId(spu.id);
			if (result1.code == 200) {
				this.updateSpu = result1.data;
			}

			//初始化图片数据
			let result2 = await this.$api.spu.reqgetspuimgList(spu.id);
			if (result2.code == 200) {
				//由于饿了么uI照片墙的显示图片的数据需要数组，即饿了么ui指定数组里面的元素必须要有name和url字段
				//需要把服务器返回的数据进行修改
				let listArr = result2.data;
				listArr.forEach((item) => {
					item.name = item.imgName;
					item.url = item.imgUrl;
				});
				//把整理好 的数据赋值给spuimagelist
				this.spuImageList = listArr;
			}
		},

		//获取品牌数据以及把父组件传过来的category3Id赋值给spuform
		async getTrademarkList(category3Id) {
			this.updateSpu.category3Id = category3Id;
			let result = await this.$api.spu.reqbaseTrademarkList();
			if (result.code == 200) {
				this.trademarkList = result.data;
			}
		},

		//获取基本的销售属性
		async getsaleValue() {
			let result = await this.$api.spu.reqsaleValue();
			if (result.code == 200) {
				this.saleValue = result.data;
			}
		},

		//添加新的销售属性
		addSalevalue() {
			const [baseSaleAttrId, saleAttrName] =
				this.attrIdAndAttrName.split(":");

			let newarr = {
				baseSaleAttrId,
				saleAttrName,
				spuSaleAttrValueList: [],
			};

			let result = this.updateSpu.spuSaleAttrList.every((item) => {
				return item.saleAttrName != newarr.saleAttrName;
			});

			if (!result) {
				this.$message("不能重复添加已有的销售属性");
			} else {
				this.updateSpu.spuSaleAttrList.push(newarr);
			}

			//置空this.attrIdAndAttrName
			this.attrIdAndAttrName = "";
		},

		//预览图片的处理
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.imgUrl;
			this.dialogVisible = true;
		},
		//照片墙删除某个图片时会触发
		handleRemove(file, fileList) {
			// file参数，代表的是删除的那个张图片·
			// fileList:照片墙删除某一张图片以后,剩余其他图片
			// 对于已有的图片,照片墙的显示必须要有这name,url两个属性
			//但对于服务器而言,不需要name,url这两个属性,因此把fileList赋值给spuImageList
			//把删除完的图片列表重新赋值给spuImageList
			this.spuImageList = fileList;
		},
		//上传预览图片成功的回调
		handlepostSuccess(response, file, fileList) {
			//收集图片的信息
			// console.log(response);

			this.spuImageList = fileList;
		},

		showInput(row, $index) {
			// console.log(row);
			//往row放入一个响应式flag，以区分与不同的input
			this.$set(row, "flag", true);
			this.$set(row, "inputValue", "");
			// this.inputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.focus();
			});
		},

		//新增tag的回调
		handleInputConfirm(row) {
			// which用来区分是鼠标离开事件还是回车键弹起事件，防止两个事件发生重复和冲突
			//在input的双向绑定中v-model="row.inputValue"即给每个row都设定了一个inputValue，这样就不会造成多个input框冲突
			const { baseSaleAttrId, inputValue } = row;

			//属性值不能为空
			if (inputValue.trim() == "") {
				this.$message("属性值不能为空!");
				this.$set(row, "flag", false);
				return;
			}
			// 属性值不能重复
			//every()方法会遍历数组的每一项，如果有有一项不满足条件，则表达式返回false,剩余的项将不会再执行检测
			let result = row.spuSaleAttrValueList.every((item) => {
				return item.saleAttrValueName != inputValue;
			});
			if (!result) {
				this.$message("输入的属性值不能重复!");

				return;
			}

			//整理新的对象
			let newObj = { baseSaleAttrId, saleAttrValueName: inputValue };

			//将新增对象push到row.spuSaleAttrValueList形成新tag
			row.spuSaleAttrValueList.push(newObj);

			//将input恢复成tag,且置空inputValue

			row.flag = false;
		},

		//移除某个tag的回调
		removeTag(row, index) {
			// if (row.spuSaleAttrValueList.length <= 1) {
			// 	this.$message("至少要保留一个属性值！");
			// } else {

			// }
			row.spuSaleAttrValueList.splice(index, 1);
		},
		//删除某个spu销售属性，如颜色、版本
		deleterow(row, $index) {
			this.updateSpu.spuSaleAttrList.splice($index, 1);
			// console.log(row == this.updateSpu.spuSaleAttrList[$index]);
		},

		//向服务器更新或添加spu
		async updateoraddSpu() {
			this.updateSpu.spuImageList = this.spuImageList.map((item) => {
				return {
					imgName: item.name,
					// imgUrl: item.url,
					//根据上传图片成功之后的回调函数，fileList中必须有response，否则无法查看图片
					imgUrl: (item.response && item.response.data) || item.url,
				};
			});

			let result = await this.$api.spu.reqAddOrUpdateSpu(this.updateSpu);

			if (result.code == 200) {
				this.$emit("backSpu", 1, "update");
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
</style>