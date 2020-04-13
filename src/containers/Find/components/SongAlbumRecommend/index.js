import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import SongAlbumShowSwiper from '../SongAlbumShowSwiper'
import './index.scss'

// 新歌新碟导航卡片
const SongAlbumRecommend = props => {
  const [currentTab, setCurrentTab] = useState('newSong')

  const {
    newSongAlbum: { newSongs, newAlbums }
  } = props

  return (
    <div className="SongAlbumRecommend">
      <div className="header">
        <div className="header-left">
          <div className="date">
            {new Date().getMonth() + 1}月{new Date().getDate()}日
          </div>
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
        <SongAlbumShowSwiper data={newSongs} />
      </div>
      <div style={{ display: currentTab === 'newAlbum' ? 'block' : 'none' }}>
        <SongAlbumShowSwiper isSong={false} data={newAlbums} />
      </div>
    </div>
  )
}
export default React.memo(SongAlbumRecommend)
