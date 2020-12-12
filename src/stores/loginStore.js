import { observable, computed, action, flow } from 'mobx'
import { fetchAccountInfo, fetchUserPlaylist, fetchLogout } from '@/api'

export class loginStore {
  // 账户信息
  @observable accountInfo = {}
  // 用户歌单
  @observable userPlaylist = []

  @observable isLogin = document.cookie.indexOf('MUSIC_U=') !== -1

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
  })

  getUserPlaylist = flow(function* (uid) {
    const { playlist } = yield fetchUserPlaylist(uid)
    this.userPlaylist = playlist
  })

  logout = flow(function* () {
    yield fetchLogout()
    this.accountInfo = {}
  })

  @action
  changeLoginStatus(isLogin) {
    this.isLogin = isLogin
  }
}
