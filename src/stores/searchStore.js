import { observable, action, computed, flow } from 'mobx'
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

  @observable activeIndex = 0

  // searchResult
  @observable lastSearch = 'complex' // 上次搜索的栏目
  @observable complex = {} // 综合
  @observable song = { songs: [], privileges: [], hasMore: true } // 单曲
  @observable playList = { playlists: [] } // 歌单
  @observable video = { mvs: [] } // 视频
  @observable artist = { artists: [] } // 歌手
  @observable album = { albums: [] } // 专辑
  @observable djRadio = { djRadios: [] } // 主播电台
  @observable user = { userprofiles: [] } // 用户

  @computed
  get complexNotFind() {
    return (
      this.complex.song?.songs.length === 0 &&
      this.complex.playList?.playLists.length === 0 &&
      this.complex.video?.videos.length === 0
    )
  }

  @action changeActiveIndex(index) {
    this.activeIndex = index
  }

  // 每次searchKeyword变化时或者第一次进入searchResult页面都需要重置结果
  @action resetSearchResult() {
    this.complex = {} // 综合
    this.song = { songs: [], privileges: [] } // 单曲
    this.playList = { playlists: [] } // 歌单
    this.video = { mvs: [] } // 视频
    this.artist = { artists: [] } // 歌手
    this.album = { albums: [] } // 专辑
    this.djRadio = { djRadios: [] } // 主播电台
    this.user = { userprofiles: [] } // 用户
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
    const trackIdsString = res.result?.song.resourceIds.join(',')
    // 用trackIds拼凑的ids字符串，请求全部的歌曲
    const songsData = yield fetchSongDetail(trackIdsString)
    this.complex = {
      ...res.result,
      song: {
        ...res.result.song,
        songs: songsData?.songs || [],
        privileges: songsData?.privileges || []
      }
    }
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
      ...res.result,
      songs: [...this.song.songs, ...(songsData?.songs || [])],
      privileges: [...this.song.privileges, ...(songsData?.privileges || [])]
    }

    // 直接push不能让组件重新渲染
    // this.song.songs.push(...songsData.songs)
    // this.song.privileges.push(...songsData.privileges)
  })

  getPlayList = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1000)
    this.playList = {
      ...res.result,
      playlists: [...this.playList.playlists, ...(res.result?.playlists || [])]
    }
  })

  getVideo = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1004)
    this.video = { ...res.result, mvs: [...this.video.mvs, ...(res.result?.mvs || [])] }
  })

  getArtist = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 100)
    this.artist = {
      ...res.result,
      artists: [...this.artist.artists, ...(res.result?.artists || [])]
    }
  })

  getAlbum = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 10)
    this.album = { ...res.result, albums: [...this.album.albums, ...(res.result?.albums || [])] }
  })

  getDjRadio = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1009)
    this.djRadio = {
      ...res.result,
      // 这里可能会返回res={result:{}, code:200}，所以必须加上 || []，避免...undefined报错
      djRadios: [...this.djRadio?.djRadios, ...(res.result?.djRadios || [])]
    }
  })

  getUser = flow(function* (keyword, offset = 0, limit = 30) {
    const res = yield fetchSearchResult(keyword, offset, limit, 1002)
    this.user = {
      ...res.result,
      userprofiles: [...this.user.userprofiles, ...(res.result?.userprofiles || [])]
    }
  })
}
