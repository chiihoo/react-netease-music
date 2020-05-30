import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { useDeviceChangeReload } from './hooks'
import Home from './containers/Home'
import Playlist from './containers/Playlist'
import './App.css'

function App() {
  // Chrome调试模式 PC端与移动端互相切换时，swiper无法滑动，需要手动刷新
  useDeviceChangeReload()

  return (
    <div className="App">
      <BrowserRouter>
        <CacheSwitch>
          <Route path="/" exact render={() => <Redirect to="/home" />} />
          <CacheRoute path="/home" component={Home} />
          <CacheRoute path="/playlist/subscribers" component={() => <>歌单订阅者</>} />
          <CacheRoute path="/playlist/recommend" component={() => <>歌单广场</>} />
          <CacheRoute path="/playlist/:id" component={Playlist} />
          <CacheRoute path="/search" component={() => <>搜索</>} />
          <CacheRoute path="/recommend/taste" component={() => <>日推</>} />
          <CacheRoute path="/play" component={() => <>播放页面</>} />
          <CacheRoute path="/user/:uid" component={() => <>用户信息</>} />
          <CacheRoute path="/toplist" component={() => <>排行榜</>} />
          <CacheRoute path="/radio" component={() => <>电台</>} />
          <CacheRoute path="/hotwall" component={() => <>云村热评墙</>} />
        </CacheSwitch>
      </BrowserRouter>
    </div>
  )
}

export default App
