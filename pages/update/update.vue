<template>
	<view>
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
				version:'',
				newVersion:'',
				appExplain:'',
				networkType:'',
				isShow:true
			}
		},
		onShow () {
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
		methods:{
			cancelEvent () {
				uni.navigateBack()
			},
			confirmEvent () {
				if(this.networkType == "none"){
					uni.showToast({
						title:"当前无网络,请稍后再试",
						icon:"none"
					})
					uni.navigateBack()
				}else if(this.networkType == "wifi"){
					// #ifdef APP-PLUS
					plus.runtime.openURL(this.baseUrl.www + "/app/smartkelan.apk" )
					// #endif
					uni.navigateBack()
				}else {
					this.isShow = false
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
								uni.navigateBack()
							}
							if(res.confirm){
								uni.navigateBack()
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
	page {
		background-color:#F2F6F8;
	}
</style>
