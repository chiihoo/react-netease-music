import React, { useState, useEffect } from 'react'
import PlaylistCoverImg from '@/components/PlaylistCoverImg'
import { imgBlurToBase64 } from '@/utils/tools'

import './index.scss'
// 歌单页面中部 歌单信息
const PlaylistInfo = props => {
  const [coverImgUrl, setCoverImgUrl] = useState()

  const { playlistData, opactiy } = props

  useEffect(() => {
    ;(async function () {
      // 先把图片缩略，再进行高斯模糊
      const imgUrl = await imgBlurToBase64(
        playlistData.coverImgUrl + '?imageView=1&thumbnail=225x0',
        50
      )
      setCoverImgUrl(imgUrl)
    })()
  }, [playlistData.coverImgUrl])

  return (
    <div className="playlist-info">
      <div className="playlist-bg-img" style={{ backgroundImage: `url(${coverImgUrl})` }}></div>
      <div className="playlist-info-main" style={{ opacity: opactiy }}>
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
      <div className="playlist-options" style={{ opacity: opactiy }}>
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
