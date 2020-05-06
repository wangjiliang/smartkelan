<template>
	<view class="center font">
		<view class="divReplace"></view>
		<view class="logo" @tap="toLogin">
			<image class="logo-img" :src="avatarUrl "></image>
			<view class="logo-title">
				<text v-if="token" class="uer-name">{{userInfo.userName ? userInfo.userName : ''}}</text>
				<text v-if="!token" class="uer-name">请登录</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @tap="toCollect">
				<text class="list-text">我的收藏</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @tap="toRemark">
				<text class="list-text">我的评论</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @tap="toContribute">
				<text class="list-text">我的投稿</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @tap="toFeedback">
				<text class="list-text">意见反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list center-list-two">
			<view class="center-list-item border-bottom" @tap="toSetting">
				<text class="list-text">设置</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @tap="updateVersion">
				<text class="list-text">版本信息</text>
				<text class="navigat-arrow">{{version}}</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @tap="clearData">
				<text class="list-text">清除缓存</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<modal-view :content='appExplain' :no-cancel='false'
			@cancel="cancelEvent" @confirm="confirmEvent"
		 confirm-text='立即更新' cancel-text="以后再说" :hidden.sync="isShow" />
	</view>
</template>

<script>
	import modalView from '@/components/x-modal/x-modal.vue'
	export default {
		components:{
			modalView
		},
		data() {
			return {
				avatarUrl: '../../static/images/noavatar_small.png',
				userInfo: {},
				token: '',
				version:'',
				newVersion:'',
				appExplain:'',
				networkType:'',
				isShow:false
			}
		},
		onShow() {
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.userInfo = res.data
					if(this.userInfo.base64){
						this.avatarUrl = this.userInfo.base64
					}else if(this.userInfo.logoFile){
						this.avatarUrl = this.userInfo.logoFile
					}else {
						this.avatarUrl = "../../static/images/noavatar_small.png"
					}
				},
				fail: () => {
					this.userInfo = {}
					this.avatarUrl = "../../static/images/noavatar_small.png"
				}
			})
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				},
				fail: () => {
					this.token = ''
				}
			})
			try{
				this.version = uni.getStorageSync('version');
			}catch(e){
				console.log(e)
			}
			try{
				this.newVersion = uni.getStorageSync('newVersion');
			}catch(e){
				console.log(e)
			}
			try{
				this.networkType = uni.getStorageSync('networkType');
			}catch(e){
				console.log(e)
			}
			try{
				let explain = uni.getStorageSync('appExplain');
				let arr = explain.split("；")
				this.appExplain = arr;
			}catch(e){
				console.log(e)
			}
		},
		methods: {
			cancelEvent(e){
				this.isShow = false
			},
			confirmEvent(){
				this.isShow = false
				if(this.networkType == "none"){
					uni.showToast({
						title:"当前无网络,请稍后再试",
						icon:"none"
					})
					return false
				}else if(this.networkType == "wifi"){
					// #ifdef APP-PLUS
					plus.runtime.openURL(this.baseUrl.www + "/app/smartkelan.apk" )
					// #endif
				}else {
					uni.showModal({
						title:"提示",
						content:"当前处于" + this.networkType + "网络,是否继续更新?" ,
						cancelText:"确定",
						cancelColor:"#333333",
						confirmText:"取消",
						confirmColor:"#999999",
						success: (res) => {
							if(res.cancel){
								// #ifdef APP-PLUS
								plus.runtime.openURL(this.baseUrl.www + "/app/smartkelan.apk" )
								// #endif
							}
						}
					})
				}
			},
			// 版本更新
			// plus.runtime.openURL(res.data.url)
			updateVersion () {
				if(this.version == this.newVersion){
					uni.showToast({
						title:"当前已是最新版本",
						icon:"none"
					})
				}else{
					this.isShow = true;
				}
			},
			//登录
			toLogin() {
				if (this.token) {
					uni.navigateTo({
						url: '../user/setting/setting'
					})
				} else {
					uni.navigateTo({
						url: '../login/login'
					})
				}
			},
			//设置
			toSetting() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.navigateTo({
						url: '../user/setting/setting'
					})
				}
			},
			//我的收藏
			toCollect() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.navigateTo({
						url: './collect'
					})
				}
			},
			//我的评论
			toRemark() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.navigateTo({
						url: './remark'
					})
				}
			},
			//我的投稿
			toContribute() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.navigateTo({
						url: './contributelist'
					})
				}
			},
			//意见反馈
			toFeedback() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.navigateTo({
						url: './feedback'
					})
				}
			},
			//清除缓存
			clearData() {
				uni.showModal({
					title: '',
					content: '是否确定清除缓存',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: 'favorites',
								success: function(res) {}
							});
							uni.removeStorage({
								key: 'remarkList',
								success: function(res) {}
							});
							uni.removeStorage({
								key: 'contributes',
								success: function(res) {}
							});
							uni.getStorage({
								key: 'titData',
								success: (res) => {
									uni.removeStorage({
										key: 'titData',
										success: function(res) {}
									});
									for (let i = 0; i < res.data.length; i++) {
										uni.removeStorage({
											key: 'localData' + i,
											success: function(res) {}
										});
									}
								},
							})
							uni.showToast({
								title: '清除成功',
								duration: 2000
							});
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	view {
		display: flex;
	}

	.center {
		background-color: #F2F6F8;
		flex-direction: column;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		padding-top: 0;
		box-sizing: border-box;
		background-color: #2C81E7;
		flex-direction: column;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 28upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-two {
		max-height: calc(100vh - 830upx);
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 32upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #d3d3d3;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #2F85FC;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #333;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}

	.bottom-content {
		justify-content: space-around;
		align-items: center;
		min-height: 240upx;

		.bottom-content-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				width: 96upx;
				height: 96upx;
				fill: currentColor;
				overflow: hidden;
			}

			.bottom-content-text {
				display: block;
				font-size: 32upx;
				line-height: 60upx;
			}
		}
	}

	.divReplace {
		height: 132upx;
		background-color: #2C81E7;
	}
</style>
