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
    <div className="SongShowSwiper">
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
                        <div className="title">
                          {item.song.name}
                          {item.song.alias[0] && `（${item.song.alias[0]}）`}
                        </div>
                        <div className="artists">
                          {item.song.artists.reduce((total, currentValue, currentIndex, arr) => {
                            return currentIndex === arr.length - 1
                              ? total + currentValue.name
                              : total + currentValue.name + '/'
                          }, '- ')}
                        </div>
                      </div>
                      <div className="item-play-status">
                        {currentPlayingId === item.id ? (
                          <i className="iconfont icon-laba"></i>
                        ) : (
                          <img src="svg/play.svg" alt="play" className="play-svg"></img>
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
