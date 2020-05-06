<template>
	<view class="font">
		<cmd-nav-bar back :title="title"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view class="banner">
			<image v-if="banner.logoFile && banner.contentTypeID != 'Video'" class="banner-img" :src="banner.logoFile"></image>
			<view class="banner-title" v-if="banner.contentTypeID == 'Video' ">{{banner.title}}</view>
			<view class="banner-title" v-if="banner.contentTypeID != 'Video' " :class="banner.logoFile ? 'fixed' : '' ">{{banner.title}}</view>
		</view>
		<view class="article-meta" v-if="banner.contentTypeID != 'Special' ">
			<text class="article-author">{{banner.source? banner.source : '岢岚网'}}</text>
			<text class="article-text">发表于</text>
			<text class="article-time">{{banner.addTime}}</text>
		</view>
		<!-- 音频 -->
		<view class="videos" v-if="audios" v-for="audio in audios" :key="audio.id">
			<video :src="audio.path" controls autoplay ></video>
		</view>
		<!-- 文件 -->
		<view class="files" v-if="files">
			<view v-for="file in files">
				<image v-if="file.src" :src="file.src"/>
				<text @click="downloadFile(file)">{{file.oldFileName}}</text>
			</view>
		</view>
		<!-- 图片集 -->
		<view class="swipers" v-if="photos">
			<uni-swiper-dot :info="photos" :current="current" mode="long">
				<swiper class="swiper" @change="change" circular="true" interval="3000">
					<swiper-item v-for="photo in photos" :key="photo.id">
						<view class="swiper-item" style="width:100%;">
							<image class="swiper-img" :src="photo.src" mode="scaleToFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<!-- 专题链接 -->
		<view class="specials" v-if="specials" v-for="special in specials" :key="special.id" @click="toWebpage(special)">
			{{special.path}}
		</view>
		<!-- 视频&视频集 -->
		<view class="videos" v-if="videos" >
			<swiper circular="true" v-if="videos.length>1">
				<swiper-item v-for="video in videos" :key="video.id">
					<video :src="video.path" controls></video>
				</swiper-item>
			</swiper>
			<video v-if="videos.length == 1" :src="videos[0].path" controls autoplay></video>
		</view>
		<!-- 富文本展示区 -->
		<u-parse v-if="content" class="article-content" :content="content" @preview="preview" @navigate="navigate" ></u-parse>
		<!-- 评论列表 -->
		<view class="comList" v-if="commentlist">
			<view class="comItem"  v-for="(item,index) in commentlist">
				<view class="itemImg">
					<image class="img-icon" :src="item.logoFileM ? item.logoFileM : avatarUrl" mode="scaleToFill"></image>
				</view>
				<view class="itemCont">
					<view class="contName">{{item.userName}}</view>
					<view class="contCont">{{item.content}}</view>
					<view class="contTime">{{item.addTime}}</view>
				</view>
			</view>
		</view>
		<view class="commentFoot" v-if="banner.contentTypeID != 'Special' ">
			<view class="comBox">
				<textarea class="comment-area" v-model="comment" placeholder="写评论..." @click="showCommentArea"></textarea>
			</view>
			<view class="tool-bar" v-if="!isShow">
				<view class="tool-item" style="margin-right:60upx;" >
					<image class="comment-icon" :src="commentIcon.message" mode="aspectFit"></image>
					<text>评论</text>
				</view>
				<view class="tool-item" @tap="isCollect">
					<image class="comment-icon" :src=" banner.isFavorite == 'Y' ? commentIcon.heartRed : commentIcon.heart" mode="aspectFit"></image>
					<text>收藏</text>
				</view>
			</view>
			<view class="comment-btn" v-if="isShow" @click="postComment">
				发表评论
			</view>
		</view>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
	import uParse from '@/components/u-parse/u-parse.vue'
	
	import { friendlyDate} from '@/common/util.js';
	
	const FAIL_CONTENT = '<p>获取信息失败</p>';
	export default {
		components: {
			cmdNavBar,
			uniSwiperDot,
			uParse
		},
		data() {
			return {
				banner: {},
				title: '',
				content: '',
				videoPath: '',
				isFavorite: '',
				token: '',
				userID: '',
				commentInfo:{},
				commentlist: null,
				avatarUrl: '../../static/images/noavatar_small.png', //用户头像
				isShow: false,
				comment: '',
				commentIcon: {
					message: '../../static/images/icon/message.png',
					heart: '../../static/images/icon/heart.png',
					heartRed: '../../static/images/icon/heart_red.png'
				},
				files: null,
				videos: null,
				audios: null,
				photos: null,
				specials: null,
				current: 0
			}
		},
		onLoad(options) {
			this.banner = JSON.parse(options.query);
			this.title = this.banner.title
		},
		onShow() {
			this.getDetail();
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				}
			});
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.userID = res.data.ID;
					this.commentInfo= res.data;
				}
			});

		},
		methods: {
			getDetail() {
				let option = {
					method: 'contentBody',
					params: {
						contentId: this.banner.ID,
						contentTypeID: this.banner.contentTypeID,
						siteID:125
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.statusCode == 200) {
							let { _Status, _Message} = res.data
							if(_Status == 1){
								let {bodyText, fileResources, imgResources, videoResources, audioResources, specialResources, commentlist} = res.data.list
								if(fileResources){
									fileResources.map( item => {
										if(item.path.indexOf("{ContextPath}") > -1){
											item.path = item.path.replace(/{ContextPath}/g, this.baseUrl.www + "/")
										}else {
											item.path = this.baseUrl.www + "/" + item.path
										}
										if(item.src) {
											item.src = item.src.replace(/{ContextPath}/g, this.baseUrl.www + "/")
										}
										if(item.oldFileName.indexOf(".") > -1 ){
											let i = item.oldFileName.indexOf(".")
											item.oldFileName = item.oldFileName.substring(0,i)
										}
									})
									this.files = fileResources
								}
								if(imgResources){
									imgResources.map( item => {
										item.src = this.baseUrl.www + "/" + item.path
									})
									this.photos = imgResources
								}
								if(videoResources) {
									videoResources.map( item => {
										if(item.path.indexOf("{ContextPath}") > -1){
											item.path = item.path.replace(/{ContextPath}/g, this.baseUrl.www + "/")
										}else {
											item.path = this.baseUrl.www + "/" + item.path
										}
									})
									this.videos = videoResources
								}
								if(audioResources) {
									audioResources.map( item => {
										if(item.path.indexOf("{ContextPath}") > -1){
											item.path = item.path.replace(/{ContextPath}/g, this.baseUrl.www + "/")
										}else {
											item.path = this.baseUrl.www + "/" + item.path
										}
									})
									this.audios = audioResources
								}
								if(specialResources) {
									specialResources.map( item => {
										item.path = this.baseUrl.www + "/" + item.path
									})
									this.specials = specialResources
								}
								let formatPath = '';
								if(commentlist.length > 0 ) {
									commentlist.forEach((item) => {
										item.addTime = friendlyDate(item.addTime);
										if (item.logoFileM) {
											item.logoFileM = this.baseUrl.www + item.logoFileM
										}
									})
									this.commentlist = commentlist;
								}
								if (bodyText) {
									let formatStyle = bodyText.replace(/<img[^>]*>/gi, function(match, capture) {
										return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%"') // 替换style
									})
									let formatLabel = formatStyle.replace(/<section/g, '<div').replace(/\/section>/g, '/div>');
									let formatImg = formatLabel.replace(/height="(\d*)"/gi, "").replace(/width="(\d*)"/gi, '').replace(/<img/gi, '<img width="100%"')
									formatPath = formatImg.replace(/{ContextPath}/g, this.baseUrl.www + "/")
									this.content = formatPath;
								}
								
							}else{
								uni.showToast({
									title: _Message,
									icon: "none",
									duration: 2500
								})
							}
						} else {
							this.content = FAIL_CONTENT;
						}
					}
				});
			},
			toWebpage(detail){
				uni.navigateTo({
					url: "./webpage?webpage=" + detail.path +"&title=" + this.title
				})
			},
			downloadFile(file){
				uni.downloadFile({
				    url: file.path, //仅为示例，并非真实的资源
				    success: (res) => {
				        if (res.statusCode === 200) {
							// #ifdef APP-PLUS
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function (data) {
									let savedFilePath = data.savedFilePath;
									uni.showModal({
										title: "文件已下载到:",
										content: savedFilePath,
										showCancel: false
									})
								}
							});
							// #endif
				        }
				    }
				});
			},
			//轮播图指示点改变
			change(e) {
				this.current = e.detail.current;
			},
			showCommentArea() {
				if (this.token) {
					this.isShow = !this.isShow;
				} else {
					uni.navigateTo({
						url: '../login/login'
					})
				}
			},
			//是否收藏
			isCollect() {
				
				if (this.token) {
					if (this.banner.isFavorite === 'N') {
						this.addCollection()
					} else if (this.banner.isFavorite === 'Y') {
						this.cancelCollect()
					}
				} else {
					uni.navigateTo({
						url: '../login/login'
					})
				}
			},
			//收藏
			addCollection() {
				let option = {
					method: 'favoriteAddAPIMethod',
					params: {
						"token": this.token,
						"memberId": this.userID,
						"contentId": this.banner.ID
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							let favorites = {
								title:this.banner.title,
								contentTypeId: this.banner.contentTypeID,
								logoFile: this.banner.logoFile,
								favoritesID: this.banner.ID,
								comments: this.banner.comment_count,
								hitCount: this.banner.hitCount,
								memberID: this.userID,
								publishDate: this.banner.publishDate,
								siteId: this.banner.siteID,
								source: this.banner.source
							}
							uni.getStorage({
								key:"favorites",
								success: (res) => {
									res.data.unshift(favorites)
									uni.setStorage({
										key: "favorites",
										data: res.data
									})
								}
							})
							uni.showToast({
								title: "收藏成功",
								icon: "none"
							});
							this.banner.isFavorite = "Y"
						} else {
							uni.showToast({
								title: res.data._Message,
								icon: "none"
							})
						}
					}
				})
			},
			//取消收藏
			cancelCollect() {
				let option = {
					method: 'favoriteCancelAPIMethod',
					params: {
						"token": this.token,
						"memberId": this.userID,
						"contentId": this.banner.ID
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							let favorites = null
							uni.getStorage({
								key: 'favorites',
								success: (res) => {
									favorites = res.data
									let index = favorites.findIndex((item) => {
										return item.favoritesID == this.banner.ID
									})
									favorites.splice(index,1)
									uni.setStorage({
										key: 'favorites',
										data: favorites
									})
								}
							})
							
							uni.showToast({
								title: "取消收藏",
								icon: "none"
							});
							this.banner.isFavorite = "N"
						} else {
							uni.showToast({
								title: res.data._Message,
								icon: "none"
							});
						}
					}
				})
			},
			//发布评论
			postComment() {
				let option = {
					method: 'comment',
					params: {
						"score": 11,
						"token": this.token,
						"userid": this.userID,
						"contentid": this.banner.ID,
						"content": this.comment
					}
				}
				if (this.comment) {
					uni.request({
						url: this.baseUrl.url,
						method: this.baseUrl.method,
						data: Object.assign(option, this.baseUrl.data),
						success: (res) => {
							let newComment = {
								"ID": this.banner.ID,
								"addTime": this.banner.datetime,
								"addUser": this.commentInfo.addUser,
								"antiCount": "",
								"catalogID": this.banner.catalogID,
								"commentRefererID": '',
								"content": this.comment,
								"contentTypeId": this.banner.contentTypeId,
								"ctitle": this.banner.title,
								"hitCount": this.banner.hitCount,
								"isFavorite": this.banner.isFavorite,
								"logoFile": this.banner.LogoFile,
								"logoFileM": this.commentInfo.logoFile,
								"modifyTime": this.banner.modifyTime,
								"modifyUser": this.banner.modifyUser,
								"publishDate": new Date().getTime(),
								"realName": this.commentInfo.realName,
								"relaID": '',
								"score": this.banner.score,
								"siteID": this.banner.siteID,
								"source": this.banner.source ? this.banner.source : '岢岚网',
								"supporterCount":  this.banner.supporterCount,
								"tag": '',
								"title": '',
								"type": '',
								"userID": this.userID,
								"userName":this.commentInfo.userName,
								"@Class":this.commentInfo['@Class']
							}
							uni.getStorage({
								key: 'remarkList',
								success: (localRes) => {
									localRes.data.unshift(newComment)
									uni.setStorage({
										key: 'remarkList',
										data: localRes.data
									});
								}
							});
							
							if (res.data._Status == 1) {
								this.commentlist = []
								this.commentlist.unshift(newComment)
								uni.showToast({
									title: "评论发表成功",
									icon: "none"
								});
								this.isShow = false;
								this.comment = '';
								
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
			}
		}
	}
</script>

<style lang="scss">
	.font{ padding-bottom: 80upx; }
	.divReplace {
		height: 132upx;
		margin-bottom: 20upx;
	}
	.swiper-img {
		width: 100%;
		height: calc((100vw) / (16/9));
	}
	.banner {
		height: auto;
		overflow: hidden;
		position: relative;
	}

	.banner-img {
		width: 100%;
		height: calc((100vw) / (16/9));
	}
	
	video {
		width: 100%;
	}
	.specials{
		padding:0 30upx ;
		word-break: break-word;
		font-size: 28upx;
	}
	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		width: 90%;
		font-size: 32upx;
		font-weight: 600;
		line-height: 42upx;
		margin: 30upx;
		color: #333333;
	}

	.fixed {
		position: absolute;
		color: #FFFFFF;
		left: 30upx;
		bottom: 30upx;
		z-index: 11;
		margin: 0;
	}

	.article-meta {
		padding: 20upx 40upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		color: gray;
		font-size: 28upx;
	}

	.article-text {
		margin: 0 20upx;
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
	}
	
	.files, .videos, .swipers{
		padding:0 30upx;
		font-size: 28upx;
		box-sizing: border-box;
	}
	swiper {
		width:100%;
		height: calc((100vw - 30px ) / (16/9));
		video {
			height:100%;
		}
	}
	.files{
		view{
			display: flex;
			align-items: center;
			margin-bottom: 6upx;
		}
		image {
			width: 32upx;
			height: 32upx;
			margin-right: 8upx;
		}
		text {
			padding-bottom: 4upx;
			border-bottom: 2upx solid #000000;
		}
	}
	
	// 底部
	.commentFoot{
		width: 100%;
		height: 80upx;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 10upx;
		box-sizing: border-box;
		display: flex;
		border-top: 1upx solid #ccc ;
		background: #fff;
		.comBox{
			width: 60%;
			height: 100%;
			margin-right: 2%;
			border-radius: 20upx;
			.comment-area {
				width: 100%;
				padding-left: 10upx;
				line-height: 1.6;
				height: 100%;
				border: 1upx solid #ccc;
				box-sizing: border-box;
				border-radius: 20upx;
			}
		}
		.tool-bar {
			width: 37%;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			text {
				font-size: 28upx;
				color: #4E4E4E;
				margin-left: 10upx;
			}
		
			.tool-item {
				display: flex;
				align-items: center;
		
				.comment-icon {
					width: 36upx;
					height: 36upx;
				}
			}
		}
		.comment-btn{
			width: 30%;
			text-align: right;
			line-height: 1.8;
			font-size: 28upx;
			color: #4E4E4E;
			padding-right: 20upx;
		}
	}
	
	// 列表
	.comList{
		padding-bottom: 100upx;
	}
	.comItem{
		width: 100%;
		height: auto;
		display: flex;
		padding:10upx 40upx 20upx 40upx;
		box-sizing: border-box;
		align-items: center;
		.itemImg{
			width: 80upx;
			height: 80upx;
			margin-right: 2%;
			border-radius: 50%;
			overflow: hidden;
			
			.img-icon{
				width: 80upx;
				height: 80upx;
				
			}
		}
		
		.itemCont{
			width: 90%;
			height: auto;
			
			.contName{
				padding:10upx 0;
				font-size: 20upx;
			}
			
			.contCont{
				font-size: 30upx;
				padding-bottom:10upx;
			}
			
			.contTime{
				font-size: 20upx;
				padding-bottom:10upx;
			}
			
		}
	}
</style>
