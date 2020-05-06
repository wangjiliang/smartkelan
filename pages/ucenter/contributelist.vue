<template>
	<view class="container">
		<cmd-nav-bar back title="我的投稿" rightText="发布投稿" @rightText="toContribute"></cmd-nav-bar>
		<view class="divReplace"></view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" :top="92" @refresh="onPulldownReresh">
			<view class="list" v-for=" item in contributeList" :key="item.addTime">
				<text class="catlog">{{item.catalogName}}</text>
				<view class="item">
					<text class="title">{{item.title}}</text>
					<rich-text class="content" :nodes="item.bodyText"></rich-text>
				</view>
			</view>
		</mix-pulldown-refresh>
		<text class="tips" v-if="isShow">暂未发布投稿</text>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh.vue'
	export default {
		components:{
			cmdNavBar,
			mixPulldownRefresh
		},
		data() {
			return {
				memberId:'',
				token:'',
				contributeList:[],
				isShow:false
			}
		},
		onLoad() {
			uni.getStorage({
				key:'userinfo',
				success: (res) => {
					this.memberId = res.data.ID;
				}
			});
			uni.getStorage({
				key:'token',
				success: (res) => {
					this.token = res.data;
				}
			});
			uni.getStorage({
				key:"contributes",
				success: (res) => {
					this.contributeList = res.data;
					if(this.contributeList.length < 1){
						this.isShow = true
					}
				},
				fail: () => {
					this.getList();
				}
			});
		},
		methods: {
			//下拉刷新
			onPulldownReresh(){
				this.getList();
				setTimeout(() => {
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				},1000)
			},
			toContribute(){
				uni.navigateTo({
					url:'./contribute'
				})
			},
			getList(){
				let option = {
					method:'contribute',
					params:{
						"token":this.token,
						"memberId":this.memberId,
						"siteId":"125"
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res)=>{
						if(res.data._Status == 1){
							uni.removeStorage({	key: 'contributes' });
							uni.setStorage({
								key:"contributes",
								data:res.data.list
							});
							uni.getStorage({
								key:"contributes",
								success: (localRes) => {
									this.contributeList = localRes.data;
									if(this.contributeList.length < 1){
										this.isShow = true
									}
								}
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background-color: #F2F6F8;}
	.mix-refresh-content{
		top:50upx;
	}
	.container{
		.tips {
			color: #666666;
			font-size: 30upx;
			display: block;
			text-align: center;
			margin: 40upx;
		}
		.list{
			background-color: #fff;
			margin-top:20upx;
			padding:0 36upx;
			.catlog{
				display: block;
				text-align:right;
				font-size:28upx;
				color:#999;
				padding-top:10upx;
			}
			.item{
				padding-bottom:12upx;
				.title{
					display: block;
					font-size:32upx;
					line-height: 40upx;
					margin-bottom:20upx;
				}
				.content{
					font-size:28upx;
					line-height: 30upx;
				}
			}
		}
	}
	.divReplace{
		height: 100upx;
	}
</style>
