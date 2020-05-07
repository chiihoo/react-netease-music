import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import SongShowSwiper from '../SongShowSwiper'
import AlbumShowSwiper from '../AlbumShowSwiper'
import './index.scss'

// 新歌新碟导航卡片
const SongAlbumRecommend = props => {
  const [currentTab, setCurrentTab] = useState('newSong')

  const {
    newSongAlbum: { newSongs, newAlbums }
  } = props

  return (
    <div className="song-album-recommend">
      <div className="header">
        <div className="header-left">
          <span className="date">
            {new Date().getMonth() + 1}月{new Date().getDate()}日
          </span>
          <div className="tabs">
            <span
              className={classNames({ active: currentTab === 'newSong' })}
              onClick={() => {
                setCurrentTab('newSong')
              }}
            >
              新歌
            </span>
            <span className="dividing-line"></span>
            <span
              className={classNames({ active: currentTab === 'newAlbum' })}
              onClick={() => {
                setCurrentTab('newAlbum')
              }}
            >
              新碟
            </span>
          </div>
        </div>
        <Link to="/" className="header-right">
          {currentTab === 'newSong' ? '更多新歌' : '更多新碟'}
        </Link>
      </div>
      <div style={{ display: currentTab === 'newSong' ? 'block' : 'none' }}>
        <SongShowSwiper data={newSongs} />
      </div>
      <div style={{ display: currentTab === 'newAlbum' ? 'block' : 'none' }}>
        <AlbumShowSwiper data={newAlbums} />
      </div>
    </div>
  )
}
export default React.memo(SongAlbumRecommend)
