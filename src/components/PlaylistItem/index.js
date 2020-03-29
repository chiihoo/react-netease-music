import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

const PlaylistItem = props => {
  const { data } = props
  return (
    <div className="PlaylistItem">
      <Link to={`/playlist/${data.id}`}>
        <div className="img-wrapper">
          <img src={data.coverImgUrl} title={data.name} alt="" className="cover-img" />
          <div className="play-count">
            <i className="iconfont icon-bofang5"></i>
            <span>
              {data.playCount >= 100000 ? parseInt(data.playCount / 10000) + '万' : data.playCount}
            </span>
          </div>
        </div>
        <div className="desc">{data.name}</div>
      </Link>
    </div>
  )
}

export default PlaylistItem
