<template>
	<view class="container">
		<cmd-nav-bar back title="意见反馈"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view class="header">
			<image class="success-icon" src="../../static/images/success.png" mode="aspectFit"></image>
			<text class="text">意见提交成功</text>
		</view>
		<text class="tips">工作人员将会在第一时间评估处理，感谢您的反馈。</text>
		<button class="default-btn" @click="backtoHome">返回首页</button>
	</view>
</template>

<script>
	import cmdNavBar from '@/components/cmd-nav-bar/cmd-nav-bar.vue'
	export default {
		components:{
			cmdNavBar
		},
		methods: {
			backtoHome() {
				uni.switchTab({
					url:'./ucenter'
				})
			}
		},
	}
</script>

<style lang="scss">
	page{
		background:#fff;
	}
	.header{
		background: #2C81E7;
		height:360upx;
		color: #fff;
		font-size: 30upx;
		.success-icon {
			width:192upx;
			height:129upx;
			margin-top:100upx;
			margin-left:50%;
			transform: translateX(-50%);
		}
		.text{
			display: block;
			text-align: center;
		}
	}
	.tips{
		color:#666666;
		font-size:28upx;
		display: block;
		text-align: center;
		padding-top:22upx;
		padding-bottom:36upx;
	}
	.divReplace{
		height: 90upx;
	}
</style>
