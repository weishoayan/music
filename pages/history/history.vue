<template>
	<view>
		<!-- {{ JSON.stringify(history[0].detail) }} -->
		<ul>
			<li @click="a(item)" v-for="(item, i) in history" :key="i">{{ item.detail.songs[0].name }}</li>
		</ul>
	</view>
</template>

<script>
	import Vuex from 'vuex'
	export default {
		computed: {
			...Vuex.mapState(['history'])
		},
		methods: {
			...Vuex.mapMutations(['setsrc', 'setdetail', 'setlrc']),
			a(item) {
				this.setsrc(item.src)
				this.setdetail(item.detail)
				this.setlrc(item.lrc)
			}
		}
	}
</script>

<style>
</style>
