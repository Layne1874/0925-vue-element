<template>
	<div>
		<Card></Card>
		<Sale></Sale>
		<Obeserve></Obeserve>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Card from "@/views/dashboard/Card";
import Sale from "./Sale";
import Obeserve from "./Obeserve";
export default {
	name: "Dashboard",
	computed: {
		...mapGetters(["name"]),
	},
	components: { Card, Sale, Obeserve },
	mounted() {
		this.$store.dispatch("getData");
	},
};
</script>

<style  scoped>

</style>
