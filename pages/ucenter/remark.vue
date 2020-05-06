<template>
	<view>
		<cmd-nav-bar back title="我的评论"></cmd-nav-bar>
		<view class="divReplace"></view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" :top="92" @refresh="onPulldownReresh">
			<view style="overflow-y: auto;">
				<view class="remark-item" v-for="(item,index) in remarkList" :key="item.id">
					<view class="source">
						<view class="sourceImg">
							<image class="source-icon"  :src="item.logo" mode="aspectFit"></image>
						</view>
						<view class="sourceTxt">{{item.source?item.source : '岢岚测试站点' }}</view>
					</view>
					<view class="ctitle" @click="toDetail(item)">{{item.ctitle}}</view>
					<view class="content">评论: {{item.content}}</view>
					<view class="media-comment">
						<view class="comment-item" @click="showCommentArea(item,index)">
							<image class="comment-icon" :src="commentIcon.message" mode="aspectFit"></image>
							<text class="comment-text">{{item.comments}}</text>
						</view>
						<view class="comment-item" style="margin-left:30upx;" @click="isCollect(item)">
							<image class="comment-icon" :src="item.isFavorite=='Y'?commentIcon.heartRed:commentIcon.heart" mode="aspectFit"></image>
							<text class="comment-text"></text>
						</view>
					</view>
					<view v-if="comments[index].isShow" style="margin-bottom:20upx;">
						<textarea class="comment-area" v-model="comments[index].comment" style="border:1px solid #ccc;"></textarea>
						<text class="comment-btn" @click="postComment(item,index)">发表评论</text>
					</view>
				</view>
			</view>
		</mix-pulldown-refresh>
		<text class="tips" v-if="isShow">暂未发表评论</text>
	</view>
</template>

<script>
	import cmdNavBar from '@/components/cmd-nav-bar/cmd-nav-bar.vue'
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh.vue'
	import {
		friendlyDate
	} from '@/common/util.js';
	export default {
		components: {
			cmdNavBar,
			mixPulldownRefresh
		},
		data() {
			return {
				isShow: false,
				remarkList: [],
				comments: [],
				avatarUrl: '/static/logo.png',
				defaultNewsicon: '/static/images/newsIcon.png',
				user: {
					id: ''
				},
				token: '',
				commentIcon: {
					zhuanfa: '../../static/images/icon/zhuanfa.png',
					message: '../../static/images/icon/message.png',
					heart: '../../static/images/icon/heart.png',
					heartRed: '../../static/images/icon/heart_red.png'
				}
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.user = res.data
					if(this.user.base64){
						this.avatarUrl = this.user.base64
					}else if(this.user.logoFile){
						this.avatarUrl = this.user.logoFile
					}else {
						this.avatarUrl = "../../static/images/noavatar_small.png"
					}
				},
				fail: () => {
					this.avatarUrl = "../../static/images/noavatar_small.png"
				}
			})
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				}
			});
			uni.getStorage({
				key: 'remarkList',
				success: (res) => {
					let list = res.data;
					list.forEach(item =>{
						if(!item.logo){
							this.setNewsLogo(item)
						}
					})
					this.remarkList = list;
					this.remarkList.forEach(item => {
						this.comments.push({
							comment: '',
							isShow: false,
							isFavorite: item.isFavorite
						})
					})
				},
				fail: () => {
					this.getRemarkList();
				}
			});
		},

		methods: {
			getRemarkList() {
				let option = {
					method: 'icommentData',
					params: {
						"userId": this.user.ID,
						"siteID":125,
						"token": this.token,
						"page": "true"
					}
				};
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							uni.removeStorage({
								key: 'remarkList',
								success: function(res) {}
							});
							if (res.data.list.length > 0) {
								let list = [];
								res.data.list.forEach((item) => {
									item.addTime = friendlyDate(item.addTime);
									if (item.logoFile) {
										item.logoFile = this.baseUrl.www + item.logoFile
									}
									this.setNewsLogo(item);
									list.push(item);
									uni.setStorage({
										key: 'remarkList',
										data: list
									});
								})
								
							} else {
								this.isShow = true;
							}
							
							uni.getStorage({
								key: 'remarkList',
								success: (localRes) => {
									this.remarkList = localRes.data;
									this.remarkList.forEach(item => {
										this.comments.push({
											comment: '',
											isShow: false,
											isFavorite: item.isFavorite
										})
									})
								}
							});
						} else {
							uni.showToast({
								title: res.data._Message,
								icon: 'none'
							})
						}
					}
				})
			},
			//文章详情
			toDetail(item) {
				let option = {
					ID: item.relaID,
					addTime: friendlyDate(item.publishDate),
					contentTypeID: item.contentTypeId,
					title: item.ctitle,
					logoFile: item.logoFile,
					source: item.source,
					isFavorite: item.isFavorite
				}
				uni.navigateTo({
					url: '/pages/detail/detail?query=' + JSON.stringify(option)
				});
			},
			//显示评论区
			showCommentArea(item, index) {
				this.comments[index].isShow = !this.comments[index].isShow
			},
			//发表评论
			postComment(item, index) {
				let option = {
					method: 'comment',
					params: {
						"score": 11,
						"token": this.token,
						"userid": item.userID,
						"contentid": item.relaID,
						"content": this.comments[index].comment
					}
				}
				if (this.comments[index].comment) {
					uni.request({
						url: this.baseUrl.url,
						method: this.baseUrl.method,
						data: Object.assign(option, this.baseUrl.data),
						success: (res) => {
							if (res.data._Status == 1) {
								uni.showToast({
									title: "评论发表成功",
									icon: "none"
								});
								this.comments[index].isShow = false;
								this.comments[index].comment = ''
							} else {
								uni.showToast({
									title: "评论发表失败",
									icon: "none"
								});
							}
						}
					})
				} else {
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none"
					})
				}
			},
			//是否收藏
			isCollect(item, index) {
				if (item.isFavorite == "Y") {
					this.cancelCollect(item, index)
				} else if (item.isFavorite == "N") {
					this.addCollection(item, index)
				}
			},
			//收藏
			addCollection(item, index) {
				let option = {
					method: 'favoriteAddAPIMethod',
					params: {
						"token": this.token,
						"memberId": item.userID,
						"contentId": item.relaID
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							uni.showToast({
								title: "收藏成功",
								icon: "none"
							});
							// this.comments[index].isFavorite = "Y";
							this.getRemarkList()
						}
					}
				})
			},
			//取消收藏
			cancelCollect(item, index) {
				let option = {
					method: 'favoriteCancelAPIMethod',
					params: {
						"token": this.token,
						"memberId": item.userID,
						"contentId": item.relaID
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							uni.showToast({
								title: "取消收藏",
								icon: "none"
							});
							this.getRemarkList()
						}
					}
				})
			},
			//转发
			transpond() {
				uni.showToast({
					title: "暂未开通转发功能",
					icon: "none"
				})
			},
			//下拉刷新
			onPulldownReresh() {
				this.getRemarkList();
				setTimeout(() => {
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				}, 1000)
			},
			setNewsLogo(obj) {
				switch (obj.source) {
					case '新华网':
						obj.logo = "../../static/images/newspaper/xinhua.png";
						break;
					case '人民网':
						obj.logo = "../../static/images/newspaper/people.png";
						break;
					case '政府网':
						obj.logo = "../../static/images/newspaper/gov.png";
						break;
					case '山西晚报':
						obj.logo = "../../static/images/newspaper/sxwb.png";
						break;
					case '山西日报':
						obj.logo = "../../static/images/newspaper/sxrb.png";
						break;
					case '新京报':
						obj.logo = "../../static/images/newspaper/xinjing.png";
						break;
					case '央视':
						obj.logo = "../../static/images/newspaper/cctv.png";
						break;
					case '山西新闻网':
						obj.logo = "../../static/images/newspaper/sxnews.png";
						break;
					case '北京青年报':
						obj.logo = "../../static/images/newspaper/bjyouth.png";
						break;
					case '澎湃新闻':
						obj.logo = "../../static/images/newspaper/pengpai.png";
						break;
					case '环球时报':
						obj.logo = "../../static/images/newspaper/huaqiushibao.png";
						break;
					case '一财网':
						obj.logo = "../../static/images/newspaper/yicai.png";
						break;
					case '央广网':
						obj.logo = "../../static/images/newspaper/ygw.png";
						break;
					case '环球网':
						obj.logo = "../../static/images/newspaper/huaqiu.png";
						break;
					case '观察者网':
						obj.logo = "../../static/images/newspaper/guancha.png";
						break;
					case '海外网':
						obj.logo = "../../static/images/newspaper/haiwai.png";
						break;
					case '国际在线':
						obj.logo = "../../static/images/newspaper/online.png";
						break;
					case '中央纪委国家监委网站':
						obj.logo = "../../static/images/newspaper/jijian.png";
						break;
					case '中国新闻网':
						obj.logo = "../../static/images/newspaper/chinanews.png";
						break;
					case '新华国际':
						obj.logo = "../../static/images/newspaper/xinhuagj.png";
						break;
					case '参考消息':
						obj.logo = "../../static/images/newspaper/cankao.png";
						break;
					default:
						obj.logo = "../../static/logo.png";
						break;
				}
			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #F2F6F8;
	}
	.mix-refresh-content{
		top:64upx;
	}
	.tips {
		color: #666666;
		font-size: 30upx;
		display: block;
		text-align: center;
		margin: 40upx;
	}

	.remark-item {
		display: flex;
		flex-direction: column;
		padding: 0 32upx;
		margin: 20upx 0;
		background: #fff;

		.source {
			padding: 0 20upx;
			padding-top: 20upx;
			color: #666666;
			font-size: 26upx;
			display: flex;
			
			.sourceImg{
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				margin-right: 10upx;
				overflow: hidden;
				.source-icon{
					width: 100%;
					height: 100%;
				}
			}
			.sourceTxt{
				line-height: 2.4;
			}
		}
		.ctitle{
			font-size: 32upx;
			font-weight: 600;
			padding: 20upx 20upx 0 20upx;
			color: #333;
			font-weight:600; 
		}
		.content {
			font-size: 28upx;
			padding:20upx;
			color: #333;
		
		}
		
		.media-comment {
			display: flex;
			justify-content: flex-end;
			padding: 20upx;
			padding-top: 0;
		
			.comment-item {
				display: flex;
		
				.comment-icon {
					width: 36upx;
					height: 36upx;
				}
		
				.comment-text {
					font-size: 28upx;
					color: #999999;
					margin-left: 4upx;
				}
			}
		}
		
	}

	.divReplace {
		height: 92upx;
	}
	
	
</style>
