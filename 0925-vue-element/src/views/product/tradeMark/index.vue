<template>
	<el-card class="demo-card-inline">

		<!-- 按钮 -->
		<el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDiag">添加</el-button>

		<!-- 表格组件 
	data:表格组件将来需要展示的数据--数组类型
	border：是给表格添加边框
	column属性
	label：属性标题
	width：对应列的宽度
	align：标题居中-->
		<el-table style="width:100%" border :data="list">
			<el-table-column type="index" prop="prop" label="序号" width="80px" align="center"></el-table-column>
			<el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
			<el-table-column prop="logoUrl" label="品牌LOGO" width="width" align="center">
				<template slot-scope="{row}">
					<img :src="row.logoUrl" alt style="width:100px;height:100px" />
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width" align="center">
				<template slot-scope="{row}">
					<el-button type="warning" size="mini" icon="el-icon-edit" @click="updatetradeMark(row)">修改
					</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="deletetradeMark(row)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 
	当前第几页、数据总条数、每一页展示条数、连续页数
	:current-page：代表的是当前第几页
	total：代表分页器一共需要展示数据条数
	page-size代表可以设置每一页展示多少条数据
	layout可以实现分页器布局
	pager-count:按钮的数量 如果为9，连续页码是7-->
		<el-pagination style="margin-top:20px;text-align: center" :current-page="5" :page-sizes="[3, 5, 10]"
			:page-size="3" layout=" prev, pager, next, jumper,->,total, sizes" :total="total" background
			:pager-count="9" @current-change="getPageList" @size-change="handleSizechange"></el-pagination>

		<!-- 对话框
	Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator-->
		<el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
			<!-- form表单  :model属性。作用为把表单的数据收集到那个对象身上，将来表单验证，也需要这个属性-->
			<el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
				<el-form-item label="品牌名称" label-width="100px" prop="tmName">
					<el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
				</el-form-item>
				<el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
					<!-- 这里收集数据，不能使用v-model，因为不是表单元素，
				action：设置图片的上传地址
				：on-success可以检测到图片上传成功，图片上传成功，会执行一次
				：before-upload图片上传前，会执行一次-->
					<el-upload :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
						class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false">
						<img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />

						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addorupdateTradeMark">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>

</template>

<script>
export default {
	name: "tradeMark",

	data() {
		return {
			//代表的分页器第几页
			page: 1,
			//当前页数展示数据条数
			limit: 3,
			//总数据条数
			total: 0,
			//列表展示的数据
			list: [],
			// 对话框显示与隐藏
			dialogFormVisible: false,
			//上传的图片
			// imageUrl: "",
			// 收集品牌的信息
			tmForm: {
				//品牌的名字
				tmName: "",
				logoUrl: "",
			},
			//表单验证规则
			rules: {
				tmName: [
					{
						required: true,
						message: "请输入品牌名称",
						trigger: "blur",
					},
					{
						min: 2,
						max: 10,
						message: "长度在 2 到 10 个字符",
						trigger: "change",
					},
				],
				logoUrl: [
					{
						required: true,
						message: "请选择品牌图片",
						trigger: "change",
					},
				],
			},
		};
	},
	//组件挂载完毕发送请求
	mounted() {
		//获取列表数据的方法
		this.getPageList();
	},

	methods: {
		// //获取品牌列表的数据
		// async getPageList(pager = 1) {
		// 	this.page = pager;
		// 	//解构出参数
		// 	const { page, limit } = this;
		// 	//获取品牌列表的接口
		// 	//当你向服务器发请求的时候，这个函数需要带参数，因此老师在data当中初始化两个字段，代表给服务器传递参数
		// 	let result = await this.$API.trademark.reqTradeMarkList(
		// 		page,
		// 		limit
		// 	);
		// 	if (result.code == 200) {
		// 		//分别是展示数据总条数与列表展示的数据
		// 		this.total = result.data.total;
		// 		this.list = result.data.records;
		// 	}
		// },
		//获取品牌列表的数据
		async getPageList(pager = 1) {
			this.page = pager;
			//解构赋值参数
			const { page, limit } = this;
			//当向服务器发送请求的时候，这个函数需要带两个默认参数page和limit
			let result = await this.$api.tradeMark.reqTradeMarkList(
				page,
				limit
			);
			if (result.code == 200) {
				this.total = result.data.total;
				this.list = result.data.records;
			}
		},

		// //改变当前页码
		// changPage(pager) {
		// 	//x修改参数
		// 	this.page = pager;
		// 	this.getPageList();
		// },

		//改变当前页面展示的数据条数
		handleSizechange(limit) {
			//修改参数
			this.limit = limit;
			this.getPageList();
		},

		//添加品牌
		showDiag() {
			// 显示对话框
			this.dialogFormVisible = true;
			//清除数据
			this.tmForm = { tmName: "", logoUrl: "" };
		},

		//修改品牌
		updatetradeMark() {
			// 显示对话框
			this.dialogFormVisible = true;
		},
		// 上传图片相关的回调
		handleAvatarSuccess(res, file) {
			// res:上传成功后返回前端的数据
			//file上传成功后服务器返回前端的数据
			//收集品牌图片的数据，因为将来需要带给服务器
			this.tmForm.logoUrl = res.data;
			console.log(res);
			// this.imageUrl = URL.createObjectURL(file.raw);
		},

		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
		},
		//添加或修改图片
		addorupdateTradeMark() {
			//当全部验证字段通过，再去书写业务逻辑
			this.$refs.ruleForm.validate(async (success) => {
				if (success) {
					this.dialogFormVisible = false;
					//发送请求
					let result =
						await this.$api.tradeMark.reqAddorUpdateTradeMark(
							this.tmForm
						);
					if (result.code == 200) {
						//弹出信息，添加品牌成功、修改品牌成功
						this.$message({
							message: this.tmForm.id
								? "修改品牌成功"
								: "添加品牌成功",
							type: "success",
						});
						//成功后，再次发起请求，获取数据进行展示
						//如果添加品牌，则停留在第一页，修改品牌应该留在当前页面
						this.getPageList(this.tmForm.id ? this.page : 1);
					}
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},

		//修改某一个品牌
		updatetradeMark(row) {
			//row:当前用户选中这个品牌的信息
			//显示对话框
			this.dialogFormVisible = true;
			// 将已有的品牌信息赋值并展示
			//用浅拷贝修改服务器返回的tmForm,这里对于tmForm来说是深拷贝，对于row来说是浅拷贝
			this.tmForm = { ...row }; //相当于this.tmForm=Object.assign({},row)
		},

		//删除某个品牌
		deletetradeMark(row) {
			this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					let result = await this.$api.tradeMark.reqDeleteTradeMark(
						row.id
					);
					//如果删除成功
					if (result.code == 200) {
						this.$message({
							type: "success",
							message: "删除成功!",
						});
						//再次获取列表数据
						this.getPageList(
							this.list.length > 1 ? this.page : this.page - 1
						);
					}
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
	},
};
</script>

<style scoped>
.demo-card-inline {
	margin: 30px;
	padding: 10px;
}

.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>