import { observable, action } from 'mobx'

export class triggerStore {
  @observable showPlayListDrawer = false // player和mini-player的当前播放列表抽屉
  @observable showDeleteAllDialog = false // playerDrawer里面的删除全部歌曲的对话框
  @observable showHomeLeftDrawer = false // home页面弹出左侧抽屉

  @action
  changeShowPlayListDrawer(isShow) {
    this.showPlayListDrawer = typeof isShow === 'boolean' ? isShow : !this.showPlayListDrawer
  }
  @action
  changeShowDeleteAllDialog(isShow) {
    this.showDeleteAllDialog = typeof isShow === 'boolean' ? isShow : !this.showDeleteAllDialog
  }
  @action
  changeShowHomeLeftDrawer(isShow) {
    this.showHomeLeftDrawer = typeof isShow === 'boolean' ? isShow : !this.showHomeLeftDrawer
  }
}
