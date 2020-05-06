<template>
	<view class="font">
		<cmd-nav-bar back title="我的设置"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view>
			<cmd-cel-item title="头像" slot-right>
				<cmd-avatar :src="avatarUrl" @click="updateAvatar"></cmd-avatar>
			</cmd-cel-item>
			<cmd-cel-item title="昵称" :addon="nickname"></cmd-cel-item>
			<cmd-cel-item title="性别" :addon="gender"></cmd-cel-item>
			<cmd-cel-item title="地区" :addon="region"></cmd-cel-item>
			<button class="default-btn" @tap="logOut">退出登录</button>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '../../../static/js/image-tools/index.js'
	import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components: {
			cmdCelItem,
			cmdAvatar,
			cmdNavBar
		},

		data() {
			return {
				// #ifdef MP-WEIXIN
				avatarUrl: '../../static/images/noavatar_small.png',
				// #endif
				// #ifndef MP-WEIXIN
				avatarUrl: '../../../static/images/noavatar_small.png',
				// #endif
				userinfo: {},
				nickname: "",
				gender: '',
				region: "",
				token:""
			};
		},
		onLoad() {
			uni.getStorage({
				key:'token',
				success: (res) => {
					this.token = res.data;
				}
			})
		},
		onShow() {
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					if (res.data) {
						this.nickname = res.data.userName;
						switch (res.data.gender) {
							case 'M':
								this.gender = '男';
								break;
							case 'F':
								this.gender = '女';
								break;
						}
						this.userinfo = res.data;
						if(this.userinfo.base64){
							this.avatarUrl = this.userinfo.base64;
						}else if(this.userinfo.logoFile){
							this.avatarUrl = this.userinfo.logoFile;
						}
						
					}
				},
				fail: () => {
					this.avatarUrl = "../../../static/images/noavatar_small.png"
				}
			})
		},
		methods: {
			//更换头像
			updateAvatar() {
				uni.chooseImage({
					count:1,
					success: (res) => {
						let imgStr = res.tempFilePaths[0];
						pathToBase64(imgStr).then(base64 => {
							this.avatarUrl = base64;
							this.userinfo.base64 = base64;
							uni.setStorage({
								key:"userinfo",
								data:this.userinfo
							})
							this.uploadAvatar(base64)
						}).catch(error => {
							console.log(error)
						})
					}
				})
			},
			//上传头像 uploadMemberHead
			uploadAvatar(img){
				uni.showLoading({
					title:"头像上传中..."
				})
				let options = {
					method: 'uploadMemberHead',
					params: {
						"siteId": "125",
						"memberId": this.userinfo.ID,
						"base64Image": img
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:"POST",
					data:Object.assign(options, this.baseUrl.data),
					success: (res) => {
						let { _Message, _Status, filePath } = res.data
						if(_Status === 1){
							uni.hideLoading();
							this.userinfo.logoFile = filePath
							uni.setStorage({
								key: "userinfo",
								data: this.userinfo
							})
							uni.showToast({
								title:"头像上传成功"
							})
						}else{
							uni.hideLoading();
							uni.showToast({
								title:_Message,
								icon:"none"
							})
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title:"头像上传失败",
							icon:"none"
						})
					}
				})
			},
			logOut() {
				if (this.token) {
					let option = {
						method: 'logOut',
						params: {
							memberId:this.userinfo.id
						}
					}
					uni.request({
						url:this.baseUrl.url,
						method:this.baseUrl.method,
						data:Object.assign(option,this.baseUrl.data),
						success: (res) => {
							if(res.data._Status == 1){
								try{
									//用户退出时删除与用户相关的缓存
									uni.removeStorageSync('userinfo')
									uni.removeStorageSync('token')
									uni.removeStorageSync('favorites')
									uni.removeStorageSync('remarkList')
									uni.removeStorageSync('contributes')
								}catch (e){
									console.log(e)
								}
								uni.showToast({
									title:'用户退出登录',
								})
								setTimeout(()=>{
									uni.switchTab({	url:'../../ucenter/ucenter'	})
								},1600)
							}else{
								uni.showToast({
									title:res.data._Message,
									duration:2000,
									icon:'none'
								})
							}
						},
					})
				} else {
					return false;
				}
			}
		}
	}
</script>

<style>
	.default-btn {
		margin-top: 100upx;
	}
	.divReplace{
		height: 152upx;
	}
</style>
