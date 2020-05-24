import { observable, flow } from 'mobx'
import { fetchPlaylistDetail, fetchSongDetail } from '@/api'
export const PlaylistStore = observable({
  playlistData: {},
  songsData: {},

  getPlaylistData: flow(function* (id) {
    // 最多只能拿到1000首，但是trackIds是完整的，可以用这个请求所有的歌曲
    const res = yield fetchPlaylistDetail(id)
    this.playlistData = res.playlist
    // trackIds中的每一个id，间隔逗号拼成的字符串
    const trackIdsString = this.playlistData.trackIds.reduce((total, curItem, curIndex) => {
      if (curIndex === 0) {
        return total + curItem.id
      }
      return total + ',' + curItem.id
    }, '')
    // 用trackIds拼凑的ids字符串，请求全部的歌曲
    this.songsData = yield fetchSongDetail(trackIdsString)
  })
})
