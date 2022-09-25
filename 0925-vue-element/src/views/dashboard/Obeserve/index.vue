<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="12">
				<Search></Search>
			</el-col>
			<el-col :span="12">
				<Categroy></Categroy>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import Search from "./Search";
import Categroy from "./Categroy";

export default {
	name: "obeServe",
	components: { Search, Categroy },
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
<style lang='' scoped>
</style>