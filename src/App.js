import React, { useEffect } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import { useDeviceChangeReload } from './hooks'
import Home from './containers/home'
import Search from './containers/search'
import Playlist from './containers/playlist'
import Player from './containers/player'
import MiniPlayer from './containers/mini-player'
import Audio from './containers/audio'
import Login from './containers/login'
import { PlayListDrawer, HomeLeftDrawer } from './containers/drawers'
import { DeleteAllDialog } from './containers/dialogs'
import './App.css'

function App() {
  // Chrome调试模式 PC端与移动端互相切换时，swiper无法滑动，需要手动刷新
  useDeviceChangeReload()

  const { loginStore, playerStore } = useStores()

  const playerMatch = useRouteMatch('/player')

  useEffect(() => {
    // 如果是登录状态，则需要获取账户信息
    if (loginStore.isLogin) {
      loginStore.getAccountInfo()
    }
    // eslint-disable-next-line
  }, [loginStore.isLogin])

  return useObserver(() => (
    <div className="App">
      <div
        className="app-main"
        style={{
          bottom: !(playerStore.playList.length === 0 || playerMatch) && '13.333vw'
        }}
      >
        <CacheSwitch>
          <CacheRoute path="/" exact render={() => <Redirect to="/home" />} />
          <CacheRoute path="/home" component={Home} />
          <CacheRoute path="/playlist/subscribers" component={() => <>歌单订阅者</>} />
          <CacheRoute path="/playlist/recommend" component={() => <>歌单广场</>} />
          <CacheRoute path="/playlist/:id" component={Playlist} />
          <CacheRoute path="/search" component={Search} when={() => false} />
          <CacheRoute path="/recommend/taste" component={() => <>日推</>} />
          <CacheRoute path="/player" component={Player} />
          <CacheRoute path="/user/:uid" component={() => <>用户信息</>} />
          <CacheRoute path="/toplist" component={() => <>排行榜</>} />
          <CacheRoute path="/radio" component={() => <>电台</>} />
          <CacheRoute path="/hotwall" component={() => <>云村热评墙</>} />
          <CacheRoute path="/login" component={Login} />
        </CacheSwitch>
      </div>
      <Audio />
      <MiniPlayer />
      <div className="drawer-wrapper">
        <PlayListDrawer />
        <HomeLeftDrawer />
      </div>
      <div className="dialog-wrapper">
        <DeleteAllDialog />
      </div>
    </div>
  ))
}

export default App
