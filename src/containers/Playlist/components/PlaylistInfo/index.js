import React from 'react'
import PlaylistCoverImg from '@/components/PlaylistCoverImg'

import './index.scss'
// 歌单页面中部 歌单信息
const PlaylistInfo = props => {
  const { playlistData, coverImgUrl, opacity } = props

  return (
    <div className="playlist-info">
      <div
        className="playlist-info-bg-img"
        style={{ backgroundImage: `url(${coverImgUrl})` }}
      ></div>
      <div className="playlist-info-main" style={{ opacity }}>
        <div className="playlist-cover-img-wrapper">
          <PlaylistCoverImg data={playlistData} />
        </div>
        <div className="playlist-info-main-right">
          <p className="playlist-title two-lines-ellipsis">{playlistData.name}</p>
          <div className="playlist-creator">
            <img className="avatar" src={playlistData.creator.avatarUrl} alt="" />
            <span>{playlistData.creator.nickname}</span>
            <i className="iconfont icon-gengduo"></i>
          </div>
          <div className="playlist-desc ">
            <p className="two-lines-ellipsis">{playlistData.description}</p>
            <i className="iconfont icon-gengduo"></i>
          </div>
        </div>
      </div>
      <div className="playlist-options" style={{ opacity }}>
        <div className="playlist-comment">
          <i className="iconfont icon-pinglun"></i>
          <span>{playlistData.commentCount || '评论'}</span>
        </div>
        <div className="playlist-share">
          <i className="iconfont icon-fenxiang"></i>
          <span>{playlistData.shareCount || '分享'}</span>
        </div>
        <div className="playlist-download">
          <i className="iconfont icon-xiazai"></i>
          <span>下载</span>
        </div>
        <div className="playlist-multiple-choice">
          <i className="iconfont icon-duoxuan"></i>
          <span>多选</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(PlaylistInfo)
