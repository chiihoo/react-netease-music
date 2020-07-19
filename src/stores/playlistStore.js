import { observable, flow } from 'mobx'
import { fetchPlaylistDetail, fetchSongDetail } from '@/api'

export class playlistStore {
  @observable loadingStatus = 0
  @observable playlistData = {}
  @observable songs = []
  @observable privileges = [] // 歌曲的SQ、VIP等特殊权限
  @observable copyRights = [] // 歌曲是否有版权

  getPlaylistData = flow(function* (id) {
    this.loadingStatus = 0
    // 最多只能拿到1000首，但是trackIds是完整的，可以用这个请求所有的歌曲
    const res = yield fetchPlaylistDetail(id)
    this.playlistData = res.playlist
    // trackIds中的每一个id，间隔逗号拼成的字符串
    const trackIdsString = this.playlistData.trackIds.reduce((total, item, index) => {
      if (index === 0) {
        return total + item.id
      }
      return total + ',' + item.id
    }, '')
    // 用trackIds拼凑的ids字符串，请求全部的歌曲
    const songsData = yield fetchSongDetail(trackIdsString)
    this.songs = songsData.songs
    this.privileges = songsData.privileges

    this.loadingStatus = 1
  })
}
