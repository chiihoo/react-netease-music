import { observable, action, flow } from 'mobx'
import {
  fetchSearchDefault,
  fetchSearchHotDetail,
  fetchSearchSuggest,
  fetchSearchResult
} from '@/api'

export class searchStore {
  @observable searchDefault = {}
  @observable searchHotDetail = []
  @observable searchSuggest = {}
  @observable searchHistory = []

  // searchResult
  @observable lastSearch = 'complex' // 上次搜索的栏目
  @observable complex = {} // 综合
  @observable song = {} // 单曲
  @observable mlog = {} // 云村
  @observable video = {} // 视频
  @observable artist = {} // 歌手
  @observable album = {} // 专辑
  @observable playList = {} // 歌单
  @observable djRadio = {} // 主播电台
  @observable user = {} // 用户

  // 搜索结果页面的栏目名臣
  @observable columns = [
    { name: '综合', nickname: 'complex' },
    { name: '单曲', nickname: 'song' },
    { name: '云村', nickname: 'mlog' },
    { name: '视频', nickname: 'video' },
    { name: '歌手', nickname: 'artist' },
    { name: '专辑', nickname: 'album' },
    { name: '歌单', nickname: 'playList' },
    { name: '主播电台', nickname: 'djRadio' },
    { name: '用户', nickname: 'user' }
  ]

  @action addSearchHistory(keyword) {
    if (!this.searchHistory.includes(keyword)) {
      this.searchHistory.unshift(keyword)
    }
  }
  @action deleteAllSearchHistory() {
    console.log(555)
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
  getSearchSuggest = flow(function* (keywords) {
    const res = yield fetchSearchSuggest(keywords)
    this.searchSuggest = res.result
  })

  getComplex = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1018)
    this.complex = res.result
  })
  getSong = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1)
    this.song = res.result
  })
  getVideo = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1004)
    this.video = res.result
  })
  getArtist = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 100)
    this.artist = res.result
  })
  getAlbum = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 10)
    this.album = res.result
  })
  getPlayList = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1000)
    this.playList = res.result
  })
  getDjRadio = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1009)
    this.djRadio = res.result
  })
  getUser = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords, 1002)
    this.user = res.result
  })
}
