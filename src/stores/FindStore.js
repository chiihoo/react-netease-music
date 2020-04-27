import { observable, flow } from 'mobx'
import { chunk } from 'lodash'
import {
  getBannerRequest,
  getHotwallRequest,
  getRecommendPlaylistsRequest,
  getNewSongsRequest,
  getNewAlbumsRequest
} from '@/api'

export const FindStore = observable({
  bannerList: [],
  hotwallList: [],
  recommendPlaylists: [],
  sceneRecommendPlaylists: [],
  newSongs: [],
  newAlbums: [],

  // 云村热评墙数据
  get hotwallNavList() {
    return this.hotwallList.map(item => ({
      id: item.id,
      content: item.content,
      avatar: item.simpleUserInfo.avatar,
      songCoverUrl: item.simpleResourceInfo.songCoverUrl
    }))
  },
  // 新歌新碟数据
  get newSongAlbum() {
    return {
      newSongs: chunk(this.newSongs.slice(0, 6), 3),
      newAlbums: chunk(this.newAlbums.slice(0, 6), 3)
    }
  },

  // 获取首页轮播图
  fetchBannerList: flow(function* () {
    const res = yield getBannerRequest()
    this.bannerList = res.banners
  }),
  // 获取云村热评墙
  fetchHotwallList: flow(function* () {
    const res = yield getHotwallRequest()
    this.hotwallList = res.data
  }),
  // 获取推荐歌单
  fetchRecommendPlaylists: flow(function* () {
    const res = yield getRecommendPlaylistsRequest(6, '全部')
    this.recommendPlaylists = res.playlists
  }),
  // 获取场景推荐歌单
  fetchSceneRecommendPlaylists: flow(function* () {
    const res = yield getRecommendPlaylistsRequest(6, '官方')
    this.sceneRecommendPlaylists = res.playlists
  }),
  // 获取新歌
  fetchNewSongs: flow(function* () {
    const res = yield getNewSongsRequest()
    this.newSongs = res.result
  }),
  // 获取新碟
  fetchNewAlbums: flow(function* () {
    const res = yield getNewAlbumsRequest()
    this.newAlbums = res.albums
  }),
  // 统一获取Find页面数据
  fetchFindData: flow(function* () {
    // Promise.allSettled不会像Promise.all那样，只有有任何一个promise失败，所有的promise就全都挂掉了
    yield Promise.allSettled([
      this.fetchBannerList(),
      this.fetchHotwallList(),
      this.fetchRecommendPlaylists(),
      this.fetchSceneRecommendPlaylists(),
      this.fetchNewSongs(),
      this.fetchNewAlbums()
    ])
  })
})
