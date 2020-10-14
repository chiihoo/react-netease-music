import { observable, action, flow } from 'mobx'
import {
  fetchSearchDefault,
  fetchSearchHotDetail,
  fetchSearchSuggest,
  fetchSearchResult,
  fetchSongDetail
} from '@/api'

export class searchStore {
  @observable searchDefault = {}
  @observable searchHotDetail = []
  @observable searchSuggest = {}
  @observable searchHistory = []

  // searchResult
  @observable lastSearch = 'complex' // 上次搜索的栏目
  @observable complex = {} // 综合
  @observable song = { songs: [], privileges: [], hasMore: true } // 单曲
  // @observable mlog = {} // 云村
  @observable video = {} // 视频
  @observable artist = {} // 歌手
  @observable album = {} // 专辑
  @observable playList = {} // 歌单
  @observable djRadio = {} // 主播电台
  @observable user = {} // 用户

  // 每次searchKeyword变化时或者第一次进入searchResult页面都需要重置结果
  @action resetSearchResult() {
    this.song = { songs: [], privileges: [], hasMore: true }
    this.complex = {}
  }

  @action setSearchKeyword(keyword) {
    this.searchKeyword = keyword
    localStorage.setItem('searchKeyword', JSON.stringify(keyword))
  }

  @action addSearchHistory(keyword) {
    if (!this.searchHistory.includes(keyword)) {
      this.searchHistory.unshift(keyword)
    }
  }
  @action deleteAllSearchHistory() {
    this.searchHistory = []
  }

  getSearchDefault = flow(function* () {
    const res = yield fetchSearchDefault()
    this.searchDefault = res.data
  })
  getSearchHotDetail = flow(function* () {
    const res = yield fetchSearchHotDetail()
    this.searchHotDetail = res.data
  })
  getSearchSuggest = flow(function* (keyword) {
    const res = yield fetchSearchSuggest(keyword)
    this.searchSuggest = res.result
  })

  getComplex = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1018)
    console.log('fetch complex', keyword, res)

    const trackIdsString = res.result?.song.resourceIds.join(',')
    // 用trackIds拼凑的ids字符串，请求全部的歌曲
    const songsData = yield fetchSongDetail(trackIdsString)
    res.result.song = {
      ...res.result.song,
      songs: songsData.songs,
      privileges: songsData.privileges
    }

    this.complex = res.result
  })
  getSong = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1)
    if (res.result.songCount === 0) return
    const trackIdsString = res.result.songs.reduce((total, item, index) => {
      if (index === 0) {
        return total + item.id
      }
      return total + ',' + item.id
    }, '')

    // 用trackIds拼凑的ids字符串，请求全部的歌曲
    const songsData = yield fetchSongDetail(trackIdsString)
    this.song = {
      songs: [...this.song.songs, ...songsData.songs],
      privileges: [...this.song.privileges, ...songsData.privileges],
      hasMore: res.result.hasMore
    }

    // 直接push不能让组件重新渲染
    // this.song.songs.push(...songsData.songs)
    // this.song.privileges.push(...songsData.privileges)
  })
  getVideo = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1004)
    this.video = res.result
  })
  getArtist = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 100)
    this.artist = res.result
  })
  getAlbum = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 10)
    this.album = res.result
  })
  getPlayList = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1000)
    this.playList = res.result
  })
  getDjRadio = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1009)
    this.djRadio = res.result
  })
  getUser = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1002)
    this.user = res.result
  })
}
