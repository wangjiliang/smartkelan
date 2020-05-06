<template>
	<view class="container">
		<cmd-nav-bar back title="我的收藏"></cmd-nav-bar>
		<view class="divReplace"></view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" :top="92" @refresh="onPulldownReresh">
			<view class="favorite" :class="index == 0 ? 'first' : '' " v-for="(item,index) in favorites" :key="item.favoritesID">
				<view class="source">
					<image class="source-icon" style="width:20px;height:20px;" :src="item.logo" mode="aspectFit"></image>
					<text class="source-name">{{item.source?item.source : '岢岚测试站点' }}</text>
				</view>
				<view>
					<text class="title" @click="toDetail(item)">{{item.title}}</text>
					<image v-if="item.logoFile" class="img1" :src="item.logoFile" mode="aspectFit"></image>
					<view class="body" v-html="item.captureText">
						{{item.captureText}}
					</view>
				</view>
				<view class="media-comment">
					<view class="comment-item">
						<image class="comment-icon" :src="commentIcon.eye" mode="aspectFit"></image>
						<text class="comment-text">{{item.hitCount}}</text>
					</view>
					<view class="comment-item" style="margin-left:30upx;" @click="showComment(index)">
						<image class="comment-icon" :src="commentIcon.message" mode="aspectFit"></image>
						<text class="comment-text">{{item.comments}}</text>
					</view>
				</view>
				<view v-if="comments[index].isShow" style="margin-bottom:20upx;min-height: 180upx;">
					<textarea class="comment-area" v-model="comments[index].comment" style="border:1px solid #ccc;"></textarea>
					<text class="comment-btn" @click="makeComments(item,index)">发表评论</text>
				</view>
			</view>
		</mix-pulldown-refresh>
		<text class="tips" v-if="isShow">暂未添加收藏</text>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh.vue'
	import { friendlyDate } from '@/common/util.js'
	export default {
		components: {
			cmdNavBar,
			mixPulldownRefresh
		},
		data() {
			return {
				token: '',
				user: {
					id: ''
				},
				favorites: [],
				commentIcon: {
					eye: '../../static/images/icon/eye.png',
					message: '../../static/images/icon/message.png'
				},
				comments: [],
				isShow:false
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.user = res.data
				}
			});

			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				}
			});
			
			uni.getStorage({
				key:'favorites',
				success: (res) => {
					let list = res.data
					list.forEach(item => {
						if(!item.logo){
							this.setNewsLogo(item)
						}
					})
					this.favorites = list;
					this.favorites.forEach( item => {
						this.comments.push({
							comment: '',
							isShow: false
						})
					});
					if(this.favorites.length < 1 ){
						this.isShow = true
					}
				},
				fail: () => {
					this.getFavorite();
				}
			})
		},
		methods: {
			//下拉刷新
			onPulldownReresh(){
				this.getFavorite();
				setTimeout(() => {
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				},1500)
			},
			getFavorite() {
				let options = {
					method: 'favorite',
					params: {
						"memberId": this.user.ID,
						"token": this.token,
						"page": "true"
					}
				};
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(options, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							uni.removeStorage({
								key: 'favorites',
								success: function(res) {}
							});
							let favorites = [];
							if (res.data.list.length > 0) {
								res.data.list.forEach((item) => {
									if(item.logoFile){
										item.logoFile = this.baseUrl.www + item.logoFile
									}
									this.setNewsLogo(item);
									if (item.captureText && item.captureText.length > 80) {
										item.captureText = item.captureText.substring(0, 60) + '...'
									}
									favorites.push(item);
								})
								uni.setStorage({
									key: 'favorites',
									data: favorites
								});
							}
							uni.getStorage({
								key:'favorites',
								success: (localRes) => {
									this.favorites = localRes.data;
									this.favorites.forEach( item => {
										this.comments.push({
											comment: '',
											isShow: false
										})
									});
									if(this.favorites.length < 1 ){
										this.isShow = true
									}
								}
							})
						} 
					}
				})
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
			},
			toDetail(option) {
				let detail = {
					ID: option.favoritesID,
					addTime: friendlyDate(option.publishDate),
					contentTypeID: option.contentTypeId,
					title: option.title,
					logoFile: option.logoFile,
					source: option.source,
					isFavorite: "Y"
				}
				uni.navigateTo({
					url: '/pages/detail/detail?query=' + JSON.stringify(detail)
				});
			},
			//显示评论区
			showComment(index) {
				this.comments[index].isShow = !this.comments[index].isShow
			},
			//发表评论
			makeComments(params, index) {
				let option = {
					method: 'comment',
					params: {
						"score": 11,
						"token": this.token,
						"userid": params.memberID,
						"contentid": params.favoritesID,
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
								this.comments[index].comment = '';
								this.getFavorite()
							} else {
								uni.showToast({
									title: res.data._Message,
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F6F8;
	}
	.mix-refresh-content{
		top:72upx;
	}
	.container {
		.tips {
			color: #666666;
			font-size: 30upx;
			display: block;
			text-align: center;
			margin: 40upx;
		}
		.favorite.first{
			margin-top:20upx;
		}
		.favorite {
			margin-bottom: 20upx;
			padding: 0 20upx;
			background-color: #FFFFFF;
			.source {
				display: flex;
				padding: 0 20upx;
				padding-top: 20upx;
				align-items: center;
				.source-icon {
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
				}
				.source-name {
					color:#666666;
					font-size: 28upx;
					margin-left: 12upx;
				}
			}

			.title {
				color: #333333;
				font-size: 32upx;
				font-weight: 600;
				padding: 20upx 20upx 0 20upx;
				display: block;
			}

			.img1 {
				display: block;
				width:100%;
				min-height:100upx;
			}

			.body {
				color: #333333;
				font-size: 28upx;
				padding: 0 20upx;
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

			.comment-area {
				width: 96%;
				padding: 12upx;
				height: 80upx;
				border: 1px solid #ccc;
			}

			.comment-btn {
				float: right;
				font-size: 30upx;
				color: #666666;
				margin: 10upx;
			}
		}
	}
	.divReplace{
		height: 82upx;
	}
</style>
