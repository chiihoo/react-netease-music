import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import './index.scss'

// 新歌新碟导航卡片
const NewSongsAlbumsRecommend = props => {
  const { newSongs, newAlbums, currentSongId, handleSongItemClick } = props

  const [currentTab, setCurrentTab] = useState('newSongs')

  const params = {
    resistanceRatio: 0,
    shouldSwiperUpdate: true
  }

  return (
    <div className="new-songs-albums-recommend">
      <div className="header">
        <div className="header-left">
          <span className="date">
            {new Date().getMonth() + 1}月{new Date().getDate()}日
          </span>
          <div className="tabs">
            <span
              className={classNames({ active: currentTab === 'newSongs' })}
              onClick={() => {
                setCurrentTab('newSongs')
              }}
            >
              新歌
            </span>
            <span className="dividing-line"></span>
            <span
              className={classNames({ active: currentTab === 'newAlbums' })}
              onClick={() => {
                setCurrentTab('newAlbums')
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
      <div className="swiper-area-wrapper">
        <div
          className="songs-show"
          style={{ visibility: currentTab === 'newSongs' ? 'visible' : 'hidden' }}
        >
          <Swiper {...params} key="newSongs">
            {newSongs.map(itemArr => {
              return (
                <div key={itemArr[0].id}>
                  {itemArr.map(item => {
                    return (
                      <div
                        className="item-info"
                        key={item.id}
                        onClick={() => handleSongItemClick(item.id)}
                      >
                        <img
                          src={item.al.picUrl + '?param=200y200'}
                          alt={item.name}
                          className="item-cover-img"
                        />
                        <div className="item-main">
                          <div className="item-desc">
                            <p className="title one-line-ellipsis">
                              {item.name}
                              {item.alia.length > 0 && `（${item.alia[0]}）`}
                            </p>
                            <p className="artists one-line-ellipsis">
                              {item.ar.reduce((total, artist, index, arr) => {
                                return index !== arr.length - 1
                                  ? total + artist.name + '/'
                                  : total + artist.name
                              }, '- ')}
                            </p>
                          </div>
                          <div className="item-play-status">
                            {currentSongId === item.id ? (
                              <i className="iconfont icon-laba"></i>
                            ) : (
                              <img
                                src={require('@/assets/svgIcons/play.svg')}
                                alt="svg-play"
                                className="svg-play"
                              ></img>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </Swiper>
        </div>
        <div
          className="albums-show"
          style={{ visibility: currentTab === 'newAlbums' ? 'visible' : 'hidden' }}
        >
          <Swiper {...params} key="newAlbums">
            {newAlbums.map(itemArr => {
              return (
                <div key={itemArr[0].id}>
                  {itemArr.map(item => {
                    return (
                      <div className="item-info" key={item.id}>
                        <img
                          src={item?.picUrl + '?param=200y200'}
                          alt={item.name}
                          className="item-cover-img"
                        />
                        <div className="item-main">
                          <div className="item-desc">
                            <p className="title one-line-ellipsis">
                              {item.name}
                              {item.alias.length > 0 && `（${item.alias[0]}）`}
                            </p>
                            <p className="artists one-line-ellipsis">
                              {item.artists.reduce((total, artist, index, arr) => {
                                return index !== arr.length - 1
                                  ? total + artist.name + '/'
                                  : total + artist.name
                              }, '- ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
export default React.memo(NewSongsAlbumsRecommend)
