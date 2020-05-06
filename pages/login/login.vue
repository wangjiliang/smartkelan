<template>
	<view class="font">
		<cmd-nav-bar back title="登录"></cmd-nav-bar>
		<view class="placeholder"></view>
        <view class="logo">
			<view class="img">
				<image src="/static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 账号密码输入框 -->
		<view class="form">
			<view class="username">
				<input placeholder="用户名/邮箱" v-model="userName" placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="password">
				<input placeholder="密码" v-model="passwd" password=true placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="btn" @tap="doLogin">登 录</view>
			<view class="res">
				<view @tap="toPage('register')">用户注册</view>
				<view @tap="toPage('resetpasswd')">忘记密码</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components:{
			cmdNavBar
		},
		data() {
			return {
				pages:'',
				userName: '',
				passwd:'',
				isShowOauth:false,
				showProvider:{
					weixin:false,
					qq:false,
					sinaweibo:false,
					xiaomi:false
				}
			}
		},
		onShow() {
			let pages = getCurrentPages();
			this.pages = pages[0].route;
		},
		methods: {
			toPage(page){
				uni.hideKeyboard()
				uni.navigateTo({
					url: page
				});
			},
			doLogin(){
				uni.hideKeyboard();
				//验证用户名或邮箱
				if(!this.userName){ 
					uni.showToast({title: '请填写邮箱或用户名',icon:"none"});
					return false; 
				}
				if(!this.passwd){
					uni.showToast({
						title:'请输入密码', 
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title: '登录中...'
				})
				let option = {
					method:'mlogin',
					params:{
						username:this.userName,
						siteid:"125",
						password:this.passwd,
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res) => {
						uni.hideLoading();
						if(res.data._Status == 1){
							let logo = res.data.list[0].logoFile
							if(logo){
								res.data.list[0].logoFile = this.baseUrl.www + logo
							}
							uni.setStorage({
								key:'userinfo',
								data:res.data.list[0]
							});
							uni.setStorage({
								key:'token',
								data:res.data.token
							});
							uni.showToast({
								title:'登录成功!',
							})
							setTimeout(()=>{
								let idx = this.pages.lastIndexOf('/');
								let name = this.pages.substring(idx+1);
								if(name == 'ucenter' || name == 'list' || name == 'service' || name == 'media'){
									uni.switchTab({
										url:"/"+this.pages
									})
								}else{
									uni.navigateTo({
										url:"/"+this.pages
									})
								}
							},1600)
						}else{
							uni.showToast({
								title:res.data._Message,
								icon:'none',
								duration:1800
							})
						}
					},
					fail: () => {
						uni.showToast({
							title:"网络错误",
							icon:'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";
	@font-face {font-family:"HMfont-login";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA') format('woff2');}
	.form {
		.res {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}
	.oauth{
		@media all and (max-height:150vw){
			display: none;
		}
		position: absolute;
		bottom: 50upx;
		width: 100%;
		.text{
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgba($color: #ffffff, $alpha: 0.8);
			font-size: 28upx;
		}
		.list{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20upx 0;
			.icon{
				font-size:80upx;
				margin: 0 30upx;
			}
		}
	}
</style>
