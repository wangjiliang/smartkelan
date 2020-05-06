<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			setTimeout(() => {
				let version = '';
				let newVersion = '';
				try {
					version = uni.getStorageSync('version');
				} catch (e) {
					console.log(e)
				}
				try {
					newVersion = uni.getStorageSync('newVersion');
				} catch (e) {
					console.log(e)
				}
				if (this.firstLoaded && (version != newVersion)) {
					this.firstLoaded = false
					uni.navigateTo({
						url: '/pages/update/update'
					})
				}
			}, 30000)
		},
		// onHide: function () {
		// 	console.log('App Hide')
		// }
	}
</script>
<style>
	/*每个页面公共css */
</style>
