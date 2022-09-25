<template>
	<div>
		<el-form :inline="true" class="demo-form-inline" :model="cForm">
			<el-form-item label="一级分类">
				<el-select
					placeholder="一级分类"
					value
					v-model="cForm.cate1id"
					@change="handel(2)"
					:disabled="show"
				>
					<el-option :label="cate.name" :value="cate.id" v-for="(cate) in categroy1" :key="cate.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="二级分类">
				<el-select
					placeholder="二级分类"
					value
					v-model="cForm.cate2id"
					@change="handel(3)"
					:disabled="show"
				>
					<el-option :label="cate2.name" :value="cate2.id" v-for="(cate2) in categroy2" :key="cate2.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="三级分类">
				<el-select
					placeholder="三级分类"
					value
					v-model="cForm.cate3id"
					@change="handel(4)"
					:disabled="show"
				>
					<el-option :label="cate3.name" :value="cate3.id" v-for="(cate3) in categroy3" :key="cate3.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
export default {
	name: "categorySelect",
	components: {},
	mixins: [],
	props: ["show"],
	data() {
		return {
			//一级分类
			categroy1: [],
			//二级分类
			categroy2: [],
			//二级分类
			categroy3: [],
			// 收集表单数据的id
			cForm: {
				cate1id: "",
				cate2id: "",
				cate3id: "",
			},
		};
	},
	computed: {},
	watch: {},
	mounted() {
		this.handel(1);
	},
	methods: {
		//触发分类
		async handel(num) {
			const { cate1id, cate2id, cate3id } = this.cForm;
			if (num == 1) {
				let result1 = await this.$api.Attr.reqCategroy1Id();
				if (result1.code == 200) {
					this.categroy1 = result1.data;
				}
			} else if (num == 2) {
				//每次一级分类数据变化就清空二级分类的数据
				//当一级分类数据发生变化时，清空二级、三级的数据
				this.categroy2 = [];
				this.categroy3 = [];
				this.cForm.cate2id = "";
				this.cForm.cate3id = "";

				let result2 = await this.$api.Attr.reqCategroy2Id(cate1id);
				if (result2.code == 200) {
					this.categroy2 = result2.data;
				}
			} else if (num == 3) {
				//当一级分类数据发生变化时，清空二级、三级的数据
				this.categroy3 = [];
				this.cForm.cate3id = "";

				let result3 = await this.$api.Attr.reqCategroy3Id(cate2id);
				if (result3.code == 200) {
					this.categroy3 = result3.data;
				}
			} else {
				//触发自定义事件获取attrlist
				this.$emit("getattrList", { cate1id, cate2id, cate3id });
				//向父组件spu传cate3id
				this.$emit("pass3Id", { cate1id, cate2id, cate3id });
			}
		},
	},
};
</script>
<style lang='less' scoped>
.demo-form-inline {
	display: flex;
	justify-content: space-around;
	align-items: center;
}
</style>