<template>
	<view class="content">
		<image class="launch-img" src="../../static/images/launch/launch.gif"></image>
	</view>
</template>
<script>
	export default {
		onLoad() {
			const innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.src = '../../static/images/launch/launch.mp3';
			setTimeout(function() {
				uni.switchTab({
					url: '/pages/list/list'
				});
			}, 4500)
		},
		onShow() {
			// #ifdef APP-PLUS
			uni.setStorage({
				key: "version",
				data: plus.runtime.version
			})
			// #endif
			uni.getNetworkType({
				success: (res) => {
					uni.setStorage({
						key: "networkType",
						data: res.networkType
					})
				}
			})
			this.getLatestVersion()
		},
		methods: {
			//获取最新版本
			getLatestVersion () {
				let options = {
					method: 'versionsUpdate'
				}
				uni.request({
					url: this.baseUrl.url,
					method: "POST",
					data: Object.assign(options, this.baseUrl.data),
					success: (res) => {
						let { app, _Status } = res.data
						if (_Status === 1) {
							uni.setStorage({
								key: 'newVersion',
								data: app.versions
							})
							uni.setStorage({
								key: 'appExplain',
								data: app.appexplain
							})
						}
					}
				})
			}
		}
	}
</script>
<style>
	.content{
		position:relative;
	}
	.launch-img {
		width: 100vw;
		height: 100vh;
		position:absolute;
		top:0;
		left:0;
		z-index: 999;
	}
</style>
