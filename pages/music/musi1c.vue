<template>
	<view>
		/
		<view style="width: 80%;">
			{{start}}
			<view>
				<slider activeColor="#ed5b3b" @changing="changing" @change="change" :value="value" />
			</view>
			{{total}}
		</view>

		<view style="height: 50upx; overflow: hidden;padding: 150upx 0">
			<ul :style=" 'margin-top: -' + 27*index + 'px; transition: margin 1.5s' ">
				<li :style="index === i && 'color:red;'" v-for="(item, i) in lrcarr" :key="i">
					{{ item.text }}
				</li>
			</ul>
		</view>
		<player></player>
	</view>
</template>

<script>
	import Vuex from 'vuex'
	import player from '@/components/player/player.vue'
	export default {
		data() {
			return {
				start: '',
				total: '',
				value: 0,
				updatestate: true,
				lrcarr: [],
				// 用来记录当前是第几条歌词
				index: -1
			}
		},
		mounted() {
			// console.log(this.detail)
			uni.setNavigationBarTitle({
				title: this.detail.songs[0].name
			})
			

			// console.log(this.lrc.lrc.lyric)
			// 格式化歌词
			const arr = this.lrc.lrc.lyric.split('\n')
			// console.log(arr)
			const lrcarr = []
			for (var i = 0; i < arr.length; i++) {
				var temparr = arr[i].split("]")
				// console.log(temparr)
				lrcarr.push({
					time: temparr[0].substring(1, temparr[0].length - 1),
					text: temparr[1]
				})
			}
			// console.log(lrcarr)
			this.lrcarr = lrcarr
			
			this.jindu()
			// 当音乐时间改变的事件
			this.audio.onTimeUpdate(this.jindu)
		},
		methods: {
			jindu() {
				// console.log(0)
				// 播放到了多长时间
				let min = Math.floor(this.audio.currentTime / 60);
				min = min.toString().length === 1 ? ("0" + min) : min;
				let sec = Math.round(this.audio.currentTime % 60);
				sec = sec.toString().length === 1 ? ("0" + sec) : sec;
				// 总时间
				let zmin = Math.floor(this.audio.duration / 60);
				zmin = zmin.toString().length === 1 ? ("0" + zmin) : zmin;
				let zsec = Math.round(this.audio.duration % 60);
				zsec = zsec.toString().length === 1 ? ("0" + zsec) : zsec;

				this.start = `${min}:${sec}`
				this.total = `${zmin}:${zsec}`

				if (this.updatestate) {
					this.value = this.audio.currentTime / this.audio.duration * 100
				}
				// console.log(this.start, this.lrcarr[this.index + 1].time)

				/* 
					onTimeUpdate改变歌词
				 */
				if (this.start > this.lrcarr[this.index + 1].time) {
					this.index++
				}
			},
			change(e) {
				// 完成时候
				// console.log(e.detail.value * this.audio.duration / 100)
				var t = e.detail.value * this.audio.duration / 100
				this.audio.seek(t)
				this.updatestate = true

				// 播放到了多长时间
				let min = Math.floor(t / 60);
				min = min.toString().length === 1 ? ("0" + min) : min;
				let sec = Math.round(t % 60);
				sec = sec.toString().length === 1 ? ("0" + sec) : sec;
				let s = `${min}:${sec}`

				const self = this;
				this.index = 0;

				function d() {
					console.log(s)
					if (s > self.lrcarr[self.index + 1].time) {
						self.index++
						d()
					}
				}
				d()
			},
			changing() {
				// 正在拖动时
				this.updatestate = false
			}
		},
		computed: {
			...Vuex.mapState(['detail', 'audio', 'lrc'])
		},
		components: {
			player
		}
	}
</script>

<style>
</style>
