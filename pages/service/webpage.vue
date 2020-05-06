<template>
	<view class="webpage">
		<cmd-nav-bar back fixed :title="title"></cmd-nav-bar>
		<web-view class="newsnet" :src="webpage"></web-view>
	</view>
</template>

<script>
	import cmdNavBar from '@/components/cmd-nav-bar/cmd-nav-bar.vue'
	export default {
		components:{
			cmdNavBar
		},
		data() {
			return {
				title:'',
				webpage:''
			}
		},
		onLoad(query) {
			this.title = query.title
			this.webpage = query.webpage
		}
	}
</script>

<style>
	.webpage{
		position: relative;
		padding-top: 92upx;
	}
	.newsnet{
		position:absolute;
		top:49px;
		z-index: 1;
	}
</style>
