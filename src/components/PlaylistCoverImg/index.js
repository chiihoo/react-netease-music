import React from 'react'
import './index.scss'

// 歌单封面组件
const PlaylistCoverImg = props => {
  const { data } = props

  return (
    <div className="playlist-cover-img">
      <div className="img-wrapper">
        <img src={data.coverImgUrl} title={data.name} alt="" className="cover-img" />
        <div className="play-count">
          <i className="iconfont icon-yousanjiao"></i>
          <span>
            {data.playCount >= 100000 ? parseInt(data.playCount / 10000) + '万' : data.playCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(PlaylistCoverImg)
