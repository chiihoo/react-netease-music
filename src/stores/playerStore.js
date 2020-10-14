import { observable, computed, action, flow } from 'mobx'
import { shuffle } from 'lodash-es'
import { fetchLyrics } from '@/api'
import { parseLrc } from '@/utils/tools'

// 播放有关的存储
export class playerStore {
  @observable isPlaying = false // 是否在播放
  @observable shouldPlay = false // 是否需要播放，见260行addSongToPlay方法中的解释
  @observable playMode = JSON.parse(localStorage.getItem('playMode')) ?? 'list' // 播放的模式： 列表播放list，随机播放random，单曲循环single
  // 这个用作当前播放列表
  @observable playList = JSON.parse(localStorage.getItem('playList')) ?? [] // 播放列表
  @observable playListIndex = JSON.parse(localStorage.getItem('playListIndex')) ?? 0 // 播放列表的索引
  // 这个用作实际播放顺序
  @observable playQueue = JSON.parse(localStorage.getItem('playQueue')) ?? [] // 实际的播放顺序，比如说随机播放下的播放顺序
  @observable playQueueIndex = JSON.parse(localStorage.getItem('playQueueIndex')) ?? 0 // 播放顺序的索引
  // privilege.fee === 1 会员
  // /1152|1028|1088|1092|1284/.test(privilege.flag) 试听
  @observable privileges = JSON.parse(localStorage.getItem('privileges')) ?? [] // 包括一些权限信息
  // 歌词不用缓存在localStorage中，因为每次播放都会自动请求歌词
  @observable isPureMusic = null // true为纯音乐
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
  @observable dataArray = new Array(256).fill(0) // 频率数组

  @computed
  get currentSong() {
    if (this.playQueue.length > 0 && this.playQueueIndex !== null)
      return this.playQueue[this.playQueueIndex]
    return {}
  }

  @computed
  get currentSongId() {
    return this.currentSong?.id
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
  // get swiperLoadSongs() {
  //   if (this.playQueue.length >= 2) {
  //     if (this.playQueueIndex === 0) {
  //       return [this.playQueue[this.playQueue.length - 1], ...this.playQueue.slice(0, 2)]
  //     } else if (this.playQueueIndex === this.playQueue.length - 1) {
  //       return [...this.playQueue.slice(-2), this.playQueue[0]]
  //     } else {
  //       return this.playQueue.slice(this.playQueueIndex - 1, this.playQueueIndex + 2)
  //     }
  //   } else if (this.playQueue.length === 1) {
  //     return [this.playQueue[0], this.playQueue[0], this.playQueue[0]]
  //   }
  //   return []
  // }
  get swiperLoadSongs() {
    if (this.playQueue.length >= 3) {
      if (this.playQueueIndex === 0) {
        return [this.playQueue[this.playQueue.length - 1], ...this.playQueue.slice(0, 2)]
      } else if (this.playQueueIndex === this.playQueue.length - 1) {
        return [...this.playQueue.slice(-2), this.playQueue[0]]
      } else {
        return this.playQueue.slice(this.playQueueIndex - 1, this.playQueueIndex + 2)
      }
    } else if (this.playQueue.length === 2) {
      // 为了在播放队列长度小于等于2首的时候，由于会截取凑成3首歌，所以map时如果key={song.id}，两个this.playQueue[0]会导致重复key
      // 所以加个keyId，map时用key={song.id + '-' + song?.keyId}来避免这个问题
      // 播放队列长度大于等于3首时，截取出来的3首歌都会不同，所以没有这个问题
      if (this.playQueueIndex === 1) {
        return [
          { ...this.playQueue[0], keyId: 1 },
          { ...this.playQueue[1], keyId: 2 },
          { ...this.playQueue[0], keyId: 3 }
        ]
      } else if (this.playQueueIndex === 0) {
        return [
          { ...this.playQueue[1], keyId: 1 },
          { ...this.playQueue[0], keyId: 2 },
          { ...this.playQueue[1], keyId: 3 }
        ]
      }
    } else if (this.playQueue.length === 1) {
      return [
        { ...this.playQueue[0], keyId: 1 },
        { ...this.playQueue[0], keyId: 2 },
        { ...this.playQueue[0], keyId: 3 }
      ]
    }
    return []
  }
  // @computed
  // get swiperLoadSongs() {
  //   if (this.playQueue.length >= 3) {
  //     if (this.playQueueIndex === 0) {
  //       return [this.playQueue[this.playQueue.length - 1], ...this.playQueue.slice(0, 2)]
  //     } else if (this.playQueueIndex === this.playQueue.length - 1) {
  //       return [...this.playQueue.slice(-2), this.playQueue[0]]
  //     } else {
  //       return this.playQueue.slice(this.playQueueIndex - 1, this.playQueueIndex + 2)
  //     }
  //   } else if (this.playQueue.length === 2) {
  //     if (this.playQueueIndex === 1) {
  //       return [
  //         { ...this.playQueue[0], keyId: 1 },
  //         { ...this.playQueue[1], keyId: 2 },
  //         { ...this.playQueue[0], keyId: 3 }
  //       ]
  //     } else if (this.playQueueIndex === 0) {
  //       return [
  //         { ...this.playQueue[1], keyId: 1 },
  //         { ...this.playQueue[0], keyId: 2 },
  //         { ...this.playQueue[1], keyId: 3 }
  //       ]
  //     }
  //   } else if (this.playQueue.length === 1) {
  //     return [
  //       { ...this.playQueue[0], keyId: 1 },
  //       { ...this.playQueue[0], keyId: 2 },
  //       { ...this.playQueue[0], keyId: 3 }
  //     ]
  //   }
  //   return []
  // }

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
    if (this.analyser) {
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

  // 根据id切换歌曲，在当前播放列表中直接切换
  @action
  changeCurrentPlaySong(songId) {
    for (let i = 0; i < this.playQueue.length; i++) {
      if (this.playQueue[i].id === songId) {
        this.setPlayQueueIndex(i)
        break
      }
    }
    this.setIsPlaying(true)
    this.changePlayListIndexWithPlayQueueIndex()
    this.currentDirection = 'next'
  }

  // 点击添加歌曲到播放队列
  @action
  addSongToPlay(songId, songs, privileges) {
    this.changePlayList(songs, songId)
    // this.setIsPlaying(true)
    // 这里为什么要用个shouldPlay的变量而不是直接setIsPlaying(true)呢？
    // 因为如果直接改播放状态的话，有一个场景是在暂停状态下，切换到另一个歌单点击歌曲播放，
    // 这时候因为网络请求获取src有延迟，所以会先播放上一首歌的部分，之后才会切换到下一首
    // 而如果在Audio中获取src后直接设置setIsPlaying(true)，又会导致刷新页面就直接播放了，所以多加了这样一个变量，来确保只有点击之后才能播放
    this.shouldPlay = true
    this.setPrivileges([...privileges])
    this.currentDirection = null
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
    let index
    for (let i = 0; i < this.playList.length; i++) {
      if (this.playList[i].id === songId) {
        index = i
        this.playList.splice(i, 1)
        localStorage.setItem('playList', JSON.stringify(this.playList))
        break
      }
    }
    this.privileges.splice(index, 1)
    localStorage.setItem('privileges', JSON.stringify(this.privileges))

    this.changePlayListIndexWithPlayQueueIndex()

    if (this.playQueue.length === 0) {
      this.setIsPlaying(false)
    }
  }

  // 删除播放列表的全部歌曲
  @action
  deleteAll() {
    this.setIsPlaying(false)
    this.setPrivileges([])
    this.setPlayList([])
    this.setPlayQueue([])
    this.setPlayListIndex(0)
    this.setPlayQueueIndex(0)
  }

  // 播放全部
  @action
  playAll(playList, privileges) {
    this.setPlayList([...playList])
    this.setPrivileges([...privileges])
    this.setPlayQueueIndex(0)
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

      this.isPureMusic = res?.nolyric ? true : false
      this.lyricUser = res.lyricUser?.nickname
      this.transUser = res.transUser?.nickname
      let lyricObj = {}
      if (lrc) {
        // 有歌词
        let lrcObj = parseLrc(lrc)
        for (let key in lrcObj) {
          lyricObj[key] = { lyric: lrcObj[key] }
        }
        // 有翻译
        if (tlrc) {
          this.hasTlyric = true
          let tlrcObj = parseLrc(tlrc)
          for (let key in tlrcObj) {
            // 这里也可以用lrcObj.hasOwnProperty(key) === true或者lrcObj[key] !== undefined判断
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
