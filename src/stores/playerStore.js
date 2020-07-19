import { observable, computed, action, flow } from 'mobx'
import { shuffle } from 'lodash-es'
import { fetchLyrics } from '@/api'
import { parseLrc } from '@/utils/tools'

// 播放有关的存储
export class playerStore {
  @observable isPlaying = false // 是否在播放
  // 这个用作当前播放列表
  @observable playList = JSON.parse(localStorage.getItem('playList')) || [] // 播放列表
  @observable playListIndex = JSON.parse(localStorage.getItem('playListIndex')) // 播放列表的索引
  @observable privileges = JSON.parse(localStorage.getItem('privileges')) || [] // 包括一些权限信息
  // 这个用作实际播放顺序
  @observable playQueue = JSON.parse(localStorage.getItem('playQueue')) || [] // 实际的播放顺序，比如说随机播放下的播放顺序
  @observable playQueueIndex = JSON.parse(localStorage.getItem('playQueueIndex')) // 播放顺序的索引
  // privilege.fee === 1 会员
  // /1152|1028|1088|1092|1284/.test(privilege.flag) 试听
  @observable playMode = JSON.parse(localStorage.getItem('playMode')) || 'list' // 播放的模式： 列表播放list，随机播放random，单曲循环single
  // 歌词不用缓存在localStorage中，因为每次播放都会自动请求歌词
  @observable isPureMusic = null // true为纯音乐
  @observable hasLyric = false // 有歌词或者有歌词翻译
  @observable lyrics = [] // 歌词
  @observable lyricUser = null // 歌词贡献者
  @observable transUser = null // 翻译贡献者
  // 上一次是点击上一首，还是下一首 prev next，主要作用是歌曲加载出错时，要切换到出错歌曲的上一首还是下一首
  @observable currentDirection = null

  @observable bufferedTime = 0 // 已缓存区域的时间 秒
  @observable totalTime = 0 // 歌曲总时间
  @observable currentTime = 0 // 当前播放的时间，只有显示作用
  @observable timeToPlay = null // 改变的播放时间
  @observable volume = 0.6 // 音量大小  [0,1]之间的小数

  // Audio组件中对audio的解析，获取频率数组，由于音频可视化动画是放在Player中的，所以需要存一下
  @observable analyser = null // AnalyserNode
  @observable dataArray = null // 频率数组

  @computed
  get currentSong() {
    if (this.playQueue.length > 0 && this.playQueueIndex !== null)
      return this.playQueue[this.playQueueIndex]
    return {}
  }

  @computed
  get currentSongId() {
    if (this.currentSong) return this.currentSong.id
    return null
  }

  // 歌曲作者
  @computed
  get artists() {
    return this.currentSong?.ar.reduce((total, item, index) => {
      return index !== this.currentSong.ar.length - 1 ? total + item.name + '/' : total + item.name
    }, '')
  }

  // mini-player 左右滑动 加载的3首歌
  @computed
  get swiperLoadSongs() {
    if (this.playQueue.length >= 2) {
      if (this.playQueueIndex === 0) {
        return [this.playQueue[this.playQueue.length - 1], ...this.playQueue.slice(0, 2)]
      } else if (this.playQueueIndex === this.playQueue.length - 1) {
        return [...this.playQueue.slice(-2), this.playQueue[0]]
      } else {
        return this.playQueue.slice(this.playQueueIndex - 1, this.playQueueIndex + 2)
      }
    } else if (this.playQueue.length === 1) {
      return [this.playQueue[0], this.playQueue[0], this.playQueue[0]]
    }
    return []
  }

  // 根据currentTime获取当前为哪句歌词，返回歌词的索引
  @computed
  get activeLyricIndex() {
    if (this.lyrics.length > 0) {
      if (this.currentTime * 1000 >= this.lyrics[this.lyrics.length - 1].time) {
        return this.lyrics.length - 1
      }
      for (let i = 0; i < this.lyrics.length - 1; i++) {
        if (
          this.currentTime * 1000 >= this.lyrics[i].time &&
          this.currentTime * 1000 < this.lyrics[i + 1].time
        ) {
          return i
        }
      }
    }
    return 0
  }

  @action
  setBufferedTime(time) {
    this.bufferedTime = time
  }
  @action
  setTotalTime(time) {
    this.totalTime = time
  }
  @action
  setCurrentTime(time) {
    this.currentTime = time
  }
  @action
  setTimeToPlay(time) {
    this.timeToPlay = time
  }
  @action
  setVolume(volume) {
    this.volume = volume
  }

  @action
  setAnalyser(analyser) {
    this.analyser = analyser
  }
  @action
  setDataArray(dataArray) {
    this.dataArray = dataArray
  }
  @action
  updateDataArray() {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray)
    }
  }

  @action
  setIsPlaying(status) {
    this.isPlaying = status
  }
  @action
  setPlayMode(playMode) {
    this.playMode = playMode
    localStorage.setItem('playMode', JSON.stringify(playMode))
  }
  @action
  setPrivileges(privileges) {
    this.privileges = privileges
    localStorage.setItem('privileges', JSON.stringify(privileges))
  }
  @action
  setPlayList(playList) {
    this.playList = playList
    localStorage.setItem('playList', JSON.stringify(playList))
  }
  @action
  setPlayQueue(playQueue) {
    this.playQueue = playQueue
    localStorage.setItem('playQueue', JSON.stringify(playQueue))
  }
  @action
  setPlayListIndex(index) {
    this.playListIndex = index
    localStorage.setItem('playListIndex', JSON.stringify(index))
  }
  @action
  setPlayQueueIndex(index) {
    this.playQueueIndex = index
    localStorage.setItem('playQueueIndex', JSON.stringify(index))
  }

  // 更改播放列表playlist，需要同步修改播放顺序队列playQueue
  @action
  changePlayList(playList, songId) {
    this.setPlayList([...playList])
    for (let i = 0; i < this.playList.length; i++) {
      if (this.playList[i].id === songId) {
        this.setPlayListIndex(i)
        break
      }
    }
    this.changePlayQueueWithPlayList()
  }

  // 根据playList以及playListIndex来改变播放顺序队列playQueue，并设置playQueueIndex
  // 当切换随机播放时，需要重新调整playQueue，并且当前播放歌曲不能自动切换掉
  @action
  changePlayQueueWithPlayList() {
    if (this.playMode === 'random') {
      this.setPlayQueue(shuffle(this.playList))
      // 当切换到'random'模式时，index要放到当前正在播放的歌曲那里
      for (let i = 0; i < this.playQueue.length; i++) {
        if (this.playQueue[i].id === this.playList[this.playListIndex].id) {
          this.setPlayQueueIndex(i)
          break
        }
      }
    } else {
      this.setPlayQueue([...this.playList])
      this.setPlayQueueIndex(this.playListIndex)
    }
  }

  // 通过playQueueIndex对应的id来设置对应的playListIndex
  // 切换歌曲时修改playQueueIndex，同时也要根据id来同步修改playListIndex
  @action
  changePlayListIndexWithPlayQueueIndex() {
    if (this.playMode === 'random') {
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id === this.playQueue[this.playQueueIndex].id) {
          this.setPlayListIndex(i)
          break
        }
      }
    } else {
      this.setPlayListIndex(this.playQueueIndex)
    }
  }

  // 更换播放模式
  @action
  changePlayMode(playMode) {
    this.setPlayMode(playMode)
    this.changePlayQueueWithPlayList()
  }

  // 上一曲
  @action
  prevSong() {
    this.setPlayQueueIndex(
      this.playQueueIndex === 0 ? this.playQueue.length - 1 : this.playQueueIndex - 1
    )
    this.setIsPlaying(true)
    this.changePlayListIndexWithPlayQueueIndex()
    this.currentDirection = 'prev'
  }

  // 下一曲
  @action
  nextSong() {
    this.setPlayQueueIndex(
      this.playQueueIndex === this.playQueue.length - 1 ? 0 : this.playQueueIndex + 1
    )
    this.setIsPlaying(true)
    this.changePlayListIndexWithPlayQueueIndex()
    this.currentDirection = 'next'
  }

  // 点击添加歌曲到播放队列
  @action
  addSongToPlay(songId, songs, privileges) {
    this.changePlayList(songs, songId)
    this.setIsPlaying(true)
    this.setPrivileges([...privileges])
    this.currentDirection = null
  }

  // 点击添加歌曲到下一首播放
  @action
  addSongToNextPlay(song) {
    this.playList.splice(this.playListIndex, 0, song)
    localStorage.setItem('playList', JSON.stringify(this.playList))
    this.playQueue.splice(this.playQueueIndex, 0, song)
    localStorage.setItem('playQueue', JSON.stringify(this.playQueue))
  }

  // 从播放列表中删除某歌曲，先删playQueue中的，之后再同步删playList
  @action
  deleteSong(songId) {
    for (let i = 0; i < this.playQueue.length; i++) {
      if (this.playQueue[i].id === songId) {
        this.playQueue.splice(i, 1)
        localStorage.setItem('playQueue', JSON.stringify(this.playQueue))
        if (i < this.playQueueIndex) {
          this.setPlayQueueIndex(this.playQueueIndex - 1)
        }
        break
      }
    }
    for (let i = 0; i < this.playList.length; i++) {
      if (this.playList[i].id === songId) {
        this.playList.splice(i, 1)
        localStorage.setItem('playList', JSON.stringify(this.playList))
        break
      }
    }
    this.changePlayListIndexWithPlayQueueIndex()
  }

  // 播放全部
  @action
  playAll(playList) {
    this.setPlayList([...playList])
    this.setPlayQueueIndex(this.playQueueIndex)
    if (this.playMode === 'random') {
      this.setPlayQueue(shuffle(this.playList))
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id === this.playQueue[0].id) {
          this.setPlayListIndex(i)
          break
        }
      }
    } else {
      this.setPlayQueue(playList)
      this.setPlayListIndex(0)
    }
    this.setIsPlaying(true)
  }

  // 获取歌词
  getLyrics = flow(function* () {
    this.lyrics = []
    if (this.currentSongId) {
      const res = yield fetchLyrics(this.currentSongId)
      let lrc = res.lrc?.lyric
      let tlrc = res.tlyric?.lyric

      this.isPureMusic = res?.nolyric
      this.lyricUser = res.lyricUser?.nickname
      this.transUser = res.transUser?.nickname

      let lyricObj = {}
      if (!lrc && !tlrc) {
        // 无歌词、翻译
        this.hasLyric = false
      } else if (lrc) {
        // 有歌词
        this.hasLyric = true
        let lrcObj = parseLrc(lrc)
        for (let key in lrcObj) {
          lyricObj[key] = { lyric: lrcObj[key] }
        }
        // 有翻译
        if (tlrc) {
          this.hasTlyric = true
          let tlrcObj = parseLrc(tlrc)
          for (let key in tlrcObj) {
            // 也可以用hasOwnProperty或者undefined判断
            if (key in lrcObj) {
              lyricObj[key] = { ...lyricObj[key], tlyric: tlrcObj[key] }
            } else {
              lyricObj[key] = { tlyric: tlrcObj[key] }
            }
          }
        }
      }
      // lyricObj的形式是这样的：{ time1: {lyric: text1a, tlyric: text1b}, time2... }
      // 但由于对象的遍历不能保证键是按顺序的，所以需要转成数组。
      // 那为什么parseLrc不直接返回数组，并用数组进行合并呢？
      // 因为如果[{t:t1,l:1},{t:t2,l:2},...]与[{t:t1,tl:a},{t:t2,tl:b},...]进行相同t的合并，
      // 需要合并成[{t:t1,l:1,tl:a},{t:t2,l:2,tl:b},...],很明显需要双重循环，时间复杂度为O(n^2)
      // 而使用对象的形式进行合并，js对象是基于哈希表的，查找的时间复杂度为O(1)，因此合并的时间复杂度为O(n)
      let lyrics = []
      for (let key in lyricObj) {
        lyrics.push({ time: Number(key), lyric: lyricObj[key].lyric, tlyric: lyricObj[key].tlyric })
      }
      lyrics.sort((a, b) => a.time - b.time)
      this.lyrics = [...lyrics]
    }
  })
}
