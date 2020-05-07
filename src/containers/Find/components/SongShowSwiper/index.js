import React, { useState } from 'react'
import Swiper from 'react-id-swiper'
import './index.scss'

// 新歌新碟卡片中 —— 新歌滑动展示区域
const SongShowSwiper = props => {
  const [currentPlayingId, setCurrentPlayingId] = useState()

  const { data } = props

  const params = {
    resistanceRatio: 0,
    shouldSwiperUpdate: true
  }

  return (
    <div className="song-show-swiper">
      <Swiper {...params}>
        {data.map(itemArr => {
          return (
            <div key={itemArr[0].id}>
              {itemArr.map(item => {
                return (
                  <div
                    className="item-info"
                    key={item.id}
                    onClick={() => setCurrentPlayingId(item.id)}
                  >
                    <img src={item.picUrl} alt={item.name} className="item-cover-img" />
                    <div className="item-main">
                      <div className="item-desc">
                        <p className="title">
                          {item.song.name}
                          {item.song.alias.length > 0 && `（${item.song.alias[0]}）`}
                        </p>
                        <p className="artists">
                          {item.song.artists.reduce((total, currentValue, currentIndex, arr) => {
                            return currentIndex === arr.length - 1
                              ? total + currentValue.name
                              : total + currentValue.name + '/'
                          }, '- ')}
                        </p>
                      </div>
                      <div className="item-play-status">
                        {currentPlayingId === item.id ? (
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
  )
}

export default React.memo(SongShowSwiper)
