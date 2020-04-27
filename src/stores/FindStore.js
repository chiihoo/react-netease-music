import { observable, flow } from 'mobx'
import { chunk } from 'lodash'
import {
  fetchBanner,
  fetchHotwall,
  fetchRecommendPlaylists,
  fetchNewSongs,
  fetchNewAlbums
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
  getBannerList: flow(function* () {
    const res = yield fetchBanner()
    this.bannerList = res.banners
  }),
  // 获取云村热评墙
  getHotwallList: flow(function* () {
    const res = yield fetchHotwall()
    this.hotwallList = res.data
  }),
  // 获取推荐歌单
  getRecommendPlaylists: flow(function* () {
    const res = yield fetchRecommendPlaylists(6, '全部')
    this.recommendPlaylists = res.playlists
  }),
  // 获取场景推荐歌单
  getSceneRecommendPlaylists: flow(function* () {
    const res = yield fetchRecommendPlaylists(6, '官方')
    this.sceneRecommendPlaylists = res.playlists
  }),
  // 获取新歌
  getNewSongs: flow(function* () {
    const res = yield fetchNewSongs()
    this.newSongs = res.result
  }),
  // 获取新碟
  getNewAlbums: flow(function* () {
    const res = yield fetchNewAlbums()
    this.newAlbums = res.albums
  }),
  // 统一获取Find页面数据
  getFindData: flow(function* () {
    // Promise.allSettled不会像Promise.all那样，只有有任何一个promise失败，所有的promise就全都挂掉了
    yield Promise.allSettled([
      this.getBannerList(),
      this.getHotwallList(),
      this.getRecommendPlaylists(),
      this.getSceneRecommendPlaylists(),
      this.getNewSongs(),
      this.getNewAlbums()
    ])
  })
})
