import { observable, flow } from 'mobx'
import {
  fetchPlaylistDetail,
  fetchSongDetail,
  fetchSubscribePlaylist,
  fetchUnsubscribePlaylist
} from '@/api'

export class playlistStore {
  @observable loadingStatus = 0
  @observable playlistData = {}
  @observable songs = []
  @observable privileges = [] // 歌曲的SQ、VIP等特殊权限
  @observable copyRights = [] // 歌曲是否有版权
  @observable subscribed = false // 歌曲是否被订阅

  getPlaylistData = flow(function* (id) {
    this.loadingStatus = 0
    this.songs = []
    this.privileges = []
    // 最多只能拿到1000首，但是trackIds是完整的，可以用这个请求所有的歌曲
    const res = yield fetchPlaylistDetail(id)
    this.playlistData = res.playlist
    this.subscribed = res.playlist.subscribed
    // trackIds中的每一个id，间隔逗号拼成的字符串
    // 如果一次性请求太多会报错，限制每次的请求的id个数为800
    let count = 0
    while (count < res.playlist.trackIds.length) {
      let arr = this.playlistData.trackIds.slice(count, count + 800)
      count = count + 800
      const trackIdsString = arr.reduce((total, item, index) => {
        if (index === 0) {
          return total + item.id
        }
        return total + ',' + item.id
      }, '')
      const songsData = yield fetchSongDetail(trackIdsString)
      this.songs = [...this.songs, ...songsData.songs]
      this.privileges = [...this.privileges, ...songsData.privileges]
    }

    this.loadingStatus = 1
  })

  // 收藏歌单
  subscribePlaylist = flow(function* (id) {
    yield fetchSubscribePlaylist(id)
    // 由于收藏歌单的方法不会马上反应到fetchPlaylistDetail的结果上，也就是说都有延迟，暂时没有实时获取歌曲是否被收藏的接口，所以改成用本地的存储
    // const res = yield fetchPlaylistDetail(id)
    // this.playlistData = { ...res.playlist }
    this.subscribed = true
  })

  // 取消收藏歌单
  unsubscribePlaylist = flow(function* (id) {
    yield fetchUnsubscribePlaylist(id)
    this.subscribed = false
  })
}
