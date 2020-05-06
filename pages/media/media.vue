<template>
	<view class="font">
		<cmd-nav-bar title="融媒体"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view>
			<uni-grid :options="[
			{image:'../../static/images/media/tv.png',text:'电视'},
			{image:'../../static/images/media/internet.png',text:'网站'},
			{image:'../../static/images/media/blog.png',text:'微博'},
			{image:'../../static/images/media/weChat.png',text:'微信'}]"
			 column-num="2" type="oblong" showBorder="true"
			 @click="clickEvent"></uni-grid>
		</view>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components:{
			uniGrid,
			cmdNavBar
		},
		methods: {
			clickEvent(val){
				let caseVal = val.index;
				switch(caseVal){
					case 0:
						uni.navigateTo({  url:'/pages/media/television'	}) ;
						break;
					case 1:
						uni.showToast({
							title:'业务正在开发中...',
							icon:'none'
						}) ;
						break;
					case 2:
						uni.showToast({
							title:'业务正在开发中...',
							icon:'none'
						}) ;
						break;
					case 3:
						uni.showToast({
							title:'业务正在开发中...',
							icon:'none'
						}) ;
						break;
					default :
						break;
				}
			}
		}
	}
</script>

<style>
	.font{
		color: #333333;
	}
	.divReplace{
		height: 132upx;
		background-color:#F2F6F8;
		margin-bottom: 20upx;
	}
</style>
