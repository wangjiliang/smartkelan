<template>
	<view class="font">
		<cmd-nav-bar back title="注册账号"></cmd-nav-bar>
		<view class="placeholder"></view>
		<view class="logo">
			<view class="img">
				<image src="/static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="form">
			<view class="username">
				<input placeholder="用户名" v-model="username" @blur="checkVal('username')" placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="username">
				<input placeholder="手机号" v-model="phone" @blur="checkVal('phone')" maxlength="11" placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="password">
				<input placeholder="邮箱" v-model="email" @blur="checkVal('email')" placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="password">
				<input placeholder="至少6位数密码" v-model="passwd" @blur="checkVal('passwd')" password=true placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="password">
				<input placeholder="确认密码" v-model="passwdAgain" @blur="checkVal('passwdAgain')" password=true placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="btn" @tap="registerNowReg">立即注册</view>
			<view class="res">
				<view @tap="toLogin">已有账号立即登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import graceChecker from "@/common/graceChecker.js";
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components:{
			cmdNavBar
		},
		data() {
			return {
				username:"",
				phone: "",
				email: "",
				passwd: "",
				passwdAgain:"",
				rule: [{
						name: "username",
						checkType: "username",
						checkRule: /^[a-zA-Z0-9]{4,16}$/,
						errorMsg: "请填写4~16位用户名"
					},
					{
						name: "phone",
						checkType: "phone",
						checkRule: /^1(3|4|5|6|7|8|9)\d{9}$/,
						errorMsg: "请填写正确手机号码"
					},
					{
						name: "email",
						checkType: "email",
						checkRule: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
						errorMsg: "请填写正确的邮箱"
					},
					{
						name: "passwd",
						checkType: "passwd",
						checkRule: /^[a-zA-Z0-9]{6,}$/,
						errorMsg: "请填写至少6位数密码"
					},
					{
						name: "passwdAgain",
						checkType: "passwdAgain",
						errorMsg: "两次密码输入不一致"
					},
				],
			}
		},
		onLoad() {
		},
		methods: {
			checkVal: function(checkType){
				switch (checkType){
					case 'username':
						!(this.rule[0].checkRule.test(this.username)) ? uni.showToast({title: this.rule[0].errorMsg,icon:"none"}):uni.hideToast();
					break;
					// 手机号
					case 'phone':
						!(this.rule[1].checkRule.test(this.phone)) ? uni.showToast({title: this.rule[1].errorMsg,icon:"none"}):uni.hideToast();
					break;
					// email
					case 'email':
						!(this.rule[2].checkRule.test(this.email)) ? uni.showToast({title: this.rule[2].errorMsg,icon:"none"}):uni.hideToast();
					break;	
					case 'passwd':
						!(this.rule[3].checkRule.test(this.passwd)) ? uni.showToast({title: this.rule[3].errorMsg,icon:"none"}):uni.hideToast();
					break;
					case 'passwdAgain':
						!(this.passwd == this.passwdAgain) ? uni.showToast({title: this.rule[4].errorMsg,icon:"none"}):uni.hideToast();
					break;
				}
				return true;
			},
			registerNowReg() {
				uni.hideKeyboard()
				if(!this.username){
					uni.showToast({
						title:'请输入用户名',
						icon:'none'
					})
					return false
				}
				if(!this.phone){
					uni.showToast({
						title:'请输入手机号',
						icon:'none'
					})
					return false
				}
				if(!this.email){
					uni.showToast({
						title:'请输入邮箱号码',
						icon:'none'
					})
					return false
				}
				if(!this.passwd){
					uni.showToast({
						title:'请输入密码',
						icon:'none'
					})
					return false
				}
				if(!this.passwdAgain){
					uni.showToast({
						title:'请输入确认密码',
						icon:'none'
					})
					return false
				}
				let option = {
					method:'register',
					params:{
						username:this.username,
						siteid:125,
						mobile:this.phone,
						password:this.passwd,
						email:this.email
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(result) => {
						if(result.data._Status == 1){
							uni.showToast({
								title:'注册成功,返回登录'
							})
							setTimeout(()=>{
								uni.redirectTo({
									url: 'login'
								});
							},1600)
						}else{
							uni.showToast({
								title:result.data._Message,
								icon:'none'
							})
						}
					},
					fail:(result) => {
						uni.showToast({
							title:"网络错误",
							icon:'none'
						})
					}
				})
			},
			toLogin() {
				uni.hideKeyboard()
				uni.redirectTo({
					url: 'login'
				});
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";
	@font-face {
		font-family: "HMfont-login";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA') format('woff2');
	}
	.form {
		.username,
		.password,
		.btn{
			width:calc(100% - 200upx);
			height:70upx;
			margin:20upx auto;
			padding:0 44upx;
		}
		.username {
			position: relative;

			.get-code {
				position: absolute;
				height: 90upx;
				display: flex;
				align-items: center;
				justify-content: center;
				right: 0;
				padding: 0 40upx;
				// border-left: solid 1upx #fff;
				z-index: 3;

				&:after {
					content: " ";
					width: 1upx;
					height: 50upx;
					background-color: #fff;
					position: absolute;
					z-index: 3;
					margin-right: 100%;
					left: 0;
					top: 20upx;
				}
			}
		}

		.res {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}
</style>
