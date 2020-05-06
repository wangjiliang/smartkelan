<template>
	<view class="uni-tab-bar font">
		<view class="weather-wrapper">
			<view class="tmp-info">
				<image class="weather-img" :src="imgSrc" mode="scaleToFill"></image>
				<text class="tmp">{{tmp}}</text>
				<text v-if="tmp" class="tmp">&deg;</text>
				<text class="cond-txt">{{weather}}</text>
			</view>
			<view class="date-info">
				<text style="margin-right: 20upx;">{{currentDay}}</text>
				<text>{{nowDate}}</text>
			</view>
		</view>
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<block v-for="(tab, index) in tabBars" :key="tab.ref">
				<view :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.ref" :data-current="index" @tap="tapTab(index)">
					{{tab.name}}
				</view>
			</block>
		</scroll-view>
		<!-- #ifndef MP-BAIDU -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" :top="360" @refresh="onPulldownReresh">
			<scroll-view class="list" v-for="(tabItem, idx) in newsList" :key="tabItem.id" v-if="tabIndex === idx" scroll-y
			 @scrolltolower="loadMore(idx)" @scroll="scrollEvent" :scroll-top="topNum">
				<uni-swiper-dot v-if="tabItem.swiper.length" :info="tabItem.swiper" :current="current" mode="long">
					<swiper class="swiper" @change="change" autoplay circular="true" interval="3000">
						<swiper-item v-for="swiperItem in tabItem.swiper" :key="swiperItem.ID">
							<view class="swiper-item" style="height:100%;" @click="goDetail(swiperItem)">
								<image class="swiper-img" :src="swiperItem.logoFile" mode="scaleToFill"></image>
								<text class="swiper-title">{{swiperItem.Title}}</text>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
				<block v-for="(newsItem, newsIndex) in tabItem.data" :key="newsIndex">
					<uni-media-list :options="newsItem" @tap="goDetail(newsItem)"></uni-media-list>
				</block>
				<view class="uni-tab-bar-loading">
					<view class="loading-more">{{loadingText}}</view>
				</view>
			</scroll-view>
		</mix-pulldown-refresh>
		<!-- #endif -->
	</view>
</template>
<script>
	import uniMediaList from '@/components/uni-media-list/uni-media-list.vue';
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh.vue';
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
	import {
		friendlyDate,
		currentCity
	} from '@/common/util.js';


	export default {
		components: {
			uniMediaList,
			cmdNavBar,
			mixPulldownRefresh,
			uniSwiperDot
		},
		data() {
			return {
				topNum: 0,
				loadingText: {
					contentdown: '上拉加载更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				token: '',
				user: {},
				weather: '',
				imgSrc: '../../static/images/weather/100.png',
				tmp: '',
				location: "",
				nowDate: '',
				currentDay: '',
				currentCity: 'kelan',
				scrollLeft: 0,
				refreshing: false,
				refreshText: '下拉可以刷新',
				newsList: [],
				tabIndex: 0,
				tabBars: [],
				CurrentScrollValue: 0,
				enableScroll: true,
				current: 0,
				topNumArr: []
			}
		},
		computed: {
			scrollViewHeight() {
				return 'height:' + (uni.getSystemInfoSync().windowHeight) + 'px';
			}
		},

		onLoad() {
			this.loadDate();
		},
		onShow() {
			this.topNum = 0;
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				},
				fail: () => {
					this.token = ''
				}
			})
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.user = res.data;
				}
			})

			uni.getStorage({
				key: 'titData',
				success: (res) => {
					if (res.data && res.data.length > 0 && this.newsList && this.newsList.length > 0) {
						uni.getStorage({
							key: 'titData',
							success: (ress) => {
								this.tabBars = res.data;
								let temporaryTop = this.tabBars[this.tabIndex].topNum*1
								setTimeout(()=>{
									this.topNum = temporaryTop;
								}, 10);
							}
						})
					} else {
						this.getColumns();
					}
				},
				fail: () => {
					this.getColumns();
				}
			})
			uni.getLocation({
				success: (res) => {
					this.currentCity = res.longitude + ',' + res.latitude;
					this.getWeather(this.currentCity);
				},
				fail: () => {
					this.getWeather(this.currentCity);
				}
			});
			const _localDatas = this.getLocalAdCaches(this.tabIndex);
			let activeTab = this.newsList[this.tabIndex];
			activeTab = {
				data: [],
				swiper: []
			};
			if (_localDatas) {
				if (_localDatas[this.tabIndex].data && _localDatas[this.tabIndex].data.length > 0) {
					activeTab.data = _localDatas[this.tabIndex].data;
					this.loadingText = '加载中...';
				} else {
					this.loadingText = '没有更多数据了';
				}
			}
		},
		methods: {
			//轮播图指示点改变
			change(e) {
				this.current = e.detail.current;
			},
			//获取栏目
			getColumns() {
				let option = {
					method: 'icatalog',
					params: {
						"siteid": "125",
						"page": "true",
						"level": "Root"
					}
				}
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(option, this.baseUrl.data),
					success: (res) => {
						if (res.data._Status == 1) {
							let tabBars = [];
							this.tabBars.splice(0, this.tabBars.length)
							res.data.list.forEach(item => {
								tabBars.push({
									id: item.ID,
									name: item.name,
									ref: item.alias,
									topNum: 0
								})
							})
							uni.setStorage({
								key: 'titData',
								data: tabBars,
							});
							uni.getStorage({
								key: 'titData',
								success: (res) => {
									this.tabBars = res.data
								}
							})
							this.tabBars.forEach((tabBar, index) => {
								this.newsList.push({
									id: 'tabBar' + index,
									swiper: [],
									data: [],
									requestParams: {
										method: 'content',
										params: {
											"siteId": "125",
											"catalogId": tabBar.id + "",
											"memberId": this.user.ID || 0,
											"publishDate": "0",
											"up": '1'
										}
									},
									loadingText: '加载中...'
								});
							});
							this.getList();
						} else {
							this.tabBars = [];
							uni.getStorage({
								key: 'titData',
								success(res) {
									this.tabBars = res.data
								}
							})
						}
					},
					fail: () => {
						this.tabBars = [];
						uni.getStorage({
							key: 'titData',
							success(res) {
								this.tabBars = res.data
							}
						})
					}
				})
			},
			//获取当前日期信息
			loadDate() {
				let m = new Date().getMonth() + 1;
				let d = new Date().getDate();
				let day = new Date().getDay();
				this.nowDate = m + '月' + d + '日';
				switch (new Date().getDay()) {
					case 0:
						this.currentDay = "星期天";
						break;
					case 1:
						this.currentDay = "星期一";
						break;
					case 2:
						this.currentDay = "星期二";
						break;
					case 3:
						this.currentDay = "星期三";
						break;
					case 4:
						this.currentDay = "星期四";
						break;
					case 5:
						this.currentDay = "星期五";
						break;
					case 6:
						this.currentDay = "星期六";
						break;
				}
			},
			//获取天气信息
			getWeather(currentCity) {
				uni.request({
					url: 'https://free-api.heweather.net/s6/weather/now',
					data: {
						key: "8370ddad59e241baaa3490d519c5c57a",
						location: currentCity
					},
					success: (result) => {
						if (result.statusCode == 200) {
							let info = result.data.HeWeather6[0];
							this.tmp = info.now.tmp;
							this.location = info.basic.location;
							this.imgSrc = "../../static/images/weather/" + info.now.cond_code + ".png";
							this.weather = info.now.cond_txt;
							uni.setStorage({
								key: "weather",
								data: info
							});
						} else {
							uni.getStorage({
								key: "weather",
								success: (res) => {
									this.tmp = res.data.now.tmp;
									this.imgSrc = "../../static/images/weather/" + res.data.now.cond_code + ".png"
									this.weather = res.data.now.cond_txt;
									this.location = res.data.basic.location;
								}
							})
						}
					},
					fail: () => {
						uni.getStorage({
							key: "weather",
							success: (res) => {
								this.tmp = res.data.now.tmp;
								this.imgSrc = "../../static/images/weather/" + res.data.now.cond_code + ".png"
								this.weather = res.data.now.cond_txt;
								this.location = res.data.basic.location;
							}
						})
					}
				})
			},
			//获取新闻列表
			getList(catalogId = "0", publishDate = "0", up = "1") {
				let activeTab = this.newsList[this.tabIndex];
				activeTab.requestParams.params.catalogId = catalogId + "";
				activeTab.requestParams.params.publishDate = publishDate;
				activeTab.requestParams.params.up = up + "";
				this.loadingText = '加载中...';
				uni.request({
					url: this.baseUrl.url,
					method: this.baseUrl.method,
					data: Object.assign(activeTab.requestParams, this.baseUrl.data),
					success: (result) => {
						if (result.statusCode == 200) {
							let swiperList = result.data.imglogo;
							let swiper = []
							if (swiperList.length > 0) {
								swiper = swiperList.filter( (item)=> {
									if(item.logoFile){
										return item
									}
								})
								swiper.map(item => {
									if(item.logoFile){
										item.logoFile = this.baseUrl.www + item.logoFile
									}
									item.addTime = friendlyDate(item.publishDate)
									if (item.title.length > 15) {
										item.Title = item.title.substring(0, 13) + "..."
									} else {
										item.Title = item.title
									}
								})
							}
							let dataList = result.data.list;
							if (dataList.length < 15) {
								this.loadingText = '没有更多数据了';
							}
							if (dataList.length > 0) {
								const data = dataList.map((news) => {
									if (news.logoFile) {
										news.logoFile = this.baseUrl.www + news.logoFile
									}
									let imgarticle = []
									if (news.imgarticle) {
										news.imgarticle.map((item, index) => {
											if (index < 3) {
												let trimQuotes = item.replace(/\'/g, "")
												let newItem = trimQuotes.replace(/{ContextPath}/gi, this.baseUrl.www + '/')
												imgarticle.push(newItem)
											}
										})
									}
									if (imgarticle.length == 1) {
										if (!news.logoFile) {
											news.logoFile = imgarticle[0]
										}
										imgarticle = null
									} else if (imgarticle.length < 1) {
										imgarticle = null;
									}
									return {
										ID: news.ID,
										article_type: 2,
										addTime: friendlyDate(news.publishDate),
										title: news.title,
										logoFile: news.logoFile,
										imgarticle: imgarticle,
										source: news.source,
										comment_count: news.comments,
										hitCount: news.hitCount,
										isFavorite: news.isFavorite,
										antiCount: news.antiCount,
										catalogID: news.catalogID,
										publishDate: news.publishDate,
										contentTypeID: news.contentTypeID,
										modifyTime: news.modifyTime,
										modifyUser: news.modifyUser,
										siteID: news.siteID,
										supporterCount: news.supporterCount,
										score: news.score
									};
								});
								uni.setStorage({
									key: 'localData' + this.tabIndex,
									data: data
								});
								uni.setStorage({
									key: 'swiper' + this.tabIndex,
									data: swiper
								})
								if (publishDate == "0") {
									activeTab.data = this.getLocalAdCaches(this.tabIndex);
									activeTab.swiper = this.getLocalSwiper(this.tabIndex);
									this.refreshing = false;
								} else {
									activeTab.swiper = this.getLocalSwiper(this.tabIndex);
									if (up == "1") {
										data.forEach((news) => {
											activeTab.data.push(news);
										});
									} else {
										let newArray = data.concat(activeTab.data)
										activeTab.data = newArray
									}
								}
							}
						} else {
							const _failData = this.getLocalAdCaches(this.tabIndex);
							const _swiperData = this.getLocalSwiper(this.tabIndex);
							activeTab.swiper = _swiperData;
							activeTab.data = [];
							if (_failData[this.tabIndex].data && _failData[this.tabIndex].data.length > 0) {
								activeTab.data = _failData[this.tabIndex].data;
								this.loadingText = '加载中...';
							} else {
								this.loadingText = '没有更多数据了';
							}
						}
					},
					fail: (result) => {
						const _localData = this.getLocalAdCaches(this.tabIndex);
						const _swiperData = this.getLocalSwiper(this.tabIndex);
						activeTab.swiper = _swiperData;
						activeTab.data = [];
						if (_localData[this.tabIndex].data && _localData[this.tabIndex].data.length > 0) {
							activeTab.data = _localData[this.tabIndex].data;
							this.loadingText = '加载中...';
						} else {
							this.loadingText = '没有更多数据了';
						}
					}
				});
			},
			//获取本地缓存
			getLocalAdCaches(index) {
				var tmp_local_ad_caches = null;
				var _tmp;
				uni.getStorage({
					key: 'localData' + index,
					success(e) {
						_tmp = e;
					}
				});
				if (_tmp) {
					tmp_local_ad_caches = _tmp.data;
				}
				return tmp_local_ad_caches;
			},
			//获取轮播图缓存
			getLocalSwiper(index) {
				let swiperData = null
				uni.getStorage({
					key: 'swiper' + index,
					success: (res) => {
						swiperData = res.data
					}
				})
				return swiperData
			},
			//查看文章详情
			goDetail(detail) {
				uni.getStorage({
					key: 'titData',
					success: (res) => {
						if (this.CurrentScrollValue > 0) {
							res.data[this.tabIndex].topNum = this.CurrentScrollValue;
							this.CurrentScrollValue=0;
						}
						let _data = res.data;
						uni.setStorage({
							key: 'titData',
							data: _data
						});
						uni.navigateTo({
							url: '/pages/detail/detail?query=' + JSON.stringify(detail)
						});
					},
					fail: () => {
			
					}
				})
			},
			//加载更多
			loadMore() {
				let activeTab = this.newsList[this.tabIndex]
				let length = activeTab.data.length
				let publishDate = activeTab.data[length - 1].publishDate
				let catalogId = this.tabBars[this.tabIndex].id
				this.getList(catalogId, publishDate, "1")
			},
			//下拉刷新
			onPulldownReresh() {
				let catalogId = this.tabBars[this.tabIndex].id
				let list = this.newsList[this.tabIndex].data
				let publishDate = "0"
				if (list.length > 1) {
					publishDate = list[0].publishDate
				}
				this.getList(catalogId, publishDate, "-1");
				setTimeout(() => {
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				}, 2000)
			},
			//滚动的距离
			scrollEvent(e) {
				this.CurrentScrollValue = e.detail.scrollTop;
			},
			//点击tab-bar
			async tapTab(index) {
				if (this.tabIndex === index) {
					return false;
				} else {
					uni.getStorage({
						key: 'titData',
						success: (res) => {
							if (this.CurrentScrollValue > 0) {
								res.data[this.tabIndex].topNum = this.CurrentScrollValue;
								this.CurrentScrollValue = 0;
							}
							if (res.data[index].topNum) {
								this.topNum = parseInt(res.data[index].topNum);
							}else{
								this.topNum = 0;
							}
							let _data = res.data;
							uni.setStorage({
								key: 'titData',
								data: _data
							});
							
						},
						fail: () => {

						}
					})
					this.tabIndex = index;
					const activeTab = this.newsList[this.tabIndex];
					if (activeTab.data.length === 0) {
						let catalogId = this.tabBars[this.tabIndex].id
						this.getList(catalogId, "0", "1");
					}

				}
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #FFFFFF;
		height: 100%;
		font-size: 11px;
		line-height: 1.8;
	}

	.swiper {
		height: calc((100vw) / (16/9));
	}

	.swiper-item {
		position: relative;

		.swiper-title {
			color: #FFFFFF;
			font-size: 14px;
			position: absolute;
			left: 5px;
			bottom: 0;
		}
	}

	.swiper-img {
		width: 100%;
		height: 100%;
	}

	.weather-wrapper {
		background-color: #2C81E7;
		color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 72upx 30upx 20upx;
	}

	.weather-img {
		width: 120upx;
		height: 120upx;
	}

	.tmp {
		font-size: 72upx;
		line-height: 72upx;
		align-self: flex-end;
	}

	.cond-txt {
		font-size: 30upx;
		line-height: 30upx;
		align-self: flex-end;
	}

	.tmp-info {
		display: block;
	}

	.date-info {
		font-size: 28upx;
		line-height: 22px;
		align-self: flex-end;
	}

	.uni-tab-bar {
		display: flex;
		/* flex: 1; */
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.uni-tab-bar .list {
		width: 750upx;
		height: calc(100vh - 360upx);
		/* height:100%; */
	}

	.uni-swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 80upx;
		height: 80upx;
		border-bottom: 1px solid #c8c7cc;
		background: #2C81E7;
		z-index: 1000;
	}

	.swiper-tab-list {
		font-size: 30upx;
		width: 150upx;
		display: inline-block;
		text-align: center;
		color: #E3E3E3;
	}

	.uni-tab-bar .active {
		color: #FFFFFF;
		font-size: 32upx;
	}

	.uni-tab-bar .swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
		overflow: scroll;
	}

	.uni-tab-bar-loading {
		text-align: center;
		padding: 20upx 0;
		font-size: 14px;
		color: #CCCCCC;
	}
</style>
