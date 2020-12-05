import { observable, computed, flow } from 'mobx'
import { fetchAccountInfo, fetchUserPlaylist } from '@/api'

export class loginStore {
  @observable accountInfo = {}
  // 用户歌单
  @observable userPlaylist = []

  @computed
  get isLogin() {
    return document.cookie.indexOf('MUSIC_U=') !== -1
  }
  @computed
  get userId() {
    return this.accountInfo?.account?.id
  }
  // 我喜欢的音乐
  @computed
  get myFavoritePlaylist() {
    return this.userPlaylist[0] || {}
  }
  // 我创建的歌单
  @computed
  get myCreatedPlaylist() {
    return this.userPlaylist.slice(1).filter(item => item?.subscribed === false)
  }
  // 我收藏的歌单
  @computed
  get myCollectedPlaylist() {
    return this.userPlaylist.filter(item => item?.subscribed === true)
  }

  getAccountInfo = flow(function* () {
    const res = yield fetchAccountInfo()
    this.accountInfo = res
    console.log(res)
  })

  getUserPlaylist = flow(function* (uid) {
    const { playlist } = yield fetchUserPlaylist(uid)
    console.log(playlist)
    this.userPlaylist = playlist
  })
}
