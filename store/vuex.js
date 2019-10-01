import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
const apiurl = 'https://api.wulv5.com/music'
export default new Vuex.Store({
	// 全局变量
	state: {
		audio: uni.createInnerAudioContext(),
		// 当前播放音乐详情
		detail: {},
		// 是否为暂停状态 true代表暂停 false代表播放
		paused: true,
		// 歌词 
		lrc: {},
		// 历史记录
		history: [],
		// 播放模式
		// 1. 单曲循环
		// 2. 顺序播放
		// 3. 随机播放
		mode: 1,
		// 用来记录当前播放的是哪一首
		musicIndex: 0
	},
	// 用来修改state里所定义的变量
	mutations: {
		setsrc(state, src) {
			// 第一个参数是固定死的, 我们自己传的参数从第2个开始
			// 设置audio的src并且播放
			state.audio.src = src;
			state.audio.play()
			state.paused = false
		},
		setdetail(state, detail) {
			state.detail = detail
		},
		setlrc(state, lrc) {
			state.lrc = lrc
		},
		sethistory(state, data) {
			// src detail lrc
			// console.log(data)
			// 不存在是-1 存在对应的索引值
			var num = state.history.findIndex((item) => {
				return item.id === data[3]
			})
			// console.log(num)
			if (num === -1) {
				state.history.unshift({
					src: data[0],
					detail: data[1],
					lrc: data[2],
					id: data[3]
				})
			}
			
		},
		play(state) {
			// console.log(1)
			state.audio.play()
			state.paused = false
		},
		pause(state) {
			// console.log(2)
			state.audio.pause()
			state.paused = true
		},
		setindex(state, num) {
			state.musicIndex++
			// console.log(state.musicIndex, state.history.length - 1)
			if (state.musicIndex >= state.history.length) {
				state.musicIndex = 0
			}
		},
		setprev(state) {
			// 上一首
			if (state.musicIndex === 0) {
				state.musicIndex = state.history.length
			}
			if (state.musicIndex === -1) {
				 state.musicIndex = state.history.length -1
			}
			
			state.musicIndex--
		},
		chengemode(state) {
			state.mode++
			if (state.mode === 4) {
				state.mode = 1
			}
		}
	},
	// 全局函数
	actions: {
		getsrc({commit, dispatch},item) {
			// 第一个参数是固定死的, 我们自己传的参数从第2个开始
			// commit 用来执行mutations里面函数的方法
			// dispatch 用来执行actions里其他函数的方法
			
			// 等待这3个ajax全部亲求玩之后, 再执行xx
			Promise.all([
				new Promise((next, err) => {
					// 获取音乐的mp3地址
					uni.request({
						url: apiurl + `/song/url?id=${item.id}`,
						success: (res) => {
							// console.log(res)
							commit('setsrc', res.data.data[0].url)
							next(res.data.data[0].url)
						}
					});
				}),
				new Promise((next, err) => {
					// 获取音乐的详情
					uni.request({
						url: apiurl + `/song/detail?ids=${item.id}`,
						success: (res) => {
							// console.log(res)
							commit('setdetail', res.data)
							next(res.data)
						}
					})
				}),
				new Promise((next) => {
					// 获取歌词
					uni.request({
						url: `https://api.wulv5.com/music/lyric?id=${item.id}`,
						success: (res) => {
							
							commit('setlrc', res.data)
							// console.log(res)
							
							next(res.data)
						}
					})
				})
			]).then(function (data) {
				data[3] = item.id
				commit('sethistory', data)
			})
			
			
			
		}
	}
})
