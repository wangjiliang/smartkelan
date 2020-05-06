<template>
	<view class="font">
		<cmd-nav-bar title="服务"></cmd-nav-bar>
		<view class="divReplace"></view>
		<view class="bsrd bs">
			<text>生活<text class="dot"></text>文教</text>
			<uni-grid :options="[
			{image:'../../static/images/service/search.png',text:'便民查询'},
			{image:'../../static/images/service/apply.png',text:'便民支付'},
			{image:'../../static/images/service/fitness.png',text:'健康养老'},
			{image:'../../static/images/service/journey.png',text:'智慧旅游'},
			{image:'../../static/images/service/village.png',text:'美丽乡村'},
			{image:'../../static/images/service/mic.png',text:'活动演出'},
			{image:'../../static/images/service/info.png',text:'教育信息'},
			{image:'../../static/images/service/online.png',text:'在线教育'}
			]"
			 column-num="4" @click="toHot"></uni-grid>
		</view>
		<view class="bszw bs">
			<text>政务</text>
			<uni-grid :options="[
			{image:'../../static/images/service/approval.png',text:'行政审批'},
			{image:'../../static/images/service/deal-online.png',text:'网上办理'},
			{image:'../../static/images/service/party.png',text:'党建党务'},
			{image:'../../static/images/service/government.png',text:'政务公开'}	]"
			 column-num="4" @click="toGovernment"></uni-grid>
		</view>
		<view class="bszw bs">
			<text>其他</text>
			<uni-grid :options="[
			{image:'../../static/images/service/socialSecurity.png',text:'社保救助'},
			{image:'../../static/images/service/publicService.png',text:'公共服务'},
			{image:'../../static/images/service/Onlineretailers.png',text:'电商平台'},
			{image:'../../static/images/service/weather.png',text:'天气预报'},
			{image:'../../static/images/service/health.png',text:'健康山西'},
			{image:'../../static/images/service/InvoiceQuery.png',text:'发票查询'},
			{image:'../../static/images/service/mallShopping.png',text:'商城购物'},
			{image:'../../static/images/service/parking.png',text:'高速路况'}]"
			 column-num="4" @click="toOthers"></uni-grid>
		</view>
		<button class="alarm-btn" @click="toAlarm">一键报警</button>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	export default {
		components: {
			uniGrid,
			cmdNavBar
		},
		data() {
			return {
				targetHref: '',
				title: '',
				videoSrc: '',
				token: '',
				userinfo: {},
				address:'',
				lat:'',
				lng:''
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			this.getAddress()
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
				}
			})
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					this.userinfo = res.data
				}
			})
		},
		methods: {
			//本县热点
			toHot(val) {
				let index = val.index;
				switch (index) {
					//便民查询
					case 0:
						this.targetHref = 'https://www.51240.com/';
						this.title = '便民查询'
						break;
					//便民支付
					case 1:
						this.targetHref = 'https://bianmin.chinapay.com/SCWeb/';
						this.title = '便民支付'
						break;
					//健康养老
					case 2:
						this.targetHref = 'http://www.jkyl.org.cn/index.php?m=content&c=index&a=lists&catid=10';
						this.title = '健康养老'
						break;
					//智慧旅游
					case 3:
						this.targetHref = 'http://www.slzhly.com/html/pc/e_productlistQJ.html';
						this.title = '智慧旅游'
						break;
					//美丽乡村
					case 4:
						this.targetHref = 'http://www.zgmlxc.com.cn/';
						this.title = '美丽乡村'
						break;
					//活动演出
					case 5:
						this.targetHref = 'http://www.show160.com/';
						this.title = '活动演出'
						break;
					//教育信息
					case 6:
						this.targetHref = 'http://www.chinaedu.edu.cn/';
						this.title = '教育信息'
						break;
					//在线教育
					case 7:
						this.targetHref = 'https://www.eol.cn/';
						this.title = '在线教育'
						break;
					default:
						return false;
						break;
				}
				uni.navigateTo({
					url: "./webpage?webpage=" + this.targetHref + "&title=" + this.title
				})
			},
			//政务
			toGovernment(val) {
				let index = val.index;
				switch (index) {
					//行政审批
					case 0:
						this.targetHref = 'http://weixin.sxzwfw.gov.cn/approvaldep';
						this.title = '行政审批'
						break;
					//网上办理
					case 1:
						this.targetHref = 'http://weixin.sxzwfw.gov.cn/qcwb';
						this.title = '网上办理'
						break;
					//党建党务
					case 2:
						this.targetHref = 'http://klx.xzzgw.gov.cn/index.html';
						this.title = '党建党务'
						break;
					//政务公开
					case 3:
						this.targetHref = 'http://xz.sxzwfw.gov.cn/kelanxian/public/index?token=&type=&CLIENT_ID=3FTJF1MVJ';
						this.title = '政务公开'
						break;
					default:
						return false;
						break;
				};
				uni.navigateTo({
					url: "./webpage?webpage=" + this.targetHref + "&title=" + this.title
				})
			},
			//其他
			toOthers(val) {
				let index = val.index;
				switch (index) {
					//社保救助
					case 0:
						this.targetHref = 'https://sxqy.msyos.com/index_new.jsp';
						this.title = '社保救助'
						break;
					//公共服务
					case 1:
						this.targetHref = 'http://weixin.sxzwfw.gov.cn/service';
						this.title = '公共服务'
						break;
					//电商平台
					case 2:
						this.targetHref = 'https://shop13325631.wxrrd.com/?suuid=f939ab8f-5758-4cde-fff9-6ad11d12658f&scene=1&sharetime=1571471728507';
						this.title = '电商平台'
						break;
					//天气预报
					case 3:
						this.targetHref = 'https://caiyunapp.com/weather/#111.5,38.7';
						this.title = '天气预报'
						break;
					//健康山西
					case 4:
						this.targetHref = 'http://www.sxyygh.com/index.asp';
						this.title = '健康山西'
						break;
					//发票查询
					case 5:
						this.targetHref = 'https://sbf.shanxi.chinatax.gov.cn:9109/gzfw/fpcx';
						this.title = '发票查询'
						break;
					//商城购物
					case 6:
						this.targetHref = 'https://ai.m.taobao.com';
						this.title = '商城购物'
						break;
					//高速路况
					case 7:
						this.targetHref = 'https://m.icauto.com.cn/gonglu/gaosu_s_18';
						this.title = '高速路况'
						break;
					default:
						return false;
						break;
				};
				uni.navigateTo({
					url: "./webpage?webpage=" + this.targetHref + "&title=" + this.title
				})
			},
			//获取地理位置
			getAddress() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						uni.request({
							url:"http://api.map.baidu.com/geocoder/v2/?location="+res.latitude+","+res.longitude+"&output=json&ak=kwDnpElcer7zmHzeUfrryVmY6uwNMjPL",
							success: (data) => {
								if(data.statusCode == 200) {
									let { result} = data.data
									this.address = result.formatted_address
									this.lng = result.location.lng
									this.lat = result.location.lat
								}
							}
						})
					}
				});
			},
			//一键报警
			toAlarm() {
				if (!this.token) {
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					uni.chooseVideo({
						sourceType: ['camera'],
						maxDuration: 10,
						success: (res) => {
							let uploadTask = uni.uploadFile({
								url: this.baseUrl.upload, 
								filePath: res.tempFilePath,
								name: 'file',
								formData: {
									nickname: this.userinfo.userName,
									tel: this.userinfo.mobile,
									sex: this.getSex(this.userinfo.gender),
									headimgurl: this.userinfo.logoFile,
									lng_lat: this.lng + '|' + this.lat,
									location: this.address
								},
								success: (res) => {
									if(res.statusCode == 200){
										let {state, message } = JSON.parse(res.data) 
										uni.showToast({
											title: message,
											icon : 'none'
										})
									}
								},
								fail: (err) => {
									uni.showToast({
										title: "上传失败,请重试",
										icon: "none"
									})
								}
							});
							uploadTask.onProgressUpdate(function(res){
								if(res.progress < 100){
									uni.showLoading({
										title: "文件上传中...",
										mask: true
									})
								}else if (res.progress == 99) {
									uni.hideLoading() 
								}else {
									uni.hideLoading()
								}
							})
						},
						fail: (error) => {
							uni.showToast({
								title: "上传失败",
								icon: "none"
							})
						}
					})
				}
			},
			getSex(gender) {
				switch (gender) {
					case "M":
						return 1;
					case "F" :
						return 2;
					default :
						return 0;
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: rgba(242, 246, 248, 1);
	}

	.divReplace {
		height: 132upx;
		margin-bottom: 20upx;
	}

	.dot{
		display: inline-block;
		width:4px ;
		height: 4px;
		border-radius: 50%;
		background: #333333;
		margin: 5px;
	}
	.bs {
		margin-bottom: 20.83upx;
		padding-top: 27upx;
		background-color: #fff;
		color: #333333;
	}

	.bs>text {
		font-size: 36upx;
		margin-left: 33upx;
		font-weight: 500;
	}
	.alarm-btn {
		width: 66%;
		height: 72upx;
		line-height: 72upx;
		color: #fff;
		font-size: 32upx;
		margin: 60upx auto;
		background-color: #EA061C;
		border-radius: 12upx;
	}
</style>
