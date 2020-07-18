import React from 'react'
import loadingSvg from '@/assets/svgIcons/loading.svg'
import './index.scss'

// 歌单页面 骨架屏
const PlaylistSkeleton = () => {
  return (
    <div className="playlist-skeleton">
      <div className="playlist-cover-img"></div>
      <div className="playlist-avatar"></div>
      <div className="loading-notice">
        <img src={loadingSvg} alt="" className="loading" />
        <span>努力加载中...</span>
      </div>
    </div>
  )
}

export default React.memo(PlaylistSkeleton)
