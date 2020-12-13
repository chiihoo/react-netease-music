import React, { useEffect, lazy, Suspense } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import { useDeviceChangeReload } from './hooks'
import Audio from './containers/audio'
import MiniPlayer from './containers/mini-player'
import { PlayListDrawer, HomeLeftDrawer } from './containers/drawers'
import { DeleteAllDialog } from './containers/dialogs'
import './App.css'

const LazyHome = lazy(() => import('./containers/home'))
const LazyPlaylist = lazy(() => import('./containers/playlist'))
const LazySearch = lazy(() => import('./containers/search'))
const LazyPlayer = lazy(() => import('./containers/player'))
const LazyLogin = lazy(() => import('./containers/login'))

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
          // 如果播放队列有歌曲，并且不是在player页面的话，则需要给底下的mini-player组件留出空间
          // bottom: !(playerStore.playList.length === 0 || playerMatch) && '13.333vw'
          bottom: playerStore.playList.length > 0 && !playerMatch && '13.333vw'
        }}
      >
        <Suspense fallback={null}>
          <CacheSwitch>
            <CacheRoute path="/" exact render={() => <Redirect to="/home" />} />
            <CacheRoute path="/home" component={LazyHome} />
            <CacheRoute path="/playlist/:id" component={LazyPlaylist} />
            <CacheRoute path="/search" component={LazySearch} />
            <CacheRoute path="/player" component={LazyPlayer} />
            <CacheRoute path="/login" component={LazyLogin} />
          </CacheSwitch>
        </Suspense>
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
