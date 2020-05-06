<template>
	<view>
		<view class="container">
			<textarea class="explain" v-model="explains" placeholder="请添加你的描述" placeholder-style="color:#AEAEAC;" />
			<video class="icon"  :src="filepath" ></video>
		</view>
		<button class="alarm-btn">一键报警</button>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '../../static/js/image-tools/index.js'
	export default {
		data(){
			return {
				explains:'',
				filepath:'../../static/face.jpg'
			}
		},
		onLoad(option) {
			this.filepath = option.filepath;
			pathToBase64(this.filepath).then(base64 => {
				// this.base64Img = base64
			}).catch(error => {
				uni.showToast({
					title:'图片转换失败,重新选择图片',
					icon:'none'
				})
			})
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#151923;
	}
	.container{
		margin-top:40upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		.explain{
			width:66%;
			color:#fff;
			display: inline-block;
			padding:18upx;
			box-sizing: border-box;
		}
		.icon{
			width:30%;
			max-height: 300upx;
		}
	}
	.alarm-btn{
		width:66%;
		height:72upx;
		line-height: 72upx;
		color:#fff;
		font-size: 32upx;
		position:fixed;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		background-color:#EA061C;
		border-radius: 12upx;
	}
</style>
