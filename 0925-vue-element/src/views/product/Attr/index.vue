<template>
	<div>
		<el-card class="demo-card-inline">
			<categorySelect @getattrList="getattrList" :show="!showAttr"></categorySelect>
		</el-card>

		<el-card class="demo-card-inline" v-show="showAttr">
			<el-button
				type="primary"
				round
				icon="el-icon-plus"
				@click="changeShow(1)"
				:disabled="!cate3id"
			>添加属性</el-button>
			<!-- 表单部分 -->
			<el-table style="width: 100%;margin-top: 20px;" border :data="attrList">
				<el-table-column prop="date" label="序号" width="80" align="center" type="index"></el-table-column>
				<el-table-column prop="attrName" label="属性名称" width="120" align="center"></el-table-column>
				<el-table-column prop="name" label="属性值列表" width="width" align="center">
					<template slot-scope="{row}">
						<el-tag
							type="success"
							v-for="(attr) in row.attrValueList"
							:key="attr.id"
							style="margin-left:15px;"
						>{{attr.valueName}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="操作" width="120" align="center">
					<template slot-scope="{row}">
						<el-button
							type="primary"
							icon="el-icon-edit"
							circle
							@click="updateAttr(row)"
							style="margin:0 5px;"
						></el-button>
						<el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteattr(row)">
							<el-button type="danger" circle icon="el-icon-delete" slot="reference"></el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-card class="demo-card-inline" v-show="!showAttr">
			<el-form label-width="80px">
				<el-form-item label="属性名称">
					<el-input style="width:180px" v-model="attrInfo.attrName"></el-input>
				</el-form-item>
			</el-form>

			<el-button type="primary" round icon="el-icon-plus" @click="addAttrvalue">添加属性</el-button>
			<el-button round @click="changeShow">取消</el-button>
			<el-table style="width: 100%;margin: 20px 0;" border :data="attrInfo.attrValueList">
				<el-table-column prop="date" label="序号" width="80" align="center" type="index"></el-table-column>
				<el-table-column prop="valueName" label="属性值名称" width="width" align="center">
					<template slot-scope="{row,$index}">
						<!-- -->
						<!--  -->
						<!---->
						<!--  -->
						<el-input
							v-if="row.flag"
							v-model="row.valueName"
							placeholder="请输入属性值名称"
							size="mini"
							@blur="toLook(row,$index)"
							:ref="$index"
							@keyup.native.enter="toLook(row)"
						></el-input>
						<span v-else style="display:block;" @click="toEdit(row,$index)">{{row.valueName}}</span>
						<!--  -->
					</template>
				</el-table-column>
				<el-table-column prop="prop" label="操作" width="80" align="center">
					<template slot-scope="{row,$index}">
						<el-popconfirm title="确定删除该属性值吗？" @onConfirm="deleteattrvalue(row,$index)">
							<el-button type="danger" circle icon="el-icon-delete" slot="reference"></el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" round @click="addorUpdateattr">保存</el-button>
			<el-button round @click="changeShow">取消</el-button>
		</el-card>
	</div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
export default {
	name: "attrVue",
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			attrList: [],
			//控制添加属性页面的隐藏与显示
			showAttr: true,
			//用来存储attrList里的每个对象
			attrInfo: {
				attrName: "",
				attrValueList: [],
				categoryId: "",
				categoryLevel: "",
				// flag: true,
			},
			cate1id: "",
			cate2id: "",
			cate3id: "",
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {
		async getattrList({ cate1id, cate2id, cate3id }) {
			this.cate1id = cate1id;
			this.cate2id = cate2id;
			this.cate3id = cate3id;
			let result = await this.$api.Attr.reqattrInfoList(
				cate1id,
				cate2id,
				cate3id
			);

			if (result.code == 200) {
				this.attrList = result.data;
			}
		},
		//添加属性跳转attr
		changeShow() {
			//每次添加新属性置空attrInfo里的attrName和attrValueList
			this.attrInfo = {
				attrName: "",
				attrValueList: [],
				categoryId: this.cate3id, //三级分类id
				categoryLevel: 3, //因为服务器也需要区分几级id
				// flag: true,
			};

			this.showAttr = !this.showAttr;
			//如果是通过点击添加属性切换进来的
		},

		//新增属性
		addAttrvalue() {
			//这里的操作，如果没有对row-attrInfo进行深拷贝，是会影响到row的数据的
			this.attrInfo.attrValueList.push({
				//相应属性的id这里把this.attrInfo.id给attrid是针对修改属性按钮时的
				//如果仅仅是对新增属性而言，那么this.attrInfo.id是不存在的，即依然为undefined
				attrId: this.attrInfo.id,
				valueName: "",
				//flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
				// 当前的flag属性，响应式数据，数据变化视图跟着变化
				flag: true,
			});

			//自动聚焦
			this.$nextTick(() => {
				this.$refs[this.attrInfo.attrValueList.length - 1].focus();
			});
			//编辑内容不能为空
		},
		//更改attr
		updateAttr(row) {
			this.showAttr = !this.showAttr;
			//在这里要进行一下深拷贝，否则后续改动attrInfo之后都会影响到row,row是服务器返回的数据，也是列表展示要用到的数据，不能随意改动
			this.attrInfo = cloneDeep(row);
		},
		//查看属性值列表

		toLook(row, $index) {
			// console.log(row);
			if (row.valueName.trim() == "") {
				this.$message("输入内容不能为空!");
				this.$nextTick(() => {
					this.$refs[$index].focus();
				});
				return;
			} else {
				row.flag = false;
			}
		},

		//编辑属性值列表
		toEdit(row, $index) {
			this.$set(row, "flag", true);
			//点击编辑属性值输入框自动聚焦
			this.$nextTick(() => {
				//$refs取到的是全部的input框，要加上具体的索引值才能取到被点击的那个input框
				this.$refs[$index].focus();
			});
		},
		//向服务器上传新增或修改的属性
		async addorUpdateattr() {
			// 			{
			//   "attrName": "string",
			//   "attrValueList": [
			//     {
			//       "attrId": 0,
			//       "id": 0,
			//       "valueName": "string"
			//     }
			//   ],
			//   "categoryId": 0,
			//   "categoryLevel": 0,
			//   "id": 0
			// }
			let result = await this.$api.Attr.reqaddOrupdateAttr(this.attrInfo);
			if (result.code == 200) {
				// 结构赋值得到的id
				const { cate1id, cate2id, cate3id } = this;
				//修改数据后发送请求
				this.getattrList({ cate1id, cate2id, cate3id });
				//保存提交到服务器数据后返回显示属性的页面
				this.showAttr = !this.showAttr;
			}
		},
		//删除某个属性值
		async deleteattr(row) {
			let result = await this.$api.Attr.reqdeleteAttrvalue(row.id);
			if (result.code == 200) {
				this.$message({ type: "success", message: "已删除该属性" });
				// 结构赋值得到的id
				const { cate1id, cate2id, cate3id } = this;
				//修改数据后发送请求
				this.getattrList({ cate1id, cate2id, cate3id });
			}
		},
		//删除某个属性值
		deleteattrvalue(row, $index) {
			this.attrInfo.attrValueList.splice($index, 1);
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