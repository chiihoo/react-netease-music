import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { AliveScope } from 'react-activation'
import routes from './routes'
import { useDeviceChangeReload } from './hooks'
import './App.css'

function App() {
  // Chrome调试模式 PC端与移动端互相切换时，swiper无法滑动，需要手动刷新
  useDeviceChangeReload()

  return (
    <div className="App">
      <BrowserRouter>
        <AliveScope>{renderRoutes(routes)}</AliveScope>
      </BrowserRouter>
    </div>
  )
}

export default App
