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
    this.songs = []
    this.privileges = []
    // 最多只能拿到1000首，但是trackIds是完整的，可以用这个请求所有的歌曲
    const res = yield fetchPlaylistDetail(id)
    this.playlistData = res.playlist
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
}
