import React, { useEffect, lazy, Suspense } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import { useDeviceChangeReload, useIsHeightChange } from './hooks'
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

  const match = useRouteMatch(['/player', '/login'])

  // 安卓移动端唤起输入法时，输入法的区域不占页面高度，就会把页面高度变小，此时固定在页面底部的元素会被顶起
  // 因此可以通过页面高度来判断是否唤起了输入法
  const isHeightChange = useIsHeightChange()

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
          // 如果播放队列有歌曲，并且不是在player页面和login页面的话，则需要给底下的mini-player组件留出空间
          // 移动端如果唤起了输入法，isHeightChange为true，则要把留出的空间给还原
          bottom: playerStore.playList.length > 0 && !match && !isHeightChange && '18.667vw'
        }}
      >
        <Suspense fallback={null}>
          <CacheSwitch>
            <CacheRoute path="/" exact render={() => <Redirect to="/home" />} />
            <CacheRoute path="/home" component={LazyHome} />
            <CacheRoute path="/playlist/:id" component={LazyPlaylist} />
            <CacheRoute path="/search" component={LazySearch} when={() => false} />
            <CacheRoute path="/player" component={LazyPlayer} />
            <CacheRoute path="/login" component={LazyLogin} />
          </CacheSwitch>
        </Suspense>
      </div>
      <Audio />
      <div
        style={{
          visibility:
            playerStore.playList.length === 0 || match || isHeightChange ? 'hidden' : 'visible'
        }}
      >
        <MiniPlayer />
      </div>
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
