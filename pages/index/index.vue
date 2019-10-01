<template>
	<view class="content">
        <!-- banner -->
		<swiper style="text-align: center;" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in banner" :key='index'>
				<view class="swiper-item">
					<image :src="item.imageUrl" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="uni-title">
			推荐歌单
		</view>
		<view class="uni-product-list">
			<view @click="playlist(item)" class="uni-product" v-for="(item, index) in list" :key="index">
				<view class="image-view">
					<image class="uni-product-image" :src="item.picUrl"></image>
				</view>
				<view class="uni-product-title">{{item.name}}</view>
			</view>
		</view>
		<view>
			<uni-drawer @close="closeDrawer" :visible="visible" mode="left">
				<uni-list>
					<uni-list-item @click="his" title="历史记录" note="" show-arrow="false"></uni-list-item>
					<uni-list-item @click="down" title="下载管理" note="" show-arrow="false"></uni-list-item>
				</uni-list>
			</uni-drawer>
		</view>
		<player></player>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import player from '@/components/player/player.vue'
	export default {
		components: {
			uniList,
			uniListItem,
			uniDrawer,
			player
		},
		data() {
			return {
				banner: [],
				list: [],
				visible: false
			}
		},
		onLoad() {
			// ajax 风格个jq比较像
			uni.request({
				url: 'https://api.wulv5.com/music/banner',
				success: (res) => {
					this.banner = res.data.banners
				}
			});
			uni.request({
				url: 'https://api.wulv5.com/music/personalized',
				success: (res) => {
					this.list = res.data.result
				}
			})
		},
		methods: {
			0() {
				// 搜索按钮
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			1() {
				// 菜单按钮
				// console.log('菜单按钮')
				this.visible = true
			},
			closeDrawer() {
				this.visible = false
			},
			his() {
				uni.navigateTo({
					url: "/pages/history/history"
				})
			},
			down() {
				uni.navigateTo({
					url: "/pages/download/download"
				})
			},
			playlist(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/playerdetail/playerdetail?id=${item.id}`
				})
				
			}
		},
		onNavigationBarButtonTap(e) {
			// console.log(e)
			// e.index 0 === 搜索按钮 1 === 菜单
			this[e.index]()
		}
	}
</script>

<style>
	
</style>
