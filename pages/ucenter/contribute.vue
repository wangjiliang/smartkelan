<template>
	<view>
		<cmd-nav-bar back title="我的投稿" @rightText="submitContribute" rightText="发布投稿"></cmd-nav-bar>
		<view class="divReplace"></view>
		<picker @change="bindPickerChange" :value="index" :range="columnList">
			<view class="uni-input">{{columnList[index]}}</view>
		</picker>
		<input class="title" v-model="title" type="text" placeholder="请输入标题" />
		<textarea class="content" v-model="content" placeholder="请输入投稿内容" />
		</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	export default {
		components:{
			cmdNavBar
		},
		data(){
			return {
				columnList:[],
				columnIdList:[],
				index:0,
				title:'',
				content:'',
				memberId:''
			}
		},
		onShow() {
			uni.getStorage({
				key:'userinfo',
				success: (res) => {
					this.memberId = res.data.ID;
				}
			});
		},
		onLoad(){
			this.getLanmu();
		},
		
		methods:{
			//获取栏目
			getLanmu(){
				let option = {
					method:'contributeCatalog',
					params:{
						"siteid":"125",
						"page":"true"
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res)=>{
						if(res.data._Status == 1){
							res.data.list.forEach(item =>{
								this.columnList.push(item.name)
								this.columnIdList.push(item.ID)
							})
						}
					}
				})
			},
			bindPickerChange(e){
				this.index = e.target.value
			},
			//提交
			submitContribute(){
				if(!this.title){
					uni.showToast({
						title:'请输入标题',
						icon:'none'
					})
					return
				}
				if(!this.content){
					uni.showToast({
						title:'投稿内容不能为空',
						icon:'none'
					});
					return
				}
				let option = {
					method:'memberContributeAdd',
					params:{
						title:this.title,
						content:this.content,
						catalogid:this.columnIdList[this.index],
						memberId:this.memberId
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res)=>{
						if(res.data._Status === 1){
							this.title = '',
							this.content = '',
							uni.showToast({
								title:res.data._Message
							})
						}else{
							uni.showToast({
								title:res.data._Message,
								icon:'none'
							})
						}
					}
				})
			},
		}
	}
</script>

<style>
	.uni-input{
		width:90%;
		height:80upx;
		line-height: 80upx;
		text-align: center;
		font-size:32upx;
		margin:12upx 5%;
		background-color: #F2F6F8;
		border:1px solid #CCCCCC;
		border-radius: 10upx;
		color: #333;
	}

	.title,.content{
		width:90%;
		padding:0 5%;
		font-size:32upx;
		border-top:1px solid #CCCCCC;
		border-bottom: 1px solid #CCCCCC;
		
	}
	.title{
		height:80upx;
	}
	.content{
		border-top: none;
		padding-top:12upx;
	}
	.divReplace{
		height: 152upx;
		margin-bottom: 20upx;
	}
</style>
