<template>
	<view class="font">
		<cmd-nav-bar back title="重置密码"></cmd-nav-bar>
		<view class="placeholder"></view>
        <view class="logo">
			<view class="img">
				<image src="/static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="form">
			<view class="username">
				<view class="get-code" :style="{'color':getCodeBtnColor}" @click.stop="getCode()">{{getCodeText}}</view>
				<input placeholder="邮箱" v-model="email" placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="code">
				<input placeholder="验证码" v-model="code" placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="password">
				<input placeholder="新密码" v-model="passwd" password=true placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="btn" @tap="doReset">重置密码</view>
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
				email:"",
				code:"",
				confirmCode:'',
				passwd:"",
				userid:'',
				getCodeText:'获取验证码',
				getCodeBtnColor:"#ffffff",
				getCodeisWaiting:false
			}
		},
		onLoad() {

		},
		methods: {
			Timer(){},
			getCode(){
				if(this.getCodeisWaiting){
					return ;
				}
				if(!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email))){ 
					uni.showToast({title: '请填写正确的邮箱号码',icon:"none"});
					return false; 
				} 
				if(this.code != this.confirmCode){
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				this.getCodeisWaiting = true;
				let option = {
					method:'sendEmail',
					params:{
						email:this.email
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res) => {
						if(res.data._Status == 1){
							this.userid = res.data.params.id;
							this.confirmCode = res.data.authCode;
							uni.showToast({title: '验证码已发送至邮箱',icon:"none"});
							this.setTimer();
						}else{
							uni.showToast({title: '验证码失败,请重试',icon:"none"});
						}
					},
					fail:(err) => {
						uni.showToast({title: '验证码发送失败',icon:"none"});
					}
				})
				
			},
			setTimer(){
				let holdTime = 60;
				this.getCodeText = "重新获取(60)"
				this.Timer = setInterval(()=>{
					if(holdTime<=0){
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = "#ffffff";
						this.getCodeText = "获取验证码"
						clearInterval(this.Timer);
						return ;
					}
					this.getCodeText = "重新获取("+holdTime+")"
					holdTime--;
					
				},1000)
			},
			doReset(){
				uni.hideKeyboard()
				//验证邮箱
				if(!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email))){ 
					uni.showToast({title: '请填写邮箱号码',icon:"none"});
					return false; 
				} 

				if(!this.code){ 
					uni.showToast({title: '请输入验证码',icon:"none"});
					return false; 
				}
				if(!this.passwd){
					uni.showToast({title: '请输入至少6位数新密码',icon:"none"});
					return false;
				}
				if(!(/^[a-z0-9A-Z]{6,}/.test(this.passwd))){
					uni.showToast({title: '密码至少6位',icon:"none"});
					return false;
				}
				let option = {
					method:'resetPassword',
					params:{
						email:this.email,
						code:this.code,
						password:this.passwd,
						id:this.userid
					}
				}
				uni.request({
					url:this.baseUrl.url,
					method:this.baseUrl.method,
					data:Object.assign(option,this.baseUrl.data),
					success:(res) => {
						if(res.data._Status == 1){
							uni.showToast({title: '密码重置成功',icon:"none"});
							setTimeout(() =>{
								uni.navigateTo({url:'./login'})
							},1600)
						}else{
							uni.showToast({title: res.data._Message,icon:"none"});
						}
					},
					fail:(err) => {
						uni.showToast({title: '网络错误',icon:"none"});
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
		.username{
			position: relative;
			.get-code{
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
	}
	
</style>
