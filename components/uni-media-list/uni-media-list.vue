<template>
	<view class="news-item">
		<view class="media-list" v-if="options.title" @click="bindClick">
			<view :class="{ 'flex-row': options.imgarticle ,'media-image-right': options.article_type === 2, 'media-image-left': options.article_type === 1}">
				<view :class="{'full-row': !options.logoFile}">
					<text class="media-title" :class="{'media-title2': options.article_type === 1 || options.article_type === 2}">{{options.title}}</text>
					<view v-if="!options.imgarticle" class="media-foot">
						<view class="media-info">
							<text class="info-text" style="color:#2C81E7">{{options.source ? options.source : '岢岚网'}}</text>
							<text class="info-text">{{options.comment_count}}评论</text>
							<text class="info-text">{{options.addTime}}</text>
						</view>
					</view>
				</view>
				<view v-if=" !options.imgarticle && options.logoFile" class="image-section" :class="{'image-section-right': options.article_type === 2, 'image-section-left': options.article_type === 1}">
					<image class="image-list1" :class="{'image-list2': options.article_type === 1 || options.article_type === 2}" v-if="options.logoFile"
					 :src="options.logoFile"></image>
				</view>
				<view class="image-group" v-if = "options.imgarticle">
					<image class="image-articl" v-for="(item, index) in options.imgarticle" :key="item" :src="item"></image>
				</view>
				<view v-if="options.imgarticle" class="media-foot">
					<view class="media-info">
						<text class="info-text" style="color:#2C81E7">{{options.source ? options.source : '岢岚网'}}</text>
						<text class="info-text">{{options.comment_count}}评论</text>
						<text class="info-text">{{options.addTime}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			bindClick() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.news-item {
		border-bottom: 1px solid #F2F6F8;
		min-height: calc((100vh - 460upx)/5);
	}

	.media-list {
		flex: 1;
		flex-direction: column;
		padding: 20upx 30upx;
	}

	.media-image-right {
		flex-direction: row;
		justify-content: space-between;
	}
	.media-image-right.flex-row{
		flex-direction: column;
	}

	.full-row {
		width: 100%;
	}
	.image-group{
		flex-direction: row;
		.image-articl{
			display: inline-block;
			width:calc((100vw - 50px)/3);
			height: calc(((100vw - 50px)/3)/(4/3));
			margin-right: 10px;
		}
	}
	
	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
	}

	.media-title {
		lines: 3;
		text-overflow: ellipsis;
		word-break: break-all;
		font-size: 32upx;
		color: #333333;
	}

	.media-title2 {
		flex: 1;
		line-height: 40upx;
	}

	.image-section {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0upx;
		width: 260upx;
		height: 196upx;
	}

	.image-section-left {
		margin-top: 0upx;
		margin-right: 10upx;
		width: 260upx;
		height: 196upx;
	}

	.image-list1 {
		width: 690upx;
		height: 481upx;
	}

	.image-list2 {
		width: 260upx;
		height: 196upx;
	}

	.image-list3 {
		width: 225upx;
		height: 146upx;
	}

	.media-info {
		flex-direction: row;
	}

	.info-text {
		color: #999999;
		font-size: 24upx;
		margin-right: 20upx;
	}

	.media-foot {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
	}

</style>
