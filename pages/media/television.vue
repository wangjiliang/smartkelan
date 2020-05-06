<template>
	<view class="video-container">
		<cmd-nav-bar back title="电视"></cmd-nav-bar>
		<view class="divReplace"></view>
		<web-view class="webpage" src="../../hybrid/html/video.html"></web-view>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components:{
			cmdNavBar
		}
	}
</script>

<style lang="scss">
	.divReplace{
		height:122upx;
		background-color: #2C81E7;
	}
	.webpage{
		top:49px;
	}
</style>
