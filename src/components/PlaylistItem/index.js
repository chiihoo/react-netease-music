import React from 'react'
import { Link } from 'react-router-dom'
import PlaylistCoverImg from '@/components/PlaylistCoverImg'
import './index.scss'

// 单个歌单 方块形展示组件
const PlaylistItem = props => {
  const { data } = props
  
  return (
    <div className="playlist-item">
      <Link to={`/playlist/${data.id}`}>
        <PlaylistCoverImg data={data} />
        <p className="desc two-lines-ellipsis">{data.name}</p>
      </Link>
    </div>
  )
}

export default React.memo(PlaylistItem)
