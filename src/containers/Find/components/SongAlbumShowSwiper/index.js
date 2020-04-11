import React, { useMemo, useState } from 'react'
import Swiper from 'react-id-swiper'
import _ from 'lodash'
import './index.scss'

const SongAlbumShowSwiper = props => {
  const [currentPlayingId, setCurrentPlayingId] = useState()

  const { isSong = true, data } = props

  // 拆分成3个一组
  const dataList = useMemo(() => _.chunk(data, 3), [data])

  const params = {
    resistanceRatio: 0,
    observer: true,
    observeParents: true
  }

  return (
    <div className="SongAlbumShowSwiper">
      {isSong ? (
        <Swiper {...params}>
          {dataList.map(itemArr => {
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
                            <svg className="icon-svg" aria-hidden="true">
                              <use xlinkHref="#icon-bofang5"></use>
                            </svg>
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
      ) : (
        <Swiper {...params}>
          {dataList.map(itemArr => {
            return (
              <div key={itemArr[0].id}>
                {itemArr.map(item => {
                  return (
                    <div className="item-info" key={item.id}>
                      <img src={item.picUrl} alt={item.name} className="item-cover-img" />
                      <div className="item-main">
                        <div className="item-desc">
                          <div className="title">
                            {item.name}
                            {item.alias.length > 0 && `（${item.alias[0]}）`}
                          </div>
                          <div className="artists">
                            {item.artists.reduce((total, currentValue, currentIndex, arr) => {
                              return currentIndex === arr.length - 1
                                ? total + currentValue.name
                                : total + currentValue.name + '/'
                            }, '- ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}

export default React.memo(SongAlbumShowSwiper)
