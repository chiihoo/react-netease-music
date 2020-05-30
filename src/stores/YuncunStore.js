import { observable, flow } from 'mobx'
import { fetchHotwall } from '@/api'

export const YuncunStore = observable({
  hotwallList: [],

  // 云村热评墙数据
  get hotwallNavList() {
    return this.hotwallList.map(item => ({
      id: item.id,
      content: item.content,
      avatar: item.simpleUserInfo.avatar,
      songCoverUrl: item.simpleResourceInfo.songCoverUrl
    }))
  },

  getYuncunData: flow(function* () {
    const res = yield fetchHotwall()
    this.hotwallList = res.data
  })
})
