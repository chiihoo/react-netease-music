import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Ticker from '@/components/Ticker'

import './index.scss'

// 歌单页面顶部header
const PlaylistHeader = props => {
  const { playlistData, isTicker, coverImgUrl, opacity } = props

  const history = useHistory()

  const goBack = useCallback(() => {
    history.goBack()
  }, [history])

  return (
    <div className="playlist-header">
      <div
        className="playlist-header-bg-img"
        style={{
          backgroundImage: `url(${coverImgUrl})`,
          opacity,
          height: opacity === 1 && '18.667vw',
        }}
      ></div>
      <i className="iconfont icon-fanhui" onClick={goBack}></i>
      <div className="title">
        {!isTicker ? (
          <span>歌单</span>
        ) : (
          <Ticker speed={window.innerWidth / 150} childMargin={window.innerWidth / 7.5}>
            <span style={{ whiteSpace: 'nowrap' }}>{playlistData.name}</span>
          </Ticker>
        )}
      </div>
      <i className="iconfont icon-sousuo"></i>
      <i className="iconfont icon-more"></i>
    </div>
  )
}

export default React.memo(PlaylistHeader)
