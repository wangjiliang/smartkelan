<template>
	<view class="container">
		<cmd-nav-bar back title="意见反馈"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view class="content-box">
			<textarea class="content" maxlength="-1" v-model="feedback" placeholder="请输入遇到的问题或建议..." />
			<view>
				<view v-if="imgList.length>0">
					<image v-for="(item,index) in imgList" :src="item" :key="index" mode="aspectFit" @click.stop="deleteImg(index)"></image>
				</view>
				<image src="../../static/images/img_add.png" mode="aspectFit" @click="addImage"></image>
			</view>
			<input type="text" style="margin-top:20upx" placeholder="添加图片说明" v-model="explain"/>
		</view>
		<view class="footer">
			<button class="default-btn" @click="submitFeedback">提交</button>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '../../static/js/image-tools/index.js'
	import cmdNavBar from '@/components/cmd-nav-bar/cmd-nav-bar.vue'
	export default {
		components: {
			cmdNavBar
		},
		data() {
			return {
				userinfo:'',
				feedback: '',//意见反馈
				explain:'',//图片说明
				imgList:[], //图片列表
				base64Img:''
			}
		},
		onShow() {
			uni.getStorage({
				key:'userinfo',
				success: (res) => {
					this.userinfo = res.data
				},
				fail: () => {
					this.userinfo = {}
				}
			})
		},
		
		methods: {
			//添加图片
			addImage() {
				uni.chooseImage({
					count:1,
					success: (res) => {
						let imgStr = res.tempFilePaths[0];
						if(this.imgList.length>0){
							this.imgList.splice(0,1);
							this.imgList.push(imgStr);
						}else{
							this.imgList.push(imgStr);
						}
						pathToBase64(imgStr).then(base64 => {
							this.base64Img = base64
						}).catch(error => {
							uni.showToast({
								title:'图片转换失败,重新选择图片',
								icon:'none'
							})
						})
					}
				})
			},
			
			//删除图片
			deleteImg(index){
				this.imgList.splice(index,1);
				this.base64Img = ''
			},
			submitFeedback(){
				if(!this.feedback){
					uni.showToast({
						title:'请填写意见或建议',
						icon:'none'
					})
					return
				}
				if(this.base64Img && !this.explain){
					uni.showToast({
						title:'添加图片说明',
						icon:'none'
					})
					return
				}
				let option = {
					method:'feedback',
					params:{
						feedback:this.feedback,
						explain:this.explain,
						fileUrl:this.imgList[0],
						siteId:125,
						memberRealName:this.userinfo.realName,
						base64Image:this.base64Img
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res)=>{
						if(res.data._Status === 1){
							this.feedback = '';
							this.explain = '';
							this.imgList = [];
							this.base64Img = '';
							uni.navigateTo({
								url:"./feedbackSuccess"
							})
						}else{
							uni.showToast({
								title:res.data._Message,
								icon:'none'
							})
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	page{
		background-color:#F2F6F8;
	}
	.content-box{
		background-color:#fff;
		padding:32upx;
		font-size:28upx;
		.content{
			width:100%;
			height:200upx;
			font-size:28upx;
		}
		view{
			display: flex;
			align-items: center;
			image{
				width:120upx;
				height:120upx;
				margin-right:8upx;
			}
			text{
				color:#666;
				font-size: 28upx;
				margin-left:30upx;
			}
		}
	}
	.footer{
		min-height:calc(100vh - 576upx);
		background-color:#fff;
		margin-top:20upx;
		padding-top:20upx;
		.default-btn{
			margin-top:20upx;
			font-size: 16px
		}
	}
	.divReplace{
		height: 152upx;
	}
</style>
