<template>
	<view class="modal-view" :class="{'modal-show': hide}" @touchmove.stop.prevent="empty" v-if="pageCloak">
		<view class="modal-content">
			<image class="header" mode="aspectFit" src="../../static/images/model-icon.png" />
			<slot name='text'>
				<view class="modal-main modal-text-center">
					<view class="text-item" v-for="(item, index) in content" :key="index"> {{item}} </view>
				</view>
			</slot>
			<view class="modal-row modal-border-top">
				<view class="modal-col modal-border-right" hover-class="modal-active" @click="cancel" v-if="!noCancel">
					{{cancelText}}
				</view>
				<view class="modal-col" hover-class="modal-active" :style="{color: confirmColor}" @click="confirm">
					{{confirmText}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '操作提示'
			},
			content: {
				type: Array,
				default: ['提示内容']
			},
			noCancel: {
				type: Boolean,
				default: false
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			confirmText: {
				type: String,
				default: '确定'
			},
			confirmColor: {
				type: String,
				default: 'rgb(255, 255, 255)'
			},
			hidden: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				hide: this.hidden,
				pageCloak: false // 小程序端初始化时，组件闪烁
			};
		},
		watch: {
			hidden(nVal, oVal) {
				this.hide = nVal
			},
			hide(nVal, oVal) {
				this.$emit('update:hidden', nVal)
			}
		},
		mounted() {
			this.pageCloak = true
		},
		methods: {
			empty() {},
			confirm(e) {
				this.$emit('confirm', e)
			},
			cancel(e) {
				this.$emit('cancel', e)
			}
		}
	}
</script>

<style lang="scss">
	.modal-view {
		position: fixed !important;
		z-index: 999;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		background: rgba(0, 0, 0, .7);
		visibility: hidden;
		transition: all .2s;
		will-change: auto;
		opacity: 0;

		.modal-content {
			display:block;
			background: #fff;
			width: 70vw;
			border-radius: 14px;
			overflow: hidden;
			position: relative;
			padding-bottom: 72px;
			-webkit-transform: scale3d(.465, .465, .465);
			transform: scale3d(.465, .465, .465);
			transition: all .2s;
			will-change: auto;
		}

		.header {
			display:block;
			width: 70vw;
			height: calc(70vw / (523/355));
		}

		.modal-row {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-evenly;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			position: absolute !important;
			left: 0;
			right: 0;
			bottom: 0;
			height: 72px;
			line-height: 72px;
			text-align: center;
			font-size: 16px;
			color: rgb(3, 3, 3);
		}

		.modal-col {
			display: block;
			background:#4ED7FF;
			color:#fff;
			width:30.5vw;
			height:36px;
			line-height: 36px;
			border-radius:18px;
		}
		
		.modal-col.modal-border-right{
			background:#b3beb3;
		}

		.modal-main {
			display:block;
			padding: 16px 28px 10px 50px;
			font-size: 15px;
			line-height: 26px;
			max-height: 400px;
			overflow-y: auto;
			color: #999;
		}

		.modal-padding {
			padding: 10px 15px;
		}

		.modal-text-center {
			.text-item{
				display: block;
				text-align: left;
				word-break: break-all;
			}
		}

		.modal-border-top::after,
		.modal-border-right::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
		}

		.modal-border-top::after {
			left: 0;
			height: 1px;
			transform: scaleY(.36) translateY(-1px);
		}

		.modal-border-right::after {
			bottom: 0;
			width: 1px;
			transform: scaleX(.36) translateX(1px);
		}
	}

	.modal-view.modal-show {
		visibility: visible;
		opacity: 1;

		.modal-content {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
