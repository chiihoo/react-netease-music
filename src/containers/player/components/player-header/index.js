import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Ticker from '@/components/ticker'
import { usePageVisibility } from '@/hooks'
import './index.scss'

// 播放页面顶部
const PlayerHeader = props => {
  const { song } = props

  const history = useHistory()
  const location = useLocation()
  const isVisible = usePageVisibility()

  return (
    <div className="player-header">
      <i
        className="iconfont icon-fanhui"
        onClick={() => {
          history.goBack()
        }}
      ></i>
      <div className="info">
        <div className="name">
          {isVisible && (
            <Ticker
              speed={window.innerWidth / 150}
              childMargin={window.innerWidth / 7.5}
              // 由于react-router-cache-route有缓存，切换路由时动画会出问题，所以每次切换路由都重新加载
              key={song.id + location.pathname}
            >
              <span style={{ whiteSpace: 'nowrap' }}>
                {song.name}
                {song.alia?.length > 0 && `（ ${song.alia[0]} ）`}
              </span>
            </Ticker>
          )}
        </div>
        <div className="artists-wrapper">
          <div className="artists one-line-ellipsis">
            {song.ar.reduce((total, artist, index, arr) => {
              return index !== arr.length - 1 ? total + artist.name + '/' : total + artist.name
            }, '')}
          </div>
          <i className="iconfont icon-gengduo"></i>
        </div>
      </div>
      <i className="iconfont icon-fenxiang"></i>
    </div>
  )
}
export default React.memo(PlayerHeader)
