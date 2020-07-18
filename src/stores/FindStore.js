import { observable, flow } from 'mobx'
import {
  fetchBanner,
  fetchRecommendPlaylists,
  fetchNewSongs,
  fetchNewAlbums,
  fetchSongDetail
} from '@/api'

export class findStore {
  @observable loadingStatus = 0 // 0：请求未完成； 1：请求完成；
  @observable bannerList = []
  @observable recommendPlaylists = []
  @observable sceneRecommendPlaylists = []
  @observable newSongs = []
  @observable privileges = []
  @observable newAlbums = []

  // 获取首页轮播图
  getBannerList = flow(function* () {
    const res = yield fetchBanner()
    this.bannerList = res.banners
  })
  // 获取推荐歌单
  getRecommendPlaylists = flow(function* () {
    const res = yield fetchRecommendPlaylists(6, '全部')
    this.recommendPlaylists = res.playlists
  })
  // 获取场景推荐歌单
  getSceneRecommendPlaylists = flow(function* () {
    const res = yield fetchRecommendPlaylists(6, '官方')
    this.sceneRecommendPlaylists = res.playlists
  })
  // 获取新歌
  getNewSongs = flow(function* () {
    const res = yield fetchNewSongs()
    const ids = res.result.reduce((total, item, index) => {
      if (index === 0) {
        return total + item.id
      } else {
        return total + ',' + item.id
      }
    }, '')
    const songsData = yield fetchSongDetail(ids)
    this.newSongs = songsData.songs
    this.privileges = songsData.privileges
  })
  // 获取新碟
  getNewAlbums = flow(function* () {
    const res = yield fetchNewAlbums()
    this.newAlbums = res.albums
  })
  // 统一获取Find页面数据
  getFindData = flow(function* () {
    this.loadingStatus = 0
    // Promise.allSettled不会像Promise.all那样，只有有任何一个promise失败，所有的promise就全都挂掉了，但兼容性不佳
    // 在后面主动map catch错误，这样catch方法返回值会被promise.reslove()包裹，传进promise.all的数据都是resolved状态
    // 这样就可以避免任意一个promise失败导致所有都挂掉了
    yield Promise.all(
      [
        this.getBannerList(),
        this.getRecommendPlaylists(),
        this.getSceneRecommendPlaylists(),
        this.getNewSongs(),
        this.getNewAlbums()
      ].map(p =>
        p.catch(e => {
          console.log(e)
        })
      )
    )
    this.loadingStatus = 1
  })
}
